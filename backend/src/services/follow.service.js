const followRepository = require("../repositories/follow.repository");
const userRepository = require("../repositories/user.repository");
const logger = require("../utils/logger");
const {BadRequestError, NotFoundError} = require("../utils/AppError");

const getFollowers = async (userId, { limit = 10, cursor, search }) => {
    const followers = await followRepository.getFollowers(userId, limit, cursor, search);
    const nextCursor = followers.length === limit
        ? followers[followers.length - 1].follower.id
        : null;

    logger.info(`Fetched followers for user ${userId}`);
    return {  followers, nextCursor };
};

const getFollowing = async (userId, { limit = 10, cursor, search }) => {
    const following = await followRepository.getFollowing(userId, limit, cursor, search);
    const nextCursor = following.length === limit
        ? following[following.length - 1].followed.id
        : null;

    logger.info(`Fetched following for user ${userId}`);
    return { following, nextCursor };
};

const toggleFollow = async (followerId, followedId, type) => {
    if (followerId === followedId) {
        throw new BadRequestError('Cannot follow yourself');
    }

    const followedUser = await userRepository.findById(followedId);
    if (!followedUser) {
        throw new NotFoundError('User to follow not found');
    }
    const existingFollow = await followRepository.existingFollow(followerId, followedId);
    if ((existingFollow && type === "follow") || (!existingFollow && type === "unfollow")) {
        throw new BadRequestError(
            existingFollow ? 'Already followed' : 'Already unfollowed'
        );
    }
    const action = type === "follow" ? "follow" : "unfollow";
    logger.info(`${action === "follow" ? "Followed" : "Unfollowed"} user ${followedId} by ${followerId}`);
    return await followRepository[action](followerId, followedId);
};

module.exports = {
    getFollowers,
    getFollowing,
    toggleFollow,
};