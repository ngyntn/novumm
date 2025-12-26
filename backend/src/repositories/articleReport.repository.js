const prisma = require('../config/db.config');

const createReport = async (data) => {
    return prisma.articleReport.create({ data });
};

const findExistingReport = async (reporterId, articleId) => {
    return prisma.articleReport.findFirst({
        where: { reporterId, articleId },
    });
};

const getRecentPendingReports = async (limit) => {
    return prisma.articleReport.findMany({
        where: { status: 'pending' },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { article: { select: { title: true } } },
    });
};

const countPendingReports = async () => prisma.articleReport.count({ where: { status: 'pending' } });

const listReports = async (page, limit, status, category, source) => { // Thêm filters
    const skip = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (source) where.source = source;

    return prisma.articleReport.findMany({
        where,
        skip,
        take: limit,
        include: { article: true, reporter: true },
    });
};

const findById = async (id) => {
    return prisma.articleReport.findUnique({
        where: { id },
        include: { article: { include: { author: true } } },
    });
};

const updateStatus = async (id, status, reason, tx = prisma) => {
    return tx.articleReport.update({
        where: { id },
        data: { status, reason },
    });
};

const findByIdWithArticle = async (id) => { // Thêm để lấy detail với article full
    return prisma.articleReport.findUnique({
        where: { id },
        include: {
            article: {
                select: { id: true, title: true, content: true, thumbnailUrl: true, readTimeMinutes: true, moderationStatus: true, violationReason: true, author: { select: { id: true, fullName: true, email: true } } }
            },
            reporter: { select: { id: true, fullName: true, avatarUrl: true } },
        },
    });
};
module.exports = {
    createReport,
    findExistingReport,
    getRecentPendingReports,
    countPendingReports,
    listReports,
    findById,
    updateStatus,
    findByIdWithArticle
    };