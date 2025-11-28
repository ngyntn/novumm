import React from 'react';
import NewsCard from './NewsCard';
import Loader from './Loader';
import ScrollToTopButton from './ScrollToTopButton';

const ArticleList = ({ items, loading, error, hasMore, lastElementRef, emptyState }) => {

    if (loading && items.length === 0) {
        return <Loader isLoading={true} />;
    }

    if (error && items.length === 0) {
        return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;
    }

    if (items.length === 0 && !loading) {
        return emptyState || <p className="text-center text-gray-500 dark:text-gray-400">Không có bài viết nào.</p>;
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {items.map((item, index) => {
                const author = item.author;
                if (items.length === index + 1) {
                    return (
                        <div ref={lastElementRef} key={item.id} className="w-full flex justify-center">
                            <NewsCard {...item} author={author} />
                        </div>
                    );
                }
                return <NewsCard key={item.id} {...item} author={author} />;
            })}
            
            {loading && items.length > 0 && <div className="py-8"><Loader isLoading={true} /></div>}
            {!hasMore && items.length > 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Đã hết bài viết để xem.</p>}
            
            <ScrollToTopButton />
        </div>
    );
};

export default ArticleList;