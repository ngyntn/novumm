import React, { useState, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markNotificationsAsRead,
} from "../api/notificationApi";
import { resetNotifications } from "../store/notificationSlice";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import NotificationItem from "../components/NotificationItem";
import Loader from "../components/Loader";

const notificationStateSelector = (state) => ({
  items: state.notifications.items,
  loading: state.notifications.loading,
  error: state.notifications.error,
  page: state.notifications.page,
  hasMore: state.notifications.hasMore,
});

const Notifications = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const listState = useSelector(notificationStateSelector, shallowEqual);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  const memoizedFetchThunk = useCallback(
    (params) => {
      dispatch(fetchNotifications({ ...params, filter }));
    },
    [dispatch, filter] 
  );

  const { items, loading, error, hasMore, lastElementRef } = useInfiniteScroll({
    listState,
    fetchThunk: memoizedFetchThunk, 
    resetAction: resetNotifications,
    dependencies: [filter], 
  });

  const handleMarkAllAsRead = () => {
    const unreadIds = items
      .filter((item) => !item.isRead)
      .map((item) => item.id);

    if (unreadIds.length > 0) {
      dispatch(markNotificationsAsRead(unreadIds));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex justify-center py-12 px-4 transition-colors">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Thông báo
          </h1>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            Chưa đọc
          </button>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {items.length > 0 &&
            items.map((notification, index) => {
              if (items.length === index + 1) {
                return (
                  <div ref={lastElementRef} key={notification.id}>
                    <NotificationItem notification={notification} />
                  </div>
                );
              }
              return (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              );
            })}

          {/* Trạng thái Loading */}
          {loading && (
            <div className="p-4 text-center">
              <Loader isLoading={true} />
            </div>
          )}

          {/* Trạng thái Lỗi */}
          {error && items.length === 0 && (
            <p className="p-4 text-center text-red-500">Lỗi: {error}</p>
          )}

          {/* Trạng thái Rỗng */}
          {!loading && items.length === 0 && !error && (
            <p className="p-4 text-center text-gray-500">
              Bạn không có thông báo nào.
            </p>
          )}

          {/* Trạng thái Hết dữ liệu */}
          {!hasMore && items.length > 0 && (
            <p className="p-4 text-center text-gray-500">
              Đã tải tất cả thông báo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
