const { Prisma } = require("@prisma/client");
const prisma = require("../config/db.config");

const create = async (articleData, tagsToConnect) => {
  return prisma.article.create({
    data: {
      ...articleData,
      articleTags: {
        create: tagsToConnect.map((tag) => ({
          tag: {
            connectOrCreate: tag,
          },
        })),
      },
    },
    include: {
      author: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

const findBySlug = async (userId, slug) => {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      articleTags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          articleLikes: true,
          comments: true,
        },
      },
      articleLikes: userId
        ? {
          where: { userId },
        }
        : false,
      bookmarks: userId
        ? {
          where: { userId },
        }
        : false,
    },
  });
};

const findByIds = async (userId, articleIds) => {
  return prisma.article.findMany({
    where: {
      id: { in: articleIds },
      moderationStatus: "public",
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      articleTags: {
        include: { tag: true },
      },
      _count: {
        select: { articleLikes: true, comments: true },
      },
      articleLikes: userId
        ? { where: { userId }, select: { userId: true } }
        : false,
      bookmarks: userId
        ? { where: { userId }, select: { userId: true } }
        : false,
    },
  });
};

const findByIdsV2 = async (userId, articleIds) => {
  return prisma.article.findMany({
    where: {
      id: { in: articleIds },
      moderationStatus: "public",
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      articleTags: {
        include: { tag: true },
      },
      _count: {
        select: { articleLikes: true, comments: true },
      },
      articleLikes: userId
        ? { where: { userId }, select: { userId: true } }
        : false,
      bookmarks: userId
        ? { where: { userId }, select: { userId: true } }
        : false,
    },
  });
};






const findAll = async (userId, { skip, take }) => {
  const whereClause = {
    moderationStatus: "public",
  };

  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        articleTags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            articleLikes: true,
            comments: true,
          },
        },
        articleLikes: userId
          ? {
            where: { userId },
          }
          : false,
        bookmarks: userId
          ? {
            where: { userId },
          }
          : false,
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take,
    }),
    prisma.article.count({
      where: whereClause,
    }),
  ]);

  return { articles, totalCount };
};

const findFeed = async (userId, { skip, take }) => {
  const whereClause = {
    moderationStatus: "public",
    author: {
      followers: {
        some: {
          followerId: userId,
        },
      },
    },
  };

  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        articleTags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            articleLikes: true,
            comments: true,
          },
        },
        articleLikes: userId
          ? {
            where: { userId },
          }
          : false,
        bookmarks: userId
          ? {
            where: { userId },
          }
          : false,
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take,
    }),
    prisma.article.count({
      where: whereClause,
    }),
  ]);

  return { articles, totalCount };
};

const findById = async (id) => {
  const articleId = Number(id);

  if (isNaN(articleId)) {
    throw new Error("Invalid article ID format.");
  }

  return prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });
};

const update = async (id, articleData, tagsToConnect) => {
  const articleId = Number(id);

  if (isNaN(articleId)) {
    throw new Error("Invalid article ID format for update.");
  }

  return prisma.article.update({
    where: {
      id: articleId,
    },
    data: {
      ...articleData,
      articleTags: {
        deleteMany: {},
        create: tagsToConnect.map((tag) => ({
          tag: {
            connectOrCreate: tag,
          },
        })),
      },
    },
    include: {
      author: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

const remove = async (id) => {
  const articleId = Number(id);
  await prisma.articleLike.deleteMany({ where: { articleId: articleId } });
  await prisma.bookmark.deleteMany({ where: { articleId: articleId } });
  await prisma.comment.deleteMany({ where: { articleId: articleId } });
  await prisma.articleTag.deleteMany({ where: { articleId: articleId } });
  await prisma.notification.deleteMany({ where: { articleId: articleId } });

  return prisma.article.delete({
    where: { id: articleId },
  });
};

const findRelatedByTags = async (tagIds, excludeId, { skip, take }) => {
  const whereClause = {
    moderationStatus: "public",
    id: {
      not: excludeId,
    },
    articleTags: {
      some: {
        tagId: {
          in: tagIds,
        },
      },
    },
  };

  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereClause,
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        articleTags: { include: { tag: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take,
    }),
    prisma.article.count({ where: whereClause }),
  ]);

  return { articles, totalCount };
};

const findByAuthor = async (authorId, excludeId, { skip, take }) => {
  const whereClause = {
    moderationStatus: "public",
    authorId: authorId,
    id: {
      not: excludeId,
    },
  };

  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereClause,
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        articleTags: { include: { tag: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take,
    }),
    prisma.article.count({ where: whereClause }),
  ]);

  return { articles, totalCount };
};


const findMostLikedSince = async (sinceDate) => {
  return await prisma.article.findMany({
    where: {
      createdAt: { gte: sinceDate },
      moderationStatus: "public",
    },
    select: {
      id: true,
    }
  });
}


const statArticles = async (articleIds) => {
  const stats = await prisma.$queryRaw`
    SELECT 
      article_id AS "articleId",
      SUM(CASE WHEN action = 'like' THEN 1 ELSE 0 END) AS "likeCount",
      SUM(CASE WHEN action = 'click' THEN 1 ELSE 0 END) AS "clickCount",
      SUM(CASE WHEN action = 'comment' THEN 1 ELSE 0 END) AS "commentCount",
      SUM(CASE WHEN action = 'bookmark' THEN 1 ELSE 0 END) AS "bookmarkCount",
      SUM(CASE WHEN action = 'read' THEN 1 ELSE 0 END) AS "readCount"
    FROM user_article_interactions
    WHERE article_id IN (${Prisma.join(articleIds)})
    GROUP BY article_id
  `;
  return stats;
}

const getUserPreferenceTags = async (userId, day = 7) => {
  const sinceDate = new Date(Date.now() - day * 24 * 60 * 60 * 1000);

  const tagIds = await prisma.$queryRaw`
    SELECT 
      at.tag_id AS "tagId",
      SUM(
        CASE 
          WHEN uai.action = 'like' THEN 3
          WHEN uai.action = 'comment' THEN 4
          WHEN uai.action = 'bookmark' THEN 2
          WHEN uai.action = 'read' THEN 1
          ELSE 0
        END
      ) AS "score",
      COUNT(*) AS "totalInteractions"
    FROM user_article_interactions uai
    JOIN article_tags at ON at.article_id = uai.article_id
    WHERE uai.user_id = ${userId}
      AND uai.created_at >= ${sinceDate}
    GROUP BY at.tag_id
    ORDER BY "score" DESC
    LIMIT 10
  `;
  return tagIds.map(t => t.tagId );
}


const findNovelArticlesByTags = async (articleIds, tagIds) => {
  const ids = await prisma.$queryRaw`
    SELECT DISTINCT at.article_id
    FROM article_tags at
    WHERE at.article_id IN (${Prisma.join(articleIds)}) AND at.tag_id NOT IN (${Prisma.join(tagIds)})
  `;
  return ids.map(i => i.article_id);
}




module.exports = {
  create,
  update,
  remove,
  findBySlug,
  findAll,
  findFeed,
  findById,
  findByIds,
  findByIdsV2,
  findRelatedByTags,
  findByAuthor,
  findMostLikedSince,
  statArticles,
  getUserPreferenceTags,
  findNovelArticlesByTags,
};
