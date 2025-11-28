const { emitToAdmin } = require('../utils/websocket');

// Functions to emit events
const emitNewReport = (data) => emitToAdmin('new_report', data);
const emitNewAppeal = (data) => emitToAdmin('new_appeal', data);
const emitNewUser = (data) => emitToAdmin('new_user', data);
const emitNewArticle = (data) => emitToAdmin('new_article', data);
const emitReportProcessed = (data) => emitToAdmin('report_processed', data);

module.exports = { emitNewReport, emitNewAppeal, emitNewUser, emitNewArticle, emitReportProcessed };