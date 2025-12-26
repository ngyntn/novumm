// File: routes/bookmark.route.js
const express = require('express');
const bookmarkController = require("../../../controllers/bookmark.controller");
const authMiddleware = require('../../../middlewares/auth.middleware');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const userValidation = require("../../../validations/user.validation");

// mergeParams: true là bắt buộc để nhận :id từ user.route.js cha
const router = express.Router({ mergeParams: true });

// Route này sẽ tương ứng với: GET /users/:id/bookmark-articles
router.get(
    '/bookmark-articles',
    authMiddleware,
    validateMiddleware(userValidation.paginationSchema),
    bookmarkController.getBookmarkArticles
);

module.exports = router;