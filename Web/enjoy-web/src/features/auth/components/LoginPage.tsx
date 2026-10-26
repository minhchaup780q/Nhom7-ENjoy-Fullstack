import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { learningApi } from '../../learning/services/learningApi';
import { ApiError } from '../../../services/apiClient';
import { isAdminRole } from '../types';

// Helper: kiểm tra placement test status và redirect
async function redirectAfterLogin(userId: number | string | undefined, role: string | undefined, navigate: (path: string, opts?: object) => void) {
  if (isAdminRole(role)) {
    navigate('/admin/dashboard', { replace: true });
    return;
  }
  try {
    const statusRes = await learningApi.getPlacementTestStatus(Number(userId));
    // apiClient.get trả về thẳng payload { hasCompleted: boolean }
    const hasCompleted = Boolean(
      (statusRes as any)?.hasCompleted ?? (statusRes as any)?.data?.hasCompleted
    );
    if (hasCompleted) {
      navigate('/learn', { replace: true });
    } else {
      navigate('/welcome', { replace: true });
    }
  } catch (err) {
    console.warn("Không thể kiểm tra trạng thái placement test, điều hướng vào /learn:", err);
    // Fallback: nếu lỗi kiểm tra status của user đã login thành công, cho vào /learn
    navigate('/learn', { replace: true });
  }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: currentUser, setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Nếu người dùng đã đăng nhập từ trước, tự động chuyển hướng đến trang tương ứng
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      redirectAfterLogin(currentUser.id, currentUser.role, navigate);
    }
  }, [isAuthenticated, currentUser, navigate]);

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
      
      const rawUser = response.user || (response as any);
      const user = {
        id: rawUser.id || (rawUser as any).userId,
        email: rawUser.email || (response as any).email || email.trim(),
        role: rawUser.role || (response as any).role,
        username: rawUser.username || (response as any).username,
        hasPassword: response.hasPassword ?? true,
      };

      setAuth(
        user,
        response.accessToken,
        response.refreshToken
      );

      await redirectAfterLogin(user.id, user.role, navigate);
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

        const rawUser = response.user || (response as any);
        const user = {
          id: rawUser.id || (rawUser as any).userId,
          email: rawUser.email || googleEmail,
          username: rawUser.username || googleName,
          role: rawUser.role || response.role,
          hasPassword: response.hasPassword ?? false,
        };

        // 3. Lưu Access Token và Refresh Token vào Zustand store / localStorage
        setAuth(
          user,
          response.accessToken,
          response.refreshToken
        );

        await redirectAfterLogin(user.id, user.role, navigate);
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50/70 via-white to-sky-100/40 relative flex flex-col justify-between items-center px-4 py-6 font-sans overflow-hidden">
      {/* Background ambient glowing blurs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-8 w-64 h-64 bg-cyan-100/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="w-full max-w-5xl flex justify-between items-center py-2 relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <div>
            <span className="font-display font-black text-2xl text-slate-900 leading-none tracking-tight block">
              ENjoy
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 block">
              TIẾNG ANH
            </span>
          </div>
        </Link>

        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white border border-sky-200/80 hover:border-sky-300 text-sky-700 font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>ĐĂNG KÝ</span>
        </Link>
      </header>

      {/* Main Content Form Card */}
      <main className="w-full max-w-md my-auto relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xl shadow-sky-950/5 flex flex-col items-center">
        {/* Card Header Icon & Title */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 mb-4">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>waving_hand</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display text-center">
          Đăng nhập ENjoy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium text-center">
          Cùng tiếp tục hành trình học tiếng Anh vui vẻ và bổ ích nhé! ✨
        </p>

        {errorMsg && (
          <div className="w-full mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-shake">
            <span className="material-symbols-outlined text-[20px] text-rose-500 shrink-0">error</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
              Email đăng nhập
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                mail
              </span>
              <input
                type="email"
                placeholder="nhapemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all duration-150"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
              <label className="text-xs font-bold text-slate-600">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => alert('Tính năng Quên mật khẩu đang được phát triển!')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 flex items-center justify-center"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-extrabold uppercase tracking-wider text-sm shadow-md shadow-sky-600/25 hover:shadow-lg hover:shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>ĐANG XỬ LÝ...</span>
              </>
            ) : (
              <>
                <span>ĐĂNG NHẬP</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full my-6 flex items-center justify-center relative">
          <div className="w-full border-t border-slate-200"></div>
          <span className="absolute bg-white px-3 text-xs font-bold text-slate-400 tracking-wider">
            HOẶC
          </span>
        </div>

        {/* Social Login: Google */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 font-bold text-sm shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>Tiếp tục với Google</span>
          </button>
        </div>

        {/* Register Prompt */}
        <p className="mt-6 text-center text-xs text-slate-500 font-medium">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
            Đăng ký ngay miễn phí
          </Link>
        </p>

        {/* Disclaimer Footer Text */}
        <div className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed font-medium">
          <p>
            Khi đăng nhập ENjoy, bạn đã đồng ý với{' '}
            <a href="#" className="font-bold text-slate-500 underline hover:text-sky-600">
              Điều khoản
            </a>{' '}
            và{' '}
            <a href="#" className="font-bold text-slate-500 underline hover:text-sky-600">
              Chính sách bảo mật
            </a>.
          </p>
        </div>
      </main>

      <footer className="w-full py-2 text-center text-xs text-slate-400 relative z-10">
        © 2026 ENjoy Learning · Nền tảng học tiếng Anh chuẩn Cambridge
      </footer>
    </div>
  );
};

export default LoginPage;
