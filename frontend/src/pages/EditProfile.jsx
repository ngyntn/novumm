import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../api/userApi'; 
import Loader from '../components/Loader';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || '');
            setAvatar(currentUser.avatar || '');
            setBio(currentUser.bio || '');
        }
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = { name, avatar, bio };

        dispatch(updateUserProfile(updatedData))
            .unwrap()
            .then(() => {
                alert('Cập nhật thông tin thành công!');
                navigate(`/profile/${currentUser.id}`);
            })
            .catch((error) => {
                alert('Cập nhật thất bại: ' + error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    
    if (!currentUser) {
        return <Loader isLoading={true} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Chỉnh sửa trang cá nhân</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">URL ảnh đại diện</label>
                        <input
                            type="text"
                            id="avatar"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Tiểu sử</label>
                        <textarea
                            id="bio"
                            rows="4"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;