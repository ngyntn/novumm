const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis.config');

jest.mock('../repositories/user.repository');
jest.mock('../config/redis.config');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('register - success', async () => {
        userRepository.findByEmail.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashed');
        userRepository.create.mockResolvedValue({ id: '1', name: 'test', email: 'test@example.com', password: 'hashed' });

        const user = await authService.register({ name: 'test', email: 'test@example.com', password: 'pass' });
        expect(user.id).toBe('1');
        expect(user.password).toBeUndefined(); // DTO hides it
    });

    test('register - email exists', async () => {
        userRepository.findByEmail.mockResolvedValue({});

        await expect(authService.register({})).rejects.toThrow('Email already exists');
    });

    // Similar tests for login, refreshToken, etc.
});