import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, Clock, UploadCloud } from "lucide-react";

export default function ArticleFormUI({
  isEdit = false,
  title, setTitle,
  content, setContent,
  readTimeMinutes, setReadTimeMinutes,
  thumbnailPreview, handleThumbnailChange, removeThumbnail,
  tags, currentTag, handleTagKeyDown, setCurrentTag, removeTag,
  quillRef, modules,
  handleSubmit, isLoading, navigate,
}) {
  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h1>
            {!isEdit && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Chia sẻ kiến thức và câu chuyện của bạn đến với mọi người.
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8 space-y-8">
              {/* === Ảnh bìa (Thumbnail) === */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ảnh bìa (Thumbnail)
                </label>
                {!thumbnailPreview ? (
                  <label
                    htmlFor="thumbnail-upload"
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          Nhấn để tải lên
                        </span>{" "}
                        hoặc kéo thả
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG, GIF, WEBP tối đa 5MB
                      </p>
                    </div>
                    <input
                      id="thumbnail-upload"
                      name="thumbnail"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      required={!isEdit} // Ảnh bìa là BẮT BUỘC khi TẠO MỚI
                    />
                  </label>
                ) : (
                  // --- Vùng xem trước ảnh ---
                  <div className="mt-2 relative">
                    <img
                      src={thumbnailPreview}
                      alt="Xem trước"
                      className="max-h-80 w-full object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                    >
                      <X size={24} />
                    </button>
                  </div>
                )}
              </div>

              {/* === Tiêu đề === */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tiêu đề
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full bg-gray-50 dark:bg-gray-700"
                  placeholder="Bài viết của bạn nói về điều gì?"
                  required
                />
              </div>

              {/* === Thời gian đọc === */}
              <div className="mb-6">
                <label
                  htmlFor="readTime"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Thời gian đọc (phút)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="number"
                    id="readTime"
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(e.target.value)}
                    min="1"
                    placeholder="5"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* === Tags === */}
              <div className="mb-6">
                <label
                  htmlFor="tags"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Gắn thẻ (tags)
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-indigo-500">
                  {tags?.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      <span className="text-gray-900 dark:text-white">{(tag && String(tag)) || ''}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-indigo-400 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-100 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Thêm tag..."
                    className="flex-grow min-w-[120px] bg-transparent focus:outline-none text-gray-900 dark:text-gray-200 p-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Nhấn Enter hoặc dấu phẩy (,) để thêm một tag.
                </p>
              </div>

              {/* === Nội dung (Editor) === */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nội dung
                </label>
                <div className="rounded-lg shadow-sm">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                  />
                </div>
              </div>
            </div>

            {/* === Vùng Nút bấm === */}
            <div className="flex items-center justify-end gap-4 p-6 sm:p-8 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    {isEdit ? "Đang cập nhật..." : "Đang đăng..."}
                  </>
                ) : (
                  isEdit ? "Cập nhật" : "Đăng bài"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
