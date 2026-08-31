import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { ApiError } from '../../../services/apiClient';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await authApi.login({ email: email.trim(), password });
      setAuth(
        { email: email.trim(), hasPassword: response.hasPassword ?? true },
        response.accessToken,
        response.refreshToken
      );
      navigate('/learn');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || 'Sai Email hoặc Mật khẩu. Vui lòng kiểm tra lại!');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setErrorMsg(null);

      try {
        // 1. Lấy thông tin user profile từ Google qua Access Token
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const { email: googleEmail, name: googleName, sub: googleId } = userInfo.data;

        // 2. Gửi thông tin sang Backend auth-service (/api/auth/login-by-google)
        const response = await authApi.googleAuth({
          email: googleEmail,
          name: googleName,
          googleId: googleId,
        });

        // 3. Lưu Access Token và Refresh Token vào Zustand store / localStorage
        setAuth(
          { email: googleEmail, username: googleName, hasPassword: response.hasPassword ?? false },
          response.accessToken,
          response.refreshToken
        );

        navigate('/learn');
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMsg(err.message || 'Đăng nhập Google thất bại!');
        } else {
          setErrorMsg('Lỗi xác thực Google. Vui lòng thử lại!');
        }
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setErrorMsg('Đăng nhập Google không thành công hoặc đã bị hủy!');
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center px-4 py-6 relative font-sans">
      {/* Top Bar Header */}
      <header className="w-full max-w-5xl flex justify-end items-center py-2">
        <Link
          to="/register"
          className="px-6 py-2 rounded-2xl border-2 border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-sm hover:border-slate-300 hover:text-slate-600 transition duration-150"
        >
          ĐĂNG KÝ
        </Link>
      </header>

      {/* Main Content Form */}
      <main className="w-full max-w-md my-auto flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-slate-700 mb-8 font-display">
          Đăng nhập
        </h1>

        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold text-center animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email/Username Field */}
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition duration-150"
            />
          </div>

          {/* Password Field with "QUÊN?" Link */}
          <div className="relative">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-20 py-3.5 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:border-sky-400 focus:bg-white transition duration-150"
            />
            <button
              type="button"
              onClick={() => alert('Tính năng Quên mật khẩu đang được phát triển!')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
            >
              QUÊN?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#ff5e97] border-b-4 border-[#d93d74] text-white font-extrabold uppercase tracking-wider text-base hover:brightness-105 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full my-6 flex items-center justify-center relative">
          <div className="w-full border-t border-slate-200"></div>
          <span className="absolute bg-white px-3 text-xs font-bold text-slate-400 tracking-wider">
            HOẶC
          </span>
        </div>

        {/* Social Login: Google only */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 border-b-4 text-slate-700 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center hover:bg-slate-50 active:translate-y-0.5 transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            GOOGLE
          </button>
        </div>

        {/* Disclaimer Footer Text */}
        <div className="mt-8 text-center text-xs text-slate-400 leading-relaxed font-medium">
          <p className="mb-2">
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
          <p className="text-[11px] text-slate-400">
            Trang này được reCAPTCHA Enterprise bảo hộ và theo{' '}
            <a href="#" className="font-bold text-slate-500 underline hover:text-slate-700">
              Chính sách bảo mật
            </a>{' '}
            và{' '}
            <a href="#" className="font-bold text-slate-500 underline hover:text-slate-700">
              Điều khoản dịch vụ
            </a>{' '}
            của Google.
          </p>
        </div>
      </main>

      <footer className="w-full py-2 text-center text-xs text-slate-300">
        © 2026 ENjoy Learning
      </footer>
    </div>
  );
};
