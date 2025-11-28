const prisma = require("../config/db.config");

const includeRelations = {
  actor: {
    select: { id: true, fullName: true, avatarUrl: true },
  },
  article: {
    select: { id: true, title: true, slug: true },
  },
  comment: {
    select: { id: true, content: true },
  },
};

const findAggregatableNotification = async ({
  recipientId,
  type,
  articleId,
  commentId,
}) => {
  let whereClause = {
    recipientId,
    type,
  };

  if (type === "like" || type === "comment") {
    whereClause.articleId = articleId;
  } else if (type === "reply") {
    whereClause.commentId = commentId;
  }

  return await prisma.notification.findFirst({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const create = async (data) => {
  return await prisma.notification.create({
    data: data,
    include: includeRelations,
  });
};

const update = async (id, data) => {
  return await prisma.notification.update({
    where: { id },
    data: data,
    include: includeRelations,
  });
};
const findByUser = async (recipientId, { skip, take, unreadOnly = false }) => {
  const whereClause = {
    recipientId: recipientId,
    ...(unreadOnly && { isRead: false }),
  };

  const [notifications, totalCount, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where: whereClause,
      include: {
        actor: { select: { id: true, fullName: true, avatarUrl: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.notification.count({ where: whereClause }),
    prisma.notification.count({
      where: { recipientId: recipientId, isRead: false },
    }),
  ]);

  return { notifications, totalCount, unreadCount };
};

const markAsRead = async (recipientId, notificationIds) => {
  return prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      recipientId: recipientId,
    },
    data: { isRead: true },
  });
};

const countUnread = async (recipientId) => {
  return prisma.notification.count({
    where: {
      recipientId: recipientId,
      isRead: false,
    },
  });
};

module.exports = {
  create,
  update,
  findAggregatableNotification,
  findByUser,
  markAsRead,
  countUnread,
};
