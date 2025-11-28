import React, { useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { fetchFeedNews } from "../api/articleApi";
import { resetFeed } from "../store/newsSlice";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import ArticleList from "../components/ArticleList";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const feedStateSelector = (state) => ({
  items: state.news.feed.items,
  loading: state.news.feed.loading,
  error: state.news.feed.error,
  page: state.news.feed.page,
  hasMore: state.news.feed.hasMore,
});

const Feed = () => {
  const listState = useSelector(feedStateSelector, shallowEqual);
  const dispatch = useDispatch();

  const memoizedFetchThunk = useCallback(
    (params) => {
      dispatch(fetchFeedNews(params));
    },
    [dispatch]
  );

  const { items, loading, error, hasMore, lastElementRef } = useInfiniteScroll({
    listState,
    fetchThunk: memoizedFetchThunk,
    resetAction: resetFeed,
  });

  const emptyFeedState = (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <p>Bảng tin của bạn đang trống.</p>
      <p>Hãy theo dõi một vài tác giả để xem bài viết của họ ở đây!</p>
      <Link
        to="/"
        className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block"
      >
        Khám phá các bài viết
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center py-8 transition-colors">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Bảng tin của bạn
      </h1>
      <ArticleList
        items={items}
        loading={loading}
        error={error}
        hasMore={hasMore}
        lastElementRef={lastElementRef}
        emptyState={emptyFeedState}
      />
    </div>
  );
};

export default Feed;
