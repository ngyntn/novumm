const prisma = require('../config/db.config');

const create = async (data) => {
    return prisma.user.create({ data });
};

const findByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};

const updatePassword = async (id, password) => {
    return prisma.user.update({ where: { id }, data: { passwordHash: password } });
};


const findById = async (id, currentUserId) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            email: true,
            bio: true,
            avatarUrl: true,
            role: true,

            // Kiểm tra follow
            followers: {
                where: {
                    followerId: currentUserId, // current user -> target user
                },
                select: { followerId: true },
            },
        },
    });
};

const updateById = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
        select: { fullName: true, bio: true, avatarUrl: true },
    });
};

const getUsers7Days = async () => {
    return prisma.user.groupBy({
        by: ['createdAt'],
        _count: true,
        where: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
    });
};


const countUsers = async () => prisma.user.count();

const listUsers = async (page, limit, search, role, isActive) => { // Thêm is_active
    const skip = (page - 1) * limit;
    const where = {};
    if (search) {
        where.OR = [
            { fullName: { contains: search } },
            { email: { contains: search } },
        ];
    }
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    return prisma.user.findMany({
        where,
        skip,
        take: limit,
    });
};

const updateStatus = async (id, isActive) => {
    return prisma.user.update({ where: { id }, data: { isActive } });
};

module.exports = {
    updatePassword,
    findByEmail,
    create,
    findById,
    updateById,
    getUsers7Days,
    countUsers,
    listUsers,
    updateStatus,
};

