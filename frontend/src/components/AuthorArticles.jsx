import SidebarArticleCard from "./SideBarArticleCard";

const AuthorArticles = ({ articles, loading, authorName }) => {
    return (
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Bài viết khác từ {authorName}
        </h3>
        {loading && (
          <div className="space-y-2">
            <div className="skeleton h-24 w-full"></div>
            <div className="skeleton h-24 w-full"></div>
          </div>
        )}
        {!loading && articles.length > 0 && (
          <div className="space-y-4">
            {articles.map((article) => (
              <SidebarArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
        {!loading && articles.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tác giả chưa có bài viết nào khác.
          </p>
        )}
      </div>
    );
};
  
export default AuthorArticles;