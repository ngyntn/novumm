const userRepository = require('../../repositories/user.repository');
const { NotFoundError, BadRequestError} = require('../../utils/AppError');
const logger = require('../../utils/logger');

const listUsers = async ({ page , limit , search, isActive }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    isActive = isActive === 'true';
    if (search) {
        search = search.trim()
    }
    return userRepository.listUsers(page, limit, search, isActive);
};

const activeUser = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (user.isActive === true) {
        throw new BadRequestError('User already active')
    }
    await userRepository.updateStatus(userId, true);
    logger.info(`User ${userId} status updated to ${isActive}`);
};

const inactiveUser = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (user.isActive === false) {
        throw new BadRequestError('User already inactive')
    }
    await userRepository.updateStatus(userId, false);
    logger.info(`User ${userId} status updated to ${isActive}`);
};
module.exports = { listUsers, activeUser, inactiveUser  };