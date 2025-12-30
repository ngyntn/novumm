const reportService = require('../services/report.service');
const ApiResponse = require('../utils/ApiResponse');


const createReport = async (req, res, next) => {
    try {
        await reportService.createReport(parseInt(req.user.id), parseInt(req.params.article_id), req.body);
        res.status(201).json(new ApiResponse(true, 'Report created successfully'));
    } catch (error) {
        next(error);
    }
};

const createAppeal = async (req, res, next) => {
    try {
        await reportService.createAppeal(parseInt(req.user.id), parseInt(req.params.article_id), req.body);
        res.status(201).json(new ApiResponse(true, 'Appeal created successfully'));
    } catch (error) {
        next(error);
    }
};

const listAppeals = async (req, res, next) => {
    try {
        const appeals = await reportService.listAppeals(parseInt(req.user.id), req.query);
        res.status(200).json(new ApiResponse(true, 'Appeals fetched', appeals));
    } catch (error) {
        next(error);
    }
};

module.exports = { createReport, createAppeal, listAppeals };