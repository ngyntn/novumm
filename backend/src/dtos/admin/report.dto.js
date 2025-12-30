class ReportDTO {
    constructor({ id, category, reason, status, article, reporter }) {
        this.id = id;
        this.category = category;
        this.reason = reason;
        this.status = status;
        this.article = { id: article.id, title: article.title };
        this.reporter = { id: reporter.id, name: reporter.name };
    }
}

module.exports = { ReportDTO };