const prisma = require("../config/db.config");

const getFollowers = async (userId, limit, cursor, search) => {
    const where = {
        followedId: userId,
        ...(search && {
            follower: {
                OR: [
                    { fullName: { contains: search } },
                    { email: { contains: search } },
                ],
            },
        }),
    };

    return prisma.follow.findMany({
        where,
        take: limit,
        cursor: cursor
            ? { followerId_followedId: { followerId: cursor, followedId: userId } }
            : undefined,
        skip: cursor ? 1 : 0,
        select: {
            follower: {
                select: { id: true, fullName: true, avatarUrl: true},
            },
        },
    });
};

const getFollowing = async (userId, limit, cursor, search) => {
    const where = {
        followerId: userId,
        ...(search && {
            followed: {
                  OR: [
                    { fullName: { contains: search } },
                    { email: { contains: search} },
                  ],
            },
        }),
    };


    return prisma.follow.findMany({
        where,
        take: limit,
        cursor: cursor
            ? { followerId_followedId: { followerId: userId, followedId: cursor } }
            : undefined,
        skip: cursor ? 1 : 0,
        select: {
            followed: {
                select: { id: true, fullName: true, avatarUrl: true },
            },
        },
    })
};

const existingFollow = async (followerId, followedId) => {
    return prisma.follow.findUnique({
        where: { followerId_followedId: { followerId, followedId } },
    });
};
const follow = async (followerId, followedId) => {
    return prisma.follow.create({
        data: { followerId, followedId },
    });
};
const unfollow = async (followerId, followedId) => {
    return prisma.follow.delete({
        where: { followerId_followedId: { followerId, followedId } },
    });
};

const countFollowers = async (userId) => {
    return prisma.follow.count({ where: { followedId: userId } });
};

const countFollowing = async (userId) => {
    return prisma.follow.count({ where: { followerId: userId } });
};

const getFollowList = async ({ type, targetUserId, currentUserId, limit = 10, cursor = null, search = '' }) => {
    const isFollowingMode = type === 'following';

    // Đảm bảo ID là kiểu Number (Int trong Schema)
    const targetId = Number(targetUserId);
    const myId = Number(currentUserId);

    const searchCondition = search ? {
        OR: [
            { fullName: { contains: search } },
            { email: { contains: search } },
        ]
    } : {};

    const follows = await prisma.follow.findMany({
        where: {
            // Theo Schema:
            // - Nếu lấy người mình đang follow: dùng follower_id = targetId
            // - Nếu lấy người follow mình: dùng followed_id = targetId
            [isFollowingMode ? 'followerId' : 'followedId']: targetId,

            // Lọc theo thông tin của User ở đầu kia của quan hệ
            [isFollowingMode ? 'followed' : 'follower']: searchCondition,
        },
        take: limit,
        // Cursor dựa trên @@id([followerId, followedId])
        cursor: cursor ? {
            followerId_followedId: isFollowingMode
                ? { followerId: targetId, followedId: Number(cursor) }
                : { followerId: Number(cursor), followedId: targetId }
        } : undefined,
        skip: cursor ? 1 : 0,
        select: {
            [isFollowingMode ? 'followed' : 'follower']: {
                select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                    // Check xem mình (myId) có follow người này không
                    followers: {
                        where: { followerId: myId },
                        select: { followerId: true }
                    },
                    // Check xem người này có follow mình (myId) không
                    following: {
                        where: { followedId: myId },
                        select: { followedId: true }
                    }
                }
            }
        }
    });

    return follows.map(f => {
        const targetUser = isFollowingMode ? f.followed : f.follower;
        return {
            id: targetUser.id,
            fullName: targetUser.fullName,
            avatarUrl: targetUser.avatarUrl,
            // Nếu danh sách followers của người đó có chứa mình -> true
            isFollowing: targetUser.followers.length > 0,
            // Nếu danh sách following của người đó có chứa mình -> true
            isFollowerOfMe: targetUser.following.length > 0
        };
    });
};
module.exports = {
    getFollowers,
    getFollowing,
    existingFollow,
    follow,
    unfollow,
    countFollowers,
    countFollowing,
    getFollowList
};