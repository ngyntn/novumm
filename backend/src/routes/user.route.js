const express = require('express');
const userController = require('../controllers/user.controller');
const validateMiddleware = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const userValidation = require("../validations/user.validation");
const bookmarkController = require("../controllers/bookmark.controller");
const followController = require("../controllers/follow.controller");


const router = express.Router();

// User profile
router.get('/me', authMiddleware, userController.getMyProfile);
router.get('/:id', authMiddleware, userController.getUser);
router.patch('/me', authMiddleware, validateMiddleware(userValidation.updateUserSchema), userController.updateUser);

// Followers
router.get('/me/followers', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getMyFollowers);
router.get('/:id/followers', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getFollowers);

// Following
router.get('/me/following', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getMyFollowing);
router.get('/:id/following', authMiddleware, validateMiddleware(userValidation.paginationSchema), followController.getFollowing);

//Bookmark
router.get('/me/bookmark-articles', authMiddleware, validateMiddleware(userValidation.paginationSchema), bookmarkController.getMyBookmarkArticles);
router.get('/:id/bookmark-articles', authMiddleware, validateMiddleware(userValidation.paginationSchema), bookmarkController.getBookmarkArticles);

//Follow
router.post('/:id/follow', authMiddleware, followController.followUser);
router.delete('/:id/unfollow', authMiddleware, followController.unfollowUser);

module.exports = router;