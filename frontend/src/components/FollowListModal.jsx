import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFollow, fetchFollowList } from '../api/userApi';
import Loader from './Loader';

const UserListItem = ({ user, currentUser, onFollowToggle, onCloseModal }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isCurrentUser = Number(currentUser?.id) === Number(user.id);

    // Xử lý logic hiển thị nút bấm
    const renderButton = () => {
        if (isCurrentUser) return null;

        // TRƯỜNG HỢP 1: Bạn đang theo dõi người này
        if (user.isFollowing) {
            return (
                <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={(e) => {
                        e.preventDefault();
                        onFollowToggle({ targetUser: user.id, isFollowing: true });
                    }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all flex-shrink-0 min-w-[110px] ${
                        isHovered 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                    }`}
                >
                    {isHovered ? 'Hủy theo dõi' : 'Đang theo dõi'}
                </button>
            );
        }

        // TRƯỜNG HỢP 2: Bạn chưa theo dõi người này
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onFollowToggle({ targetUser: user.id, isFollowing: false });
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors min-w-[110px] ${
                    user.isFollowerOfMe 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none' 
                    : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                }`}
            >
                {user.isFollowerOfMe ? 'Theo dõi lại' : 'Theo dõi'}
            </button>
        );
    };

    return (
        <div className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-2xl transition-all group">
            <Link 
                to={`/profile/${user.id}`} 
                onClick={onCloseModal} 
                className="flex items-center gap-3 flex-1 min-w-0"
            >
                <div className="relative">
                    <img 
                        src={user.avatarUrl || 'https://via.placeholder.com/150'} 
                        alt={user.fullName} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all shadow-sm" 
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                            {user.fullName}
                        </span>
                        {/* Badge nhỏ xinh hiển thị mối quan hệ */}
                        {user.isFollowerOfMe && (
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[9px] font-black rounded uppercase tracking-wider">
                                Theo dõi bạn
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        @{user.fullName?.toLowerCase().replace(/\s/g, '') || 'user'}
                    </span>
                </div>
            </Link>
            <div className="ml-3">
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-[28px] shadow-2xl w-full max-w-md flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
                    <div className="w-8"></div>
                    <h2 className="text-sm font-black text-center uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        {title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body List */}
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                    {users.length > 0 ? (
                        <div className="space-y-1">
                            {users.map(u => (
                                <UserListItem 
                                    key={u.id} 
                                    user={u} 
                                    currentUser={currentUser} 
                                    onFollowToggle={(p) => dispatch(toggleFollow(p))}
                                    onCloseModal={onClose}
                                />
                            ))}
                            
                            {/* Nút Xem thêm */}
                            {nextCursor && (
                                <div className="p-4 mt-2">
                                    <button 
                                        onClick={handleLoadMore}
                                        disabled={status === 'loading'}
                                        className="w-full py-3 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all disabled:opacity-50"
                                    >
                                        {status === 'loading' ? 'Đang tải...' : 'Xem thêm'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        status === 'loading' ? (
                            <div className="py-24 flex flex-col items-center gap-4">
                                <Loader isLoading={true} />
                                <span className="text-xs text-gray-400 animate-pulse">Đang tải danh sách...</span>
                            </div>
                        ) : (
                            <div className="py-24 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                                    <X size={32} className="text-gray-300 dark:text-gray-600" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium italic">
                                    Danh sách này hiện đang trống.
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;