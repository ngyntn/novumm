// src/socket.js
import { io } from "socket.io-client";
import { addOrUpdateNotification, setUnreadCount } from "../store/notificationSlice";
import NotificationToast from "../components/NotificationToast";
import { toast } from "react-hot-toast";

let socket;

export const initSocket = (userId, dispatch) => {
  if (socket) {
    socket.disconnect();
  }

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

  socket = io(SOCKET_URL, {
    // transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("join-room", userId.toString());
  });

  socket.on("new_notification", (notification) => {
    console.log("New notification received:", notification);
    dispatch(addOrUpdateNotification(notification));
    toast.custom(
      (t) => <NotificationToast t={t} notification={notification} />,
      {
        duration: 5000,
        position: "bottom-left",
      }
    );
  });

  socket.on("notification_read_update", (data) => {
    console.log("Unread count update:", data);
    dispatch(setUnreadCount(data));
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};
