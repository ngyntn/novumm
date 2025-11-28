const articleRepository = require("../repositories/article.repository");
const interactionRepository = require("../repositories/interaction.repopsitory");
const slugify = require("../utils/slugify");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/AppError");
const { default: axios } = require("axios");
const { ar } = require("zod/locales");
const notificationService = require("./notification.service");
const { AuthorDTO } = require("../dtos/article.dto");
const logger = require("../utils/logger");

const redisClient = require('../config/redis.config');

const RECOMMEND_API = process.env.RECOMMEND_API;

const createArticle = async (body, userId, file) => {
  if (!file) {
    throw new BadRequestError("Vui lòng cung cấp ảnh bìa (thumbnail).");
  }

  const thumbnailUrl = file.location;

  const { title, content, readTimeMinutes } = body;

  let tagsToConnect = [];
  if (body.tags) {
    try {
      const tagNames = JSON.parse(body.tags);
      if (Array.isArray(tagNames) && tagNames.length > 0) {
        tagsToConnect = tagNames.map((name) => ({
          where: { name: name.trim() },
          create: { name: name.trim() },
        }));
      }
    } catch (e) {
      throw new BadRequestError(
        "Định dạng tags không hợp lệ (phải là JSON string array)."
      );
    }
  }

  const slug = slugify(title);
  const articleData = {
    title,
    content,
    slug,
    thumbnailUrl,
    authorId: userId,
    moderationStatus: "public",
    readTimeMinutes: parseInt(readTimeMinutes, 10) || 5,
  };

  const article = await articleRepository.create(articleData, tagsToConnect);
  return article;
};

const uploadMedia = async (file) => {
  if (!file) {
    throw new BadRequestError("Upload media thất bại.");
  }
  return { url: file.location };
};

const getArticleBySlug = async (userId, slug) => {
  const article = await articleRepository.findBySlug(userId, slug);
  if (!article) {
    throw new NotFoundError("Không tìm thấy bài viết.");
  }
  return article;
};

const getAllArticles = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { articles, totalCount } = await articleRepository.findAll(userId, {
    skip,
    take: limit,
  });

  const totalPages = Math.ceil(totalCount / limit);
  const pagination = {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
  };

  return { articles, pagination };
};


// Trả về số lượng bài viết gợi ý
const getFeaturedArticles = async (userId, limit) => {

  // Lấy danh sách bài viết nổi bật từ Redis
  const featuredArticles = await redisClient.get('featured_articles');
  if (!featuredArticles) {
    logger.warn('Không tìm thấy bài viết nổi bật trong Redis');
    return [];
  }
  const articleIds = JSON.parse(featuredArticles);

  // Truy vấn bài viết gốc
  const articles = await articleRepository.findByIds(userId, articleIds);

  // Lấy phiên người dùng từ redis: phiên chứa danh sách bài viết phổ biến người dùng đã đọc qua
  const today = new Date().toISOString().split('T')[0]; // định dạng YYYY-MM-DD
  const key = `user:${userId}:featured_session:${today}:read`;
  const readArticles = await redisClient.smembers(key);
  const readSet = new Set(readArticles.map(id => parseInt(id, 10)));
  logger.info(`Các bài viết người dùng đã đọc: ${Array.from(readSet)}`);

  // Lấy ra cac tag ưu thích của người dùng
  const preferredTags = await articleRepository.getUserPreferenceTags(userId, day = 7);
  logger.info(`Tag ưu thích của người dùng ${userId}: ${preferredTags}`);

  // Bắt đầu lọc bài viết gốc chưa đọc và ưu tiên bài viết có tag mới lạ
  const filteredArticles = articles.filter(article => {
    const hasPreferredTag = article.articleTags.some(at => preferredTags.includes(at.tag.name));
    const isUnread = !readSet.has(article.id);
    return isUnread && !hasPreferredTag;
  });

  // Trộn & random danh sách bài viết
  const shuffled = filteredArticles.sort(() => 0.5 - Math.random());
  const results = shuffled.slice(0, limit);

  if (results.length > 0) {
    const idsToAdd = results.map(a => a.id);
    console.log('Đánh dấu bài viết đã được xem bởi người dùng:', idsToAdd);
    await redisClient.sadd(key, idsToAdd);
    await redisClient.expire(key, 24 * 60 * 60); // TTL 1 ngày
  }

  console.log('[Result] Bài viết nổi bật trả về:', results.map(a => a.id));
  return results;
}


