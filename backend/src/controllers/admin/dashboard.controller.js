const dashboardService = require('../../services/admin/dashboard.service');
const ApiResponse = require('../../utils/ApiResponse');

const getStatistics = async (req, res, next) => {
    try {
        const stats = await dashboardService.getStatistics();
        res.status(200).json(new ApiResponse(true, 'Statistics fetched', stats));
    } catch (error) {
        next(error);
    }
};

const getCharts = async (req, res, next) => {
    try {
        const charts = await dashboardService.getCharts();
        res.status(200).json(new ApiResponse(true, 'Charts fetched', charts));
    } catch (error) {
        next(error);
    }
};

const getHotlists = async (req, res, next) => {
    try {
        const hotlists = await dashboardService.getHotlists();
        res.status(200).json(new ApiResponse(true, 'Hotlists fetched', hotlists));
    } catch (error) {
        next(error);
    }
};

module.exports = { getStatistics, getCharts, getHotlists };