const { UserSummaryDTO, ListUserDTO, PaginationDTO } = require("../dtos/user.dto");
const followService = require("../services/follow.service");
const ApiResponse = require("../utils/ApiResponse");


const getFollowers = async (req, res, next) => {
    try {
        const userId =  parseInt(req.params.id);
        const paginationDTO = new PaginationDTO(req.query);
        const result = await followService.getFollowers(userId, paginationDTO);

        const response = new ListUserDTO(
            result.followers.map(u => new UserSummaryDTO(u.follower)),
            result.nextCursor
        );

        res.status(200)
            .json(new ApiResponse(true, 'Followers fetched', response));
    } catch (error) {
        next(error);
    }
};

const getFollowing = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const paginationDTO = new PaginationDTO(req.query);
        const result = await followService.getFollowing(userId, paginationDTO);
        const response = new ListUserDTO(
            result.following.map(u => new UserSummaryDTO(u.followed)),
            result.nextCursor
        );

        res.status(200)
            .json(new ApiResponse(true, 'Following fetched', response));
    } catch (error) {
        next(error);
    }
};

const getMyFollowers = async (req, res, next) => {
    try {
        const userId = req.user.id ;
        const paginationDTO = new PaginationDTO(req.query);
        const result = await followService.getFollowers(userId, paginationDTO);

        const response = new ListUserDTO(
            result.followers.map(u => new UserSummaryDTO(u.follower)),
            result.nextCursor
        );

        res.status(200)
            .json(new ApiResponse(true, 'Followers fetched', response));
    } catch (error) {
        next(error);
    }
};

const getMyFollowing = async (req, res, next) => {
    try {
        const userId =  req.user.id;
        const paginationDTO = new PaginationDTO(req.query);
        const result = await followService.getFollowing(userId, paginationDTO);

        const response = new ListUserDTO(
            result.following.map(u => new UserSummaryDTO(u.followed)),
            result.nextCursor
        );

        res.status(200)
            .json(new ApiResponse(true, 'Following fetched', response));
    } catch (error) {
        next(error);
    }
};

const followUser = async (req, res, next) => {
    try {
        const targetUserId = parseInt(req.params.id);
        const currentUserId = req.user.id;
        await followService.toggleFollow(currentUserId, targetUserId, 'follow');
        res.status(201).json(new ApiResponse(true, 'Follow Successfully'));
    } catch (err) {
        next(err);
    }
};

const unfollowUser = async (req, res, next) => {
    try {
        const targetUserId = parseInt(req.params.id);
        const currentUserId = req.user.id;
        await followService.toggleFollow(currentUserId, targetUserId, 'unfollow');
        res.status(200).json(new ApiResponse(true, 'Unfollow Successfully'));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    getMyFollowers,
    getMyFollowing
};