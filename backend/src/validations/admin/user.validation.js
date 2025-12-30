const z = require('zod');

const listUsers = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        search: z.string().optional(),
        isActive: z.enum(['true', 'false']).optional(),
    })
});

module.exports = { listUsers };