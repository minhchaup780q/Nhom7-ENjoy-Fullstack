import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  CameraIcon, 
  CheckIcon, 
  ArrowRightOnRectangleIcon, 
  CheckCircleIcon, 
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { profileApi, type UserProfile } from '../services/profileApi';

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

export const ProfilePage: React.FC = () => {
  const { user, logout, setAuth, accessToken } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Vai trò tài khoản hiện tại từ database
  const isParent = profile?.role === 'ROLE_PARENT' || user?.role === 'ROLE_PARENT';
  const roleLabel = (profile?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_ADMIN')
    ? 'Quản trị viên'
    : isParent
      ? 'Phụ huynh'
      : 'Học sinh';

  // Helper tính tuổi
  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return null;
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Tên hiển thị không được để trống.');
      return;
    }

    if (birthday) {
      const age = calculateAge(birthday);
      if (age !== null && age < 0) {
        setErrorMessage('Ngày sinh không hợp lệ (không thể ở tương lai).');
        return;
      }
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

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Lỗi khi lưu profile:", err);
      setErrorMessage(err.message || 'Không thể lưu thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <ArrowPathIcon className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-sm font-display font-black text-text-muted">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col max-w-4xl mx-auto w-full select-none gap-6">
      {/* Top Header Card */}
      <div className="bg-white border-4 border-border-main rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-border-main bg-primary-soft/30 flex items-center justify-center p-2 shadow-inner">
            <img
              src={avatarUrl || AVATAR_PRESETS[0]}
              alt="Avatar"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAvatarPicker(true)}
            className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl border-2 border-white shadow-md hover:scale-110 transition-all cursor-pointer"
            title="Đổi ảnh đại diện"
          >
            <CameraIcon className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* User Info Overview */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#2b2b2b]">
              {username || user?.username || 'Người Dùng Enjoy'}
            </h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-display font-black border ${
              isParent 
                ? 'bg-amber-50 text-amber-700 border-amber-300' 
                : 'bg-primary-soft text-primary border-primary/30'
            }`}>
              {isParent ? 'Phụ Huynh' : 'Học Sinh'}
            </span>
          </div>

          <p className="text-xs font-semibold text-text-muted flex items-center justify-center sm:justify-start gap-1.5">
            <EnvelopeIcon className="w-4 h-4" />
            {profile?.email || user?.email}
          </p>

          <p className="text-[11px] font-medium text-text-muted">
            Tài khoản Enjoy ID: #{profile?.id || user?.id || '1'}
          </p>
        </div>

        {/* Mascot */}
        <div className="hidden md:block shrink-0">
          <Mascot
            expression="happy"
            speechBubbleText={isParent ? "Chào ba mẹ! Chúc gia đình có buổi học vui vẻ!" : "Chào bé! Chúc bé học thật giỏi nha!"}
            size={80}
          />
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white border-4 border-border-main rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-border-main pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
            <UserIcon className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-display font-black text-[#2b2b2b] uppercase">
              Thông Tin Cá Nhân
            </h2>
            <p className="text-xs font-semibold text-text-muted">
              Cập nhật thông tin hiển thị và ngày sinh của bạn
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
            Cập nhật thông tin cá nhân thành công!
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-display font-black text-[#2b2b2b] uppercase">
                Tên hiển thị / Biệt danh
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 border-border-main rounded-2xl text-sm font-semibold text-[#2b2b2b] focus:border-primary focus:bg-white outline-none transition-all"
                  required
                />
                <UserIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Birthday Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-display font-black text-[#2b2b2b] uppercase">
                Ngày sinh
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={birthday}
                  min="1920-01-01"
                  max={todayStr}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 border-border-main rounded-2xl text-sm font-semibold text-[#2b2b2b] focus:border-primary focus:bg-white outline-none transition-all"
                />
                <CalendarIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-display font-black text-[#2b2b2b] uppercase">
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
              <label className="text-xs font-display font-black text-[#2b2b2b] uppercase">
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
          </div>

          <div className="flex justify-end pt-2">
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

      {/* Account Actions Card */}
      <div className="bg-white border-4 border-border-main rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-sm font-display font-black text-[#2b2b2b] uppercase">
            Phiên Đăng Nhập
          </h3>
          <p className="text-xs font-semibold text-text-muted">
            Đăng xuất tài khoản này khỏi thiết bị của bạn
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="px-5 py-2.5 rounded-2xl border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-display font-black text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 stroke-[2.5]" />
          ĐĂNG XUẤT
        </button>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-border-main rounded-3xl p-6 max-w-md w-full space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-display font-black text-[#2b2b2b] uppercase">
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
                  className={`p-2 rounded-2xl border-4 transition-all hover:scale-105 ${
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
    </div>
  );
};
