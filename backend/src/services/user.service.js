const userRepository = require('../repositories/user.repository');
const articleLikeRepository = require('../repositories/articleLike.repository');
const followRepository = require('../repositories/follow.repository');
const logger = require('../utils/logger');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/AppError');

const getUser = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const totalFollowers = await followRepository.countFollowers(userId);
    const totalFollowing = await followRepository.countFollowing(userId);
    const totalArticleLikes = await articleLikeRepository.countArticleLikes(userId);

    logger.info(`Fetched user ${userId}`);
    return {
        ...user,
        totalFollowers,
        totalFollowing,
        totalArticleLikes,
    };
};

const updateUser = async (userId, data) => {
    if (Object.keys(data).length === 0) {
        throw new BadRequestError('No data provided to update');
    }

    const updateData = {};
    if (data.fullName) updateData.fullName = data.fullName;
    if (data.bio) updateData.bio = data.bio;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;

    const user = await userRepository.updateById(userId, updateData);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const totalFollowers = await followRepository.countFollowers(userId);
    const totalFollowing = await followRepository.countFollowing(userId);
    const totalArticleLikes = await articleLikeRepository.countArticleLikes(userId);

    logger.info(`Updated user ${userId}`);
    return {
        ...user,
        totalFollowers,
        totalFollowing,
        totalArticleLikes,
    };
};

module.exports = {
    getUser,
    updateUser,
};