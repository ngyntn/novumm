const commentRepository = require("../repositories/comment.repository");
const articleRepository = require("../repositories/article.repository");
const { NotFoundError, BadRequestError } = require("../utils/AppError");
const notificationService = require("./notification.service");

const getCommentsByArticle = async (query) => {
  const articleId = parseInt(query.articleId, 10);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("Không tìm thấy bài viết.");
  }

  const { comments, totalCount } = await commentRepository.findByArticleId(
    articleId,
    { skip, take: limit }
  );

  const totalPages = Math.ceil(totalCount / limit);
  const pagination = {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
  };

  return { comments, pagination };
};

const getRepliesByParent = async (parentId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  const parentComment = await commentRepository.findById(parentId);
  if (!parentComment) {
    throw new NotFoundError("Không tìm thấy bình luận cha.");
  }

  const { comments, totalCount } =
    await commentRepository.findRepliesByParentId({
      parentId,
      skip,
      take: limit,
    });

  const totalPages = Math.ceil(totalCount / limit);
  const pagination = {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
  };

  return { comments, pagination };
};

const createComment = async (userId, body) => {
  const { articleId, content, parentId } = body;

  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new NotFoundError("Không tìm thấy bài viết để bình luận.");
  }

  let recipientId = article.authorId;
  let isReply = !!parentId;

  if (isReply) {
    const parentComment = await commentRepository.findById(parentId);
    if (!parentComment) {
      throw new NotFoundError("Bình luận cha không tồn tại.");
    }
    if (parentComment.articleId !== articleId) {
      throw new BadRequestError("Bình luận cha không thuộc bài viết này.");
    }
    if (userId !== parentComment.userId) {
      recipientId = parentComment.userId;
    }
  }

  const isAuthor = article.authorId === userId;

  const newComment = await commentRepository.create({
    userId,
    articleId,
    content,
    isAuthor,
    parentId,
  });

  if (userId !== recipientId) {
    const notificationType = parentId ? "reply" : "comment";
    const aggregationCommentId = isReply ? parentId : null;
    let initialMetadata = {};
    if (isReply) {
      initialMetadata.newReplyId = newComment.id;
    } else {
      initialMetadata.newCommentId = newComment.id;
    }
    await notificationService.createNotification({
      recipientId: recipientId,
      actorId: userId,
      type: notificationType,
      articleId: article.id,
      commentId: aggregationCommentId,
      metadata: initialMetadata,
    });
  }

  return newComment;
};

const updateComment = async (commentId, userId, newContent) => {
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Không tìm thấy bình luận.");
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError("Bạn không có quyền sửa bình luận này.");
  }

  const updatedComment = await commentRepository.update(commentId, newContent);
  return updatedComment;
};

const deleteComment = async (commentId, userId) => {
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Không tìm thấy bình luận.");
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError("Bạn không có quyền xóa bình luận này.");
  }

  await commentRepository.remove(commentId);
  return { id: commentId, parentId: comment.parentId };
};

module.exports = {
  getCommentsByArticle,
  getRepliesByParent,
  createComment,
  updateComment,
  deleteComment,
};
