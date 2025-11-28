const { z } = require('zod');

const getNotifications = z.object({
  query: z.object({
    page: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 1),
      z.number().min(1).default(1)
    ),
    limit: z.preprocess(
      (val) => (val ? parseInt(val, 10) : 10),
      z.number().min(1).max(50).default(10) 
    ),
    unreadOnly: z.preprocess( 
      (val) => val === 'true' || val === true,
      z.boolean().optional()
    ),
  }),
});

const markNotificationsRead = z.object({
    body: z.object({
        notificationIds: z.array(z.number().int().positive()).min(1, "Cần ít nhất một ID thông báo.")
    })
});

module.exports = {
  getNotifications,
  markNotificationsRead,
};