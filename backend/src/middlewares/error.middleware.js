const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');
const { AppError } = require('../utils/AppError');

module.exports = (err, req, res, next) => {
    if (err instanceof AppError && err.isOperational) {
        logger.warn(`Operational error: ${err.message}`);
        return res.status(err.statusCode).json(
            new ApiResponse(false,
                err.message,
                null,
                { code: err.statusCode, message: err.message })
        );
    }

    logger.error(`Internal error: ${err.stack}`);
    return res.status(500).json(
        new ApiResponse(false,
            'Internal server error',
            null,
            { code: 500, message: err.message })
    );
};