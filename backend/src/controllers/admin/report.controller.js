const reportService = require('../../services/admin/report.service');
const ApiResponse = require('../../utils/ApiResponse');

const listReports = async (req, res, next) => {
    try {
        const reports = await reportService.listReports(req.query);
        res.status(200).json(new ApiResponse(true, 'Pending reports fetched', reports));
    } catch (error) {
        next(error);
    }
};

const processReport = async (req, res, next) => {
    try {
        await reportService.processReport(parseInt(req.params.report_id), req.body);
        res.status(200).json(new ApiResponse(true, 'Report processed'));
    } catch (error) {
        next(error);
    }
};

const getReportDetail = async (req, res, next) => {
    try {
        const report = await reportService.getReportDetail(parseInt(req.params.report_id));
        res.status(200).json(new ApiResponse(true, 'Report detail fetched', report));
    } catch (error) {
        next(error);
    }
};

module.exports = { listReports, processReport , getReportDetail};