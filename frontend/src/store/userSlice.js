import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../api/authApi';
import { 
    fetchUserProfile, 
    toggleFollow, 
    updateUserProfile, 
    fetchFollowList // Đảm bảo đã import hàm này
} from '../api/userApi';
import { fetchArticlesByTab } from '../api/articleApi';

const initialState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    profile: {
        data: null,
        posts: { articles: [], nextCursor: null },
        liked: { articles: [], nextCursor: null },
        bookmarked: { articles: [], nextCursor: null },
        // --- PHẦN THIẾU: Lưu trữ danh sách cho Modal ---
        followList: { 
            users: [], 
            nextCursor: null, 
            status: 'idle',
            type: null 
        },
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

            // --- Xử lý Lấy Profile User ---
            .addCase(fetchUserProfile.fulfilled, (state, action) => { 
                state.profile.status = 'succeeded'; 
                state.profile.data = action.payload; 
            })

            // --- Xử lý Lấy Bài Viết Theo Tab ---
            .addCase(fetchArticlesByTab.fulfilled, (state, action) => {
                const { tab, data } = action.payload;
                state.profile.status = 'succeeded';
                if (tab === 'posts') state.profile.posts = data;
                else if (tab === 'liked') state.profile.liked = data;
                else if (tab === 'bookmarked') state.profile.bookmarked = data;
            })

            // --- PHẦN THIẾU: Xử lý danh sách Follower/Following cho Modal ---
            .addCase(fetchFollowList.pending, (state) => {
                state.profile.followList.status = 'loading';
            })
            .addCase(fetchFollowList.fulfilled, (state, action) => {
                const { type, data } = action.payload;
                state.profile.followList.status = 'succeeded';
                state.profile.followList.type = type;

                // Nếu có cursor (tải thêm) thì nối mảng, không thì thay mới
                if (action.meta.arg.cursor) {
                    state.profile.followList.users = [...state.profile.followList.users, ...data.users];
                } else {
                    state.profile.followList.users = data.users;
                }
                state.profile.followList.nextCursor = data.nextCursor;
            })
            .addCase(fetchFollowList.rejected, (state, action) => {
                state.profile.followList.status = 'failed';
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

                // Tùy chọn: Cập nhật trạng thái nút Follow của user đó ngay trong Modal nếu đang mở
                const targetId = action.meta.arg.targetUser;
                const userInList = state.profile.followList.users.find(u => u.id === targetId);
                if (userInList) {
                    userInList.isFollowing = isFollow;
                }
            })

            // --- Xử lý Cập nhật Profile ---
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.currentUser = { ...state.currentUser, ...action.payload };
                localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
                if (state.profile.data && (state.profile.data.id === action.payload.id)) {
                    state.profile.data = { ...state.profile.data, ...action.payload };
                }
            });
    },
});

export const { resetProfile, loadUserFromStorage, logout } = userSlice.actions;
export default userSlice.reducer;