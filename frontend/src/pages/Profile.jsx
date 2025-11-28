import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchCurrentUser } from '../api/userApi';
import { fetchUserNews } from '../api/articleApi';
import { resetProfile } from '../store/userSlice';
import ProfileHeader from '../components/ProfileHeader';
import NewsCard from '../components/NewsCard';
import Loader from '../components/Loader';
import { useState } from 'react';
import { FileText, Heart, Bookmark } from 'lucide-react';

const mockLikedPosts = [
    { id: 201, title: 'Bài viết đã thích số 1', content: 'Đây là nội dung của bài viết bạn đã thích...', publishedAt: '2025-10-10T12:00:00Z', likeCount: 150, author: { id: '2', name: 'Tác giả B', avatar: 'https://i.pravatar.cc/150?u=author2' } },
    { id: 202, title: 'Bài viết đã thích số 2', content: 'Một nội dung thú vị khác mà bạn đã nhấn like.', publishedAt: '2025-10-09T12:00:00Z', likeCount: 200, author: { id: '3', name: 'Tác giả C', avatar: 'https://i.pravatar.cc/150?u=author3' } },
];

const mockBookmarkedPosts = [
    { id: 301, title: 'Bài viết đã lưu để đọc sau', content: 'Nội dung này rất quan trọng nên bạn đã lưu lại...', publishedAt: '2025-10-11T12:00:00Z', likeCount: 500, author: { id: '4', name: 'Tác giả D', avatar: 'https://i.pravatar.cc/150?u=author4' } },
];

const Profile = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const { data: user, news, status, error } = useSelector((state) => state.user.profile);
    const { currentUser } = useSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchCurrentUser());
        }
        if (userId) {
            dispatch(fetchUserProfile({ userId }));
            dispatch(fetchUserNews({ userId }));
        }

        return () => {
            dispatch(resetProfile());
        };  
    }, [userId, dispatch, currentUser]);

    const renderContent = () => {
        let contentToRender = [];
        let emptyMessage = "";

        switch (activeTab) {
            case 'posts':
                contentToRender = news;
                emptyMessage = "Người dùng này chưa có bài viết nào.";
                break;
            case 'liked':
                // Chỉ hiển thị tab này cho người dùng hiện tại
                if (currentUser?.id === userId) {
                    contentToRender = mockLikedPosts;
                    emptyMessage = "Bạn chưa thích bài viết nào.";
                }
                break;
            case 'bookmarked':
                 // Chỉ hiển thị tab này cho người dùng hiện tại
                if (currentUser?.id === userId) {
                    contentToRender = mockBookmarkedPosts;
                    emptyMessage = "Bạn chưa lưu bài viết nào.";
                }
                break;
            default:
                break;
        }

        if (contentToRender.length > 0) {
            return (
                <div className="flex flex-col items-center gap-4">
                    {contentToRender.map((item) => (
                        <NewsCard
                            key={item.id}
                            {...item}
                            // Ghi đè author nếu là bài viết của người khác
                            author={item.author || { id: user.id, name: user.name, avatar: user.avatar }}
                        />
                    ))}
                </div>
            );
        }
        return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">{emptyMessage}</p>;
    };

    if (status === 'loading' || !user) {
        return <Loader isLoading={true} />;
    }

    if (status === 'failed') {
        return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;
    }

    const isCurrentUserProfile = currentUser?.id === userId;

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen py-8 px-4 transition-colors">
            <ProfileHeader user={user} />
            
            {/* Tabs Navigation */}
            <div className="w-full max-w-4xl mx-auto mt-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center sm:justify-start gap-4 sm:gap-8">
                    <TabButton
                        label="Bài viết"
                        icon={FileText}
                        isActive={activeTab === 'posts'}
                        onClick={() => setActiveTab('posts')}
                    />
                    {isCurrentUserProfile && (
                        <>
                            <TabButton
                                label="Đã thích"
                                icon={Heart}
                                isActive={activeTab === 'liked'}
                                onClick={() => setActiveTab('liked')}
                            />
                            <TabButton
                                label="Đã lưu"
                                icon={Bookmark}
                                isActive={activeTab === 'bookmarked'}
                                onClick={() => setActiveTab('bookmarked')}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
};

// Component TabButton để tái sử dụng
const TabButton = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 py-3 px-1 font-medium border-b-2 transition-colors ${
            isActive 
                ? 'border-indigo-500 text-indigo-500' 
                : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
);

export default Profile;