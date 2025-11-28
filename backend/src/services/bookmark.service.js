const bookmarkRepository = require("../repositories/bookmark.repository");
const logger = require("../utils/logger");

const getBookmarkArticles = async (userId, { limit = 10, cursor, search }) => {

    const articles = await bookmarkRepository.getBookmarkArticles(userId, limit, cursor, search);
    const nextCursor = articles.length === limit
        ? articles[articles.length - 1].article.id
        : null;

    logger.info(`Fetched liked articles for user ${userId}`);
    return {  articles, nextCursor };
};

module.exports = {
    getBookmarkArticles,
};