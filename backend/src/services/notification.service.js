const notificationRepository = require("../repositories/notification.repository");
const { emitNotification } = require("../sockets/user.notification.socket.js");
const { NotificationDTO } = require("../dtos/notification.dto");
const { NotFoundError, BadRequestError } = require("../utils/AppError");
const logger = require("../utils/logger");

const AGGREGATE_TYPES = ["like", "comment", "reply"];

const createNotification = async (data) => {
  try {
    const {
      recipientId,
      actorId,
      type,
      articleId,
      commentId,
      metadata: inputMetadata,
    } = data;

    let notificationToEmit;

    if (AGGREGATE_TYPES.includes(type) && actorId) {
      let aggregationKey = {};
      if (type === "like" || type === "comment") {
        aggregationKey.articleId = articleId;
      } else if (type === "reply") {
        aggregationKey.commentId = commentId;
      }

      const existingNoti =
        await notificationRepository.findAggregatableNotification({
          recipientId,
          type,
          ...aggregationKey,
        });

      if (existingNoti) {
        const metadata = existingNoti.metadata || {};

        let actors =
          metadata.actors ||
          (existingNoti.actorId ? [existingNoti.actorId] : []);
        if (!actors.includes(actorId)) {
          actors.push(actorId);
        }

        let replyIds = metadata.replyIds || [];
        if (
          type === "reply" &&
          inputMetadata?.newReplyId &&
          !replyIds.includes(inputMetadata.newReplyId)
        ) {
          replyIds.push(inputMetadata.newReplyId);
        }

        const updatedMetadata = {
          actors: actors,
          count: actors.length,
          ...(replyIds.length > 0 && { replyIds: replyIds }),
        };

        notificationToEmit = await notificationRepository.update(
          existingNoti.id,
          {
            actorId: actorId,
            metadata: updatedMetadata,
            createdAt: new Date(),
            isRead: false,
          }
        );
        logger.info(
          `Aggregated notification ${existingNoti.id} for user ${recipientId}`
        );
      } else {
        let initialMetadata = {
          actors: [actorId],
          count: 1,
        };

        if (type === "reply" && inputMetadata?.newReplyId) {
          initialMetadata.replyIds = [inputMetadata.newReplyId];
        }

        const createData = {
          ...data,
          metadata: initialMetadata,
          isRead: false,
        };
        notificationToEmit = await notificationRepository.create(createData);
        logger.info(`Notification created for user ${recipientId}`);
      }
    } else {
      notificationToEmit = await notificationRepository.create(data);
      logger.info(
        `Notification (non-aggregate) created for user ${recipientId}`
      );
    }

    const notificationDTO = new NotificationDTO(notificationToEmit);

    emitNotification(
      recipientId.toString(),
      "new_notification",
      notificationDTO
    );

    const unreadCount = await notificationRepository.countUnread(recipientId);
    emitNotification(recipientId.toString(), "notification_read_update", {
      unreadCount,
    });

    logger.info(`Notification logic processed for user ${recipientId}`);
    return notificationDTO;
  } catch (error) {
    logger.error(`Error creating/aggregating notification: ${error.message}`);
  }
};

const getNotifications = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const unreadOnly = query.filter === 'unread';

  const { notifications, totalCount, unreadCount } =
    await notificationRepository.findByUser(userId, {
      skip,
      take: limit,
      unreadOnly,
    });

  const totalPages = Math.ceil(totalCount / limit);
  const pagination = {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
  };

  const notificationsDTO = notifications.map(
    (noti) => new NotificationDTO(noti)
  );

  return { notifications: notificationsDTO, pagination, unreadCount };
};

const markNotificationsAsRead = async (userId, notificationIds) => {
  if (!notificationIds || notificationIds.length === 0) {
    throw new BadRequestError("Cần cung cấp danh sách notificationIds.");
  }

  const result = await notificationRepository.markAsRead(
    userId,
    notificationIds
  );

  if (result.count === 0) {
    logger.warn(`No notifications marked as read for user ${userId}.`);
  }

  const unreadCount = await notificationRepository.countUnread(userId);
  emitNotification(userId.toString(), "notification_read_update", {
    unreadCount,
  });

  return { markedCount: result.count, unreadCount };
};

const getUnreadCount = async (userId) => {
  const count = await notificationRepository.countUnread(userId);
  return { unreadCount: count };
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationsAsRead,
  getUnreadCount,
};
