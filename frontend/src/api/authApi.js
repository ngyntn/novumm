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
