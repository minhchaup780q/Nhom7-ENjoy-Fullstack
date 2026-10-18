import React, { useState, useEffect } from 'react';
import { RankShieldBar } from './RankShieldBar';
import { LeaderboardItem } from './LeaderboardItem';
import { PromotionDivider } from './PromotionDivider';
import type { LeaderboardResponse, RankTierType } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { apiClient } from '../../../services/apiClient';
import { ArrowPathIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Button3D } from '../../../components/ui/Button3D';

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
      const res = await apiClient.get<LeaderboardResponse>('/api/leaderboard/current', {
        params: {
          userId: user?.id,
          username: user?.username,
        },
      });
      setData(res);
    } catch (err: any) {
      console.error("Lỗi khi tải bảng xếp hạng:", err);
      setError("Không thể tải bảng xếp hạng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 1. GIAO DIỆN KHI ĐANG TẢI DỮ LIỆU THẬT (SKELETON LOADING)
  if (loading && !data) {
    return (
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center max-w-2xl mx-auto w-full select-none gap-6 animate-pulse">
        <div className="w-64 h-16 bg-gray-200 rounded-3xl" />
        <div className="space-y-2 text-center w-full flex flex-col items-center">
          <div className="w-48 h-8 bg-gray-200 rounded-2xl" />
          <div className="w-72 h-4 bg-gray-100 rounded-xl" />
          <div className="w-20 h-4 bg-gray-100 rounded-xl" />
        </div>
        <div className="w-full bg-white border-2 border-border-main rounded-3xl p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="w-32 h-4 bg-gray-200 rounded-xl" />
              </div>
              <div className="w-14 h-4 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. GIAO DIỆN KHI CÓ LỖI TẢI
  if (error && !data) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
          <TrophyIcon className="w-8 h-8 stroke-[2]" />
        </div>
        <h3 className="text-xl font-display font-black text-text-main">
          Bảng xếp hạng đang cập nhật
        </h3>
        <p className="text-xs font-semibold text-text-muted leading-relaxed">
          {error}
        </p>
        <Button3D variant="blue" size="sm" onClick={fetchLeaderboard} className="flex items-center gap-2">
          <ArrowPathIcon className="w-4 h-4 stroke-[2.5]" />
          THỬ LẠI
        </Button3D>
      </div>
    );
  }

  if (!data) return null;

  const currentTier: RankTierType = data.currentRank?.tier || 'BRONZE';
  const currentRankName = data.currentRank?.nameVi || 'Đồng';
  const daysRemaining = data.tournament?.daysRemaining ?? 6;
  const topUsers = data.topUsers || [];

  // Phân chia danh sách: Nhóm thăng hạng (Top 12) và nhóm rớt hạng (> 12)
  const promotionUsers = topUsers.filter((u) => u.rank <= (data.promotionThreshold || 12));
  const demotionUsers = topUsers.filter((u) => u.rank > (data.promotionThreshold || 12));

  // Kiểm tra xem current user có nằm trong Top 15 không
  const isUserInTop15 = topUsers.some(
    (u) => u.isCurrentUser || (user?.id && u.userId === user.id) || (user?.username && u.username === user.username)
  );

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col items-center max-w-2xl mx-auto w-full select-none gap-6 pb-24">
      {/* 1. TOP RANK SHIELD BAR (DẢI HUY HIỆU RANK THEO DỮ LIỆU THẬT) */}
      <RankShieldBar currentTier={currentTier} />

      {/* 2. HEADER TIÊU ĐỀ GIẢI ĐẤU */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-[#2b2b2b] tracking-tight">
          Giải đấu {currentRankName}
        </h1>
        <p className="text-sm font-bold text-text-muted">
          Bạn sẽ được thăng hạng giải đấu khi lọt top {data.promotionThreshold || 12}
        </p>
        <div className="text-sm font-display font-black text-[#eab308] pt-1">
          {daysRemaining} ngày
        </div>
      </div>

      {/* 3. BẢNG XẾP HẠNG TOP 15 TỪ CƠ SỞ DỮ LIỆU */}
      <div className="w-full bg-white border-2 border-border-main rounded-3xl p-3 sm:p-4 shadow-sm divide-y divide-border-main/40">
        {topUsers.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#f1f3f5] text-[#9ca3af] flex items-center justify-center mx-auto">
              <TrophyIcon className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-text-muted">
              Chưa có ai trong giải đấu {currentRankName} tuần này.
            </p>
            <p className="text-xs text-text-muted">
              Hãy hoàn thành bài học để trở thành người dẫn đầu giải đấu!
            </p>
          </div>
        ) : (
          <>
            {/* Nhóm thăng hạng (Hạng 1 đến 12) */}
            <div className="space-y-1">
              {promotionUsers.map((u) => {
                const isMe = Boolean(
                  u.isCurrentUser ||
                  (user?.id && u.userId === user.id) ||
                  (user?.username && u.username === user.username)
                );
                return (
                  <LeaderboardItem
                    key={u.userId}
                    user={u}
                    isCurrentUser={isMe}
                  />
                );
              })}
            </div>

            {/* Vạch ngăn: NHÓM THĂNG HẠNG (Chỉ hiện khi có người thuộc nhóm sau hoặc đủ 12 người) */}
            {(demotionUsers.length > 0 || promotionUsers.length >= (data.promotionThreshold || 12)) && (
              <div className="pt-2">
                <PromotionDivider type="promotion" />
              </div>
            )}

            {/* Vạch ngăn: NHÓM RỚT HẠNG (Chỉ hiện khi có người trên hạng 12) */}
            {demotionUsers.length > 0 && (
              <div className="pt-1">
                <PromotionDivider type="demotion" />
              </div>
            )}

            {/* Nhóm rớt hạng (Hạng 13 trở đi) */}
            {demotionUsers.length > 0 && (
              <div className="space-y-1 pt-2">
                {demotionUsers.map((u) => {
                  const isMe = Boolean(
                    u.isCurrentUser ||
                    (user?.id && u.userId === user.id) ||
                    (user?.username && u.username === user.username)
                  );
                  return (
                    <LeaderboardItem
                      key={u.userId}
                      user={u}
                      isCurrentUser={isMe}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. THANH CỐ ĐỊNH Ở ĐÁY NẾU USER ĐANG NẰM NGOÀI TOP 15 */}
      {!isUserInTop15 && data.currentUserEntry && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-30 animate-fade-in-up">
          <div className="bg-[#d7ffb8] border-2 border-[#a3e635] rounded-2xl p-3 shadow-xl flex items-center justify-between font-display font-black">
            <div className="flex items-center gap-3">
              <span className="w-8 text-center text-[#14532d] text-base">
                #{data.currentUserEntry.rank}
              </span>
              <span className="text-[#14532d] text-sm">
                {data.currentUserEntry.username} (Vị trí của bạn)
              </span>
            </div>
            <span className="text-[#14532d] text-sm">
              {data.currentUserEntry.weeklyXp} KN
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
