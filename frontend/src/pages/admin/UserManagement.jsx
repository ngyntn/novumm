// src/pages/admin/UserManagement.jsx

import React from 'react';
import { Eye, Lock, Unlock } from 'lucide-react';

const mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com', joinDate: '2025-10-01', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', joinDate: '2025-09-15', status: 'active' },
    { id: 3, name: 'bad_user_123', email: 'bad@example.com', joinDate: '2025-08-20', status: 'locked' },
];

const UserManagement = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Quản lý người dùng</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Tên người dùng</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Ngày tham gia</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsers.map(user => (
                            <tr key={user.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4 font-medium">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.joinDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><Eye size={16} /></button>
                                    {user.status === 'active' 
                                        ? <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-red-500"><Lock size={16} /></button>
                                        : <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full text-green-500"><Unlock size={16} /></button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;