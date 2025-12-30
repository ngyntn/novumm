class AppealDTO {
    constructor({ id, appeal_note, status, reviewedAt, reason, article, author }) {
        this.id = id;
        this.appeal_note = appeal_note;
        this.status = status;
        this.reviewedAt = reviewedAt;
        this.reason = reason;
        this.article = { id: article.id, title: article.title };
        this.author = { id: author.id, name: author.name };
    }
}

module.exports = { AppealDTO };