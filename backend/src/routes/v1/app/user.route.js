// File: routes/user.route.js
const express = require('express');
const userController = require('../../../controllers/user.controller');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const authMiddleware = require('../../../middlewares/auth.middleware');
const userValidation = require("../../../validations/user.validation");
const bookmarkController = require("../../../controllers/bookmark.controller");
const followController = require("../../../controllers/follow.controller");
const likeController = require("../../../controllers/like.controller");
const reportController = require('../../../controllers/report.controller'); // <--- Thêm report controller
const reportValidation = require('../../../validations/report.validation'); // <--- Thêm report validation
const articleValidation = require('../../../validations/article.validation');
const articleController = require('../../../controllers/article.controller');

// --- IMPORT CÁC ROUTER LỒNG ---
const followRouter = require('./follow.route');
const bookmarkRouter = require('./bookmark.route');
const likeRouter = require('./like.route');

const router = express.Router();

router.get('/me', authMiddleware, userController.getMyProfile);
router.patch('/me', authMiddleware, validateMiddleware(userValidation.updateUserSchema), userController.updateUser);

router.get('/me/followers', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getMyFollowers);
router.get('/me/following', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getMyFollowing);
router.get('/me/bookmark-articles', authMiddleware, validateMiddleware(userValidation.paginationSchema), bookmarkController.getMyBookmarkArticles);
router.get('/me/liked-articles', authMiddleware, validateMiddleware(userValidation.paginationSchema), likeController.getMyLikedArticles);

router.get(
    '/me/appeals',
    authMiddleware,
    validateMiddleware(reportValidation.listAppeals),
    reportController.listAppeals
);


router.get('/:id', authMiddleware, userController.getUser);

router.use('/:id', followRouter);
router.use('/:id', bookmarkRouter);
router.use('/:id', likeRouter);

router.get('/me/articles', authMiddleware, validateMiddleware(articleValidation.paginationSchema), articleController.getMyArticles);
router.get('/:id/articles', authMiddleware, validateMiddleware(articleValidation.paginationSchema), articleController.getUserArticles);

module.exports = router;