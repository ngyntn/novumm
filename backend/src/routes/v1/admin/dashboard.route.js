const express = require('express');
const dashboardController = require('../../../controllers/admin/dashboard.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');
const adminMiddleware = require('../../../middlewares/admin.middleware');

const router = express.Router();

router.get('/statistics', authMiddleware, adminMiddleware, dashboardController.getStatistics);
router.get('/charts', authMiddleware, adminMiddleware, dashboardController.getCharts);
router.get('/hotlists', authMiddleware, adminMiddleware, dashboardController.getHotlists);

module.exports = router;