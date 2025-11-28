const prisma = require('../config/db.config');

const countArticleLikes = async (userId) => prisma.articleLike.count({ where: { userId } });

module.exports = { countArticleLikes };