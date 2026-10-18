import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  CameraIcon, 
  UserGroupIcon, 
  CheckIcon, 
  ArrowRightOnRectangleIcon, 
  CheckCircleIcon, 
  ArrowPathIcon,
  FaceSmileIcon,
  HeartIcon,
  PencilSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  FireIcon, 
  BoltIcon 
} from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { profileApi, type UserProfile } from '../services/profileApi';
import { FamilyManagementModal } from './FamilyManagementModal';

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

  // Form states
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
    } catch (err: any) {
      console.warn("Không thể tải profile từ backend, fallback sang local data:", err);
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
      }, 1500);
    } catch (err: any) {
      console.error("Lỗi khi lưu profile:", err);
      setErrorMessage(err.message || 'Không thể lưu thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  const isParent = profile?.role === 'ROLE_PARENT' || user?.role === 'ROLE_PARENT';
  const roleLabel = isParent 
    ? 'Phụ huynh' 
    : (profile?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_ADMIN') 
      ? 'Quản trị viên' 
      : 'Học sinh';

  const userHandle = profile?.email 
    ? profile.email.split('@')[0] 
    : (user?.username || 'user');

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col max-w-4xl mx-auto w-full select-none gap-8">
      {/* 1. TOP PROFILE HEADER (BANNER + AVATAR + EDIT BUTTON) CHUẨN DUOLINGO */}
      <div className="bg-white border-2 border-border-main rounded-3xl overflow-hidden shadow-sm">
        {/* Banner with edit button */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#e9ecef] to-[#dee2e6] relative flex items-center justify-center">
          {/* Decorative subtle patterns */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Edit Profile Button at top-right of banner */}
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-text-main rounded-2xl border-2 border-border-main shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
            title="Chỉnh sửa hồ sơ"
          >
            <PencilSquareIcon className="w-5 h-5 text-[#4b4b4b] stroke-[2]" />
          </button>

          {/* Avatar in the center of banner */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg flex items-center justify-center p-2">
              <img
                src={avatarUrl || AVATAR_PRESETS[0]}
                alt="Avatar"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(true)}
              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-2 border-white shadow-md hover:scale-110 transition-all cursor-pointer"
              title="Đổi ảnh đại diện"
            >
              <CameraIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* User Info & Social Counters */}
        <div className="p-6 md:p-8 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-text-main">
                  {username || user?.username || 'Tá ka bần'}
                </h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-display font-black border ${
                  isParent 
                    ? 'bg-amber-50 text-amber-700 border-amber-300' 
                    : 'bg-primary-soft text-primary border-primary/30'
                }`}>
                  {isParent ? 'Phụ Huynh' : 'Học Sinh'}
                </span>
              </div>

              <p className="text-sm font-semibold text-text-muted">
                {userHandle}
              </p>

              <p className="text-xs font-medium text-text-muted">
                {formatJoinDate(profile?.createAt)}
              </p>
            </div>

            {/* Badges / Languages row on the right */}
            <div className="flex items-center gap-2">
              {/* US Flag Course badge */}
              <div 
                className="w-8 h-8 rounded-lg border-2 border-border-main flex items-center justify-center bg-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                title="Tiếng Anh"
              >
                <span className="text-lg">🇺🇸</span>
              </div>
              {/* Castle / Chess badge */}
              <div 
                className="w-8 h-8 rounded-lg border-2 border-emerald-300 bg-emerald-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                title="Tháp chinh phục"
              >
                <span className="text-sm font-black">🏰</span>
              </div>
              {/* Math / Skills badge */}
              <div 
                className="w-8 h-8 rounded-lg border-2 border-sky-300 bg-sky-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                title="Kỹ năng tính toán"
              >
                <span className="text-sm font-black">➗</span>
              </div>
            </div>
          </div>

          {/* Followers count row */}
          <div className="flex items-center gap-4 text-xs font-display font-black text-[#1cb0f6] pt-1 border-t border-border-main/50">
            <button type="button" className="hover:underline cursor-pointer">
              Đang theo dõi 0
            </button>
            <span className="text-text-muted font-normal">•</span>
            <button type="button" className="hover:underline cursor-pointer">
              0 Người theo dõi
            </button>
          </div>
        </div>
      </div>

      {/* 2. MỤC DÀNH CHO PHỤ HUYNH (NẾU LÀ PARENT) */}
      {isParent && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 shadow-inner">
              <FaceSmileIcon className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-200/80 rounded-full text-[10px] font-display font-black text-amber-900 uppercase">
                <HeartIcon className="w-3.5 h-3.5" />
                DÀNH CHO PHỤ HUYNH
              </div>
              <h3 className="text-lg font-display font-black text-[#2b2b2b]">
                Quản Lý & Giám Sát Trẻ Em
              </h3>
              <p className="text-xs font-medium text-amber-900/80 max-w-md">
                Khu vực dành riêng cho ba mẹ quản lý tài khoản và thiết lập học tập của các bé.
              </p>
            </div>
          </div>

          <Button3D
            variant="pink"
            size="md"
            onClick={() => setShowParentModal(true)}
            className="flex items-center gap-2 shrink-0"
          >
            <UserGroupIcon className="w-4 h-4 stroke-[2.5]" />
            QUẢN LÝ TRẺ EM
          </Button3D>
        </div>
      )}

      {/* 3. KHU VỰC THỐNG KÊ (STATISTICS GRID 2x2 - GIỐNG ẢNH 2 CHUẨN DUOLINGO) */}
      <div className="space-y-4 text-left">
        <h2 className="text-xl font-display font-black text-text-main">
          Thống kê
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Ngày streak */}
          <div className="bg-white border-2 border-border-main rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#ff9600]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#fff5eb] text-[#ff9600] flex items-center justify-center shrink-0">
              <FireIcon className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-display font-black text-text-main leading-tight">
                1
              </div>
              <div className="text-xs font-bold text-text-muted">
                Ngày streak
              </div>
            </div>
          </div>

          {/* Card 2: Tổng điểm KN */}
          <div className="bg-white border-2 border-border-main rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#ffc800]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#fffdf0] text-[#ffc800] flex items-center justify-center shrink-0">
              <BoltIcon className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-display font-black text-text-main leading-tight">
                321
              </div>
              <div className="text-xs font-bold text-text-muted">
                Tổng điểm KN
              </div>
            </div>
          </div>

          {/* Card 3: Giải đấu hiện tại (Có tag TUẦN 1) */}
          <div className="bg-white border-2 border-border-main rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#a0a0a0] transition-colors relative">
            <div className="w-12 h-12 rounded-xl bg-[#f1f3f5] text-[#9e9e9e] flex items-center justify-center shrink-0">
              {/* Silver Shield SVG */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#c0c0c0] stroke-[#8a8a8a] stroke-[1.5]">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xl font-display font-black text-text-main leading-tight">
                  Bạc
                </span>
                <span className="px-2 py-0.5 bg-[#afafaf] text-white text-[10px] font-display font-black rounded-md tracking-wider">
                  TUẦN 1
                </span>
              </div>
              <div className="text-xs font-bold text-text-muted">
                Giải đấu hiện tại
              </div>
            </div>
          </div>

          {/* Card 4: Số lần đạt top 3 */}
          <div className="bg-white border-2 border-border-main rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#c0c0c0] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] text-[#adb5bd] flex items-center justify-center shrink-0">
              {/* Medal / Ribbon icon */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#d1d5db] stroke-[#9ca3af] stroke-[1.5]">
                <circle cx="12" cy="9" r="6" />
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-display font-black text-text-main leading-tight">
                0
              </div>
              <div className="text-xs font-bold text-text-muted">
                Số lần đạt top 3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TÀI KHOẢN & ĐĂNG XUẤT */}
      <div className="bg-white border-2 border-border-main rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-display font-black text-text-main">
            Cài đặt & Tài khoản
          </h3>
          <p className="text-xs font-semibold text-text-muted">
            Quản lý thông tin đăng nhập, ngày sinh hoặc đăng xuất khỏi hệ thống
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button3D
            variant="blue"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2"
          >
            <PencilSquareIcon className="w-4 h-4 stroke-[2.5]" />
            CHỈNH SỬA
          </Button3D>

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2.5 rounded-2xl border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-display font-black text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 stroke-[2.5]" />
            ĐĂNG XUẤT
          </button>
        </div>
      </div>

      {/* MODAL CHỈNH SỬA THÔNG TIN CÁ NHÂN */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-border-main rounded-3xl p-6 max-w-lg w-full space-y-5 animate-in zoom-in-95 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:bg-bg-light cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 border-b-2 border-border-main pb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <UserIcon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-text-main uppercase">
                  Chỉnh Sửa Hồ Sơ
                </h3>
                <p className="text-xs font-semibold text-text-muted">
                  Cập nhật tên hiển thị và ngày sinh của bạn
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl text-xs font-bold text-red-600">
                {errorMessage}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-green-50 border-2 border-green-200 rounded-2xl text-xs font-bold text-green-600 flex items-center gap-2">
                <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                Cập nhật thông tin thành công!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-black text-text-main uppercase">
                  Tên hiển thị / Biệt danh
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 border-border-main rounded-2xl text-sm font-semibold text-text-main focus:border-primary focus:bg-white outline-none transition-all"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Birthday Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-black text-text-main uppercase">
                  Ngày sinh
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 border-border-main rounded-2xl text-sm font-semibold text-text-main focus:border-primary focus:bg-white outline-none transition-all"
                  />
                  <CalendarIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-black text-text-main uppercase">
                  Địa chỉ Email (Đăng nhập)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-[#f1f3f5] border-2 border-border-main/60 rounded-2xl text-sm font-medium text-text-muted cursor-not-allowed outline-none"
                  />
                  <EnvelopeIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Role (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-black text-text-main uppercase">
                  Loại tài khoản
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={roleLabel}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-[#f1f3f5] border-2 border-border-main/60 rounded-2xl text-sm font-bold text-text-muted cursor-not-allowed outline-none"
                  />
                  <ShieldCheckIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button3D
                  type="button"
                  variant="gray"
                  size="md"
                  onClick={() => setShowEditModal(false)}
                >
                  HỦY
                </Button3D>

                <Button3D
                  type="submit"
                  variant="green"
                  size="md"
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin stroke-[2.5]" />
                      ĐANG LƯU...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4 stroke-[2.5]" />
                      LƯU THAY ĐỔI
                    </>
                  )}
                </Button3D>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-border-main rounded-3xl p-6 max-w-md w-full space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-display font-black text-text-main uppercase">
                Chọn Ảnh Đại Diện
              </h3>
              <p className="text-xs font-semibold text-text-muted">
                Chọn linh vật hoạt hình bạn yêu thích nhất nhé!
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
                  className={`p-2 rounded-2xl border-4 transition-all hover:scale-105 cursor-pointer ${
                    avatarUrl === preset 
                      ? 'border-primary bg-primary-soft ring-2 ring-primary/20' 
                      : 'border-border-main bg-[#f8f9fa]'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            <Button3D variant="gray" fullWidth size="sm" onClick={() => setShowAvatarPicker(false)}>
              ĐÓNG
            </Button3D>
          </div>
        </div>
      )}

      {/* Family Management Modal for Parent (from dev) */}
      <FamilyManagementModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
        isParent={isParent}
        userEmail={profile?.email || user?.email}
      />
    </div>
  );
};
