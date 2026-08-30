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
    let timer: NodeJS.Timeout;
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
        birthday,
      });

      setSuccessMsg('Mã OTP đã được gửi đến Gmail của bạn!');
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
      }, 2500);
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
        <h1 className="text-3xl font-extrabold text-slate-700 mb-8 font-display text-center">
          {step === 'REGISTER' ? 'Tạo tài khoản ENjoy' : 'Xác thực mã OTP'}
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

        {step === 'REGISTER' ? (
          /* STEP 1: Registration Form */
          <form onSubmit={handleRegisterSubmit} noValidate className="w-full space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                Tên hiển thị *
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
                Ngày sinh *
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
              {loading ? 'ĐANG XỬ LÝ...' : 'TẠO TÀI KHOẢN'}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification Form */
          <form onSubmit={handleVerifyOtpSubmit} noValidate className="w-full space-y-4">
            <p className="text-sm text-slate-500 text-center mb-4">
              Chúng tôi đã gửi mã xác thực OTP 6 số đến email <strong className="text-slate-700">{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                Mã OTP (6 chữ số) *
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-100/80 border-2 border-slate-200 text-slate-800 tracking-[0.5em] text-center font-mono font-bold text-2xl placeholder-slate-300 focus:outline-none focus:border-sky-400 focus:bg-white transition duration-150"
              />
            </div>

            {/* Countdown Timer */}
            <div className="flex justify-between items-center text-sm px-1 py-1">
              <span className="text-slate-500 font-medium">
                ⏱️ Hạn OTP: <strong className="text-red-500 font-bold">{formatTime(timeLeft)}</strong>
              </span>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className={`text-xs font-bold uppercase tracking-wider underline ${
                  canResend
                    ? 'text-sky-500 hover:text-sky-600 cursor-pointer'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                Gửi lại OTP
              </button>
            </div>

            {/* Verify Submit Button */}
            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full mt-4 py-3.5 rounded-2xl bg-sky-500 border-b-4 border-sky-700 text-white font-extrabold uppercase tracking-wider text-base hover:brightness-105 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
            >
              {loading ? 'ĐANG XÁC THỰC...' : 'XÁC NHẬN OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep('REGISTER')}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider text-center"
            >
              ← Quay lại nhập thông tin
            </button>
          </form>
        )}

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
