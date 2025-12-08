import axios from 'axios'; 

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); 
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config; 
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const status = error.response ? error.response.status : null;
        const refreshToken = localStorage.getItem('refreshToken');

        if (status === 401 && originalRequest.url !== `${BASE_URL}/auth/refresh-token` && originalRequest.url !== `${BASE_URL}/auth/login`) {
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            if (!refreshToken) {
                console.error("Refresh token không tồn tại, đang đăng xuất.");
                localStorage.removeItem('currentUser');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { 
                    refreshToken: refreshToken 
                });

                const newAccessToken = response.data.data.accessToken.accessToken; // Giả sử BE trả về { accessToken: { accessToken: "..." } }
                localStorage.setItem('accessToken', newAccessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                return api(originalRequest);

            } catch (refreshError) {
                console.error("Làm mới token thất bại!", refreshError);
                processQueue(refreshError, null);
                
                localStorage.removeItem('currentUser');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; 
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false; 
            }
        }
        
        return Promise.reject(error);
    }
);

