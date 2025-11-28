import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetailNews,
  fetchAuthorArticles,
  fetchRelatedArticlesByTag,
  readArticle,
} from "../api/articleApi";
import LikeInteraction from "../components/LikeInteraction";
import CommentSection from "../components/CommentSection";
import { convertDateTimeToVietnam } from "../utils/convert";
import { resetNewsDetail } from "../store/newsSlice";
import Loader from "../components/Loader";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { deleteNews } from "../api/articleApi";
import toast from "react-hot-toast";
import BookmarkInteraction from "../components/BookmarkInteraction";
import AuthorArticles from "../components/AuthorArticles";
import RelatedArticlesByTag from "../components/RelatedArticlesByTag";

function NewsDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    item,
    itemLoading,
    itemError,
    deleteStatus,
    authorArticles,
    authorArticlesLoading,
    relatedArticles,
    relatedArticlesLoading,
  } = useSelector((state) => state.news);
    const { currentUser } = useSelector((state) => state.user);
    
    console.log(item);

  useEffect(() => {
    if (slug) {
      dispatch(fetchDetailNews(slug));
    }
    return () => {
      dispatch(resetNewsDetail());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (item) {
      if (item.author?.id) {
        dispatch(
          fetchAuthorArticles({
            authorId: item.author.id,
            excludeId: item.id,
            limit: 5,
          })
        );
      }
      if (item.tags && item.tags.length > 0) {
        const tagIds = item.tags.map((tag) => tag.id).join(",");
        dispatch(
          fetchRelatedArticlesByTag({
            tagIds: tagIds,
            excludeId: item.id,
            limit: 5,
          })
        );
      }
    }
  }, [dispatch, item]);

  useEffect(() => {
    if (item) {
      dispatch(readArticle(item.id));
    }
  }, [item]);

  const isAuthor = currentUser && item && currentUser.id === item.author?.id;

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      try {
        await dispatch(deleteNews(item.id)).unwrap();
        toast.success("Xóa bài viết thành công!");
        navigate("/");
      } catch (error) {
        toast.error(error.message || "Xóa bài viết thất bại.");
      }
    }
  };

  if (itemLoading) return <Loader isLoading={true} />;
  if (itemError)
    return <div className="text-red-500 text-center">{itemError}</div>;
  if (!item) return null;

  return (
    <div className="dark:text-gray-200">
      {/* Thumbnail */}
      <img
        src={item.thumbnailUrl}
        alt={item.title}
        className="w-full h-[40vh] object-cover"
      />

      {/* === LAYOUT 3 CỘT (MỚI) === */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8">
        
        {/* === CỘT TRÁI: BÀI VIẾT CỦA TÁC GIẢ === */}
        <aside className="w-full lg:w-1/4 space-y-6 lg:sticky lg:top-20 h-fit">
          <AuthorArticles
            articles={authorArticles}
            loading={authorArticlesLoading}
            authorName={item.author?.fullName}
          />
        </aside>

        {/* === CỘT GIỮA: NỘI DUNG CHÍNH === */}
        <main className="w-full lg:w-1/2">
          {/* Nút "Quay lại" */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm mb-4 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          {/* Tiêu đề */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {item.title}
          </h1>

          {/* Thông tin tác giả & Nút Sửa/Xóa */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={
                  item.author?.avatarUrl ||
                  "https://placehold.co/400x400/gray/white?text=User"
                }
                alt={item.author?.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{item.author?.fullName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {convertDateTimeToVietnam(item.createdAt)}
                </p>
              </div>
            </div>
            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/edit/${item.slug}`}
                  className="btn btn-sm btn-ghost btn-circle hover:bg-base-200 dark:hover:bg-base-700"
                  aria-label="Sửa bài viết"
                >
                  <PencilIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn btn-sm btn-ghost btn-circle text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                  disabled={deleteStatus === "loading"}
                  aria-label="Xóa bài viết"
                >
                  {deleteStatus === "loading" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <TrashIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Nội dung bài viết */}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                  
                  {item.tags && item.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-base-200 dark:border-base-700 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Link
                  to={`/search/${tag.name}`} 
                  key={tag.id}
                  className="btn btn-sm btn-ghost bg-gray-100 dark:bg-gray-800 rounded-full font-normal hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  # {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Tương tác Like/Bookmark */}
          <div className="flex items-center space-x-6 py-4 border-b border-base-200 dark:border-base-700 mt-6">
            <LikeInteraction article={item} />
            <BookmarkInteraction article={item} />
          </div>

          {/* Khu vực bình luận */}
          <CommentSection 
            articleId={item.id} 
            totalComments={item.commentsCount} 
          />
        </main>

        {/* === CỘT PHẢI: BÀI VIẾT LIÊN QUAN === */}
        <aside className="w-full lg:w-1/4 space-y-6 lg:sticky lg:top-20 h-fit">
          <RelatedArticlesByTag
            articles={relatedArticles}
            loading={relatedArticlesLoading}
          />
        </aside>
      </div>
    </div>
  );
}

export default NewsDetail;