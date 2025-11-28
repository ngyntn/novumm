import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postComment } from "../api/commentApi";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

const CommentForm = ({
  articleId,
  parentId = null,
  onCommentPosted,
  placeholder = "Viết bình luận...",
  currentUser,
}) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await dispatch(postComment({ articleId, content, parentId })).unwrap();
      setContent("");
      if (onCommentPosted) {
        onCommentPosted();
      }
    } catch (error) {
      toast.error(error.message || "Bình luận thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start w-full">
      <img
        src={
          currentUser.avatarUrl ||
          "https://placehold.co/400x400/gray/white?text=User"
        }
        alt="Your avatar"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-200 resize-none"
          rows={2}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-circle flex-shrink-0"
        disabled={isLoading}
        aria-label="Gửi bình luận"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

export default CommentForm;
