const express = require('express');
const followController = require('../../../controllers/follow.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');
const validateMiddleware = require('../../../middlewares/validate.middleware');
const userValidation = require("../../../validations/user.validation");

// Quan trọng: mergeParams: true để nhận :id từ user.route.js
const router = express.Router({ mergeParams: true });

// Lưu ý: đường dẫn bây giờ là tương đối so với /:id
// GET /users/:id/followers
router.get('/followers', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getFollowers);

// GET /users/:id/following
router.get('/following', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getFollowing);

// POST /users/:id/follow
router.post('/follow', authMiddleware, followController.followUser);

// DELETE /users/:id/unfollow
router.delete('/unfollow', authMiddleware, followController.unfollowUser);

module.exports = router;