import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../api/userApi';
import { fetchArticlesByTab } from '../api/articleApi';
import { resetProfile } from '../store/userSlice';
import ProfileHeader from '../components/ProfileHeader';
import NewsCard from '../components/NewsCard';
import Loader from '../components/Loader';
import { FileText, Heart, Bookmark } from 'lucide-react';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { currentUser } = useSelector((state) => state.user);
    const { data: user, posts, liked, bookmarked, status } = useSelector((state) => state.user.profile);

    const [activeTab, setActiveTab] = useState('posts');
    const isOwnProfile = currentUser.id == userId;

    // 1. Fetch thông tin User (Avatar, Bio, Name)
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserProfile({ userId }));
        }
        return () => dispatch(resetProfile());
    }, [userId, dispatch]);

    // 2. Fetch bài viết dựa trên Tab đang active
    useEffect(() => {
        if (userId) {
            dispatch(fetchArticlesByTab({ 
                tab: activeTab, 
                userId, 
                isOwnProfile 
            }));
        }
    }, [userId, activeTab, isOwnProfile, dispatch]);

    const renderContent = () => {
        // Lấy nguồn dữ liệu tương ứng với tab từ Store
        const sourceMap = {
            posts: { data: posts, msg: "Người dùng này chưa có bài viết nào." },
            liked: { data: liked, msg: "Bạn chưa thích bài viết nào." },
            bookmarked: { data: bookmarked, msg: "Bạn chưa lưu bài viết nào." }
        };

        const currentSource = sourceMap[activeTab];

        // Nếu đang tải lần đầu (mảng chưa có dữ liệu) thì hiện Loader
        if (status === 'loading' && (!currentSource.data.articles || currentSource.data.articles.length === 0)) {
            return <Loader isLoading={true} />;
        }

        if (currentSource.data.articles && currentSource.data.articles.length > 0) {
            return (
                <div className="flex flex-col items-center gap-4 w-full">
                    {currentSource.data.articles.map((item) => (
                        <NewsCard key={item.id} {...item} />
                    ))}
                </div>
            );
        }

        return <p className="text-center text-gray-500 mt-8">{currentSource.msg}</p>;
    };

    if (!user && status === 'loading') return <Loader isLoading={true} />;

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen py-8 px-4 transition-colors">
            {/* Header chứa Avatar, Bio, nút Follow/Edit */}
            <ProfileHeader isOwnProfile={isOwnProfile} />

            {/* Điều hướng Tab */}
            <div className="w-full max-w-4xl mx-auto mt-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center sm:justify-start gap-4">
                    <TabButton 
                        label="Bài viết" 
                        icon={FileText} 
                        isActive={activeTab === 'posts'} 
                        onClick={() => setActiveTab('posts')} 
                    />
                    {isOwnProfile && (
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

            {/* Nội dung danh sách bài viết */}
            <div className="mt-8">{renderContent()}</div>
        </div>
    );
};

/**
 * Component TabButton phụ để render các nút chọn Tab
 * Bạn có thể khai báo nó ngay tại đây để dùng nội bộ trong trang Profile
 */
const TabButton = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 py-3 px-1 font-medium border-b-2 transition-all ${
            isActive
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
    >
        <Icon size={18} />
        <span className="text-sm sm:text-base">{label}</span>
    </button>
);

export default Profile;