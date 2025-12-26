const reportRepository = require('../../repositories/articleReport.repository');
const articleRepository = require('../../repositories/article.repository');
const { emitReportProcessed } = require('../../sockets/admin.dashboard.socket');
const { BadRequestError, NotFoundError } = require('../../utils/AppError');
const logger = require('../../utils/logger');
const prisma = require('../../config/db.config');
const notificationService = require("../notification.service");

const listReports = async ({ page , limit , status, category, source }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    return reportRepository.listReports(page, limit, status, category, source);
};

const processReport = async (reportId, { action, reason }) => {
    const report = await reportRepository.findById(parseInt(reportId));
    if (!report) {
        throw new NotFoundError('Report not found');
    }
    if (report.status !== 'pending') {
        throw new BadRequestError('Report already processed');
    }

    await prisma.$transaction(async (tx) => {
        await reportRepository.updateStatus(parseInt(reportId), action === 'confirm' ? 'confirmed' : 'dismissed', tx);
        if (action === 'confirm') {
            const notificationData = {
                recipientId : report.article.authorId,
                articelId: report.articleId,
                type : 'article_hidden_by_admin',
                metadata : {
                    category : report.category,
                    reason : reason
                }
            }
            await articleRepository.updateModerationStatus(report.articleId, 'hidden_by_admin',reason, tx);
            await notificationService.createNotification(notificationData);
        }
        emitReportProcessed({ reportId });
    });

    logger.info(`Report ${reportId} processed with action ${action}`);
};

const getReportDetail = async (reportId) => {
    const report = await reportRepository.findByIdWithArticle(reportId);
    if (!report) {
        throw new NotFoundError('Report not found');
    }
    return report;
};
module.exports = { listReports, processReport, getReportDetail };