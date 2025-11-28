const bookmarkService = require("../services/bookmark.service");
const { ListBookmarkArticlesDTO  } = require("../dtos/bookmark.dto");
const { PaginationDTO } = require("../dtos/user.dto");
const ApiResponse = require("../utils/ApiResponse");


const getBookmarkArticles = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const paginationDTO = new PaginationDTO(req.query);
        const result = await bookmarkService.getBookmarkArticles(userId, paginationDTO);

        const response = new ListBookmarkArticlesDTO(result.articles, result.nextCursor);

        res.status(200)
            .json(new ApiResponse(true, 'Liked articles fetched', response));
    } catch (error) {
        next(error);
    }
};
const getMyBookmarkArticles = async (req, res, next) => {
    try {
        const userId = req.user.id ;

        const paginationDTO = new PaginationDTO(req.query);
        const result = await bookmarkService.getBookmarkArticles(userId, paginationDTO);

        const response = new ListBookmarkArticlesDTO(result.articles, result.nextCursor);

        res.status(200)
            .json(new ApiResponse(true, 'Liked articles fetched', response));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBookmarkArticles,
    getMyBookmarkArticles,
};