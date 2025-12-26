const express = require('express');
const userController = require('../../../controllers/admin/user.controller');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const authMiddleware = require('../../../middlewares/auth.middleware');
const adminMiddleware = require('../../../middlewares/admin.middleware');
const userValidation = require('../../../validations/admin/user.validation');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, validateMiddleware(userValidation.listUsers), userController.listUsers);

router.put('/:user_id/active', authMiddleware, adminMiddleware, userController.activeUser);

router.put('/:user_id/inactive', authMiddleware, adminMiddleware, userController.inactiveUser);

module.exports = router;