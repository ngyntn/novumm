const express = require('express');
const authController = require('../controllers/auth.controller');
const validateMiddleware = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

router.post(
    '/register',
    validateMiddleware(authValidation.register),
    authController.register);

router.post(
    '/register/send-otp',
    validateMiddleware(authValidation.requestOtp),
    authController.sendOtpVerifyEmail);

router.post(
    '/register/verify-otp',
    validateMiddleware(authValidation.verifyOtp),
    authController.verifyOtpRegister);

router.post(
    '/login',
    validateMiddleware(authValidation.login),
    authController.login);

router.post(
    '/refresh-token',
    validateMiddleware(authValidation.refreshToken),
    authController.refreshToken);

router.post(
    '/logout',
    authMiddleware,
    authController.logout);

router.post(
    '/change-password/send-otp',
    validateMiddleware(authValidation.requestOtp),
    authController.sendOtpChangePassword);

router.post(
    '/change-password/verify-otp',
    validateMiddleware(authValidation.verifyOtp),
    authController.verifyOtpChangePassword);

router.post(
    '/change-password',
    validateMiddleware(authValidation.changePassword),
    authController.changePassword);


module.exports = router;