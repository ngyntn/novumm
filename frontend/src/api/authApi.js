import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from './apiClient';

export const loginUser = createAsyncThunk(
    'auth/login', 
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosPrivate.post('/auth/login', { email, password });
            
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            // userData bao gồm: { fullName, email, password }
            console.log("Registering user with data:", userData);
            const response = await axiosPrivate.post('/auth/register', userData); 
            // Giả sử BE trả về { success: true, data: userObject }
            return response.data;
        } catch (error) {
            // Lấy message lỗi từ BE trả về hoặc dùng message mặc định
            return rejectWithValue(error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
        }
    }
);

// Bước 1: Gửi mã đến Email
export const sendVerifyEmail = createAsyncThunk(
    '/auth/register/send-otp',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axiosPrivate.post('/auth/register/send-otp', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi gửi mã!");
        }
    }
);

// Bước 2: Xác thực mã (BE sẽ lưu vào cache nếu thành công)
export const verifyOtp = createAsyncThunk(
    '/auth/register/verify-otp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axiosPrivate.post('/auth/register/verify-otp', { email, otp });
            return response.data; // BE trả về thành công để FE chuyển bước
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Mã xác thực sai!");
        }
    }
);
