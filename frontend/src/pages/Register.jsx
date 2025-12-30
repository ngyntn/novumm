import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, sendVerifyEmail, verifyOtp } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Info
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  // Xử lý Bước 1: Gửi OTP
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(sendVerifyEmail({ email: formData.email }));
    if (sendVerifyEmail.fulfilled.match(result)) {
      setStep(2);
    } else {
      setError(result.payload);
    }
    setLoading(false);
  };

  // Xử lý Bước 2: Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(verifyOtp({ email: formData.email, otp: formData.otp }));
    if (verifyOtp.fulfilled.match(result)) {
      setStep(3); // BE đã lưu cache, giờ cho nhập pass
    } else {
      setError(result.payload);
    }
    setLoading(false);
  };

  // Xử lý Bước 3: Đăng ký cuối cùng
  const handleFinalRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) return setError("Mật khẩu ít nhất 6 ký tự!");
    if (formData.password !== formData.confirmPassword) return setError("Mật khẩu không khớp!");

    setLoading(true);
    const { confirmPassword, otp, ...registerData } = formData;
    const result = await dispatch(registerUser(registerData));

    if (registerUser.fulfilled.match(result)) {
      alert("Đăng ký thành công!");
      navigate("/login");
    } else {
      setError(result.payload);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        
        {/* Progress Bar đơn giản */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 w-full mx-1 rounded ${step >= s ? "bg-indigo-600" : "bg-gray-200"}`} />
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {step === 1 && "Nhập Email"}
          {step === 2 && "Xác nhận mã OTP"}
          {step === 3 && "Thông tin cá nhân"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* STEP 1: GỬI EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
            <input
              type="email" name="email" placeholder="Email của bạn" required
              onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <button disabled={loading} className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              {loading ? "Đang gửi..." : "Tiếp tục"}
            </button>
          </form>
        )}

        {/* STEP 2: NHẬP OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">Mã đã gửi tới {formData.email}</p>
            <input
              type="text" name="otp" placeholder="Nhập mã OTP" required
              onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white text-center text-xl tracking-widest"
            />
            <button disabled={loading} className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              {loading ? "Đang xác thực..." : "Xác nhận mã"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 hover:underline">Quay lại</button>
          </form>
        )}

        {/* STEP 3: NHẬP INFO & PASS */}
        {step === 3 && (
          <form onSubmit={handleFinalRegister} className="flex flex-col gap-4">
            <input
              type="text" name="fullName" placeholder="Họ và tên" required
              onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <input
              type="password" name="password" placeholder="Mật khẩu (>= 6 ký tự)" required
              onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <input
              type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required
              onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <button disabled={loading} className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              {loading ? "Đang đăng ký..." : "Hoàn tất"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;