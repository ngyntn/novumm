// src/pages/admin/ReportManagement.jsx

import React from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const mockReports = [
    { id: 1, contentId: 103, contentType: 'Bài viết', reason: 'Nội dung không phù hợp', reporter: 'David', date: '2025-10-10', status: 'pending' },
    { id: 2, contentId: 201, contentType: 'Bình luận', reason: 'Spam, quảng cáo', reporter: 'Eve', date: '2025-10-09', status: 'pending' },
    { id: 3, contentId: 101, contentType: 'Bài viết', reason: 'Thông tin sai sự thật', reporter: 'Frank', date: '2025-10-08', status: 'resolved' },
];

const ReportManagement = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Quản lý báo cáo</h1>
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">ID Báo cáo</th>
                            <th className="px-6 py-3">Loại nội dung</th>
                            <th className="px-6 py-3">Lý do</th>
                            <th className="px-6 py-3">Người báo cáo</th>
                            <th className="px-6 py-3">Ngày báo cáo</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockReports.map(report => (
                            <tr key={report.id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4">{report.id}</td>
                                <td className="px-6 py-4 font-medium">{report.contentType} #{report.contentId}</td>
                                <td className="px-6 py-4 max-w-xs truncate">{report.reason}</td>
                                <td className="px-6 py-4">{report.reporter}</td>
                                <td className="px-6 py-4">{report.date}</td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {report.status === 'pending' ? 'Đang chờ' : 'Đã xử lý'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" title="Xem nội dung"><Eye size={16} /></button>
                                    <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full text-green-500" title="Chấp nhận báo cáo"><CheckCircle size={16} /></button>
                                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-red-500" title="Hủy báo cáo"><XCircle size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportManagement;