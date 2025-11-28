// src/pages/admin/Dashboard.jsx

import React from 'react';
import { Users, FileText, ShieldAlert, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
            <Icon className="text-indigo-600 dark:text-indigo-300" size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng người dùng" value="1,250" icon={Users} />
                <StatCard title="Tổng bài viết" value="5,830" icon={FileText} />
                <StatCard title="Báo cáo mới" value="25" icon={ShieldAlert} />
                <StatCard title="Tăng trưởng" value="+15.3%" icon={TrendingUp} />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hoạt động gần đây</h2>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="py-3">Người dùng "Alice" đã đăng một bài viết mới.</li>
                        <li className="py-3">Bài viết "Hướng dẫn React 2025" đã bị báo cáo.</li>
                        <li className="py-3">Admin đã khóa tài khoản "bad_user_123".</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;