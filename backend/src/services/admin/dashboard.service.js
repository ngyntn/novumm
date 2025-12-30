const userRepository = require('../../repositories/user.repository');
const articleRepository = require('../../repositories/article.repository');
const reportRepository = require('../../repositories/articleReport.repository');
const appealRepository = require('../../repositories/articleAppeal.repository');


const getStatistics = async () => {
    const totalUsers = await userRepository.countUsers();
    const totalArticles = await articleRepository.countArticles();
    const pendingReports = await reportRepository.countPendingReports();
    const pendingAppeals = await appealRepository.countPendingAppeals();
    return { totalUsers, totalArticles, pendingReports, pendingAppeals };
};

const getCharts = async () => {
    const users7Days = await userRepository.getUsers7Days();
    const articles7Days = await articleRepository.getArticles7Days();
    return { users: users7Days, articles: articles7Days };
};

const getHotlists = async () => {
    const recentReports = await reportRepository.getRecentPendingReports(5);
    const recentAppeals = await appealRepository.getRecentPendingAppeals(5);
    return { reports: recentReports, appeals: recentAppeals };
};

module.exports = { getStatistics, getCharts, getHotlists };