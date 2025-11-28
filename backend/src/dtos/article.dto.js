class AuthorDTO {
  constructor(author) {
    this.id = author.id;
    this.fullName = author.fullName;
    this.avatarUrl = author.avatarUrl || null;
  }
}

class TagDTO {
  constructor(tag) {
    this.id = tag.id;
    this.name = tag.name;
  }
}
class ArticleDetailDTO {
  constructor(article) {
    this.id = article.id;
    this.title = article.title;
    this.slug = article.slug;
    this.content = article.content;
    this.thumbnailUrl = article.thumbnailUrl;
    this.moderationStatus = article.moderationStatus;
    this.readTimeMinutes = article.readTimeMinutes;
    this.createdAt = article.createdAt;
    this.author = article.author ? new AuthorDTO(article.author) : null;
    this.tags = article.articleTags
      ? article.articleTags.map((at) => new TagDTO(at.tag))
      : [];
    this.comments = article.comments
      ? article.comments.map((comment) => new CommentDTO(comment))
      : [];
    this.likesCount = article._count ? article._count.articleLikes : 0;
    this.isLiked = article.articleLikes
      ? article.articleLikes.length > 0
      : false;
    this.isBookmarked = article.bookmarks
      ? article.bookmarks.length > 0
      : false;
    this.commentsCount = article._count ? article._count.comments : 0;
    this.moderationStatus = article.moderationStatus;
    this.violationReason = article.violationReason || null;
  }
}

class ArticleSummaryDTO {
  constructor(article) {
    this.id = article.id;
    this.title = article.title;
    this.slug = article.slug;
    this.content = article.content;
    this.thumbnailUrl = article.thumbnailUrl;
    this.createdAt = article.createdAt;
    this.author = article.author ? new AuthorDTO(article.author) : null;
    this.tags = article.articleTags
      ? article.articleTags.map((at) => new TagDTO(at.tag))
      : [];
    this.likesCount = article._count ? article._count.articleLikes : 0;
    this.isLiked = article.articleLikes
      ? article.articleLikes.length > 0
      : false;
    this.isBookmarked = article.bookmarks
      ? article.bookmarks.length > 0
      : false;
    this.commentsCount = article._count ? article._count.comments : 0;
  }
}


class ArticleCompactDTO {
  constructor(article) {
    this.id = article.id;
    this.title = article.title;
    this.content = article.content;
    this.slug = article.slug;
    this.publishedAt = article.createdAt;
    this.likeCount = article._count?.articleLikes || 0;
    this.userId = article.author?.id || null;
    this.thumbnailUrl = article.thumbnailUrl || null;
  }
}


module.exports = {
  ArticleDetailDTO,
  ArticleSummaryDTO,
  ArticleCompactDTO,
  AuthorDTO,
};
