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
    async ({ userId }, { rejectWithValue }) => { // Gộp tempLogin và fetchUserProfile
        try {
            console.log("Fetching user profile for ID:", userId);
            const response = await api.get(`/users/${userId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const toggleFollow = createAsyncThunk(
    'user/toggleFollow',
    async ({ targetUser, isFollowing }, { rejectWithValue }) => { // Đơn giản hóa logic
        try {
            // Gửi ID user cần follow/unfollow, BE sẽ tự xử lý
            const action = isFollowing ? 'unfollow' : 'follow';
            const response = await api.post(`/users/${action}/${targetUser}`);
            // BE nên trả về user đã được cập nhật
            console.log("Toggle follow response data:", response.data);
            return {
                action,
                status: response.data.success,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (updateData, { rejectWithValue }) => { 
        try {
            // Gửi dữ liệu dưới dạng JSON (mặc định của axios là JSON nếu không set header khác)
            // updateData sẽ có cấu trúc: { fullName, avatarUrl, bio }
            const response = await api.patch('/users/me', updateData);
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Hàm này sẽ được gọi trực tiếp trong Component để lấy URL ảnh
export const uploadMediaApi = async (file) => {
    const formData = new FormData();
    formData.append('media_file', file); // Khớp với uploadMedia.single("media_file") ở BE

    const response = await api.post('/articles/upload-media', formData, {
        headers: { 
            'Content-Type': 'multipart/form-data' 
        }
    });
    // Giả sử BE của bạn trả về { data: { url: "..." } } hoặc tương đương
    return response.data; 
};

export const fetchFollowList = createAsyncThunk(
    'user/fetchFollowList',
    async ({ type, userId, isOwnProfile, cursor = null }, { rejectWithValue }) => {
        try {
            let endpoint = isOwnProfile 
                ? (type === 'followers' ? '/users/me/followers' : '/users/me/following')
                : (type === 'followers' ? `/users/${userId}/followers` : `/users/${userId}/following`);

            const response = await api.get(endpoint, {
                params: { limit: 10, cursor }
            });
            return { type, data: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

