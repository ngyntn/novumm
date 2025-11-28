import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RelatedArticleCard = ({ article }) => (
    <Link to={`/news/${article.id}`} className="block p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <h4 className="font-bold text-gray-900 dark:text-gray-100">{article.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{new Date(article.publishedAt).toLocaleDateString()}</p>
    </Link>
);

const RelatedArticles = () => {
    const { relatedItems, item } = useSelector(state => state.news);
    
    if (relatedItems.length === 0) return null;

    return (
        <div className="my-12 py-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Các bài viết khác của {item.author?.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedItems.map(article => (
                    <RelatedArticleCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
};

export default RelatedArticles;