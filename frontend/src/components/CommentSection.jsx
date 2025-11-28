import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchComments } from "../api/commentApi";
import CommentForm from "./CommentForm";
import Comment from "./Comment";


const CommentSection = ({ articleId, totalComments }) => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const {
    items: comments,
    page,
    hasMore,
    loading,
    error,
  } = useSelector((state) => state.news.comments);

  useEffect(() => {
    if (articleId && currentUser) {
      dispatch(fetchComments({ articleId, page: 1, limit: 10 }));
    }
  }, [articleId, dispatch, currentUser]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchComments({ articleId, page: page, limit: 10 }));
    }
  };
  console.log(totalComments);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Bình luận ({totalComments || 0})
      </h3>

      {/* Form post comment GỐC */}
      <div className="mb-6">
        <CommentForm articleId={articleId} currentUser={currentUser} />
      </div>

      {/* Danh sách bình luận */}
      <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            articleId={articleId}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Lỗi / Nút "Tải thêm" */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="btn btn-ghost"
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Tải thêm bình luận"}
          </button>
        </div>
      )}
      {!hasMore && comments.length > 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          Đã hiển thị tất cả bình luận.
        </p>
      )}
    </div>
  );
};

export default CommentSection;
