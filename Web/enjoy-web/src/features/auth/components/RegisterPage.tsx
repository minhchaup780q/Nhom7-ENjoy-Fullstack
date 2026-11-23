import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { ApiError } from '../../../services/apiClient';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [birthday, setBirthday] = useState('');

  // Flow State: 'REGISTER' | 'OTP'
  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [otpCode, setOtpCode] = useState('');

  // Timer State (300s = 5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'OTP' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Submit Register Form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim() || !birthday) {
      setErrorMsg('Vui lòng nhập đầy đủ tất cả các trường thông tin!');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
        birthday,
      });

      setSuccessMsg('Mã OTP 6 chữ số đã được gửi đến Gmail của bạn!');
      setStep('OTP');
      setTimeLeft(300);
      setCanResend(false);
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

  // Step 2: Verify OTP Submit
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length !== 6) {
      setErrorMsg('Vui lòng nhập đúng 6 chữ số mã OTP');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await authApi.verifyOtp({
        email: email.trim(),
        otp: otpCode.trim(),
      });

      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || 'Mã OTP không chính xác hoặc đã hết hạn!');
      } else {
        setErrorMsg('Lỗi xác thực OTP. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      await authApi.resendOtp({ email: email.trim() });
      setSuccessMsg('Mã OTP mới đã được gửi thành công!');
      setTimeLeft(300);
      setCanResend(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message || 'Gửi lại OTP thất bại!');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ!');
      }
    } finally {
      setLoading(false);
    }
  };

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
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white border border-sky-200/80 hover:border-sky-300 text-sky-700 font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span>ĐĂNG NHẬP</span>
        </Link>
      </header>

      {/* Main Content Form Card */}
      <main className="w-full max-w-md my-auto relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-xl shadow-sky-950/5 flex flex-col items-center">
        {/* Card Header Icon & Title */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 mb-4">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {step === 'REGISTER' ? 'person_add' : 'mark_email_read'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display text-center">
          {step === 'REGISTER' ? 'Tạo tài khoản ENjoy' : 'Xác thực mã OTP'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium text-center">
          {step === 'REGISTER'
            ? 'Bắt đầu hành trình chinh phục tiếng Anh Cambridge cùng ENjoy! ✨'
            : `Mã xác thực gồm 6 chữ số đã được gửi tới email ${email}`}
        </p>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="w-full mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-shake">
            <span className="material-symbols-outlined text-[20px] text-rose-500 shrink-0">error</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="w-full mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-emerald-500 shrink-0">check_circle</span>
            <span className="flex-1">{successMsg}</span>
          </div>
        )}

        {step === 'REGISTER' ? (
          /* STEP 1: Registration Form */
          <form onSubmit={handleRegisterSubmit} noValidate className="w-full space-y-4 mt-6">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                Tên hiển thị *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                  person
                </span>
                <input
                  type="text"
                  placeholder="Ví dụ: Alex Nguyen"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all duration-150"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                Địa chỉ Email *
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
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                Mật khẩu *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tối thiểu 6 ký tự"
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

            {/* Birthday Field */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                Ngày sinh của bé / bạn *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                  calendar_today
                </span>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all duration-150"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-extrabold uppercase tracking-wider text-sm shadow-md shadow-sky-600/25 hover:shadow-lg hover:shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>ĐANG XỬ LÝ...</span>
                </>
              ) : (
                <>
                  <span>TẠO TÀI KHOẢN</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification Form */
          <form onSubmit={handleVerifyOtpSubmit} noValidate className="w-full space-y-4 mt-6">
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-center">
              <span className="text-xs text-slate-600 block">
                Mã xác thực đã được gửi tới:
              </span>
              <strong className="text-sm text-sky-800 font-bold block mt-0.5">
                {email}
              </strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 text-center">
                MÃ OTP 6 CHỮ SỐ *
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="••••••"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-sky-200 text-slate-800 tracking-[0.6em] text-center font-mono font-black text-2xl placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all duration-150"
              />
            </div>

            {/* Countdown Timer & Resend */}
            <div className="flex justify-between items-center text-xs px-2 py-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-500">timer</span>
                <span>Hạn mã:</span>
                <strong className="text-amber-600 font-bold">{formatTime(timeLeft)}</strong>
              </span>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className={`font-bold uppercase tracking-wider transition-colors ${
                  canResend
                    ? 'text-sky-600 hover:text-sky-700 underline cursor-pointer'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                Gửi lại mã OTP
              </button>
            </div>

            {/* Verify Submit Button */}
            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-extrabold uppercase tracking-wider text-sm shadow-md shadow-sky-600/25 hover:shadow-lg hover:shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>ĐANG XÁC THỰC...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>XÁC NHẬN OTP</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('REGISTER');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Quay lại chỉnh sửa thông tin</span>
            </button>
          </form>
        )}

        {/* Login Prompt */}
        <p className="mt-6 text-center text-xs text-slate-500 font-medium">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>

        {/* Disclaimer Footer Text */}
        <div className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed font-medium">
          <p>
            Khi đăng ký ENjoy, bạn đã đồng ý với{' '}
            <a href="#" className="font-bold text-slate-500 underline hover:text-sky-600">
              Điều khoản dịch vụ
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

export default RegisterPage;
