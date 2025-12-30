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

const attachReadCounts = async (dataList) => {
    if (!dataList || dataList.length === 0) return dataList;
  
    // BƯỚC 1: TẠO DANH SÁCH "REAL ARTICLES" (Dựa trên tham chiếu)
    // - Nếu là Home: item chính là article.
    // - Nếu là Like/Bookmark: item.article là article (chúng ta lấy cái bên trong ra).
    // Vì là object, nên thay đổi 'article' ở đây cũng sẽ thay đổi dataList gốc.
    const realArticles = dataList.map((item) => {
      return item.article ? item.article : item;
    });
  
    const articleIds = realArticles.map((a) => a.id);
  
    // BƯỚC 2: QUERY DB
    const readCounts = await prisma.userArticleInteraction.groupBy({
      by: ['articleId'],
      where: {
        articleId: { in: articleIds },
        action: 'read',
      },
      _count: { _all: true },
    });
  
    // Tạo Map để tra cứu nhanh
    const countMap = {};
    readCounts.forEach((item) => {
      countMap[item.articleId] = item._count._all;
    });
  
    // BƯỚC 3: GÁN NGƯỢC LẠI VÀO "REAL ARTICLES"
    // Quan trọng: Chúng ta loop qua realArticles để gán đúng vào object article
    realArticles.forEach((article) => {
      // Nếu article bị null (trường hợp dữ liệu rác), ta bỏ qua
      if (article) {
          article.readsCount = countMap[article.id] || 0;
      }
    });
  
    // BƯỚC 4: TRẢ VỀ DANH SÁCH GỐC
    // Do tính chất tham chiếu, dataList lúc này đã có readsCount nằm đúng chỗ
    // Home: [{ id: 1, readsCount: 5 }]
    // Like: [{ article: { id: 1, readsCount: 5 } }]
    return dataList;
  };

const findBySlug = async (userId, slug) => {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        articleTags: { include: { tag: true } },
        _count: {
          select: {
            articleLikes: true,
            comments: true,
            bookmarks: true,
          },
        },
        articleLikes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
    });
  
    if (article) {
      const readCount = await prisma.userArticleInteraction.count({
        where: { articleId: article.id, action: 'read' },
      });
      article.readsCount = readCount;
    }
  
    return article;
};



const findByIds = async (userId, articleIds) => {
    const articles = await prisma.article.findMany({
      where: {
        id: { in: articleIds },
        moderationStatus: "public",
      },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
        articleTags: { include: { tag: true } },
        _count: {
          select: { articleLikes: true, comments: true, bookmarks: true }, 
        },
        articleLikes: userId
          ? { where: { userId }, select: { userId: true } }
          : false,
        bookmarks: userId
          ? { where: { userId }, select: { userId: true } }
          : false,
      },
    });
  
    await attachReadCounts(articles);
    return articles;
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

const findAll = async (userId, authorId, { skip, take }) => {
    const whereClause = {
      moderationStatus: "public",
      authorId: authorId,
    };
  
    const [articles, totalCount] = await prisma.$transaction([
      prisma.article.findMany({
        where: whereClause,
        include: {
          author: { select: { id: true, fullName: true, avatarUrl: true } },
          articleTags: { include: { tag: true } },
          _count: {
            select: {
              articleLikes: true,
              comments: true,
              bookmarks: true, 
            },
          },
          articleLikes: userId ? { where: { userId } } : false,
          bookmarks: userId ? { where: { userId } } : false,
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take,
      }),
      prisma.article.count({ where: whereClause }),
    ]);
  
    await attachReadCounts(articles);
  
    return { articles, totalCount };
  };

  const findFeed = async (userId, { skip, take }) => {
    const whereClause = {
      moderationStatus: "public",
      author: {
        followers: { some: { followerId: userId } },
      },
    };
  
    const [articles, totalCount] = await prisma.$transaction([
      prisma.article.findMany({
        where: whereClause,
        include: {
          author: { select: { id: true, fullName: true, avatarUrl: true } },
          articleTags: { include: { tag: true } },
          _count: {
            select: {
              articleLikes: true,
              comments: true,
              bookmarks: true,
            },
          },
          articleLikes: userId ? { where: { userId } } : false,
          bookmarks: userId ? { where: { userId } } : false,
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take,
      }),
      prisma.article.count({ where: whereClause }),
    ]);
  
    await attachReadCounts(articles);
  
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
        _count: {
            select: { articleLikes: true, comments: true, bookmarks: true }, 
        },
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
        _count: {
            select: { articleLikes: true, comments: true, bookmarks: true }, 
        },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take,
    }),
    prisma.article.count({ where: whereClause }),
  ]);

  return { articles, totalCount };
};


