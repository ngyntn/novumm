import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./apiClient";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ page, limit = 10, filter }, { rejectWithValue }) => {
    try {
      const params = { page, limit };

      if (filter && filter !== "all") {
        params.filter = filter;
      }

      const response = await api.get("/notifications", {
        params: params, 
      });
      return response.data.data; // { notifications, pagination, unreadCount }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchDropdownNotifications = createAsyncThunk(
  "notifications/fetchDropdownNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications", {
        params: { page: 1, limit: 7 },
      });
      return response.data.data; // { notifications, pagination, unreadCount }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data.data; // { unreadCount }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationIds, { rejectWithValue }) => {
    try {
      const response = await api.post("/notifications/mark-as-read", {
        notificationIds,
      });
      return response.data.data; // { markedCount, unreadCount }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
