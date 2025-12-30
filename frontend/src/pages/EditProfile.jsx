import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../api/userApi'; 
import { uploadMediaApi } from '../api/userApi'; // Import hàm mới
import Loader from '../components/Loader';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { currentUser } = useSelector((state) => state.user);

    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.fullName || ''); // Khớp với key fullName của bạn
            setAvatar(currentUser.avatarUrl || ''); // Khớp với key avatarUrl của bạn
            setBio(currentUser.bio || '');
        }
    }, [currentUser]);

    // Xử lý khi người dùng chọn ảnh
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Hiển thị ảnh tạm thời (Local Preview)
        const localUrl = URL.createObjectURL(file);
        setAvatar(localUrl);

        // 2. Gọi API upload ngay lập tức
        setIsUploading(true);
        try {
            const result = await uploadMediaApi(file);
            // 3. Cập nhật lại state avatar bằng URL thật từ server trả về
            // Giả sử backend trả về { data: { url: "..." } } hoặc { url: "..." }
            const serverUrl = result.url || result.data?.url; 
            setAvatar(serverUrl);
        } catch (error) {
            alert("Lỗi upload ảnh: " + error.message);
            // Nếu lỗi thì có thể reset về ảnh cũ của user
            setAvatar(currentUser.avatarUrl);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isUploading) {
            return alert("Vui lòng đợi ảnh tải lên hoàn tất!");
        }

        setLoading(true);
        
        // Body khớp với Zod schema của bạn
        const updatedData = { 
            fullName: name, 
            avatarUrl: avatar, 
            bio: bio 
        };

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
    
    if (!currentUser) return <Loader isLoading={true} />;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Chỉnh sửa trang cá nhân</h1>
                
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                    {/* Khu vực chọn ảnh đại diện */}
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <img
                                src={avatar || 'https://via.placeholder.com/150'}
                                alt="Avatar"
                                className={`w-32 h-32 rounded-full object-cover border-4 border-white shadow-md ${isUploading ? 'opacity-40' : 'group-hover:opacity-80'}`}
                            />
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <p className="mt-2 text-xs text-gray-500">Nhấp vào ảnh để thay đổi</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập ít nhất 10 ký tự..."
                            className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tiểu sử</label>
                        <textarea
                            rows="3"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || isUploading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition"
                    >
                        {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;