// File: routes/like.route.js
const express = require('express');
const likeController = require("../../../controllers/like.controller");
const authMiddleware = require('../../../middlewares/auth.middleware');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const userValidation = require("../../../validations/user.validation");

// mergeParams: true là bắt buộc
const router = express.Router({ mergeParams: true });

// Route này sẽ tương ứng với: GET /users/:id/liked-articles
router.get(
    '/liked-articles',
    authMiddleware,
    validateMiddleware(userValidation.paginationSchema),
    likeController.getLikedArticles
);

module.exports = router;