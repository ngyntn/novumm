import { useEffect, useRef, useState } from "react";
import { Heart, Bookmark, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  convertDateTimeToVietnam,
  convertLikeNumber,
  createContentSnippet,
} from "../utils/convert";
import { useDispatch, useSelector } from "react-redux";
import { updateArticleLike, toggleBookmark } from "../api/articleApi";
import { toast } from "react-hot-toast";

const NewsCard = ({
  id,
  title,
  author,
  createdAt,
  content,
  likesCount,
  commentsCount,
  isLiked,
  isBookmarked,
  tags = [],
  thumbnailUrl,
  slug,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [currentLikeCount, setCurrentLikeCount] = useState(likesCount || 0);
  const [currentUserReaction, setCurrentUserReaction] = useState(isLiked);
  const [currentIsBookmarked, setCurrentIsBookmarked] = useState(isBookmarked);

  const snippet = createContentSnippet(content, 120);

  useEffect(() => {
    setCurrentLikeCount(likesCount || 0);
    setCurrentUserReaction(isLiked);
    setCurrentIsBookmarked(isBookmarked);
  }, [likesCount, isLiked, isBookmarked]);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [content]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.info("Bạn cần đăng nhập để thích bài viết");
      navigate("/login");
      return;
    }

    const oldState = {
      isLiked: currentUserReaction,
      likeCount: currentLikeCount,
    };

    const newState = {
      isLiked: !currentUserReaction,
      likeCount: !currentUserReaction
        ? currentLikeCount + 1
        : currentLikeCount - 1,
    };
    setCurrentUserReaction(newState.isLiked);
    setCurrentLikeCount(newState.likeCount);

    try {
      await dispatch(updateArticleLike(id)).unwrap();
    } catch (error) {
      toast.error(error.message || "Lỗi: Không thể thích bài viết.");
      setCurrentUserReaction(oldState.isLiked);
      setCurrentLikeCount(oldState.likeCount);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.info("Bạn cần đăng nhập để lưu bài viết");
      navigate("/login");
      return;
    }

    const oldState = currentIsBookmarked;

    setCurrentIsBookmarked(!oldState);

    try {
      await dispatch(toggleBookmark(id)).unwrap();
    } catch (error) {
      toast.error(error.message || "Lỗi: Không thể lưu bài viết.");
      setCurrentIsBookmarked(oldState);
    }
  };

  const handleOnClickTitle = () => {
    navigate(`/news/${slug}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-6 sm:px-10 py-6 m-4 rounded-xl shadow-sm max-w-5xl w-full mx-auto transition-colors">
      {/* --- PHẦN HEADER (TÁC GIẢ, TIÊU ĐỀ, HÀNH ĐỘNG) --- */}
      <div className="flex justify-between items-start">
        {/* --- CỘT BÊN TRÁI (TIÊU ĐỀ, TÁC GIẢ) --- */}
        <div className="flex-1 pr-4">
          <div className="flex items-center mb-2">
            {author ? (
              <Link
                to={`/profile/${author.id}`}
                className="flex items-center group"
                onClick={(e) => e.stopPropagation()} // Ngăn card click
              >
                <img
                  src={
                    author.avatarUrl ||
                    "https://placehold.co/40x40/EFEFEF/AAAAAA?text=A"
                  }
                  alt={author.fullName}
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:underline">
                  {author.fullName}
                </span>
              </Link>
            ) : (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tác giả ẩn danh
              </span>
            )}
            <span className="text-sm text-gray-500 mx-2">•</span>
            <span className="text-sm text-gray-500">
              {convertDateTimeToVietnam(createdAt)}
            </span>
          </div>

          <h2
            className="text-xl font-bold mb-1 hover:cursor-pointer hover:underline text-gray-900 dark:text-gray-100"
            onClick={handleOnClickTitle}
          >
            {title}
          </h2>
        </div>

        {/* --- CỘT BÊN PHẢI (HÀNH ĐỘNG: LIKE, COMMENT, BOOKMARK) --- */}
        <div className="flex-shrink-0 flex items-center space-x-4 px-2 ml-4">
          <div className="flex items-center space-x-1" title="Lượt thích">
            <button
              onClick={handleLike}
              className={`p-1 rounded-full transition-colors ${
                currentUserReaction
                  ? "text-red-500 hover:bg-red-100 dark:hover:bg-gray-800"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500"
              }`}
            >
              <Heart
                className="w-5 h-5"
                fill={currentUserReaction ? "currentColor" : "none"}
              />
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {convertLikeNumber(currentLikeCount)}
            </p>
          </div>

          <div
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:cursor-pointer hover:text-indigo-500"
            title="Lượt bình luận"
            onClick={handleOnClickTitle} // Nhấp vào comment cũng đi đến bài viết
          >
            <MessageSquare className="w-5 h-5" />
            <p className="text-sm">{convertLikeNumber(commentsCount || 0)}</p>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-1 rounded-full transition-colors ${
              currentIsBookmarked
                ? "text-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-800"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-500"
            }`}
            title={currentIsBookmarked ? "Bỏ lưu" : "Lưu bài viết"}
          >
            <Bookmark
              className="w-5 h-5"
              fill={currentIsBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      {/* --- PHẦN NỘI DUNG (ẢNH VÀ TRÍCH ĐOẠN) --- */}
      <div
        className="mt-4 grid grid-cols-12 gap-6 hover:cursor-pointer"
        onClick={handleOnClickTitle}
      >
        {/* --- TRÍCH ĐOẠN NỘI DUNG --- */}
        <div
          className={`text-gray-700 dark:text-gray-300 text-sm leading-relaxed ${
            thumbnailUrl ? "col-span-8" : "col-span-12" // Chiếm toàn bộ nếu không có ảnh
          }`}
        >
          <p>{snippet}...</p>
        </div>

        {/* --- ẢNH THUMBNAIL --- */}
        {thumbnailUrl && (
          <div className="col-span-4">
            <img
              src={thumbnailUrl}
              alt={title}
              className="rounded-lg w-full h-32 object-cover border dark:border-gray-700"
              onError={(e) => {
                e.target.onerror = null; // Ngăn lặp vô hạn
                e.target.src =
                  "https://placehold.co/300x200/EFEFEF/AAAAAA?text=Image+Error";
              }}
            />
          </div>
        )}
      </div>

      {/* --- PHẦN TAGS --- */}
      {tags && tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id || tag.name}
              className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsCard;
