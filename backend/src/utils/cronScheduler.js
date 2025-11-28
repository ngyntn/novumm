
const cron = require('node-cron');
const logger = require('../utils/logger');
const articleService = require("../services/article.service");

// job chạy mỗi 1 phút đẻ cập nhật danh sách bài viết nổi bật trong cache redis
const featuredCron = cron.schedule('0 */15 * * * *', async () => {
    try {
        await articleService.updateFeaturedArticles();
    } catch (error) {
        logger.error('Có lỗi xảy ra khi chạy cronjob', error);   
        console.error(error);
    }
}, {
    scheduled: false // mặc định không chạy, cần gọi .start() để chạy
});

module.exports = { startCrons: () => featuredCron.start() };