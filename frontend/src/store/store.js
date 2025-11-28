import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./newsSlice";
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
    reducer: {
        news: newsReducer, 
        user: userReducer,
        notifications: notificationReducer,
    },
});

export default store;