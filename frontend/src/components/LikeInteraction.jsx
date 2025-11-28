import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { convertLikeNumber } from '../utils/convert';
import { updateArticleLike } from '../api/articleApi';
import { toast } from 'react-hot-toast';

const LikeInteraction = ({ article }) => {
    const dispatch = useDispatch();
    const [isLiked, setIsLiked] = useState(article.isLiked);
    const [likeCount, setLikeCount] = useState(article.likesCount || 0);

    useEffect(() => {
        setIsLiked(article.isLiked);
        setLikeCount(article.likesCount || 0);
    }, [article.isLiked, article.likesCount]);

    const handleLike = async () => {
        const oldState = {
            isLiked: isLiked,
            likeCount: likeCount,
        };

        const newState = {
            isLiked: !isLiked,
            likeCount: !isLiked ? likeCount + 1 : likeCount - 1,
        };
        setIsLiked(newState.isLiked);
        setLikeCount(newState.likeCount);

        try {
            await dispatch(updateArticleLike(article.id)).unwrap();
        } catch (error) {
            toast.error(error.message || "Lỗi: Không thể thích bài viết.");
            setIsLiked(oldState.isLiked);
            setLikeCount(oldState.likeCount);
        }
    };

    return (
        <div className="my-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                        isLiked 
                            ? 'bg-red-100 dark:bg-red-900 text-red-500' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    <Heart 
                        className="w-6 h-6"
                        fill={isLiked ? 'currentColor' : 'none'}
                    />
                </button>
                <span className="font-medium text-gray-700 dark:text-gray-200">
                    {convertLikeNumber(likeCount)} lượt thích
                </span>
            </div>
        </div>
    );
};

export default LikeInteraction;