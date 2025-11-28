const z = require('zod');

const updateUserSchema = z.object({
    body : z.object({
        fullName: z.string().min(10).max(100).optional(),
        avatarUrl: z.url().optional(),
        bio: z.string().max(300).optional(),
    })
});

const paginationSchema = z.object({
    query : z.object({
        limit: z
            .string()
            .regex(/^\d+$/, "Limit phải là số")
            .optional(),

        cursor: z
            .string()
            .regex(/^\d+$/, "Cursor phải là số")
            .optional(),

        search: z
            .string()
            .optional()

    })
});

module.exports = {
    updateUserSchema,
    paginationSchema,
};