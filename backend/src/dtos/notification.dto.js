class ActorDTO {
    constructor(actor) {
        this.id = actor.id;
        this.fullName = actor.fullName;
        this.avatarUrl = actor.avatarUrl;
    }
}

class ArticleInfoDTO {
    constructor(article) {
        this.id = article.id;
        this.title = article.title;
        this.slug = article.slug;
    }
}

class NotificationDTO {
    constructor(notification) {
        this.id = notification.id;
        this.type = notification.type;
        this.isRead = notification.isRead;
        this.createdAt = notification.createdAt;
        this.actor = notification.actor ? new ActorDTO(notification.actor) : null;
        this.article = notification.article ? new ArticleInfoDTO(notification.article) : null;
        this.commentId = notification.commentId || null;
        this.metadata = notification.metadata || {};
    }
}

module.exports = {
    NotificationDTO,
};