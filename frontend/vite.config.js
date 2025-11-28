import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Thư mục đầu ra khi build
    assetsDir: 'assets', // Thư mục chứa các file tĩnh (js, css,...)
    sourcemap: true, // Tạo sourcemap để dễ debug (tùy chọn)
  },
  base: '/', // Đường dẫn gốc, thay đổi nếu deploy lên subpath (ví dụ: '/my-app/')
});