import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./apiClient";

export const fetchComments = createAsyncThunk(
  "comments/fetchByArticle",
  async ({ articleId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/comments", {
        params: { articleId, page, limit },
      });
      const resData = response.data.data;
      return {
        comments: resData.comments,
        pagination: resData.pagination,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const postComment = createAsyncThunk(
  "comments/post",
  async ({ articleId, content, parentId = null }, { rejectWithValue }) => {
    try {
      const response = await api.post("/comments", {
        articleId,
        content,
        parentId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/update",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
