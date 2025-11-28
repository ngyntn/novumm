// fe/src/api/userApi.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './apiClient'; // Dùng instance 'api' (có interceptor)

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/me'); 
            return response.data.data; // Giả sử BE trả về { data: userObject }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (userId, { rejectWithValue }) => { // Gộp tempLogin và fetchUserProfile
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const toggleFollow = createAsyncThunk(
    'user/toggleFollow',
    async (targetUserId, { rejectWithValue }) => { // Đơn giản hóa logic
        try {
            // Gửi ID user cần follow/unfollow, BE sẽ tự xử lý
            const response = await api.post(`/users/follow/${targetUserId}`);
            // BE nên trả về user đã được cập nhật
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (formData, { rejectWithValue }) => { // (Giả sử dùng formData cho avatar)
        try {
            const response = await api.put('/users/profile', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data; // Trả về user đã update
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);