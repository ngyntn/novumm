const logger = require('../utils/logger');
const articleService = require("../services/article.service");

const startCrons = async () => { 
    const INTERVAL_TIME = 15 * 60 * 1000; // 15 phút

    logger.info(`[Scheduler] Đã thiết lập cập nhật cache mỗi ${15} phút.`);

    logger.info('[Scheduler] Đang chạy cập nhật cache lần đầu tiên...');
    try {
        await articleService.updateFeaturedArticles();
        logger.info('[Scheduler] Cập nhật cache lần đầu hoàn tất.');
    } catch (error) {
        logger.error('Có lỗi xảy ra khi chạy job lần đầu', error);
        console.error(error);
    }

    setInterval(async () => {
        try {
            logger.info('[Scheduler] Bắt đầu cập nhật cache theo chu kỳ.');
            await articleService.updateFeaturedArticles();
        } catch (error) {
            logger.error('Có lỗi xảy ra khi chạy interval job', error);   
            console.error(error);
        }
    }, INTERVAL_TIME);
};

module.exports = { startCrons };