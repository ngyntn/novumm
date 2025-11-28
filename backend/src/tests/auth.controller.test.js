const authController = require('../controllers/auth.controller');
const authService = require('../services/auth.service');

jest.mock('../services/auth.service');

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('register - success', async () => {
        authService.register.mockResolvedValue({ id: '1' });

        await authController.register(req, res, next);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    test('register - error', async () => {
        authService.register.mockRejectedValue(new Error('error'));

        await authController.register(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    // Add more tests for other methods
});