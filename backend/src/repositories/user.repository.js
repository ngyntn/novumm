const prisma = require('../config/db.config');

const create = async (data) => {
    return prisma.user.create({ data });
};

const findByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};

const updatePassword = async (id, password) => {
    return prisma.user.update({ where: { id }, data: { passwordHash : password } });
};


const findById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, fullName: true, email: true, bio: true, avatarUrl: true, role: true },
    });
};

const updateById = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
        select: { fullName: true,  bio: true, avatarUrl: true },
    });
};


module.exports = {
    updatePassword,
    findByEmail,
    create,
    findById,
    updateById,
};

