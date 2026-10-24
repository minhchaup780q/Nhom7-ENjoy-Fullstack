import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { profileApi, type UserProfile } from '../services/profileApi';
import { FamilyManagementModal } from './FamilyManagementModal';
import { apiClient } from '../../../services/apiClient';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyPenguin',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyTiger',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyBear',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyRabbit',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyLion',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyFox',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyPanda',
  'https://api.dicebear.com/7.x/bottts/svg?seed=EnjoyCat',
];

const formatJoinDate = (dateStr?: string) => {
  if (!dateStr) return 'Đã tham gia Tháng Bảy 2026';
  try {
    const d = new Date(dateStr);
    const months = [
      'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
      'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
    ];
    return `Đã tham gia ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return 'Đã tham gia Tháng Bảy 2026';
  }
};

export const ProfilePage: React.FC = () => {
  const { user, logout, setAuth, accessToken } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form & Modal states
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rankData, setRankData] = useState<any>(null);
  const [activeFriendTab, setActiveFriendTab] = useState<'following' | 'followers'>('following');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setErrorMessage(null);
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
      setUsername(data.username || '');
      setBirthday(data.birthday || '');
      setAvatarUrl(data.avatarUrl || AVATAR_PRESETS[0]);

      // Tải dữ liệu rank thật từ API
      try {
        const lbRes = await apiClient.get<any>('/api/leaderboard/current', {
          params: {
            userId: data.id || user?.id,
            username: data.username || user?.username,
          },
        });
        setRankData(lbRes);
      } catch (lbErr) {
        console.warn('Chưa tải được leaderboard trên profile:', lbErr);
      }
    } catch (err: any) {
      console.warn('Không thể tải profile từ backend, fallback sang local data:', err);
      if (user) {
        setUsername(user.username || '');
        setAvatarUrl(AVATAR_PRESETS[0]);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Tên hiển thị không được để trống.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const updated = await profileApi.updateProfile({
        username: username.trim(),
        birthday: birthday || undefined,
        avatarUrl: avatarUrl || undefined,
      });

      setProfile(updated);
      setSaveSuccess(true);

      if (user && accessToken) {
        setAuth(
          {
            ...user,
            username: updated.username,
            role: updated.role,
          },
          accessToken
        );
      }

      setTimeout(() => {
        setSaveSuccess(false);
        setShowEditModal(false);
      }, 1200);
    } catch (err: any) {
      console.error('Lỗi khi lưu profile:', err);
      setErrorMessage(err.message || 'Không thể lưu thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  const isParent = profile?.role === 'ROLE_PARENT' || user?.role === 'ROLE_PARENT';
  const roleLabel = isParent
    ? 'Phụ huynh'
    : profile?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_ADMIN'
    ? 'Quản trị viên'
    : 'Học sinh';

  const userHandle = profile?.email
    ? profile.email.split('@')[0]
    : user?.username || 'user';

  const displayAvatar = avatarUrl || AVATAR_PRESETS[0];

  return (
    <div className="w-full flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT MAIN COLUMN (Hero Profile, Parents Callout, Stats, Account Settings) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* 1. Hero Profile Card */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300">
            {/* Cover Banner */}
            <div className="relative h-44 sm:h-48 w-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-400 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-300 rounded-full blur-2xl opacity-60 pointer-events-none animate-pulse" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-300 rounded-full blur-xl opacity-50 pointer-events-none" />
              <div className="absolute top-6 left-12 w-12 h-12 rounded-full border-2 border-white/30 pointer-events-none opacity-40" />

              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur text-slate-800 shadow-md flex items-center gap-1.5 hover:bg-white transition-all hover:scale-105 active:scale-95 font-semibold text-xs cursor-pointer"
                title="Chỉnh sửa thông tin hồ sơ"
              >
                <span className="material-symbols-outlined text-[18px] text-sky-600">edit</span>
                <span>Chỉnh sửa</span>
              </button>
            </div>

            {/* Profile Detail Container */}
            <div className="relative px-6 sm:px-8 pb-8 pt-0 flex flex-col">
              {/* Avatar Overlap */}
              <div className="flex justify-center -mt-16 mb-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-sky-500 shadow-lg shadow-rose-500/25 flex items-center justify-center animate-glow">
                    <div className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden relative shadow-inner">
                        <img
                          src={displayAvatar}
                          alt="Avatar"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(true)}
                    className="absolute bottom-0.5 right-0.5 w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white shadow-md shadow-rose-500/30 flex items-center justify-center hover:scale-110 active:scale-95 ring-3 ring-white transition-all cursor-pointer"
                    title="Đổi ảnh đại diện"
                  >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </button>
                </div>
              </div>

              {/* User Identification & Badges */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2.5 flex-wrap justify-center">
                  <h1 className="font-display text-2xl sm:text-3xl text-slate-900 font-extrabold tracking-tight">
                    {username || user?.username || 'Học viên ENjoy'}
                  </h1>
                  {isParent ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold text-xs tracking-wider shadow-sm uppercase">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Phụ Huynh
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs tracking-wider shadow-sm uppercase">
                      <span className="material-symbols-outlined text-[15px]">school</span>
                      Học Sinh
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                  @{userHandle} <span className="mx-1.5 text-slate-300">•</span>{' '}
                  {formatJoinDate(profile?.createAt)}
                </p>

                {/* Country and Subject Badges */}
                <div className="flex items-center gap-2.5 mt-3.5">
                  <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                    <span>🇺🇸 US</span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-200/60"
                    title="Lịch sử học tập"
                  >
                    <span className="material-symbols-outlined text-[19px]">account_balance</span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs border border-indigo-200/60"
                    title="Kỹ năng tính toán"
                  >
                    <span className="material-symbols-outlined text-[19px]">calculate</span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shadow-xs border border-rose-200/60"
                    title="Phản xạ ngôn ngữ"
                  >
                    <span className="material-symbols-outlined text-[19px]">psychology</span>
                  </div>
                </div>

                {/* Followers count row */}
                <div className="flex items-center gap-4 mt-4 font-semibold text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setActiveFriendTab('following')}
                    className="text-sky-600 hover:text-sky-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-900">0</span>
                    <span>Đang theo dõi</span>
                  </button>
                  <span className="text-slate-300 font-light">•</span>
                  <button
                    type="button"
                    onClick={() => setActiveFriendTab('followers')}
                    className="text-sky-600 hover:text-sky-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-900">0</span>
                    <span>Người theo dõi</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Parents Management Callout Banner (Dành cho Phụ Huynh) */}
          {isParent && (
            <section className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-2 border-amber-200/80 p-6 shadow-xs relative overflow-hidden transition-all duration-300">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-200/50 rounded-full blur-xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30 transform hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[34px]">family_restroom</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="inline-flex self-start">
                      <span className="font-bold text-[11px] text-amber-900 bg-amber-200/80 border border-amber-300 px-3 py-0.5 rounded-full uppercase tracking-wider mb-1 shadow-xs">
                        Dành Cho Phụ Huynh
                      </span>
                    </div>
                    <h2 className="font-display text-lg sm:text-xl text-slate-900 font-extrabold">
                      Quản Lý & Giám Sát Trẻ Em
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium max-w-md">
                      Khu vực dành riêng cho ba mẹ quản lý tài khoản và thiết lập học tập của các bé.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowParentModal(true)}
                  className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-500/30 hover:shadow-lg hover:shadow-rose-500/40 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  <span>QUẢN LÝ TRẺ EM</span>
                </button>
              </div>
            </section>
          )}

          {/* 3. Statistics (Thống kê) */}
          <section className="flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-display text-xl font-extrabold text-slate-900">
                Thống kê
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stat 1: Ngày streak */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/70 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md hover:scale-[1.01] transition-all group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-2xl font-black text-orange-600 leading-tight">
                    {rankData?.streak?.currentStreak ?? 0}
                  </span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-0.5">
                    Ngày streak
                  </span>
                </div>
              </div>

              {/* Stat 2: Tổng điểm KN */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/70 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md hover:scale-[1.01] transition-all group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-400/25 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-2xl font-black text-amber-600 leading-tight">
                    {rankData?.currentUserEntry?.weeklyXp ?? 0}
                  </span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-0.5">
                    Tổng điểm KN
                  </span>
                </div>
              </div>

              {/* Stat 3: Giải đấu hiện tại */}
              <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-200/70 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-3 hover:shadow-md hover:scale-[1.01] transition-all group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-[30px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      shield
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-2xl font-black text-indigo-700 leading-tight">
                      {rankData?.currentRank?.nameVi || 'Bạc'}
                    </span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide truncate mt-0.5">
                      Giải đấu hiện tại
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-xl bg-indigo-500 text-white font-black text-xs shrink-0 shadow-xs">
                  TUẦN 1
                </span>
              </div>

              {/* Stat 4: Số lần đạt top 3 */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md hover:scale-[1.01] transition-all group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    military_tech
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-2xl font-black text-emerald-700 leading-tight">
                    0
                  </span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide mt-0.5">
                    Số lần đạt top 3
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Account Settings & Sign Out Card */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 transition-all text-left">
            <div className="flex flex-col text-center md:text-left">
              <h2 className="font-display text-base font-extrabold text-slate-900">
                Cài đặt & Tài khoản
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Quản lý thông tin đăng nhập hoặc đăng xuất khỏi hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-center">
              <button
                type="button"
                onClick={logout}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs uppercase shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>ĐĂNG XUẤT</span>
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR (Friend Connection & Social Widget) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Friend Follower Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
            {/* Tabs */}
            <div className="grid grid-cols-2 w-full p-1.5 bg-gradient-to-r from-rose-50 to-sky-50 border border-slate-200/60 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setActiveFriendTab('following')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeFriendTab === 'following'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ĐANG THEO DÕI
              </button>
              <button
                type="button"
                onClick={() => setActiveFriendTab('followers')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeFriendTab === 'followers'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                NGƯỜI THEO DÕI
              </button>
            </div>

            {/* Illustration animal bubbles */}
            <div className="w-full bg-gradient-to-b from-sky-50/60 via-purple-50/40 to-pink-50/60 border border-indigo-100/60 rounded-2xl py-8 px-4 flex flex-col items-center justify-center shadow-xs">
              <div className="flex items-center justify-center -space-x-3 mb-2">
                <div className="w-11 h-11 rounded-full bg-amber-300 ring-4 ring-white flex items-center justify-center text-amber-900 shadow-md text-base font-bold hover:scale-110 transition-transform cursor-pointer">
                  🐣
                </div>
                <div className="w-11 h-11 rounded-full bg-purple-400 ring-4 ring-white flex items-center justify-center text-white shadow-md text-base font-bold hover:scale-110 transition-transform cursor-pointer">
                  🐱
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 ring-4 ring-white flex items-center justify-center text-white shadow-lg text-2xl font-bold z-10 hover:scale-110 transition-transform cursor-pointer">
                  🐧
                </div>
                <div className="w-11 h-11 rounded-full bg-orange-400 ring-4 ring-white flex items-center justify-center text-white shadow-md text-base font-bold hover:scale-110 transition-transform cursor-pointer">
                  🦊
                </div>
                <div className="w-11 h-11 rounded-full bg-sky-400 ring-4 ring-white flex items-center justify-center text-white shadow-md text-base font-bold hover:scale-110 transition-transform cursor-pointer">
                  🐻
                </div>
              </div>
              <p className="text-sm text-slate-700 font-medium max-w-[220px] mt-3">
                Kết nối bạn bè giúp học vui và hiệu quả hơn!
              </p>
            </div>
          </div>

          {/* Add Friends Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4 text-left">
            <h3 className="font-display text-base font-extrabold text-slate-900 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-500 text-[20px]">group_add</span>
              Thêm bạn bè
            </h3>

            <button
              type="button"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 hover:border-sky-300 hover:shadow-xs transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">search</span>
                </div>
                <span className="font-bold text-sm text-slate-800">Tìm bạn bè</span>
              </div>
              <span className="material-symbols-outlined text-sky-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all">
                chevron_right
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-100 hover:border-amber-300 hover:shadow-xs transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">mail</span>
                </div>
                <span className="font-bold text-sm text-slate-800">Mời bạn bè</span>
              </div>
              <span className="material-symbols-outlined text-amber-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all">
                chevron_right
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL CHỈNH SỬA THÔNG TIN CÁ NHÂN */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 animate-in zoom-in-95 shadow-2xl relative text-left border border-slate-200">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
              </div>
              <div>
                <h3 className="text-lg font-display font-extrabold text-slate-900 uppercase">
                  Chỉnh Sửa Hồ Sơ
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Cập nhật tên hiển thị và ngày sinh của bạn
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600">
                {errorMessage}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Cập nhật thông tin thành công!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-extrabold text-slate-700 uppercase">
                  Tên hiển thị / Biệt danh
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:border-sky-500 focus:bg-white outline-none transition-all"
                    required
                  />
                  <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-3.5">
                    person
                  </span>
                </div>
              </div>

              {/* Birthday Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-extrabold text-slate-700 uppercase">
                  Ngày sinh
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:border-sky-500 focus:bg-white outline-none transition-all"
                  />
                  <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-3.5">
                    calendar_today
                  </span>
                </div>
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-extrabold text-slate-700 uppercase">
                  Địa chỉ Email (Đăng nhập)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                  />
                  <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-3.5">
                    mail
                  </span>
                </div>
              </div>

              {/* Role (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-extrabold text-slate-700 uppercase">
                  Loại tài khoản
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={roleLabel}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                  <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-3.5">
                    verified_user
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  HỦY
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      <span>ĐANG LƯU...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>LƯU THAY ĐỔI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỌN ẢNH ĐẠI DIỆN */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 animate-in zoom-in-95 shadow-2xl border border-slate-200 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-display font-extrabold text-slate-900 uppercase">
                Chọn Ảnh Đại Diện
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Chọn linh vật robot hoạt hình bạn yêu thích nhất nhé!
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(preset);
                    setShowAvatarPicker(false);
                  }}
                  className={`p-2.5 rounded-2xl border-2 transition-all hover:scale-105 cursor-pointer ${
                    avatarUrl === preset
                      ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-300'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={preset}
                    alt={`Avatar ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAvatarPicker(false)}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer uppercase"
            >
              ĐÓNG
            </button>
          </div>
        </div>
      )}

      {/* MODAL QUẢN LÝ TRẺ EM CỦA PHỤ HUYNH */}
      <FamilyManagementModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
        isParent={isParent}
        userEmail={profile?.email || user?.email}
      />
    </div>
  );
};
