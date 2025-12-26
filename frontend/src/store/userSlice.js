import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../api/authApi';
import { fetchUserProfile, toggleFollow, updateUserProfile } from '../api/userApi';
import { fetchArticlesByTab } from '../api/articleApi'; // Action mới chúng ta đã thống nhất

const initialState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    profile: {
        data: null, // Thông tin user (name, avatar, bio...)
        posts: { articles: [], nextCursor: null }, // Danh sách bài viết của user
        liked: { articles: [], nextCursor: null }, // Danh sách bài viết đã thích
        bookmarked: { articles: [], nextCursor: null }, // Danh sách bài viết đã lưu
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
            state.profile = initialState.profile;
        },
        loadUserFromStorage: (state) => {
            const user = localStorage.getItem('currentUser');
            if (user) {
                state.currentUser = JSON.parse(user);
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
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Xử lý Đăng nhập ---
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload.user;
                localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
                localStorage.setItem('accessToken', action.payload.accessToken.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken.refreshToken);
            })

            // --- Xử lý Lấy Profile User (Thông tin cơ bản) ---
            .addCase(fetchUserProfile.pending, (state) => { 
                state.profile.status = 'loading'; 
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => { 
                state.profile.status = 'succeeded'; 
                state.profile.data = action.payload; 
            })
            .addCase(fetchUserProfile.rejected, (state, action) => { 
                state.profile.status = 'failed'; 
                state.profile.error = action.payload; 
            })

            // --- Xử lý Lấy Bài Viết Theo Tab (Gộp chung logic DTO) ---
            .addCase(fetchArticlesByTab.pending, (state) => {
                state.profile.status = 'loading';
            })
            .addCase(fetchArticlesByTab.fulfilled, (state, action) => {
                const { tab, data } = action.payload; // data là { articles, nextCursor }
                state.profile.status = 'succeeded';
                
                // Cập nhật đúng mảng dựa vào tab truyền lên
                if (tab === 'posts') state.profile.posts = data;
                else if (tab === 'liked') state.profile.liked = data;
                else if (tab === 'bookmarked') state.profile.bookmarked = data;
            })

            // --- Xử lý Follow/Unfollow ---
            .addCase(toggleFollow.fulfilled, (state, action) => {
                const { action: actType } = action.payload;
                if (!state.profile.data) return;

                const isFollow = actType === 'follow';
                state.profile.data = {
                    ...state.profile.data,
                    isFollowing: isFollow,
                    totalFollowers: (state.profile.data.totalFollowers || 0) + (isFollow ? 1 : -1)
                };
            })

            // --- Xử lý Cập nhật Profile ---
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                // 1. Cập nhật state currentUser để Header thay đổi ngay
                state.currentUser = { ...state.currentUser, ...action.payload };
                
                // 2. Cập nhật localStorage để F5 không mất dữ liệu
                localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
                
                // 3. Nếu đang xem trang profile của chính mình, cập nhật luôn dữ liệu hiển thị
                if (state.profile.data && (state.profile.data.id === action.payload.id)) {
                    state.profile.data = { ...state.profile.data, ...action.payload };
                }
            });
    },
});

export const { resetProfile, loadUserFromStorage, logout } = userSlice.actions;
export default userSlice.reducer;