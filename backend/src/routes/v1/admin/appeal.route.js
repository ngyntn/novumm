const express = require('express');
const appealController = require('../../../controllers/admin/appeal.controller');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const authMiddleware = require('../../../middlewares/auth.middleware');
const adminMiddleware = require('../../../middlewares/admin.middleware');
const appealValidation = require('../../../validations/admin/appeal.validation');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, validateMiddleware(appealValidation.listAppeals), appealController.listAppeals);
router.get('/:appeal_id', authMiddleware, adminMiddleware, appealController.getAppealDetail);
router.post('/:appeal_id/review', authMiddleware, adminMiddleware, validateMiddleware(appealValidation.reviewAppeal), appealController.reviewAppeal);

module.exports = router;