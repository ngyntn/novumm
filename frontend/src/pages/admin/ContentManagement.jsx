// src/pages/admin/ContentManagement.jsx

import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const mockContent = [
    { id: 101, title: 'Hướng dẫn toàn tập về React Hooks', author: 'Alice', date: '2025-10-05', status: 'published' },
    { id: 102, title: '10 Mẹo CSS không thể bỏ qua', author: 'Bob', date: '2025-10-04', status: 'published' },
    { id: 103, title: 'Giới thiệu về AI tạo sinh', author: 'Charlie', date: '2025-10-02', status: 'published' },
    { id: 104, title: 'Bài viết đang chờ duyệt', author: 'David', date: '2025-10-01', status: 'pending' },
];

const ContentManagement = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Quản lý nội dung</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">ID Bài viết</th>
                            <th className="px-6 py-3">Tiêu đề</th>
                            <th className="px-6 py-3">Tác giả</th>
                            <th className="px-6 py-3">Ngày đăng</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockContent.map(content => (
                            <tr key={content.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4">{content.id}</td>
                                <td className="px-6 py-4 font-medium max-w-sm truncate">{content.title}</td>
                                <td className="px-6 py-4">{content.author}</td>
                                <td className="px-6 py-4">{content.date}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" title="Xem bài viết">
                                        <Eye size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-red-500" title="Xóa bài viết">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentManagement;