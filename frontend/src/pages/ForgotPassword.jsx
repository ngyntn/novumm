import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { requestForgotPasswordOtp, verifyForgotPasswordOtp, changeForgotPassword } from "../api/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // Lưu trữ để dùng cho cả bước 2 và 3
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Bước 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(requestForgotPasswordOtp({ email }));
    if (requestForgotPasswordOtp.fulfilled.match(result)) {
      setStep(2);
      setError(null);
    } else {
      setError(result.payload);
    }
    setLoading(false);
  };

  // Bước 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError("Mã OTP phải có 6 ký tự!");
    
    setLoading(true);
    const result = await dispatch(verifyForgotPasswordOtp({ email, otp }));
    if (verifyForgotPasswordOtp.fulfilled.match(result)) {
      setStep(3);
      setError(null);
    } else {
      setError(result.payload);
    }
    setLoading(false);
  };

  // Bước 3: Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) return setError("Mật khẩu mới phải ít nhất 8 ký tự!");
    if (passwords.newPassword !== passwords.confirmPassword) return setError("Mật khẩu xác nhận không khớp!");

    setLoading(true);
    // Gửi đủ email, otp, newPassword theo đúng changePassword schema
    const result = await dispatch(changeForgotPassword({ 
        email, 
        otp, 
        newPassword: passwords.newPassword 
    }));

    if (changeForgotPassword.fulfilled.match(result)) {
      alert("Đổi mật khẩu thành công!");
      navigate("/login");
    } else {
      setError(result.payload);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {step === 1 && "Quên mật khẩu"}
          {step === 2 && "Xác thực mã OTP"}
          {step === 3 && "Thiết lập mật khẩu mới"}
        </h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm font-medium">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <input
              type="email" placeholder="Nhập email của bạn" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold transition">
              {loading ? "Đang gửi..." : "Gửi mã xác thực"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input
              type="text" placeholder="Nhập mã 6 số" required maxLength={6}
              value={otp} onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white text-center text-2xl tracking-[0.5em] font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold transition">
              {loading ? "Đang kiểm tra..." : "Xác nhận OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <input
              type="password" placeholder="Mật khẩu mới (tối thiểu 8 ký tự)" required
              value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password" placeholder="Xác nhận mật khẩu mới" required
              value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold transition">
              {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;