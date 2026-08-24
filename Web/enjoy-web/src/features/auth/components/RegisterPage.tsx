import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { ApiError } from '../../../services/apiClient';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim() || !birthday) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
        birthday: birthday || undefined,
      });

      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng sang Đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || 'Đăng ký thất bại. Email có thể đã được sử dụng!');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center px-4 py-6 relative font-sans">
      {/* Top Bar Header */}
      <header className="w-full max-w-5xl flex justify-end items-center py-2">
        <Link
          to="/login"
          className="px-6 py-2 rounded-2xl border-2 border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-sm hover:border-slate-300 hover:text-slate-600 transition duration-150"
        >
          ĐĂNG NHẬP
        </Link>
      </header>

      {/* Main Content Form */}
      <main className="w-full max-w-md my-auto flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-slate-700 mb-8 font-display">
          Tạo tài khoản ENjoy
        </h1>

        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="w-full mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-semibold text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              Tên người dùng *
            </label>
            <input
              type="text"
              placeholder="Nhập tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition duration-150"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              Email *
            </label>
            <input
              type="email"
              placeholder="nhapemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition duration-150"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              Mật khẩu *
            </label>
            <input
              type="password"
              placeholder="Mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition duration-150"
            />
          </div>

          {/* Birthday Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
              Ngày tháng năm sinh *
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition duration-150"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-2xl bg-[#58cc02] border-b-4 border-[#3f9102] text-white font-extrabold uppercase tracking-wider text-base hover:brightness-105 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
          >
            {loading ? 'ĐANG TẠO TÀI KHOẢN...' : 'TẠO TÀI KHOẢN'}
          </button>
        </form>

        {/* Disclaimer Footer Text */}
        <div className="mt-8 text-center text-xs text-slate-400 leading-relaxed font-medium">
          <p>
            Khi đăng ký trên ENjoy, bạn đã đồng ý với{' '}
            <a href="#" className="font-bold text-slate-500 underline hover:text-slate-700">
              Các chính sách
            </a>{' '}
            và{' '}
            <a href="#" className="font-bold text-slate-500 underline hover:text-slate-700">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi.
          </p>
        </div>
      </main>

      <footer className="w-full py-2 text-center text-xs text-slate-300">
        © 2026 ENjoy Learning
      </footer>
    </div>
  );
};
