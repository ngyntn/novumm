const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');
const { UserResponseDTO } = require("../dtos/user.dto");

const getMyProfile = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.user.id);
        const response = new UserResponseDTO(user)
        res.status(200)
            .json(new ApiResponse(true, 'User fetched successfully', response));
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await userService.getUser(userId);
        const response = new UserResponseDTO(user)
        res.status(200)
            .json(new ApiResponse(true, 'User fetched successfully', response));
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.user.id, req.body);
        const response = new UserResponseDTO(user)
        res.status(200)
            .json(new ApiResponse(true, 'User updated successfully', response));
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getMyProfile,
    getUser,
    updateUser,

};