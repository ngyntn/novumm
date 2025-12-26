const prisma = require("../config/db.config");

const createAppeal = async (data) => {
    return prisma.articleAppeal.create({ data });
};

const findPendingAppeal = async (articleId) => {
    return prisma.articleAppeal.findFirst({
        where: { articleId, status: 'pending' },
    });
};

const listAppealsByAuthorId = async (authorId, page, limit, status) => {
    const skip = (page - 1) * limit;
    const where = { authorId };
    if (status) where.status = status;

    return prisma.articleAppeal.findMany({
        where,
        skip,
        take: limit,
        include: { article: { select: { title: true, moderationStatus: true } } },
    });
};

const listAppeals = async (page, limit, status) => { // Thêm filter status
    const skip = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;

    return prisma.articleAppeal.findMany({
        where,
        skip,
        take: limit,
        include: { article: true, author: true },
    });
};

const findById = async (id) => {
    return prisma.articleAppeal.findUnique({
        where: { id },
    });
};

const updateStatus = async (id, status, reason, tx = prisma) => {
    return tx.articleAppeal.update({
        where: { id },
        data: { status: status,
            adminReviewNote: reason,
            reviewedAt: new Date() },
    });
};

const countPendingAppeals = async () => prisma.articleAppeal.count({ where: { status: 'pending' } });

const getRecentPendingAppeals = async (limit) => {
    return prisma.articleAppeal.findMany({
        where: { status: 'pending' },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { article: { select: { title: true } } },
    });
};

const findByIdWithArticle = async (id) => {
    return prisma.articleAppeal.findUnique({
        where: { id },
        include: {
            article: {
                select: { id: true, title: true, content: true, thumbnailUrl: true, readTimeMinutes: true, moderationStatus: true, violationReason: true }
            },
            author: { select: { id: true, fullName: true, email: true } },
        },
    });
};

module.exports = {
    createAppeal,
    findPendingAppeal,
    listAppeals,
    findById,
    updateStatus,
    countPendingAppeals,
    getRecentPendingAppeals,
    listAppealsByAuthorId,
    findByIdWithArticle
};