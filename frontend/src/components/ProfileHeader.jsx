import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFollow } from '../api/userApi';
import FollowListModal from './FollowListModal';

const ProfileHeader = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { data: user } = useSelector((state) => state.user.profile);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        type: '', // 'followers' hoặc 'following'
    });

    // Thêm state để quản lý hiệu ứng hover cho nút Follow
    const [isHovered, setIsHovered] = useState(false);

    if (!user) return null; 

    const handleOpenModal = (title, type) => {
        setModalConfig({ isOpen: true, title, type });
    };

    const handleCloseModal = () => {
        setModalConfig({ isOpen: false, title: '', type: '' });
    };

    const isMe = Number(currentUser?.id) === Number(user?.id);

    const handleFollow = () => {
        if (!currentUser) {
            alert('Bạn cần đăng nhập để thực hiện chức năng này');
            return;
        }
        // Gọi API toggleFollow với trạng thái hiện tại
        dispatch(toggleFollow({ isFollowing: user.isFollowing, targetUser: user.id }));
    };

    return (
        <>
            <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative group">
                        <img
                            src={user.avatarUrl || 'https://via.placeholder.com/150'}
                            alt={user.fullName}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Information */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{user.fullName}</h1>
                            
                            {/* Nút bấm hiển thị tại đây trên mobile để cân đối */}
                            <div className="sm:hidden">
                                {isMe ? (
                                    <Link to="/edit-profile">
                                        <button className="w-full px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-full hover:bg-gray-200 transition-all text-sm">
                                            Chỉnh sửa
                                        </button>
                                    </Link>
                                ) : (
                                    <button
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onClick={handleFollow}
                                        className={`w-full px-6 py-2 font-bold rounded-full transition-all text-sm min-w-[140px] ${
                                            user.isFollowing
                                                ? isHovered 
                                                    ? 'bg-red-50 text-red-600 border border-red-200' 
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        {user.isFollowing ? (isHovered ? 'Hủy theo dõi' : 'Đang theo dõi') : (user.isFollowerOfMe ? 'Theo dõi lại' : 'Theo dõi')}
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-base leading-relaxed max-w-lg">
                            {user.bio || "Chưa có tiểu sử"}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex justify-center sm:justify-start gap-8 mt-6">
                            <div 
                                className="text-center cursor-pointer group flex flex-col sm:flex-row sm:gap-1" 
                                onClick={() => handleOpenModal('Người theo dõi', 'followers')}
                            >
                                <span className="font-bold text-gray-900 dark:text-gray-100">{user.totalFollowers || 0}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-indigo-600 transition-colors">Người theo dõi</span>
                            </div>
                            <div 
                                className="text-center cursor-pointer group flex flex-col sm:flex-row sm:gap-1" 
                                onClick={() => handleOpenModal('Đang theo dõi', 'following')}
                            >
                                <span className="font-bold text-gray-900 dark:text-gray-100">{user.totalFollowing || 0}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-indigo-600 transition-colors">Đang theo dõi</span>
                            </div>
                        </div>
                    </div>

                    {/* Nút bấm hiển thị tại đây trên desktop */}
                    <div className="hidden sm:block">
                        {isMe ? (
                            <Link to="/edit-profile">
                                <button className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-full hover:bg-gray-200 transition-all border border-gray-200 dark:border-gray-700">
                                    Chỉnh sửa trang cá nhân
                                </button>
                            </Link>
                        ) : (
                            <button
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={handleFollow}
                                className={`px-8 py-2 font-bold rounded-full transition-all min-w-[150px] shadow-sm ${
                                    user.isFollowing
                                        ? isHovered 
                                            ? 'bg-red-50 text-red-600 border border-red-200' 
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none shadow-lg'
                                }`}
                            >
                                {user.isFollowing 
                                    ? (isHovered ? 'Hủy theo dõi' : 'Đang theo dõi') 
                                    : (user.isFollowerOfMe ? 'Theo dõi lại' : 'Theo dõi')
                                }
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <FollowListModal 
                isOpen={modalConfig.isOpen}
                onClose={handleCloseModal}
                title={modalConfig.title}
                type={modalConfig.type}
                userId={user.id}
                isOwnProfile={isMe}
            />
        </>
    );
};

export default ProfileHeader;