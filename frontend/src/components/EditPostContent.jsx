import React, { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import { useArticleForm } from "../hooks/userArticleForm";
import ArticleFormUI from "../components/ArticleFormUI";
import toast from 'react-hot-toast';
import { updateNews } from '../api/articleApi';
export default function EditPostContent({ article, currentUser, navigate, updateStatus }) {
    const dispatch = useDispatch();
    console.log("EditPostContent article:", article);
    const {
      title, setTitle,
      content, setContent,
      readTimeMinutes, setReadTimeMinutes,
      tags, setTags,
      thumbnail, 
      setThumbnailPreview, 
      ...formHandlers
    } = useArticleForm(article); 
  
    const isLoading = updateStatus === 'loading';
  
    useEffect(() => {
      if (article.author?.id !== currentUser?.id) {
        toast.error('Bạn không có quyền sửa bài viết này.');
        navigate('/');
      }
    }, [article, currentUser, navigate]);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const currentThumbnailPreview = formHandlers.thumbnailPreview;
  
      if (!title || !content) {
        return toast.error('Vui lòng nhập đủ Tiêu đề và Nội dung.');
      }
      if (!thumbnail && !currentThumbnailPreview) { 
        return toast.error('Vui lòng chọn ảnh bìa.');
      }
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('readTimeMinutes', parseInt(readTimeMinutes, 10) || 5);
      
      formData.append(
        'tags',
        JSON.stringify(tags.map((tag) => tag.trim()).filter(Boolean))
      );
  
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
  
      try {
        const updatedArticle = await dispatch(
          updateNews({ articleId: article.id, formData })
        ).unwrap();
  
        toast.success('Cập nhật bài viết thành công, đang chờ duyệt lại!');
        navigate(`/news/${updatedArticle.slug}`);
      } catch (error) {
        toast.error(error.message || 'Cập nhật thất bại.');
      }
    };
  
  
    return (
      <ArticleFormUI
        isEdit={true} 
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
        {...formHandlers} 
      />
    );
  }