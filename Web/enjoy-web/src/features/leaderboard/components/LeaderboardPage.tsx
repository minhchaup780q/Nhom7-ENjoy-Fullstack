import React, { useState, useEffect } from 'react';
import { RankShieldBar } from './RankShieldBar';
import { LeaderboardItem } from './LeaderboardItem';
import type { LeaderboardResponse, RankTierType, LeaderboardUser } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { apiClient } from '../../../services/apiClient';
import { profileApi } from '../../profile/services/profileApi';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy thông tin profile hiện tại để đảm bảo avatarUrl và username mới nhất
      let currentAvatar = (user as any)?.avatarUrl;
      let currentUsername = user?.username;
      try {
        const prof = await profileApi.getProfile();
        if (prof) {
          if (prof.avatarUrl) currentAvatar = prof.avatarUrl;
          if (prof.username) currentUsername = prof.username;
        }
      } catch {
        // Fallback an toàn nếu chưa đăng nhập hoặc mạng lỗi
      }

      const res = await apiClient.get<LeaderboardResponse>('/api/leaderboard/current', {
        params: {
          userId: user?.id,
          username: currentUsername,
          avatarUrl: currentAvatar,
        },
      });
      setData(res);
    } catch (err: any) {
      console.error('Lỗi khi tải bảng xếp hạng:', err);
      setError('Không thể tải bảng xếp hạng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // 1. SKELETON LOADING
  if (loading && !data) {
    return (
      <div className="w-full flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse select-none space-y-8">
        <div className="h-44 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto items-end pt-8">
          <div className="h-40 bg-slate-200 rounded-t-3xl" />
          <div className="h-56 bg-slate-200 rounded-t-3xl" />
          <div className="h-36 bg-slate-200 rounded-t-3xl" />
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // 2. ERROR DISPLAY
  if (error && !data) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-4 select-none">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-[32px]">trophy</span>
        </div>
        <h3 className="text-xl font-display font-extrabold text-slate-800">
          Bảng xếp hạng đang cập nhật
        </h3>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          {error}
        </p>
        <button
          onClick={fetchLeaderboard}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          THỬ LẠI
        </button>
      </div>
    );
  }

  if (!data) return null;

  const currentTier: RankTierType = data.currentRank?.tier || 'BRONZE';
  const currentRankName = data.currentRank?.nameVi || 'Bạc';
  const nextRankName = currentTier === 'BRONZE' ? 'Bạc' : currentTier === 'SILVER' ? 'Vàng' : currentTier === 'GOLD' ? 'Bạch kim' : 'Kim cương';
  const daysRemaining = data.tournament?.daysRemaining ?? 7;
  const topUsers = data.topUsers || [];

  // Tách riêng Top 1, Top 2, Top 3 cho bục vinh danh
  const top1 = topUsers.find((u) => u.rank === 1);
  const top2 = topUsers.find((u) => u.rank === 2);
  const top3 = topUsers.find((u) => u.rank === 3);

  // Danh sách từ hạng 4 trở đi
  const remainingUsers = topUsers.filter((u) => u.rank > 3);
  const promotionUsers = remainingUsers.filter((u) => u.rank <= (data.promotionThreshold || 12));
  const holdingUsers = remainingUsers.filter((u) => u.rank > (data.promotionThreshold || 12));

  // Kiểm tra user có nằm trong top hiển thị không
  const isUserInTopList = topUsers.some(
    (u) =>
      u.isCurrentUser ||
      (user?.id && u.userId === user.id) ||
      (user?.username && u.username === user.username)
  );

  const getAvatar = (u?: LeaderboardUser) => {
    if (!u) return '';
    if (u.avatarUrl && u.avatarUrl.trim() !== '') return u.avatarUrl;
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.username || `User_${u.userId}`)}`;
  };

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* 1. HEADER / TIER BANNER */}
      <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 mb-8 overflow-hidden">
        {/* Shield Progression Bar */}
        <RankShieldBar currentTier={currentTier} />

        {/* League Title & Badges */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 mb-2 flex-wrap justify-center">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
              Giải đấu {currentRankName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300 text-amber-700 font-bold text-xs shadow-xs">
              <span className="material-symbols-outlined text-[15px] animate-pulse">timer</span>
              Còn {daysRemaining} ngày kết thúc
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg">
            Top <span className="font-bold text-emerald-600">12</span> sẽ được thăng hạng lên{' '}
            <span className="font-black text-amber-600">Giải đấu {nextRankName}!</span> Cùng nỗ lực bứt phá bảng vàng tuần này!
          </p>
        </div>
      </div>

      {/* 2. BỤC VINH DANH TOP 1, 2, 3 PODIUM */}
      {topUsers.length >= 1 && (
        <section className="mb-10 pt-2">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-3xl mx-auto px-1">
            {/* TOP 2 (BẠC) */}
            <div className="flex flex-col items-center order-1 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 text-slate-700 font-black text-xs sm:text-sm flex items-center justify-center shadow-xs border-2 border-white mb-2">
                2
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-center p-2.5 sm:p-3 relative mb-2.5">
                {top2 ? (
                  <img
                    src={getAvatar(top2)}
                    alt={top2.username}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[36px] text-slate-300">person</span>
                )}
              </div>
              <div className="text-center px-1 mb-2">
                <h3
                  className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate max-w-[95px] sm:max-w-[150px]"
                  title={top2?.username || 'Chưa có'}
                >
                  {top2?.username || '---'}
                </h3>
                <div className="inline-flex items-center gap-1 mt-1 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-bold">⟐</span>
                  <span className="font-display font-extrabold text-slate-700 text-xs">
                    {top2?.weeklyXp ?? 0} KN
                  </span>
                </div>
                <div className="mt-1">
                  <span className="inline-block text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                    Top 2 Thăng hạng
                  </span>
                </div>
              </div>
              {/* 3D Silver Podium Block */}
              <div className="w-full h-28 sm:h-40 rounded-t-3xl bg-gradient-to-b from-slate-200/80 via-slate-100 to-slate-200/60 shadow-md flex flex-col items-center justify-start pt-4 relative">
                <span className="font-display font-black text-4xl sm:text-6xl text-slate-300/80 select-none">2</span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">HẠNG NHÌ</span>
              </div>
            </div>

            {/* TOP 1 (QUÁN QUÂN VÀNG) */}
            <div className="flex flex-col items-center order-2 relative z-20 group">
              <div className="absolute -top-12 inset-x-0 w-36 sm:w-44 h-36 sm:h-44 mx-auto bg-amber-400/20 blur-2xl rounded-full pointer-events-none animate-glow" />
              <div className="animate-float z-10 flex flex-col items-center mb-1">
                <span
                  className="material-symbols-outlined text-[32px] sm:text-[36px] text-amber-500 drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  emoji_events
                </span>
              </div>
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-4 border-amber-400 shadow-xl shadow-amber-400/25 flex items-center justify-center p-2.5 sm:p-3 relative mb-2.5">
                {top1 ? (
                  <img
                    src={getAvatar(top1)}
                    alt={top1.username}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[44px] text-amber-500">person</span>
                )}
                {/* Badge 1 at bottom center */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md border-2 border-white">
                  1
                </div>
              </div>
              <div className="text-center px-1 mb-2">
                <div className="inline-flex items-center gap-1 max-w-[120px] sm:max-w-[180px] justify-center">
                  <h2
                    className="font-display font-black text-slate-900 text-xs sm:text-base leading-snug truncate"
                    title={top1?.username || 'Chưa có'}
                  >
                    {top1?.username || '---'}
                  </h2>
                  <span
                    className="material-symbols-outlined text-amber-500 text-[16px] shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-white font-display font-black text-xs sm:text-sm px-3 py-0.5 rounded-full shadow-xs">
                    <span>⟐</span>
                    <span>{top1?.weeklyXp ?? 0} KN</span>
                  </span>
                </div>
                <div className="mt-1">
                  <span className="inline-block text-[10px] sm:text-[11px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
                    ⚡ Thăng hạng {nextRankName}
                  </span>
                </div>
              </div>
              {/* 3D Gold Podium Block */}
              <div className="w-full h-36 sm:h-52 rounded-t-3xl bg-gradient-to-b from-amber-300 via-amber-200 to-amber-300/80 shadow-2xl shadow-amber-400/35 flex flex-col items-center justify-start pt-4 relative">
                <span className="font-display font-black text-5xl sm:text-7xl text-amber-500/80 select-none drop-shadow-sm">1</span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-800 mt-1">QUÁN QUÂN</span>
              </div>
            </div>

            {/* TOP 3 (ĐỒNG) */}
            <div className="flex flex-col items-center order-3 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs border-2 border-white mb-2">
                3
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl border-2 border-amber-500/90 shadow-sm flex items-center justify-center p-2.5 sm:p-3 relative mb-2.5">
                {top3 ? (
                  <img
                    src={getAvatar(top3)}
                    alt={top3.username}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[36px] text-amber-600">person</span>
                )}
                {/* Green online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="text-center px-1 mb-2">
                <h3
                  className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate max-w-[95px] sm:max-w-[150px]"
                  title={top3?.username || 'Chưa có'}
                >
                  {top3?.username || '---'}
                </h3>
                <div className="inline-flex items-center gap-1 mt-1 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <span className="text-[11px] text-amber-700 font-bold">⟐</span>
                  <span className="font-display font-extrabold text-amber-800 text-xs">
                    {top3?.weeklyXp ?? 0} KN
                  </span>
                </div>
                <div className="mt-1">
                  <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Top 3 Thăng hạng
                  </span>
                </div>
              </div>
              {/* 3D Bronze Podium Block */}
              <div className="w-full h-24 sm:h-36 rounded-t-3xl bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100 shadow-md flex flex-col items-center justify-start pt-4 relative">
                <span className="font-display font-black text-4xl sm:text-6xl text-amber-700/30 select-none">3</span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-800/70 mt-1">HẠNG BA</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. DANH SÁCH TỪ HẠNG 4 TRỞ ĐI */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden mb-12">
        {/* Header Vùng thăng hạng Top 4 - 12 */}
        <div className="bg-emerald-50/70 px-6 py-3.5 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[16px] font-bold">keyboard_double_arrow_up</span>
            </span>
            <span className="font-display font-black text-emerald-800 text-xs sm:text-sm uppercase tracking-wider">
              VÙNG THĂNG HẠNG GIẢI {nextRankName.toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
            Giữ vị trí để lên hạng!
          </span>
        </div>

        {/* Rows: Ranks 4 to 12 */}
        <div className="divide-y divide-slate-100">
          {promotionUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Chưa có người dùng ở vị trí này. Hãy học bài để lọt vào Top thăng hạng!
            </div>
          ) : (
            promotionUsers.map((u) => {
              const isMe = Boolean(
                u.isCurrentUser ||
                (user?.id && u.userId === user.id) ||
                (user?.username && u.username === user.username)
              );
              return <LeaderboardItem key={u.userId} user={u} isCurrentUser={isMe} />;
            })
          )}
        </div>

        {/* Header Vùng giữ hạng (Hạng 13 trở đi) */}
        {holdingUsers.length > 0 && (
          <>
            <div className="bg-slate-50/70 px-6 py-3 border-y border-dashed border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>—</span>
                <span>VÙNG GIỮ HẠNG (TOP 13 - 25)</span>
              </div>
              <span className="text-xs font-medium text-slate-400 hidden sm:inline-block">
                Học bài để lọt vào Top 12
              </span>
            </div>

            <div className="divide-y divide-slate-100 bg-slate-50/30">
              {holdingUsers.map((u) => {
                const isMe = Boolean(
                  u.isCurrentUser ||
                  (user?.id && u.userId === user.id) ||
                  (user?.username && u.username === user.username)
                );
                return <LeaderboardItem key={u.userId} user={u} isCurrentUser={isMe} />;
              })}
            </div>
          </>
        )}
      </section>

      {/* 4. THANH VỊ TRÍ CỦA BẠN NẾU NGOÀI TOP */}
      {!isUserInTopList && data.currentUserEntry && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-30">
          <div className="bg-sky-600 text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between font-display font-bold border border-sky-400">
            <div className="flex items-center gap-3">
              <span className="w-8 text-center text-white text-base font-black">
                #{data.currentUserEntry.rank}
              </span>
              <span className="text-sm">
                {data.currentUserEntry.username} (Vị trí hiện tại của bạn)
              </span>
            </div>
            <span className="text-sm font-black">
              {data.currentUserEntry.weeklyXp} KN
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