const getFeaturedArticlesV2 = async (userId, limit, readSet) => {

  // Lấy toàn bộ danh sách bài viết nổi bật từ Redis
  const cachedArticles = await redisClient.get('featured_articles');
  if (!cachedArticles) {
    logger.warn('Không tìm thấy bài viết nổi bật trong Redis');
    return [];
  }
  const cachedArticlesIds = JSON.parse(cachedArticles);
  logger.info(`Tìm thấy ${cachedArticlesIds.length} bài viết nổi bật trong Redis`);

  // Lọc danh sách bài viết ở trên: không chưa tag ưu thích của người dùng
  const preferredTags = await articleRepository.getUserPreferenceTags(userId, day = 7); // [tag1, tag2, ...]
  const novelArticleIds = (preferredTags.length === 0) ? cachedArticlesIds 
  : await articleRepository.findNovelArticlesByTags(cachedArticlesIds, preferredTags); 

  // Lọc bài viết đã đọc
  const unreadArticleIds = novelArticleIds.filter(id => !readSet.has(id));

  // suffle & limit 
  const shuffled = unreadArticleIds.sort(() => 0.5 - Math.random());
  const selectedIds = shuffled.slice(0, limit);

  return selectedIds;
}

const getRecommendedArticlesV2 = async (query) => {
  const userId = parseInt(query.userId);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;

  if (!userId) throw new BadRequestError("User ID là bắt buộc.");

  // Nếu page = 1, thì bắt đầy lấy kho bài gợi ý + nổi bật để cache vào redis (chưa đọc)

  try {
    if (page === 1) {

      // lấy danh sách bài viết đã đọc trong 90 ngày qua trong cache của người dùng
      const readKey = `user:${userId}:read_articles`;
      const readArticles = await redisClient.smembers(readKey);
      const readArticleSet = new Set(readArticles.map(id => parseInt(id, 10)));


      // lấy danh sách 200 id bài viết gợi ý chưa đọc từ python service
      const response = await axios.post(RECOMMEND_API, {
        user_id: userId,
        read_ids: Array.from(readArticleSet),
      });

      if (response.data.status === "error") {
        throw new BadRequestError(response.data.error.message);
      }

      const recArticleIds = response.data.data.results; // [id1, id2, id3, ...]

      // Lấy danh sách 40 id bài viết nổi bật chưa đọc từ redis cache
      const featuredArticleIds = await getFeaturedArticlesV2(userId, 40, readArticleSet);
      console.log(`Bài viết nổi bật chưa đọc cho user ${userId}:`, featuredArticleIds);

      // Trộn 2 danh sách trên và loại bỏ trùng lặp
      const combinedIdsSet = new Set([...recArticleIds, ...featuredArticleIds]);
      const combinedIds = Array.from(combinedIdsSet);

      // Suffle & lưu vào redis cache
      const finalIds = combinedIds.sort(() => 0.5 - Math.random());

      const cacheKey = `user:${userId}:recommended_articles`;
      await redisClient.set(cacheKey, JSON.stringify(finalIds));

      console.log(`Đã cập nhật kho bài viết gợi ý cho user ${userId}: ${finalIds.length} items vào redis`);

    }

    // Lấy danh sách bài viết gợi ý từ redis cache
    const cacheKey = `user:${userId}:recommended_articles`;
    const cachedData = await redisClient.get(cacheKey);
    if (!cachedData) {
      throw new BadRequestError("Không tìm thấy kho bài viết gợi ý trong Redis.");
    }
    const recommendedArticleIds = JSON.parse(cachedData);
    console.log(`Tìm thấy ${recommendedArticleIds.length} bài viết gợi ý trong Redis cho user ${userId}`);

    // Lấy bài viết theo phân trang
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const pagedArticleIds = recommendedArticleIds.slice(startIdx, endIdx);

    const resultArticles = await articleRepository.findByIds(
      userId,
      pagedArticleIds
    );

    const orderedArticles = pagedArticleIds
      .map((id) => resultArticles.find((a) => a.id === id))
      .filter(Boolean);
    console.log('[Result] Bài viết gợi ý trả về:', orderedArticles.map(a => a.id));

    const pagination = {
      currentPage: page,
      limit,
      totalCount: recommendedArticleIds.length,
      totalPages: Math.ceil(recommendedArticleIds.length / limit),
    };

    // Cache bài viết đã đọc vào redis
    const readKey = `user:${userId}:read_articles`;
  
    const idsToAdd = orderedArticles
      .map(a => a.id)
      
    if (idsToAdd.length > 0) {
      await redisClient.sadd(readKey, idsToAdd);
      await redisClient.expire(readKey, 90 * 24 * 60 * 60); // TTL 90 ngày
    }

    return { articles: orderedArticles, pagination}

  } catch (error) {
    console.error("Error calling Python service:", error);
    throw new BadRequestError("Lỗi khi lấy bài viết gợi ý");
  }
}

