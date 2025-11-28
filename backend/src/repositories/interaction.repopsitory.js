const prisma = require("../config/db.config");

const toggleLike = async (userId, articleId) => {
  const whereClause = {
    userId_articleId: {
      userId: userId,
      articleId: articleId,
    },
  };

  const whereClause2 = {
    userId_articleId_action: {
      userId: userId,
      articleId: articleId,
      action: 'like'
    },
  }

  const existingLike = await prisma.articleLike.findUnique({
    where: whereClause,
  });

  let isLiked;
  if (existingLike) {
    await prisma.articleLike.delete({ where: whereClause });
    await prisma.userArticleInteraction.delete({ where: whereClause2 });
    isLiked = false;
  } else {
    await prisma.articleLike.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    });

    await prisma.userArticleInteraction.create({
      data: {
        userId: userId,
        articleId: articleId,
        action: 'like'
      }
    })
    isLiked = true;
  }

  const likesCount = await prisma.articleLike.count({
    where: { articleId: articleId },
  });

  return { isLiked, likesCount };
};

const toggleBookmark = async (userId, articleId) => {
  const whereClause = {
    userId_articleId: {
      userId: userId,
      articleId: articleId,
    },
  };

  const whereClause2 = {
    userId_articleId_action: {
      userId: userId,
      articleId: articleId,
      action: 'bookmark'
    },
  }

  const existingBookmark = await prisma.bookmark.findUnique({
    where: whereClause,
  });

  let isBookmarked;
  if (existingBookmark) {
    await prisma.bookmark.delete({ where: whereClause });
    await prisma.userArticleInteraction.delete({ where: whereClause2 });
    isBookmarked = false;
  } else {
    await prisma.bookmark.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    });
    await prisma.userArticleInteraction.create({
      data: {
        userId: userId,
        articleId: articleId,
        action: 'bookmark'
      }
    })
    isBookmarked = true;
  }

  return { isBookmarked };
};


const recordReadAction = async (userId, articleId) => {
  await prisma.userArticleInteraction.upsert({
    where: {
      userId_articleId_action: { 
        userId,
        articleId,
        action: 'read'
      }
    },
    update: {}, 
    create: { userId, articleId, action: 'read' }
  });
}


module.exports = {
  toggleLike,
  toggleBookmark,
  recordReadAction,
};
