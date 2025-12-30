const z = require('zod');

const createReport = z.object({
    body : z.object({
        category: z.enum(['spam', 'hate_speech', 'adult_content', 'violence', 'fake_news', 'other']),
        reason: z.string().min(5),
    })
});

const createAppeal = z.object({
    body : z.object({
        appealNote: z.string().min(10),
    })
});

const listAppeals = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        status: z.string().optional(),
    })
});

module.exports = { createReport, createAppeal, listAppeals };