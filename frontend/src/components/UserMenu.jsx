import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, PlusSquare, User as ProfileIcon, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { logout } from "../store/userSlice";
import { useDispatch } from "react-redux";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate("/login");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="hidden md:block font-medium text-gray-700 dark:text-gray-200">
          {user.fullName || "User"}
        </span>
        <img
          className="h-9 w-9 rounded-full object-cover"
          src={
            user.avatarUrl ||
            "https://placehold.co/400x400/gray/white?text=User"
          }
          alt={user.fullName}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in-down">
          <ul className="p-2 space-y-1">
            <li>
              <Link
                to="/feed"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Users size={20} />
                <span>Bảng tin</span>
              </Link>
            </li>
            <li>
              <Link
                to="/create-post"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <PlusSquare size={20} />
                <span>Tạo bài viết</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <ProfileIcon size={20} />
                <span>Trang cá nhân</span>
              </Link>
            </li>
            <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut />
              <span>Đăng xuất</span>
            </button>
            <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
            <li className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              <span>Chế độ tối</span>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
