import React from "react";
import { Heart, MessageSquare, UserPlus, AlertTriangle } from "lucide-react";

const renderIcon = (type) => {
  switch (type) {
    case "like":
      return (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white">
          <Heart size={10} fill="white" />
        </span>
      );
    case "comment":
      return (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-blue-500 text-white">
          <MessageSquare size={10} fill="white" />
        </span>
      );
    case "reply":
      return (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-purple-500 text-white">
          <MessageSquare size={10} fill="white" />
        </span>
      );
    case "follow":
      return (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-green-500 text-white">
          <UserPlus size={10} />
        </span>
      );
    default:
      return (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-yellow-500 text-white">
          <AlertTriangle size={10} />
        </span>
      );
  }
};

const NotificationAvatar = ({ notification }) => {
  const avatarUrl =
    notification.actor?.avatarUrl || "https://via.placeholder.com/40";

  return (
    <div className="relative flex-shrink-0">
      <img
        className="h-10 w-10 rounded-full"
        src={avatarUrl}
        alt={notification.actor?.fullName}
      />
      <div className="absolute -bottom-1 -right-1 border-2 border-white dark:border-gray-800 rounded-full">
        {renderIcon(notification.type)}
      </div>
    </div>
  );
};

export default NotificationAvatar;
