const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const {LoginDTO, RefreshTokenDTO} = require('../dtos/auth.dto');


const register = async (req, res, next) => {
    try{
        const { user, accessToken, refreshToken } = await authService.register(req.body);
        const response = new LoginDTO({
            accessToken,
            refreshToken,
            user });
        res.status(201)
            .json(new ApiResponse(true, 'User registered successfully', response));
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        const response = new LoginDTO({
            accessToken,
            refreshToken,
            user});
        res.status(200)
            .json(new ApiResponse(true, 'Login successful', response ));
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { accessToken } = await authService.refreshToken(req.body.refreshToken);
        const response = new RefreshTokenDTO({ accessToken });
        res.status(200)
            .json(new ApiResponse(true, 'Token refreshed', response));
    } catch (error) {
        next(error);
    }
};


const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        res.status(200).json(new ApiResponse(true, 'Logged out successfully'));
    } catch (error) {
        next(error);
    }
};

const sendOtpChangePassword = async (req, res, next) => {
    try {
        await authService.sendOtp(req.body.email, "reset");
        res.status(200).json(new ApiResponse(true, 'OTP change password sent (simulated)'));
    } catch (error) {
        next(error);
    }
};
const sendOtpVerifyEmail = async (req, res, next) => {
    try {
        await authService.sendOtp(req.body.email, "register");
        res.status(200).json(new ApiResponse(true, 'OTP verify email sent (simulated)'));
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        await authService.changePassword(req.body.email, req.body.otp, req.body.newPassword);
        res.status(200).json(new ApiResponse(true, 'Password changed successfully'));
    } catch (error) {
        next(error);
    }
};
const verifyOtpChangePassword = async (req, res, next) => {
    try {
        await authService.verifyOtp(req.body.email, req.body.otp, "reset");
        res.status(200).json(new ApiResponse(true, 'OTP verified successfully', null));
    } catch (error) {
        next(error);
    }
}

const verifyOtpRegister = async (req, res, next) => {
    try {
        await authService.verifyOtp(req.body.email, req.body.otp, "register");
        res.status(200).json(new ApiResponse(true, 'OTP verified successfully'));
    } catch (error) {
        next(error);
    }
}



module.exports = {
    register,
    login,
    refreshToken,
    logout,
    verifyOtpRegister,
    verifyOtpChangePassword,
    sendOtpChangePassword,
    sendOtpVerifyEmail,
    changePassword
};