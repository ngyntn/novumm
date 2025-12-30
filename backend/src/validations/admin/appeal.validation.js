const z = require('zod');

const listAppeals = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
    })
});

const reviewAppeal = z.object({
    body: z.object({
        action: z.enum(['approve', 'reject']),
        adminReviewNote: z.string().min(5),
    })
});

module.exports = { listAppeals, reviewAppeal };