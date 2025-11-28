const logger = require('../utils/logger');

module.exports = (err, req, res, next ) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
}