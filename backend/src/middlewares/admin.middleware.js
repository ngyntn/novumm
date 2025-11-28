const {ForbiddenError} = require('../utils/AppError');

module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ForbiddenError('Access denied: Admin only'));
    }
    next();
};