const getRecommendedArticles = async (query) => {
  const userId = parseInt(query.userId);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;

  if (!userId) throw new BadRequestError("User ID là bắt buộc.");

  try {
    const rcmApi = `http://localhost:5000/articles/recommend`;
    const response = await axios.get(rcmApi, {
      params: { user: userId, page, size: Math.floor(limit * 80 / 100) },
    });

    const articles = response.data.data.results;
    const articleIds = articles.map((a) => a.id);

    const resultArticles = await articleRepository.findByIds(
      userId,
      articleIds
    );

    const orderedArticles = articleIds
      .map((id) => resultArticles.find((a) => a.id === id))
      .filter(Boolean);
    console.log('[Result] Bài viết gợi ý trả về:', orderedArticles.map(a => a.id));

    const pagination = {
      currentPage: page,
      limit,
      totalCount: 1000, // giả sử tổng số bài viết là 1000
      totalPages: 10,
    };


    // Bắt đầu lấy thêm bái viết phổ biến
    const featuredArticles = await getFeaturedArticles(userId, Math.ceil(limit * 20 / 100));

    // Kết hợp 2 danh sấch và loại bỏ trùng lặp:
    const mixedArticles = [...orderedArticles];
    featuredArticles.forEach(fa => {
      if (!mixedArticles.find(a => a.id === fa.id)) {
        const insertPos = Math.floor(Math.random() * (mixedArticles.length + 1));
        mixedArticles.splice(insertPos, 0, fa);
      }
    });
    const finalArticles = mixedArticles.slice(0, limit);

    console.log('[Final Result] Bài viết trả về:', finalArticles.map(a => a.id));


    return { articles: finalArticles, pagination };
  } catch (error) {
    console.error("Error calling Python service:", error);
    throw new BadRequestError("Lỗi khi lấy bài viết gợi ý từ python service.");
  }
};


const getSearchArticles = async ({ query, page, limit, userId }) => {
  try {
    const rcmApi = `http://localhost:5000/articles/search/knn`;
    const response = await axios.get(rcmApi, {
      params: { key: query, page, size: limit },
    });

    if (response.data.status === "error") {
      throw new BadRequestError(response.data.error.message);
    }

    const articleIds = response.data.data.results.map((a) => a.id);
    const dbArticles = await articleRepository.findByIds(userId, articleIds);

    const orderedArticles = articleIds
      .map((id) => dbArticles.find((a) => a.id === id))
      .filter(Boolean);

    const authorsMap = {};
    orderedArticles.forEach((article) => {
      if (article.author) {
        authorsMap[article.author.id] = new AuthorDTO(article.author);
      }
    });


    return { articles: orderedArticles, authors: authorsMap };
  } catch (error) {
    console.error("Error calling Python service:", error.message);
    throw new BadRequestError("Lỗi khi lấy bài viết tìm kiếm từ Python service.");
  }
};





const getFeedArticles = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { articles, totalCount } = await articleRepository.findFeed(userId, {
    skip,
    take: limit,
  });

  const totalPages = Math.ceil(totalCount / limit);
  const pagination = {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
  };

  return { articles, pagination };
};

const updateArticle = async (articleId, userId, body, file) => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("Không tìm thấy bài viết.");
  }
  if (article.authorId !== userId) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa bài viết này.");
  }

  const articleData = { ...body };

  if (file) {
    articleData.thumbnailUrl = file.location;
  }

  if (body.title && body.title !== article.title) {
    articleData.slug = slugify(body.title);
  }

  let tagsToConnect = [];
  if (body.tags) {
    try {
      const tagNames = JSON.parse(body.tags);
      if (Array.isArray(tagNames) && tagNames.length > 0) {
        tagsToConnect = tagNames.map((name) => ({
          where: { name: name.trim() },
          create: { name: name.trim() },
        }));
      }
    } catch (e) {
      throw new BadRequestError(
        "Định dạng tags không hợp lệ (phải là JSON string array)."
      );
    }
  }

  articleData.moderationStatus = "public";
  articleData.updatedAt = new Date();

  delete articleData.tags;
  delete articleData.content;
  if (body.content) {
    articleData.content = body.content;
  }

  const updatedArticle = await articleRepository.update(
    articleId,
    articleData,
    tagsToConnect
  );
  return updatedArticle;
};

const deleteArticle = async (articleId, userId) => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("Không tìm thấy bài viết.");
  }
  if (article.authorId !== userId) {
    throw new ForbiddenError("Bạn không có quyền xóa bài viết này.");
  }
  await articleRepository.remove(articleId);
};

