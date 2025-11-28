const notificationService = require("../services/notification.service.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await notificationService.getNotifications(userId, req.query);
  res
    .status(200)
    .json(
      new ApiResponse(200, "Lấy danh sách thông báo thành công.", result)
    );
});

const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notificationIds } = req.body;
  const result = await notificationService.markNotificationsAsRead(
    userId,
    notificationIds
  );
  res
    .status(200)
    .json(new ApiResponse(200, "Đánh dấu đã đọc thành công.", result));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await notificationService.getUnreadCount(userId);
  res
    .status(200)
    .json(
      new ApiResponse(200, "Lấy số thông báo chưa đọc thành công.", result)
    );
});

module.exports = {
  getNotifications,
  markAsRead,
  getUnreadCount,
};