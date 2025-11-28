const express = require("express");
const articleController = require("../controllers/article.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const articleValidation = require("../validations/article.validation");
const createUploader = require("../config/s3Upload");

const router = express.Router();

const imageMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const mediaMimes = [
  ...imageMimes,
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

const uploadThumbnail = createUploader(
  "thumbnails",
  imageMimes,
  1024 * 1024 * 5 // 5MB
);

const uploadMedia = createUploader(
  "media",
  mediaMimes,
  1024 * 1024 * 100 // 100MB
);

router.post(
  "/",
  auth,
  uploadThumbnail.single("thumbnail"),
  validate(articleValidation.createArticle),
  articleController.createArticle
);

router.put(
  "/:id",
  auth,
  uploadThumbnail.single("thumbnail"),
  validate(articleValidation.updateArticle),
  articleController.updateArticle
);

router.delete(
  "/:id",
  auth,
  validate(articleValidation.deleteArticle),
  articleController.deleteArticle
);

router.post(
  "/upload-media",
  auth,
  uploadMedia.single("media_file"),
  articleController.uploadMedia
);

router.get(
  "/feed",
  auth,
  validate(articleValidation.getArticles),
  articleController.getFeedArticles
);

router.get(
  "/related",
  auth,
  validate(articleValidation.getRelatedArticles),
  articleController.getRelatedArticles
);

router.get(
  "/author",
  auth,
  validate(articleValidation.getAuthorArticles),
  articleController.getAuthorArticles
);

router.get(
  "/recommend",
  auth,
  validate(articleValidation.getRecommendedArticles),
  articleController.getRecommendedArticles
);

router.get(
    "/search/knn",
    auth,
    validate(articleValidation.getSearchArticles),
    articleController.getSearchArticles
  );


router.post(
  "/:id/like",
  auth,
  validate(articleValidation.interactArticle),
  articleController.toggleLike
);

router.post(
  "/:id/bookmark",
  auth,
  validate(articleValidation.interactArticle),
  articleController.toggleBookmark
);

router.post(
  "/:id/read",
  auth,
  validate(articleValidation.interactArticle),
  articleController.read
);

router.get(
  "/:slug",
  auth,
  validate(articleValidation.getArticleBySlug),
  articleController.getArticleBySlug
);



router.get(
  "/",
  auth,
  validate(articleValidation.getArticles),
  articleController.getAllArticles
);

module.exports = router;
