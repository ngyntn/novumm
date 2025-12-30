// File: routes/report.route.js
const express = require('express');
const reportController = require('../../../controllers/report.controller');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const authMiddleware = require('../../../middlewares/auth.middleware');
const reportValidation = require('../../../validations/report.validation');

// mergeParams: true để nhận :id (article_id) từ article.routes.js
const router = express.Router({ mergeParams: true });

// POST /articles/:id/report
router.post(
    '/report',
    authMiddleware,
    validateMiddleware(reportValidation.createReport),
    reportController.createReport
);

// POST /articles/:id/appeal
router.post(
    '/appeal',
    authMiddleware,
    validateMiddleware(reportValidation.createAppeal),
    reportController.createAppeal
);

module.exports = router;