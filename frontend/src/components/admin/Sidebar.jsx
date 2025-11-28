// src/components/admin/Sidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, ShieldAlert, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const navItems = [
        { to: "/admin", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/admin/users", icon: Users, text: "Quản lý người dùng" },
        { to: "/admin/content", icon: FileText, text: "Quản lý nội dung" },
        { to: "/admin/reports", icon: ShieldAlert, text: "Quản lý báo cáo" },
    ];

    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;

    const handleLogout = () => {
        // Logic đăng xuất sẽ được thêm ở đây
        // Ví dụ: dispatch(logoutUser());
        console.log("Đăng xuất thành công!");
        navigate('/login'); // Chuyển hướng về trang đăng nhập
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-8">
                    <img src="/React-icon.svg" alt="Logo" className="h-8 w-auto" />
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Admin Panel
                    </span>
                </div>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} className={navLinkClasses} end>
                            <item.icon size={20} />
                            <span className="font-medium">{item.text}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            
            {/* Nút Đăng xuất được đẩy xuống dưới cùng */}
            <div className="mt-auto p-4">
                 <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;