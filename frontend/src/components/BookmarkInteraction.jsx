import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
import { toggleBookmark } from "../api/articleApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookmarkInteraction = ({ article }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked);

  useEffect(() => {
    setIsBookmarked(article.isBookmarked);
  }, [article.isBookmarked]);

  const handleBookmark = async () => {
    const oldState = isBookmarked;
    setIsBookmarked(!oldState);
    try {
      await dispatch(toggleBookmark(article.id)).unwrap();
    } catch (error) {
      toast.error(error.message || "Lỗi: Không thể lưu bài viết.");
      setIsBookmarked(oldState);
    }
  };

  return (
    <button
      className="btn btn-ghost btn-sm flex items-center space-x-1"
      onClick={handleBookmark}
      disabled={isLoading} // Disable nút khi đang loading
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <Bookmark
          className={`w-5 h-5 ${
            isBookmarked
              ? "fill-blue-500 text-blue-500" // Đã bookmark
              : "text-gray-500 dark:text-gray-400" // Chưa bookmark
          }`}
        />
      )}
      <span>{isBookmarked ? "Đã lưu" : "Lưu"}</span>
    </button>
  );
};

export default BookmarkInteraction;
