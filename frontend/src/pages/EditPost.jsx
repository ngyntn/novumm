import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateNews, fetchDetailNews } from '../api/articleApi';
import { resetArticleStatus, resetNewsDetail } from '../store/newsSlice';

import Loader from '../components/Loader';
import  EditPostContent  from '../components/EditPostContent';


export default function EditPost() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { currentUser } = useSelector((state) => state.user);
    const {
      item: article,
      itemLoading,
      updateStatus,
    } = useSelector((state) => state.news);
  
    useEffect(() => {
      if (slug) {
        dispatch(fetchDetailNews(slug)); 
      }
      return () => {
        dispatch(resetNewsDetail());
        dispatch(resetArticleStatus());
      };
    }, [dispatch, slug]);
  
    const isLoading = itemLoading || updateStatus === 'loading';
  
    if (itemLoading) {
      return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <Loader />
        </div>
      );
    }
  
    if (!article) {
      return (
        <div className="text-center py-20">Không tìm thấy bài viết.</div>
      );
    }
  
    return (
      <EditPostContent 
        article={article} 
        currentUser={currentUser} 
        navigate={navigate} 
        updateStatus={updateStatus}
      />
    );
  }