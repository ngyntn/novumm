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

module.exports = {
    getFollowers,
    getFollowing,
    existingFollow,
    follow,
    unfollow,
    countFollowers,
    countFollowing,
};