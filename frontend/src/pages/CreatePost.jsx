import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createNews } from "../api/articleApi";
import { resetArticleStatus } from "../store/newsSlice";
import { useArticleForm } from "../hooks/userArticleForm"; // NEW IMPORT
import ArticleFormUI from "../components/ArticleFormUI"; // NEW IMPORT

export default function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus } = useSelector((state) => state.news);

  // SỬ DỤNG HOOK DÙNG CHUNG
  const {
    title, content, readTimeMinutes, thumbnail, tags,
    setTitle, setContent, setReadTimeMinutes,
    ...formHandlers
  } = useArticleForm();
  
  const isLoading = createStatus === "loading";

  // Cleanup effect
  useEffect(() => {
    return () => {
      dispatch(resetArticleStatus());
    };
  }, [dispatch]);

  // === Logic Submit ĐẶC THÙ cho Create ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !thumbnail) {
      return toast.error("Vui lòng nhập đủ Tiêu đề, Nội dung và Ảnh bìa.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("thumbnail", thumbnail);
    // Tags đã là mảng, chỉ cần JSON.stringify
    formData.append("tags", JSON.stringify(tags));
    formData.append("readTimeMinutes", parseInt(readTimeMinutes, 10));

      try {
        const dataToLog = {};
      formData.forEach((value, key) => {
        dataToLog[key] = value instanceof File ? `[File: ${value.name}, ${value.size} bytes]` : value;
      });
      console.log("Submitting FormData (Debug):", dataToLog);
        const newArticle = await dispatch(createNews(formData)).unwrap();
        console.log("Created Article:", newArticle);
      toast.success("Tạo bài viết thành công, đang chờ duyệt!");
      navigate(`/news/${newArticle.slug}`);
    } catch (error) {
      toast.error(error || "Tạo bài viết thất bại.");
    }
  };

  // --- Render UI ---
  return (
    <ArticleFormUI
      isEdit={false}
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      readTimeMinutes={readTimeMinutes}
      setReadTimeMinutes={setReadTimeMinutes}
      tags={tags}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      navigate={navigate}
      // Truyền tất cả handlers/states còn lại từ hook
      {...formHandlers} 
    />
  );
}
