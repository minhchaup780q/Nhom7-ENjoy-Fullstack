import React, { useState, useEffect } from 'react';
import { RankShieldBar } from './RankShieldBar';
import { LeaderboardItem } from './LeaderboardItem';
import { PromotionDivider } from './PromotionDivider';
import type { LeaderboardResponse, LeaderboardUser, RankTierType } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { apiClient } from '../../../services/apiClient';

// Dữ liệu mẫu chuẩn ảnh Duolingo của người dùng
const INITIAL_MOCK_DATA: LeaderboardResponse = {
  tournament: {
    id: 1,
    seasonCode: '2026_W42',
    daysRemaining: 6,
    endDate: '2026-10-25T23:59:59',
  },
  currentRank: {
    tier: 'SILVER',
    nameVi: 'Bạc',
    level: 2,
    color: '#c0c0c0',
  },
  promotionThreshold: 12,
  topUsers: [
    { rank: 1, userId: 101, username: 'tripp', weeklyXp: 50 },
    { rank: 2, userId: 102, username: 'villeda', weeklyXp: 20 },
    { rank: 3, userId: 103, username: 'やまさきひとみ', weeklyXp: 20 },
    { rank: 4, userId: 104, username: 'huyền vũ', weeklyXp: 16 },
    { rank: 5, userId: 105, username: 'Low HC', weeklyXp: 15 },
    { rank: 6, userId: 106, username: 'Chi E', weeklyXp: 14 },
    { rank: 7, userId: 107, username: 'Aayan Kumthekar', weeklyXp: 14 },
    { rank: 8, userId: 88, username: 'Tá ka bần', weeklyXp: 13, isCurrentUser: true },
    { rank: 9, userId: 109, username: 'Marcel', weeklyXp: 10 },
    { rank: 10, userId: 110, username: 'HAMID YT', weeklyXp: 10 },
    { rank: 11, userId: 111, username: 'min', weeklyXp: 9 },
    { rank: 12, userId: 112, username: 'mrc', weeklyXp: 6 },
    { rank: 13, userId: 113, username: '夏凛森林', weeklyXp: 5 },
    { rank: 14, userId: 114, username: 'Thảo Ngọc', weeklyXp: 5 },
    { rank: 15, userId: 115, username: 'Bé Na', weeklyXp: 3 },
  ],
  currentUserEntry: {
    rank: 8,
    userId: 88,
    username: 'Tá ka bần',
    weeklyXp: 13,
    isPromoting: true,
  },
};

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<LeaderboardResponse>(INITIAL_MOCK_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<LeaderboardResponse>('/api/leaderboard/current');
      if (res && res.topUsers) {
        setData(res);
      }
    } catch (err) {
      console.warn("Chưa kết nối API leaderboard hoặc dùng mock data ban đầu:", err);
      // Giữ mock data hiển thị chuẩn giao diện
    } finally {
      setLoading(false);
    }
  };

  const currentTier: RankTierType = data.currentRank.tier;
  const currentRankName = data.currentRank.nameVi;
  const daysRemaining = data.tournament.daysRemaining;

  // Tách nhóm: Top 12 thăng hạng và nhóm còn lại
  const promotionUsers = data.topUsers.filter((u) => u.rank <= 12);
  const demotionUsers = data.topUsers.filter((u) => u.rank > 12);

  // Kiểm tra xem current user có trong top 15 không
  const isUserInTop15 = data.topUsers.some(
    (u) => u.isCurrentUser || (user?.username && u.username === user.username)
  );

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col items-center max-w-2xl mx-auto w-full select-none gap-6 pb-24">
      {/* 1. TOP RANK SHIELD BAR (DẢI HUY HIỆU RANK) */}
      <RankShieldBar currentTier={currentTier} />

      {/* 2. HEADER TIÊU ĐỀ GIẢI ĐẤU */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-[#2b2b2b] tracking-tight">
          Giải đấu {currentRankName}
        </h1>
        <p className="text-sm font-bold text-text-muted">
          Bạn sẽ được thăng hạng giải đấu khi lọt top {data.promotionThreshold}
        </p>
        <div className="text-sm font-display font-black text-[#eab308] pt-1">
          {daysRemaining} ngày
        </div>
      </div>

      {/* 3. BẢNG XẾP HẠNG TOP 15 */}
      <div className="w-full bg-white border-2 border-border-main rounded-3xl p-3 sm:p-4 shadow-sm divide-y divide-border-main/40">
        {/* Nhóm thăng hạng (Hạng 1 đến 12) */}
        <div className="space-y-1">
          {promotionUsers.map((u) => {
            const isMe = Boolean(u.isCurrentUser || (user?.username && u.username === user.username));
            return (
              <LeaderboardItem
                key={u.userId}
                user={u}
                isCurrentUser={isMe}
              />
            );
          })}
        </div>

        {/* Vạch ngăn: NHÓM THĂNG HẠNG */}
        <div className="pt-2">
          <PromotionDivider type="promotion" />
        </div>

        {/* Vạch ngăn: NHÓM RỚT HẠNG */}
        {demotionUsers.length > 0 && (
          <div className="pt-1">
            <PromotionDivider type="demotion" />
          </div>
        )}

        {/* Nhóm rớt hạng (Hạng 13 trở đi) */}
        {demotionUsers.length > 0 && (
          <div className="space-y-1 pt-2">
            {demotionUsers.map((u) => {
              const isMe = Boolean(u.isCurrentUser || (user?.username && u.username === user.username));
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
      </div>

      {/* 4. STICKY USER BAR Ở ĐÁY NẾU USER NGOÀI TOP 15 */}
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
