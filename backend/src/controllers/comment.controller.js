const commentService = require("../services/comment.service");
const ApiResponse = require("../utils/ApiResponse");
const { CommentDTO } = require("../dtos/comment.dto");
const asyncHandler = require("../utils/asyncHandler");

const getComments = asyncHandler(async (req, res) => {
  const { comments, pagination } = await commentService.getCommentsByArticle(
    req.query
  );

  const commentsDTO = comments.map((comment) => new CommentDTO(comment));

  res.status(200).json(
    new ApiResponse(200, "Lấy bình luận thành công.", {
      comments: commentsDTO,
      pagination,
    })
  );
});

const getReplies = asyncHandler(async (req, res) => {
  const parentId = parseInt(req.params.id, 10);

  const { comments, pagination } = await commentService.getRepliesByParent(
    parentId,
    req.query
  );

  const commentsDTO = comments.map((comment) => new CommentDTO(comment));

  res.status(200).json(
    new ApiResponse(200, "Lấy phản hồi thành công.", {
      comments: commentsDTO,
      pagination,
    })
  );
});

const createComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const comment = await commentService.createComment(userId, req.body);

  const commentDTO = new CommentDTO(comment);

  res
    .status(201)
    .json(new ApiResponse(201, "Bình luận thành công.", commentDTO));
});

const updateComment = asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  const { content } = req.body;

  const updatedComment = await commentService.updateComment(
    commentId,
    userId,
    content
  );

  const commentDTO = new CommentDTO(updatedComment);
  res
    .status(200)
    .json(new ApiResponse(200, "Cập nhật bình luận thành công.", commentDTO));
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  const deletedInfo = await commentService.deleteComment(commentId, userId);

  res
    .status(200)
    .json(new ApiResponse(200, "Xóa bình luận thành công.", deletedInfo));
});

module.exports = {
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment,
};
