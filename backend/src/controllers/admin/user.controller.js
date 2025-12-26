const userService = require('../../services/admin/user.service');
const ApiResponse = require('../../utils/ApiResponse');

const listUsers = async (req, res, next) => {
    try {
        const users = await userService.listUsers(req.query);
        res.status(200).json(new ApiResponse(true, 'Users fetched', users));
    } catch (error) {
        next(error);
    }
};

const activeUser = async (req, res, next) => {
    try {
        await userService.activeUser(parseInt(req.params.user_id), req.body);
        res.status(200).json(new ApiResponse(true, 'active user successfully!!!'));
    } catch (error) {
        next(error);
    }
};

const inactiveUser = async (req, res, next) => {
    try {
        await userService.inactiveUser(parseInt(req.params.user_id), req.body);
        res.status(200).json(new ApiResponse(true, 'inactive user successfully!!!'));
    } catch (error) {
        next(error);
    }
};


module.exports = {
    listUsers,
    activeUser,
    inactiveUser
};