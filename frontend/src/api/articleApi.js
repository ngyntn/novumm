import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './apiClient';
   
export const fetchRecommendedNews = createAsyncThunk(
    'articles/fetchRecommended', 
    async ({ page, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles', { params: { page, limit } });
            const resData = response.data.data;
            console.log("SSSS",resData)
            return { 
                articles: resData.articles, 
                pagination: resData.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


   
export const fetchRecommendedNewsV2 = createAsyncThunk(
    'articles/fetchRecommendedV2', 
    async ({ page, limit = 20 }, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('currentUser') 
                ? JSON.parse(localStorage.getItem('currentUser')).id
                : null;
            if (userId === null) throw new Error("User not logged in");

            const response = await api.get('/articles/recommend', { params: { userId, page, limit } });
            const resData = response.data.data;
            console.log("Recommended results: ",resData)

            return { 
                articles: resData.articles, 
                pagination: resData.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchDetailNews = createAsyncThunk(
    'articles/fetchDetail',
    async (slug, { rejectWithValue }) => { 
        try {
            console.log("Start fetching detail for slug:", slug);
            const response = await api.get(`/articles/${slug}`);
            console.log("DETAIL",response)
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchNewsByKeySearch = createAsyncThunk(
    'articles/search',
    async ({ keySearch }, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles/search', { params: { q: keySearch } });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const fetchNewsByKeySearchV2 = createAsyncThunk(
    'articles/search/knn',
    async ({ keySearch, page, limit }, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles/search/knn', { params: { query: keySearch, page, limit } });
            return { ...response.data.data, page };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createNews = createAsyncThunk(
    'articles/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/articles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' } 
            }); 
            console.log("AAAA",response)
            return response.data.data;
        } catch (error) {
            const originalMessage = error.response?.data?.message || error.message;
            const cleanMessage = originalMessage.replace(/^\[.*?\]: /, '');
            return rejectWithValue(cleanMessage);
        }
    }
);

export const uploadMedia = createAsyncThunk(
    'articles/uploadMedia',
    async (fileData, { rejectWithValue }) => {
        try {
            const response = await api.post('/articles/upload-media', fileData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateNews = createAsyncThunk(
    'articles/update',
    async ({ articleId, formData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/articles/${articleId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteNews = createAsyncThunk(
    'articles/delete',
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/articles/${articleId}`);
            return response.data.data; 
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateArticleLike = createAsyncThunk(
    'articles/updateLike', 
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/articles/${articleId}/like`);
            return response.data.data; 
        } catch (error) { 
            return rejectWithValue(error.response?.data?.message || error.message); 
        }
    }
);

export const toggleBookmark = createAsyncThunk(
    "articles/toggleBookmark",
    async (articleId, { rejectWithValue }) => {
      try {
        const response = await api.post(`/articles/${articleId}/bookmark`);
        return response.data.data; 
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

export const fetchUserNews = createAsyncThunk(
    'articles/fetchByUser', 
    async ({ userId, page, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles', { params: { userId, page, limit } });
            const resData = response.data.data; 
            return {
                articles: resData.data,
                hasMore: resData.pagination.page < resData.pagination.totalPages
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchFeedNews = createAsyncThunk(
    'articles/fetchFeed', 
    async ({ page, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles/feed', { params: { page, limit } });
            const resData = response.data.data;
            return { 
                articles: resData.articles,
                pagination: resData.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAuthorArticles = createAsyncThunk(
    'articles/fetchByAuthor',
    async ({ authorId, excludeId, limit = 5 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles/author', { 
                params: { authorId, excludeId, limit } 
            });
            return response.data.data.articles; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchRelatedArticlesByTag = createAsyncThunk(
    'articles/fetchByTag',
    async ({ tagIds, excludeId, limit = 5 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles/related', { 
                params: { tagIds, excludeId, limit } 
            });
            return response.data.data.articles; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const readArticle = createAsyncThunk(
    'articles/readArticle',
    async (articleId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/articles/${articleId}/read`);
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)