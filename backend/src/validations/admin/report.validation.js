const z = require('zod');

const listReports = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        status: z.enum(['pending', 'dismissed', 'confirmed']).optional(),
        category: z.enum(['spam', 'hate_speech', 'adult_content', 'violence', 'fake_news', 'other']).optional(),
        source: z.enum(['user', 'ai']).optional(),
    })
});

const processReport = z.object({
    body: z.object({
        action: z.enum(['confirm', 'dismiss']),
        reason: z.string().min(5),
    })
});

module.exports = { listReports, processReport };