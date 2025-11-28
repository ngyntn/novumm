import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../api/authApi";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const { status, error: reduxError } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Đăng nhập thất bại:", err);
      });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Cột bên trái - Hình ảnh & Branding */}
      <div
        className="hidden md:flex flex-col justify-center items-center text-white p-12 rounded-r-2xl"
        style={{
          backgroundImage: `url('src/assets/background1.png')`, 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
        }}
      >
      </div>

      {/* Cột bên phải - Form Đăng nhập */}
      <div className="flex items-center justify-center bg-gray-50 dark:bg-black transition-colors py-12 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Đăng nhập tài khoản
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
            Vui lòng nhập thông tin của bạn
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>} */}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition mt-2"
            >
              Đăng nhập
            </button>
          </form>

          <div className="text-center mt-4">
            <a
              href="#"
              className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Được thực hiện bởi:</p>
            <p className="font-semibold">Phạm Tấn Nguyên - N22DCCN156</p>
            <p className="font-semibold">Ngô Tấn Sang - N22DCCN167</p>
            <p className="font-semibold">Văn Minh Tấn - N22DCCN175</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
