import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { convertDateTimeToVietnam, convertLikeNumber } from '../utils/convert';

const SearchResultItem = ({ item, author }) => {

    console.log("Rendering SearchResultItem for item:", item);
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(item.likeCount || 0);
    const [userReaction, setUserReaction] = useState(null);

    const createSnippet = (content, wordLimit = 30) => {
        const plainText = content.replace(/#+\s/g, '').replace(/[*_`]/g, '');
        const words = plainText.split(' ');
        if (words.length <= wordLimit) {
            return plainText;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    const handleNavigate = () => {
        console.log("Navigating to article:", item.slug);
        navigate(`/news/${item.slug}`);
    };

    const handleLike = (e) => {
        e.stopPropagation(); 
        if (userReaction === "like") {
            setLikeCount(likeCount - 1);
            setUserReaction(null);
        } else {
            setLikeCount(likeCount + 1);
            setUserReaction("like");
        }
    };

    const snippet = createSnippet(item.content);

    return (
        <div
            className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 last:border-b-0 py-6 px-6 w-full max-w-4xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
            onClick={handleNavigate}
        >
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 hover:underline">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{snippet}</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{author?.fullName || 'Tác giả ẩn danh'}</span>
                <span className="mx-2">•</span>
                <span>{convertDateTimeToVietnam(item.publishedAt)}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={handleLike}
                        className={`transition-colors ${userReaction === 'like' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} hover:text-red-500`}
                        aria-label="Like this article"
                    >
                        <Heart
                            className="w-4 h-4"
                            fill={userReaction === 'like' ? 'currentColor' : 'none'}
                        />
                    </button>
                    <span>{convertLikeNumber(likeCount)}</span>
                </div>
            </div>
        </div>
    );
};

export default SearchResultItem;