const getRelatedArticles = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 3;
  const skip = (page - 1) * limit;

  if (!query.tagIds) {
    throw new BadRequestError("Cần cung cấp tagIds.");
  }

  const tagIds = query.tagIds
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter(Number.isFinite);

  if (tagIds.length === 0) {
    return {
      articles: [],
      pagination: { currentPage: page, totalPages: 0, totalCount: 0, limit },
    };
  }

  const excludeId = parseInt(query.excludeId, 10) || 0;

  const { articles, totalCount } = await articleRepository.findRelatedByTags(
    tagIds,
    excludeId,
    { skip, take: limit }
  );

  const totalPages = Math.ceil(totalCount / limit);
  const pagination = { currentPage: page, totalPages, totalCount, limit };

  return { articles, pagination };
};

const getAuthorArticles = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 3;
  const skip = (page - 1) * limit;

  if (!query.authorId) {
    throw new BadRequestError("Cần cung cấp authorId.");
  }

  const authorId = parseInt(query.authorId, 10);
  const excludeId = parseInt(query.excludeId, 10) || 0;

  if (isNaN(authorId)) {
    throw new BadRequestError("authorId không hợp lệ.");
  }

  const { articles, totalCount } = await articleRepository.findByAuthor(
    authorId,
    excludeId,
    { skip, take: limit }
  );

  const totalPages = Math.ceil(totalCount / limit);
  const pagination = { currentPage: page, totalPages, totalCount, limit };

  return { articles, pagination };
};

const toggleArticleLike = async (userId, articleIdStr) => {
  const articleId = parseInt(articleIdStr, 10);
  if (isNaN(articleId)) {
    throw new BadRequestError("Article ID không hợp lệ.");
  }

  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("Không tìm thấy bài viết.");
  }

  const result = await interactionRepository.toggleLike(userId, articleId);

  if (result.isLiked && userId !== article.authorId) {
    await notificationService.createNotification({
      recipientId: article.authorId,
      actorId: userId,
      type: "like",
      articleId: article.id,
    });
  }
  return result;
};

const toggleArticleBookmark = async (userId, articleIdStr) => {
  const articleId = parseInt(articleIdStr, 10);
  if (isNaN(articleId)) {
    throw new BadRequestError("Article ID không hợp lệ.");
  }

  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("Không tìm thấy bài viết.");
  }

  const result = await interactionRepository.toggleBookmark(userId, articleId);
  return result;
};


const updateFeaturedArticles = async () => {
  const now = new Date();
  const sinceDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Lấy ra tất cả bài viết trong 24 giờ qua
  logger.info(`Đang lấy bài viết trong 24 giờ qua`);
  const featuredArticleIds = await articleRepository.findMostLikedSince(sinceDate);
  logger.info(`Tìm thấy ${featuredArticleIds.length} bài viết`);

  // Bắt đầu truy vấn số tương tác và tính toán trọng số. 
  logger.info('Bắt đầu thống kê số tương tác cho các bài viết gần đây');
  const arrayArticleIds = featuredArticleIds.map(item => item.id);
  const itemedArticleCounts = await articleRepository.statArticles(arrayArticleIds);
  logger.info(`Thống kê số tương tác cho ${arrayArticleIds.length} bài viết hoàn tất`);


  // Tính điểm trọng số cho từng bài viết
  const articleScores = itemedArticleCounts.map((item) => {
    const baseScore = item.likeCount + item.commentCount * 2;
    const score = baseScore * (1 + item.commentCount / (item.likeCount + 1));
    return { articleId: item.articleId, score };
  });

  logger.info(`Tính toán điểm trọng số cho các bài viết hoàn tất`);
  articleScores.sort((a, b) => b.score - a.score);
  console.log('Top 100 bài viết nổi bật:', articleScores.slice(0, 100));

  // Bắt đầu cache bài viết nổi bật vào Redis
  const data = articleScores.slice(0, 100).map(a => a.articleId);
  console.log('Dữ liệu cache vào redis:', data);
  await redisClient.set('featured_articles', JSON.stringify(data), 'EX', 1200); // hết hạn sau 20 phút

  console.log(`Đã cập nhật bài viết nổi bật: ${articleScores.length} items vào redis`);
}


const updateReadAction = async (userId, articleIdStr) => {

  const articleId = parseInt(articleIdStr, 10);
  if (isNaN(articleId)) {
    throw new BadRequestError("Article ID không hợp lệ.");
  }

  await interactionRepository.recordReadAction(userId, articleId);
}

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  uploadMedia,
  getArticleBySlug,
  getAllArticles,
  getRecommendedArticles,
  getSearchArticles,
  getFeedArticles,
  getRelatedArticles,
  getAuthorArticles,
  toggleArticleLike,
  toggleArticleBookmark,
  updateFeaturedArticles,
  getRecommendedArticlesV2,
  updateReadAction,
};
