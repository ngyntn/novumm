// src/routes/notification.route.js
const express = require("express");
const notificationController = require("../controllers/notification.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const notificationValidation = require("../validations/notification.validation");

const router = express.Router();

router.use(auth);

router.get(
  "/",
  validate(notificationValidation.getNotifications),
  notificationController.getNotifications
);

router.get(
  "/unread-count",
  notificationController.getUnreadCount
);

router.post(
  "/mark-as-read",
  validate(notificationValidation.markNotificationsRead),
  notificationController.markAsRead
);

module.exports = router;