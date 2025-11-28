const { verifyAccessToken } = require('../utils/jwt.util');
const { UnauthorizedError } = require("../utils/AppError");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('No token provided'));
    }

    try {
        req.user = await verifyAccessToken(token);
        next();
    } catch (err) {
        next(new UnauthorizedError('Invalid token'));
    }
};