import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDropdownNotifications, fetchUnreadCount } from '../api/notificationApi';
import NotificationItem from './NotificationItem'; 

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useDispatch();

    const { unreadCount, dropdownItems, dropdownLoading } = useSelector(
        (state) => state.notifications
    );
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchUnreadCount());
            dispatch(fetchDropdownNotifications());
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Thông báo"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white">Thông báo</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                        {dropdownLoading && dropdownItems.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">Đang tải...</p>
                        ) : dropdownItems.length > 0 ? (
                            dropdownItems.map(notification => (
                                <NotificationItem 
                                    key={notification.id} 
                                    notification={notification} 
                                    isDropdown={true} 
                                />
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500">Bạn không có thông báo mới.</p>
                        )}
                    </div>
                    <Link 
                        to="/notifications" 
                        onClick={() => setIsOpen(false)}
                        className="block text-center py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Xem tất cả thông báo
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;