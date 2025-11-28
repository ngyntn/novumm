import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  fetchDropdownNotifications,
  fetchUnreadCount,
  markNotificationsAsRead,
} from "../api/notificationApi";

const updateOrPrepend = (list, newItem) => {
    const filteredList = list.filter((item) => item.id !== newItem.id);
    filteredList.unshift(newItem);
    return filteredList;
  };

const initialState = {
  items: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,

  dropdownItems: [],
  dropdownLoading: false,

  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addOrUpdateNotification: (state, action) => {
        const newNotification = action.payload;
  
        state.items = updateOrPrepend(state.items, newNotification);
        state.dropdownItems = updateOrPrepend(state.dropdownItems, newNotification);
  
        if (state.dropdownItems.length > 7) {
          state.dropdownItems.pop();
        }
      },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload.unreadCount;
    },
    resetNotifications: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, pagination, unreadCount } = action.payload;
        if (pagination.currentPage === 1) {
          state.items = notifications;
        } else {
          const newItems = notifications.filter(
            (n) => !state.items.some((i) => i.id === n.id)
          );
          state.items.push(...newItems);
        }
        state.page = pagination.currentPage + 1;
        state.hasMore = pagination.currentPage < pagination.totalPages;
        state.unreadCount = unreadCount;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDropdownNotifications.pending, (state) => {
        state.dropdownLoading = true;
      })
      .addCase(fetchDropdownNotifications.fulfilled, (state, action) => {
        state.dropdownItems = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.dropdownLoading = false;
      })
      .addCase(fetchDropdownNotifications.rejected, (state) => {
        state.dropdownLoading = false;
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount;
      })

      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        const { unreadCount } = action.payload;
        const markedIds = action.meta.arg; 

        state.unreadCount = unreadCount;
        state.items = state.items.map((item) =>
          markedIds.includes(item.id) ? { ...item, isRead: true } : item
        );
        state.dropdownItems = state.dropdownItems.map((item) =>
          markedIds.includes(item.id) ? { ...item, isRead: true } : item
        );
      });
  },
});

export const { addOrUpdateNotification, setUnreadCount, resetNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;