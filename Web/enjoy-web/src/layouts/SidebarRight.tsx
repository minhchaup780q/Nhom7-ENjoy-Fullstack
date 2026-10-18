import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FireIcon, 
  HeartIcon, 
  BoltIcon, 
  GiftIcon, 
  MagnifyingGlassIcon, 
  EnvelopeIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/solid';
import { Button3D } from '../components/ui/Button3D';
import { StreakPopover } from '../components/ui/StreakPopover';
import { apiClient } from '../services/apiClient';
import type { StreakInfo } from '../features/leaderboard/types';

interface SidebarRightProps {
  streak?: number;
  gems?: number;
  hearts?: number;
  courseLevel?: number;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  streak = 0,
  gems = 794,
  hearts = 3,
  courseLevel = 2,
}) => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const [showStreakPopover, setShowStreakPopover] = useState(false);
  const [activeFriendTab, setActiveFriendTab] = useState<'following' | 'followers'>('following');
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await apiClient.get<StreakInfo>('/api/leaderboard/streak');
        if (res) {
          setStreakInfo(res);
        }
      } catch (e) {
        console.warn('Chưa thể lấy thông tin streak cho SidebarRight:', e);
      }
    };
    fetchStreak();
  }, [location.pathname]);

  const displayStreak = streakInfo ? streakInfo.currentStreak : streak;

  return (
    <aside className="w-80 p-5 space-y-6 select-none bg-white min-h-screen">
      {/* Top Stats Bar Header */}
      <div className="flex items-center justify-between px-1 relative">
        {/* Course / Flag Badge */}
        <div 
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-[#f1f3f5] transition-all cursor-pointer font-display font-black text-xs text-[#4b4b4b]"
          title="Khóa học tiếng Anh"
        >
          <span className="text-xl leading-none">🇺🇸</span>
          <span>{courseLevel}</span>
        </div>

        {/* Streak Flame Badge with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowStreakPopover(!showStreakPopover)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all cursor-pointer font-display font-black text-xs ${
              showStreakPopover 
                ? 'bg-[#ff9600]/15 text-[#ff9600] ring-2 ring-[#ff9600]/40' 
                : 'text-[#ff9600] hover:bg-[#ff9600]/10'
            }`}
            title="Chuỗi ngày streak"
          >
            <FireIcon className="w-5 h-5 text-[#ff9600] animate-bounce-subtle" />
            <span className="font-extrabold">{displayStreak}</span>
          </button>

          {/* Interactive Streak Popover */}
          <StreakPopover 
            streak={displayStreak} 
            weeklyStatus={streakInfo?.weeklyStatus}
            activeDayIndex={streakInfo?.activeDayIndex}
            motivationText={streakInfo?.motivationText}
            isOpen={showStreakPopover} 
            onClose={() => setShowStreakPopover(false)} 
          />
        </div>

        {/* Gems / Diamond Badge */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#1cb0f6] hover:bg-[#1cb0f6]/10 transition-all cursor-pointer font-display font-black text-xs"
          title="Đá quý (Gems)"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <polygon points="12,2 22,8.5 18,22 6,22 2,8.5" />
          </svg>
          <span className="font-extrabold">{gems}</span>
        </div>

        {/* Hearts / Trái tim Badge */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#ff4b4b] hover:bg-[#ff4b4b]/10 transition-all cursor-pointer font-display font-black text-xs"
          title="Trái tim"
        >
          <HeartIcon className="w-5 h-5 text-[#ff4b4b] animate-pulse" />
          <span className="font-extrabold">{hearts}</span>
        </div>
      </div>

      {/* GIAO DIỆN KHI Ở TRANG PROFILE: HIỂN THỊ WIDGET BẠN BÈ VÀ KẾT NỐI (GIỐNG ẢNH 2) */}
      {isProfilePage ? (
        <div className="space-y-6">
          {/* Card Bạn bè (Đang theo dõi / Người theo dõi) */}
          <div className="border-2 border-border-main rounded-3xl p-5 text-center space-y-4 shadow-sm bg-white">
            {/* Tabs */}
            <div className="flex border-b-2 border-border-main">
              <button
                type="button"
                onClick={() => setActiveFriendTab('following')}
                className={`flex-1 pb-3 text-xs font-display font-black tracking-wider transition-all cursor-pointer ${
                  activeFriendTab === 'following'
                    ? 'text-primary border-b-2 border-primary -mb-[2px]'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                ĐANG THEO DÕI
              </button>
              <button
                type="button"
                onClick={() => setActiveFriendTab('followers')}
                className={`flex-1 pb-3 text-xs font-display font-black tracking-wider transition-all cursor-pointer ${
                  activeFriendTab === 'followers'
                    ? 'text-primary border-b-2 border-primary -mb-[2px]'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                NGƯỜI THEO DÕI
              </button>
            </div>

            {/* Illustration */}
            <div className="py-2 flex justify-center">
              <div className="w-full h-28 bg-[#f7f9fa] rounded-2xl flex items-center justify-center p-2 relative overflow-hidden border border-dashed border-border-main">
                <div className="flex items-end justify-center -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffc83b] border-2 border-white flex items-center justify-center text-sm shadow-sm">
                    👦
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#a855f7] border-2 border-white flex items-center justify-center text-lg shadow-sm z-10">
                    👧
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#22c55e] border-2 border-white flex items-center justify-center text-xl shadow-md z-20">
                    🐧
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#f97316] border-2 border-white flex items-center justify-center text-lg shadow-sm z-10">
                    🦊
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#3b82f6] border-2 border-white flex items-center justify-center text-sm shadow-sm">
                    🐻
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-text-muted px-2 leading-relaxed">
              Kết nối bạn bè giúp học vui và hiệu quả hơn.
            </p>
          </div>

          {/* Card Thêm bạn bè */}
          <div className="border-2 border-border-main rounded-3xl p-5 space-y-3 shadow-sm bg-white text-left">
            <h3 className="font-display font-extrabold text-base text-text-main m-0">
              Thêm bạn bè
            </h3>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#f7f9fa] transition-colors group cursor-pointer border border-transparent hover:border-border-main"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-display font-black text-text-main">
                    Tìm bạn bè
                  </span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#f7f9fa] transition-colors group cursor-pointer border border-transparent hover:border-border-main"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-display font-black text-text-main">
                    Mời bạn bè
                  </span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN TRANG HỌC TẬP THÔNG THƯỜNG */
        <>
          {/* Super ENjoy Promo Box */}
          <div className="p-5 bg-gradient-to-br from-primary-soft to-[#fff0f3] border-2 border-primary/20 rounded-3xl space-y-4 shadow-sm text-left">
            <div className="flex items-center gap-2">
              <BoltIcon className="w-6 h-6 text-primary" />
              <h3 className="font-display font-extrabold text-base text-primary m-0">SUPER ENJOY</h3>
            </div>
            <div>
              <h4 className="font-display font-extrabold text-sm text-text-main m-0">Thử Super miễn phí!</h4>
              <p className="text-[12px] font-semibold text-text-main/70 mt-1">
                Học tập không quảng cáo và mở khóa không giới hạn số lần chinh phục huyền thoại.
              </p>
            </div>
            <Button3D variant="pink" size="sm" fullWidth className="text-[11px]">
              DÙNG THỬ 1 TUẦN MIỄN PHÍ
            </Button3D>
          </div>

          {/* Daily Quests Box */}
          <div className="border-2 border-border-main rounded-3xl p-5 text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-text-main m-0">Nhiệm vụ hàng ngày</h3>
              <span className="text-xs font-bold text-primary hover:underline cursor-pointer">XEM TẤT CẢ</span>
            </div>

            {/* Quest 1 */}
            <div className="space-y-2">
              <div className="flex items-start justify-between text-xs font-bold">
                <span className="text-text-main/80 flex items-center gap-2">
                  <BoltIcon className="w-4 h-4 text-warning" />
                  Kiếm 10 Điểm kinh nghiệm (XP)
                </span>
                <span className="text-text-muted">7/10</span>
              </div>
              <div className="w-full bg-border-main h-3 rounded-full overflow-hidden">
                <div className="bg-warning h-full rounded-full transition-all duration-300" style={{ width: '70%' }} />
              </div>
            </div>

            {/* Quest 2 */}
            <div className="space-y-2">
              <div className="flex items-start justify-between text-xs font-bold">
                <span className="text-text-main/80 flex items-center gap-2">
                  <GiftIcon className="w-4 h-4 text-primary" />
                  Hoàn thành 1 bài học giới thiệu
                </span>
                <span className="text-text-muted">0/1</span>
              </div>
              <div className="w-full bg-border-main h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
