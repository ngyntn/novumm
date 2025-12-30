const appealRepository = require('../../repositories/articleAppeal.repository');
const articleRepository = require('../../repositories/article.repository');
const notificationService = require('../notification.service');
const prisma = require('../../config/db.config');
const { BadRequestError, NotFoundError } = require('../../utils/AppError');
const logger = require('../../utils/logger');

const listAppeals = async ({ page , limit, status }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    return appealRepository.listAppeals(page, limit, status);
};

const reviewAppeal = async (appealId, { action, adminReviewNote }) => {
    const appeal = await appealRepository.findById(appealId);
    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }
    if (appeal.status !== 'pending') {
        throw new BadRequestError('Appeal already reviewed');
    }
    const notificationData = {
        recipientId : appeal.article.authorId,
        articleId: appeal.articleId,
        metadata : {
            adminReviewNote : adminReviewNote
        }
    }
    await prisma.$transaction(async (tx) => {
        await appealRepository.updateStatus(appealId, action === 'approve' ? 'approved' : 'rejected',  adminReviewNote, tx);
        if (action === 'approve') {
            await articleRepository.updateModerationStatus(appeal.articleId, 'public',"", tx);
            notificationData.type = 'appeal_approved';
        } else {
            notificationData.type = 'appeal_rejected';
        }
        await notificationService.createNotification(notificationData);
    });

    logger.info(`Appeal ${appealId} reviewed with action ${action}`);
};

const getAppealDetail = async (appealId) => {
    const appeal = await appealRepository.findByIdWithArticle(appealId);
    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }
    return appeal;
};

module.exports = { listAppeals, reviewAppeal, getAppealDetail };