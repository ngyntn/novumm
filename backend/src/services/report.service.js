const reportRepository = require('../repositories/articleReport.repository');
const articleRepository = require('../repositories/article.repository');
const appealRepository = require('../repositories/articleAppeal.repository');
const { emitNewReport, emitNewAppeal } = require('../sockets/admin.dashboard.socket');

const { NotFoundError, ConflictError, ForbiddenError, BadRequestError } = require('../utils/AppError');
const logger = require('../utils/logger');

const createReport = async (reporterId, articleId, { category, reason }) => {
    const article = await articleRepository.findById(articleId);
    if (!article) {
        throw new NotFoundError('Article not found');
    }

    const existingReport = await reportRepository.findExistingReport(reporterId, articleId);
    if (existingReport) {
        throw new ConflictError('Report already exists');
    }

    await reportRepository.createReport({ articleId: articleId, reporterId: reporterId, category, reason, source: 'user' });
    emitNewReport({ articleId, reporterId });
    logger.info(`Report created for article ${articleId} by user ${reporterId}`);
};

const createAppeal = async (authorId, articleId, { appealNote }) => {
    const article = await articleRepository.findById(articleId);
    if (!article) {
        throw new NotFoundError('Article not found');
    }
    if (article.authorId !== authorId) {
        throw new ForbiddenError('Not the author of the article');
    }
    if (article.moderationStatus !== 'hidden_by_admin') {
        throw new BadRequestError('Article not hidden');
    }

    const pendingAppeal = await appealRepository.findPendingAppeal(articleId);
    if (pendingAppeal) {
        throw new ConflictError('Pending appeal exists');
    }

    await appealRepository.createAppeal({ articleId: articleId, authorId: authorId, appealNote: appealNote });
    emitNewAppeal({ articleId, authorId });
    logger.info(`Appeal created for article ${articleId} by user ${authorId}`);
};

const listAppeals = async (authorId, { page, limit , status }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    return appealRepository.listAppeals(authorId, page, limit, status);
};

module.exports = { createReport, createAppeal, listAppeals };