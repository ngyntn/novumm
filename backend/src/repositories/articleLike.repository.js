const prisma = require('../config/db.config');

const countArticleLikes = async (userId) => prisma.articleLike.count({ where: { userId } });

const getLikedArticles = async (userId, limit, cursor, search) => {
    const where = {
        userId,
        ...(search && {
            article: {
                OR: [
                    { title: { contains: search } },
                    { content: { contains: search } },
                ],
            },
        }),
    };


    return prisma.articleLike.findMany({
        where,
        take: limit,
        cursor: cursor
            ? { userId_articleId: { userId, articleId: cursor } }
            : undefined,
        skip: cursor ? 1 : 0,
        select: {
            article: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                    thumbnailUrl: true,
                    author: { select: { id: true, fullName: true, avatarUrl: true} },
                    articleTags: {
                        select: {
                            tag: { select: { id: true, name: true } }
                        },
                    },
                    // ✅ ĐẾM LIKE / COMMENT
                    _count: {
                        select: {
                            articleLikes: true,
                            comments: true
                        }
                    },

                    // ✅ check user đã like chưa
                    articleLikes: {
                        where: { userId },
                        select: { userId: true }
                    },

                    // ✅ check bookmark
                    bookmarks: {
                        where: { userId },
                        select: { userId: true }
                    }
                },
            },
        },
    })
};
module.exports = { countArticleLikes, getLikedArticles };