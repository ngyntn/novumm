import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Check } from "lucide-react";
import { updateComment } from "../api/commentApi";
import toast from "react-hot-toast";

const EditCommentForm = ({ comment, onCancel, onSave }) => {
    const dispatch = useDispatch();
    const [content, setContent] = useState(comment.content);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!content.trim() || content === comment.content) {
        onCancel(); 
        return;
      }
  
      setIsLoading(true);
      try {
        await dispatch(
          updateComment({ commentId: comment.id, content: content })
        ).unwrap();
        toast.success("Đã cập nhật bình luận");
        onSave();
      } catch (error) {
        toast.error(error.message || "Cập nhật thất bại.");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-200 resize-none"
          rows={2}
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-sm btn-ghost"
          >
            <X className="w-4 h-4" /> Hủy
          </button>
          <button type="submit" className="btn btn-sm btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Check className="w-4 h-4" />
            )}
            Lưu
          </button>
        </div>
      </form>
    );
};
  
export default EditCommentForm;