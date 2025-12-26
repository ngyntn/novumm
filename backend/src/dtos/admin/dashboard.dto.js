class StatisticsDTO {
    constructor({ totalUsers, totalArticles, pendingReports, pendingAppeals }) {
        this.total_users = totalUsers;
        this.total_articles = totalArticles;
        this.pending_reports = pendingReports;
        this.pending_appeals = pendingAppeals;
    }
}

class ChartsDTO {
    constructor({ users, articles }) {
        this.users = users;
        this.articles = articles;
    }
}

class HotlistsDTO {
    constructor({ reports, appeals }) {
        this.reports = reports;
        this.appeals = appeals;
    }
}

module.exports = { StatisticsDTO, ChartsDTO, HotlistsDTO };