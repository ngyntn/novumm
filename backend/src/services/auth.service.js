const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const redisClient = require('../config/redis.config');
const logger = require('../utils/logger');
const { generateAccessToken,generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const {UnauthorizedError,  NotFoundError, ConflictError, BadRequestError} = require("../utils/AppError");
const sendEmail = require("../utils/email.utils");


const register = async ({ fullName, email, password }) => {
    const verifiedKey = `verified:email:${email}`;
    const isVerified = await redisClient.get(verifiedKey);
    if (!isVerified) {
        throw new BadRequestError('Email not verified. Please verify OTP first.');
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new ConflictError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ fullName, email, passwordHash: hashedPassword});

    await redisClient.del(verifiedKey);
    logger.info(`User registered: ${user.id}`);

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { user, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    logger.info(`User logged in: ${user.id}`);
    return { user: user, accessToken, refreshToken };
};
const refreshToken = async (refreshToken) => {
    let decoded
    try {
        decoded = await verifyRefreshToken(refreshToken);
    } catch (err) {
        throw new UnauthorizedError('Invalid RefreshToken');
    }

    const storedToken = await redisClient.get(`user:${decoded.id}:refreshToken`);
    if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedError("RefreshToken is invalid or invoked");
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    const accessToken = await generateAccessToken(user);
    return { accessToken };
};

const logout = async (userId) => {
    const refreshKey = `user:${userId}:refreshToken`;
    await redisClient.del(refreshKey);
    logger.info(`User logged out: ${userId}`);
};

const changePassword = async (email,otp, newPassword) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    await verifyOtp(email, otp, 'reset');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

    logger.info(`Password changed for user: ${user.id}`);
};


const sendOtp = async (email, type) => {
    if (!['register', 'reset'].includes(type)) {
        throw new BadRequestError('Invalid OTP type');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${type}:${email}`;

    await redisClient.set(key, otp, 'EX', parseInt(process.env.OTP_EXPIRES_IN) * 60);

    const subject = type === 'register' ? 'Verify Your Email' : 'Password Reset OTP';
    const text = type === 'register'
        ? `Your OTP for email verification is: ${otp}. It expires in ${process.env.OTP_EXPIRES_IN} minutes.`
        : `Your OTP for password reset is: ${otp}. It expires in ${process.env.OTP_EXPIRES_IN} minutes.`;

    await sendEmail(email, subject, text);
    logger.info(`OTP (${type}) sent to ${email}`);
};

const verifyOtp = async (email, otp, type) => {
    const key = `otp:${type}:${email}`;
    const storedOtp = await redisClient.get(key);

    if (!storedOtp || storedOtp !== otp) {
        throw new BadRequestError('Invalid or expired OTP');
    }


    if (type === 'register') {
        await redisClient.set(`verified:email:${email}`, 'true', 'EX', 300); // 5 phút
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    changePassword,
    sendOtp,
    verifyOtp
};