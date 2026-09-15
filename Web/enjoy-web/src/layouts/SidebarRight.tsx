import React from 'react';
import { FireIcon, HeartIcon, SparklesIcon, BoltIcon, GiftIcon } from '@heroicons/react/24/solid';
import { Button3D } from '../components/ui/Button3D';

interface SidebarRightProps {
  streak?: number;
  gems?: number;
  hearts?: number;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  streak = 3,
  gems = 245,
  hearts = 5,
}) => {
  return (
    <aside className="w-80 p-6 space-y-6 select-none bg-white">
      {/* Stats row */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 font-display font-extrabold text-sm text-warning hover:scale-110 transition-transform cursor-pointer">
          <FireIcon className="w-6 h-6" />
          <span>{streak}</span>
        </div>
        <div className="flex items-center gap-2 font-display font-extrabold text-sm text-info hover:scale-110 transition-transform cursor-pointer">
          <SparklesIcon className="w-6 h-6" />
          <span>{gems}</span>
        </div>
        <div className="flex items-center gap-2 font-display font-extrabold text-sm text-primary hover:scale-110 transition-transform cursor-pointer">
          <HeartIcon className="w-6 h-6 animate-pulse" />
          <span>{hearts}</span>
        </div>
      </div>

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
    </aside>
  );
};