const findArticlesForScoring = async (sinceDate) => {
    const articles = await prisma.article.findMany({
      where: {
        createdAt: { gte: sinceDate },
        moderationStatus: "public",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        authorId: true,
        _count: {
          select: {
            articleLikes: true, 
            comments: true,     
            bookmarks: true,  
          },
        },
      },
    });
  
    if (articles.length === 0) return [];
  
    const articleIds = articles.map(a => a.id);
  
    const interactions = await prisma.userArticleInteraction.groupBy({
      by: ['articleId', 'action'],
      where: {
        articleId: { in: articleIds },
        action: { in: ['read', 'click'] } 
      },
      _count: { _all: true }
    });
  
    const interactionMap = {};
    interactions.forEach(item => {
      if (!interactionMap[item.articleId]) {
        interactionMap[item.articleId] = { read: 0, click: 0 };
      }
      if (item.action === 'read') interactionMap[item.articleId].read = item._count._all;
      if (item.action === 'click') interactionMap[item.articleId].click = item._count._all;
    });
  
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      createdAt: article.createdAt,
      likeCount: article._count.articleLikes,
      commentCount: article._count.comments,
      bookmarkCount: article._count.bookmarks,
      readCount: interactionMap[article.id]?.read || 0,
      clickCount: interactionMap[article.id]?.click || 0,
    }));
  };


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

const countArticles = async () => prisma.article.count();

const getArticles7Days = async () => {
  return prisma.article.groupBy({
    by: ['createdAt'],
    _count: true,
    where: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
  });
};

const updateModerationStatus = async(articleId, status, reason, tx) => {
  return tx.article.update({
    where : {
      id : articleId
    },
    data : {
      moderationStatus: status,
      violationReason: reason
    }
  });
}

const findArticlesByUser = async (userId, { search = '', skip = 0, take = 10, includePrivate = false }) => {
  const whereClause = {
    authorId: userId,
    title: search ? { contains: search } : undefined,
    moderationStatus: includePrivate
        ? { not: 'deleted' }
        : 'public',
  };

  return prisma.article.findMany({
    where: whereClause,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, fullName: true, avatarUrl: true },
      },
      // Include more relations if needed, e.g., tags
    },
  });
};

const countArticlesByUser = async (userId, { search = '', includePrivate = false }) => {
  const whereClause = {
    authorId: userId,
    title: search ? { contains: search } : undefined,
    moderationStatus: includePrivate
        ? { not: 'deleted' }
        : 'public',
  };

  return prisma.article.count({ where: whereClause });
};

const findArticlesByUserV2 = async (userId, { search = '', cursor, take = 10, includePrivate = false }) => {
  const where = {
    authorId: userId,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ],
    }),
    moderationStatus: includePrivate ? { not: 'deleted' } : 'public',
  };

  const articles = await prisma.article.findMany({
    where,
    take: Number(take),
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true, // Thêm nếu DTO cần
      createdAt: true,
      thumbnailUrl: true,
      author: {
        select: { id: true, fullName: true, avatarUrl: true }
      },
      articleTags: {
        select: {
          tag: { select: { id: true, name: true } }
        },
      },
      _count: {
        select: {
          articleLikes: true,
          comments: true,
          bookmarks: true
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
  });

  return articles; // Trả về mảng [ {id, title...}, {...} ]
};
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
  findArticlesForScoring,
  statArticles,
  getUserPreferenceTags,
  findNovelArticlesByTags,
  countArticles,
  getArticles7Days,
  updateModerationStatus,
  findArticlesByUser,
  countArticlesByUser,
  findArticlesByUserV2,
  attachReadCounts,
};
