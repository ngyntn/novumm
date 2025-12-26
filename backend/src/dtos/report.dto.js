class ReportDTO {
    constructor({ id, category, reason, status, createdAt }) {
        this.id = id;
        this.category = category;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }
}

class AppealDTO {
    constructor({ id, appealNote, status, reviewedAt, reason, article }) {
        this.id = id;
        this.appeal_note = appealNote;
        this.status = status;
        this.reviewedAt = reviewedAt;
        this.reason = reason;
        this.article = { title: article.title, moderation_status: article.moderationStatus };
    }
}

module.exports = { ReportDTO, AppealDTO };