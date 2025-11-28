const z = require('zod');
  
const register = z.object({
    body: z.object({
        fullName: z.string().min(1),
        email: z.email(),
        password: z.string().min(8),
    }),
});
  
const login = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(8),
    }),
});
  
const refreshToken = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});

const requestOtp = z.object({
    body: z.object({
        email: z.email(),
    }),
});

const changePassword = z.object({
    body: z.object({
        email: z.email(),
        otp: z.string().length(6),
        newPassword: z.string().min(8),
    }),
});

const verifyOtp = z.object({
    body: z.object({
        email: z.email(),
        otp: z.string().length(6),
    }),
});

module.exports = {
    register,
    login,
    refreshToken,
    requestOtp,
    changePassword,
    verifyOtp,
};