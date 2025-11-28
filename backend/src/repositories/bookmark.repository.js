const prisma = require("../config/db.config");


const getBookmarkArticles = async (userId, limit, cursor, search) => {
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


    return prisma.bookmark.findMany({
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
                    }
                },
            },
        },
    })
};

module.exports = {
    getBookmarkArticles,
};