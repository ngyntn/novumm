class AuthorDTO {
  constructor(author) {
    this.id = author.id;
    this.fullName = author.fullName;
    this.avatarUrl = author.avatarUrl;
  }
}

class CommentDTO {
  constructor(comment) {
    this.id = comment.id;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.isAuthor = comment.isAuthor;
    this.parentId = comment.parentId;
    this.author = comment.user ? new AuthorDTO(comment.user) : null;
    this.replyCount = comment._count?.replies ?? 0;
    this.replies =
      comment.replies && Array.isArray(comment.replies)
        ? comment.replies.map((reply) => new CommentDTO(reply))
        : [];
  }
}

module.exports = {
  AuthorDTO,
  CommentDTO,
};
