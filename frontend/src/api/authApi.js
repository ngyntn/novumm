import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate, api } from './apiClient';

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

// fe/src/api/userApi.js

// 1. Gửi OTP: body { email }
export const requestForgotPasswordOtp = createAsyncThunk(
    'auth/change-password/send-otp',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axiosPrivate.post('/auth/change-password/send-otp', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi gửi mã!");
        }
    }
);

// 2. Xác thực OTP: body { email, otp }
export const verifyForgotPasswordOtp = createAsyncThunk(
    'auth/change-password/verify-otp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axiosPrivate.post('/auth/change-password/verify-otp', { email, otp });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Mã xác thực không đúng!");
        }
    }
);

// 3. Đổi mật khẩu: body { email, otp, newPassword }
export const changeForgotPassword = createAsyncThunk(
    'auth/change-password',
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            // Theo schema của bạn, bước này cần gửi cả email và otp đã xác thực trước đó
            const response = await axiosPrivate.post('/auth/change-password', { 
                email, 
                otp, 
                newPassword 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Đổi mật khẩu thất bại!");
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
            return;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);