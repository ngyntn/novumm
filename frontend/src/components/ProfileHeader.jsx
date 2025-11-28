import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFollow } from '../api/userApi';
import FollowListModal from './FollowListModal';

const ProfileHeader = ({ user }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        userIds: [],
    });

    const handleOpenModal = (title, userIds) => {
        if (userIds && userIds.length > 0) {
            setModalConfig({ isOpen: true, title, userIds });
        }
    };

    const handleCloseModal = () => {
        setModalConfig({ isOpen: false, title: '', userIds: [] });
    };

    const isFollowing = currentUser?.following?.includes(user.id);
    const isCurrentUser = currentUser?.id === user.id;

    const handleFollow = () => {
        if (!currentUser) {
            alert('Bạn cần đăng nhập để thực hiện chức năng này');
            return;
        }
        dispatch(toggleFollow({ targetUser: user }));
    };

    return (
        <>
            <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{user.bio}</p>
                        
                        <div className="flex justify-center sm:justify-start gap-6 mt-4 text-base">
                            <div 
                                className="text-center cursor-pointer group" 
                                onClick={() => handleOpenModal('Người theo dõi', user.followers)}
                            >
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{user.followers?.length || 0}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1 group-hover:underline">Người theo dõi</span>
                            </div>
                            <div 
                                className="text-center cursor-pointer group" 
                                onClick={() => handleOpenModal('Đang theo dõi', user.following)}
                            >
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{user.following?.length || 0}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1 group-hover:underline">Đang theo dõi</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        {isCurrentUser ? (
                            <Link to="/edit-profile">
                                <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                                    Chỉnh sửa trang cá nhân
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={handleFollow}
                                className={`px-6 py-2 font-semibold rounded-lg transition-colors w-32 ${
                                    isFollowing
                                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <FollowListModal 
                isOpen={modalConfig.isOpen}
                onClose={handleCloseModal}
                title={modalConfig.title}
                userIds={modalConfig.userIds}
            />
        </>
    );
};

export default ProfileHeader;