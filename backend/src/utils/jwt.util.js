const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis.config');
const logger = require('./logger');

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpire = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshExpire = process.env.REFRESH_TOKEN_EXPIRES_IN;

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { id: user.id },
        refreshSecret,
        { expiresIn: refreshExpire }
    );

    const refreshKey = `user:${user.id}:refreshToken`;
    await redisClient.set(refreshKey, refreshToken, 'EX', 60*60*24*7);
    logger.info(`Tokens generated for user ${user.id}`);
    return { refreshToken };
};

const generateAccessToken = async (user) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        accessSecret,
        { expiresIn: accessExpire }
    );
    return { accessToken };
};

const verifyRefreshToken = async (refreshToken) => {
    return jwt.verify(refreshToken, refreshSecret);
};

const verifyAccessToken = (token) => {
    return jwt.verify(token,accessSecret );
};

module.exports = {
    generateRefreshToken,
    generateAccessToken,
    verifyRefreshToken,
    verifyAccessToken,
};