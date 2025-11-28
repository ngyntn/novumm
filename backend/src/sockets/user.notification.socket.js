const { emitToUser } = require('../utils/websocket');

const emitNotification = (userId, type, message) => {
    emitToUser(userId, type, message);
};

module.exports = { emitNotification };