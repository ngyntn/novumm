const express = require('express');
const reportController = require('../../../controllers/admin/report.controller');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const authMiddleware = require('../../../middlewares/auth.middleware');
const adminMiddleware = require('../../../middlewares/admin.middleware');
const reportValidation = require('../../../validations/admin/report.validation');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, validateMiddleware(reportValidation.listReports), reportController.listReports);
router.get('/:report_id', authMiddleware, adminMiddleware, reportController.getReportDetail);
router.post('/:report_id/process', authMiddleware, adminMiddleware, validateMiddleware(reportValidation.processReport), reportController.processReport);

module.exports = router;