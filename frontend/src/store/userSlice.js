import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../api/authapi';
import { fetchUserProfile, fetchCurrentUser, toggleFollow, updateUserProfile } from '../api/userApi';
import { fetchFeedNews, fetchUserNews } from '../api/articleApi';

const initialState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    profile: { 
        data: null,
        news: [],
        status: 'idle',
        error: null,
    },
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetProfile: (state) => {
            state.profile.data = null;
            state.profile.news = [];
            state.profile.status = 'idle';
            state.profile.error = null;
        },
        loadUserFromStorage: (state) => {
            const user = localStorage.getItem('currentUser');
            const refreshToken = localStorage.getItem('refreshToken');
            if (user && refreshToken) {
                state.currentUser = JSON.parse(user);
                state.status = 'succeeded';
            } else {
                state.currentUser = null;
                state.status = 'succeeded';
            }
        },
        logout: (state) => {
            state.currentUser = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            state.feed = initialState.feed;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload.user;
                
                localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
                localStorage.setItem('accessToken', action.payload.accessToken.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken.refreshToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; 
                state.currentUser = null;
            })
            .addCase(fetchUserProfile.pending, (state) => { state.profile.status = 'loading'; })
            .addCase(fetchUserProfile.fulfilled, (state, action) => { state.profile.status = 'succeeded'; state.profile.data = action.payload; })
            .addCase(fetchUserProfile.rejected, (state, action) => { state.profile.status = 'failed'; state.profile.error = action.payload; })
            .addCase(fetchUserNews.fulfilled, (state, action) => { state.profile.news = action.payload; })
            .addCase(toggleFollow.fulfilled, (state, action) => {
                state.currentUser = action.payload.updatedCurrentUser;
                if (state.profile.data?.id === action.payload.updatedTargetUser.id) {
                    state.profile.data = action.payload.updatedTargetUser;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                if (state.profile.data?.id === action.payload.id) {
                    state.profile.data = action.payload;
                }
            });
    },
});

export const { resetProfile, resetFeed, loadUserFromStorage, logout } = userSlice.actions;
export default userSlice.reducer;