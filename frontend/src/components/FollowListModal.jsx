import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFollow } from '../api/userApi';

const UserListItem = ({ user, currentUser, onFollowToggle, onCloseModal }) => {
    const isFollowing = currentUser?.following?.includes(user.id);
    const isCurrentUser = currentUser?.id === user.id;

    const handleFollowClick = (e) => {
        e.stopPropagation();
        onFollowToggle({ targetUser: user });
    };
    
    const handleUserClick = () => {
        onCloseModal();
    };

    return (
        <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <Link to={`/profile/${user.id}`} onClick={handleUserClick} className="flex items-center gap-3 flex-1 min-w-0">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="font-medium text-gray-900 dark:text-white truncate">{user.name}</span>
            </Link>
            {!isCurrentUser && (
                 <button
                    onClick={handleFollowClick}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex-shrink-0 ${
                        isFollowing
                            ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                            : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                >
                    {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
            )}
        </div>
    );
};

const FollowListModal = ({ isOpen, onClose, title, userIds }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const USERS_API = import.meta.env.VITE_REACT_APP_USERS_API;

    useEffect(() => {
        if (!isOpen || !userIds || userIds.length === 0) {
            setUsers([]);
            return;
        }

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const userPromises = userIds.map(id =>
                    fetch(`${USERS_API}/${id}`).then(res => res.ok ? res.json() : null)
                );
                const fetchedUsers = (await Promise.all(userPromises)).filter(Boolean);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [isOpen, userIds, USERS_API]);

    const handleFollowToggle = (payload) => {
        dispatch(toggleFollow(payload));
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-[100] transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg shadow-xl w-full max-w-sm flex flex-col transition-colors"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
                    <div className="w-8"></div>
                    <h2 className="text-lg font-bold text-center">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <p className="text-center p-4 text-gray-500 dark:text-gray-400">Đang tải...</p>
                    ) : users.length > 0 ? (
                        users.map(user => (
                            <UserListItem 
                                key={user.id} 
                                user={user} 
                                currentUser={currentUser} 
                                onFollowToggle={handleFollowToggle}
                                onCloseModal={onClose}
                            />
                        ))
                    ) : (
                        <p className="text-center p-4 text-gray-500 dark:text-gray-400">Không có ai trong danh sách này.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;