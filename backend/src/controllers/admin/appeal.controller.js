const appealService = require('../../services/admin/appeal.service');
const ApiResponse = require('../../utils/ApiResponse');

const listAppeals = async (req, res, next) => { // Đổi tên từ listPendingAppeals
    try {
        const appeals = await appealService.listAppeals(req.query);
        res.status(200).json(new ApiResponse(true, 'Appeals fetched', appeals));
    } catch (error) {
        next(error);
    }
};
const reviewAppeal = async (req, res, next) => {
    try {
        await appealService.reviewAppeal(parseInt(req.params.appeal_id), req.body);
        res.status(200).json(new ApiResponse(true, 'Appeal reviewed', null));
    } catch (error) {
        next(error);
    }
};

const getAppealDetail = async (req, res, next) => {
    try {
        const appeal = await appealService.getAppealDetail(parseInt(req.params.appeal_id));
        res.status(200).json(new ApiResponse(true, 'Appeal detail fetched', appeal));
    } catch (error) {
        next(error);
    }
};

module.exports = { listAppeals, reviewAppeal, getAppealDetail };