import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { formatTimeAgo } from "../utils/convert.js";
import NotificationAvatar from "./NotificationAvatar";
import {
  generateNotificationMessage,
  getNotificationLink,
} from "../utils/notification.utils.jsx";

const NotificationToast = ({ t, notification }) => {
  const navigate = useNavigate();
  const message = generateNotificationMessage(notification);
  const timeAgo = formatTimeAgo(notification.createdAt);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (t.visible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [t.visible]);

  const handleClick = () => {
    toast.dismiss(t.id);
    const link = getNotificationLink(notification);
    if (link && link !== "#") {
      navigate(link);
    }
  };

  return (
    <div
      className={`
        max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg 
        pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer
        
        transition-all duration-300 ease-in-out

        ${
          t.visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }
      `}
      onClick={handleClick}
    >
      {/* Avatar và nội dung */}
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <NotificationAvatar notification={notification} />
          </div>

          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {message}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {timeAgo}
            </p>
          </div>
        </div>
      </div>

      {/* Nút X để đóng */}
      <div className="flex items-center p-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t.id);
          }}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
