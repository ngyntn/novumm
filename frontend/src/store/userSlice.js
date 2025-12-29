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

            .addCase(toggleFollow.fulfilled, (state, action) => {
                // Lấy thông tin từ tham số truyền vào action (meta.arg)
                const { targetUser, isFollowing } = action.meta.arg; 
                const newStatus = !isFollowing;

                // --- CẬP NHẬT 1: Cập nhật số lượng hiển thị trên Profile Header ---
                // Kiểm tra nếu người vừa được tương tác chính là người đang hiển thị Profile
                if (state.profile.data && Number(state.profile.data.id) === Number(targetUser)) {
                    state.profile.data.isFollowing = newStatus;

                    // Cập nhật số lượng Followers hiển thị ngoài Header
                    if (newStatus) {
                        // Nếu vừa nhấn Follow -> Tăng 1
                        state.profile.data.totalFollowers = (state.profile.data.totalFollowers || 0) + 1;
                    } else {
                        // Nếu vừa nhấn Unfollow -> Giảm 1 (không để âm)
                        state.profile.data.totalFollowers = Math.max(0, (state.profile.data.totalFollowers || 0) - 1);
                    }
                }

                // --- CẬP NHẬT 2: Cập nhật trạng thái nút bấm ngay trong Modal ---
                const userInList = state.profile.followList.users.find(
                    (u) => Number(u.id) === Number(targetUser)
                );
                if (userInList) {
                    userInList.isFollowing = newStatus;
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