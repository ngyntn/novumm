import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFollow, fetchFollowList } from '../api/userApi';
import Loader from './Loader';

const UserListItem = ({ user, currentUser, onFollowToggle, onCloseModal }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isCurrentUser = Number(currentUser?.id) === Number(user.id);

    // Logic xác định trạng thái nút
    // 1. Nếu mình đang theo dõi họ: Hiện "Đang theo dõi" (Hover vào đổi thành "Hủy theo dõi")
    // 2. Nếu mình CHƯA theo dõi họ:
    //    - Nếu họ đang theo dõi mình: Hiện "Theo dõi lại"
    //    - Nếu họ không theo dõi mình: Hiện "Theo dõi"
    
    const renderButton = () => {
        if (isCurrentUser) return null;

        if (user.isFollowing) {
            return (
                <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={(e) => {
                        e.preventDefault();
                        onFollowToggle({ targetUser: user.id, isFollowing: true });
                    }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex-shrink-0 min-w-[100px] ${
                        isHovered 
                        ? 'bg-red-100 text-red-600 border border-red-200' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                >
                    {isHovered ? 'Hủy theo dõi' : 'Đang theo dõi'}
                </button>
            );
        }

        // Trường hợp chưa theo dõi
        const isFollowBack = user.isFollowerOfMe; // Cần thuộc tính này từ Backend nếu muốn chính xác 100%
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onFollowToggle({ targetUser: user.id, isFollowing: false });
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors min-w-[100px]"
            >
                {isFollowBack ? 'Theo dõi lại' : 'Theo dõi'}
            </button>
        );
    };

    return (
        <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
            <Link to={`/profile/${user.id}`} onClick={onCloseModal} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                    <img 
                        src={user.avatarUrl || 'https://via.placeholder.com/150'} 
                        alt={user.fullName} 
                        className="w-10 h-10 rounded-full object-cover border dark:border-gray-600" 
                    />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {user.fullName}
                    </span>
                    {user.isFollowerOfMe && (
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Theo dõi bạn</span>
                    )}
                </div>
            </Link>
            <div className="ml-2">
                {renderButton()}
            </div>
        </div>
    );
};

const FollowListModal = ({ isOpen, onClose, title, type, userId, isOwnProfile }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { users, nextCursor, status } = useSelector((state) => state.user.profile.followList);

    useEffect(() => {
        if (isOpen && userId && type) {
            dispatch(fetchFollowList({ type, userId, isOwnProfile, cursor: null }));
        }
    }, [isOpen, type, userId, isOwnProfile, dispatch]);

    const handleLoadMore = () => {
        if (nextCursor) {
            dispatch(fetchFollowList({ type, userId, isOwnProfile, cursor: nextCursor }));
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[75vh] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="w-8"></div>
                    <h2 className="text-base font-bold text-center uppercase tracking-wide">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {users.length > 0 ? (
                        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {users.map(u => (
                                <UserListItem 
                                    key={u.id} 
                                    user={u} 
                                    currentUser={currentUser} 
                                    onFollowToggle={(p) => dispatch(toggleFollow(p))}
                                    onCloseModal={onClose}
                                />
                            ))}
                            {nextCursor && (
                                <div className="p-2">
                                    <button 
                                        onClick={handleLoadMore}
                                        disabled={status === 'loading'}
                                        className="w-full py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                    >
                                        {status === 'loading' ? 'Đang tải...' : 'Xem thêm người dùng'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        status === 'loading' ? (
                            <div className="py-20 flex justify-center"><Loader isLoading={true} /></div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">Danh sách này hiện đang trống.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;