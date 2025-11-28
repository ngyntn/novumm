import { Link } from "react-router-dom";

const SidebarArticleCard = ({ article }) => {
    return (
      <Link
        to={`/news/${article.slug}`}
        className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
      >
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="w-full h-24 object-cover rounded-md mb-3"
        />
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          {article.title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          bởi {article.author?.fullName}
        </p>
      </Link>
    );
};
  
  export default SidebarArticleCard;