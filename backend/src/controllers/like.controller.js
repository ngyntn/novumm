const likeService = require("../services/like.service");
const { ListArticlesDTO  } = require("../dtos/article.dto");
const { PaginationDTO } = require("../dtos/user.dto");
const ApiResponse = require("../utils/ApiResponse");


const getLikedArticles = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const paginationDTO = new PaginationDTO(req.query);
        const result = await likeService.getLikedArticles(userId, paginationDTO);

        const response = new ListArticlesDTO(result.articles, result.nextCursor);

        res.status(200)
            .json(new ApiResponse(true, 'Liked articles fetched', response));
    } catch (error) {
        next(error);
    }
};
const getMyLikedArticles = async (req, res, next) => {
    try {
        const userId = req.user.id ;

        const paginationDTO = new PaginationDTO(req.query);
        const result = await likeService.getLikedArticles(userId, paginationDTO);

        const response = new ListArticlesDTO(result.articles, result.nextCursor);

        res.status(200)
            .json(new ApiResponse(true, 'Liked articles fetched', response));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLikedArticles,
    getMyLikedArticles,
};