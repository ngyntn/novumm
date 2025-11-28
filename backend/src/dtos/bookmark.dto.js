const { ArticleSummaryDTO } = require("./article.dto");

class ListBookmarkArticlesDTO {
    constructor(bookmarkArticles, nextCursor = null) {
        this.articles = bookmarkArticles.map(b => new ArticleSummaryDTO(b.article));
        this.nextCursor = nextCursor;
    }
}

module.exports = { ListBookmarkArticlesDTO };