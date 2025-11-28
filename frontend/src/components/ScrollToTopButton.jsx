import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // 1. Theo dõi vị trí cuộn của trang
    const toggleVisibility = () => {
        // Nếu cuộn xuống hơn 300px, hiện nút
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // 2. Thêm và xóa sự kiện lắng nghe khi cuộn
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        // Dọn dẹp sự kiện khi component bị hủy
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // 3. Hàm để cuộn mượt mà lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Tạo hiệu ứng cuộn mượt
        });
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* 4. Chỉ hiển thị nút khi isVisible là true */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none"
                    aria-label="Trở lại đầu trang"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </div>
    );
}

export default ScrollToTopButton;