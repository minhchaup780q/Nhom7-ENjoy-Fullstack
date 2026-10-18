export type RankTierType = 
  | 'BRONZE' 
  | 'SILVER' 
  | 'GOLD' 
  | 'SAPPHIRE' 
  | 'RUBY' 
  | 'EMERALD' 
  | 'AMETHYST' 
  | 'PEARL' 
  | 'OBSIDIAN' 
  | 'DIAMOND';

export interface RankInfo {
  tier: RankTierType;
  level: number;
  nameVi: string;
  nameEn: string;
  color: string;
  iconBg: string;
}

export interface LeaderboardUser {
  rank: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  weeklyXp: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardResponse {
  tournament: {
    id: number;
    seasonCode: string;
    daysRemaining: number;
    endDate: string;
  };
  currentRank: {
    tier: RankTierType;
    nameVi: string;
    level: number;
    color: string;
  };
  promotionThreshold: number; // 12
  topUsers: LeaderboardUser[];
  currentUserEntry?: {
    rank: number;
    userId: number;
    username: string;
    avatarUrl?: string;
    weeklyXp: number;
    isPromoting: boolean;
  };
}

export const RANK_TIERS_CONFIG: RankInfo[] = [
  { tier: 'BRONZE', level: 1, nameVi: 'Đồng', nameEn: 'Bronze', color: '#cd7f32', iconBg: 'bg-[#cd7f32]' },
  { tier: 'SILVER', level: 2, nameVi: 'Bạc', nameEn: 'Silver', color: '#c0c0c0', iconBg: 'bg-[#c0c0c0]' },
  { tier: 'GOLD', level: 3, nameVi: 'Vàng', nameEn: 'Gold', color: '#ffd700', iconBg: 'bg-[#ffd700]' },
  { tier: 'SAPPHIRE', level: 4, nameVi: 'Lam Ngọc', nameEn: 'Sapphire', color: '#0f52ba', iconBg: 'bg-[#0f52ba]' },
  { tier: 'RUBY', level: 5, nameVi: 'Hồng Ngọc', nameEn: 'Ruby', color: '#e0115f', iconBg: 'bg-[#e0115f]' },
  { tier: 'EMERALD', level: 6, nameVi: 'Ngọc Lục Bảo', nameEn: 'Emerald', color: '#50c878', iconBg: 'bg-[#50c878]' },
  { tier: 'AMETHYST', level: 7, nameVi: 'Thạch Anh Tím', nameEn: 'Amethyst', color: '#9966cc', iconBg: 'bg-[#9966cc]' },
  { tier: 'PEARL', level: 8, nameVi: 'Ngọc Trai', nameEn: 'Pearl', color: '#eae0c8', iconBg: 'bg-[#eae0c8]' },
  { tier: 'OBSIDIAN', level: 9, nameVi: 'Hắc Diệu Thạch', nameEn: 'Obsidian', color: '#3b3c36', iconBg: 'bg-[#3b3c36]' },
  { tier: 'DIAMOND', level: 10, nameVi: 'Kim Cương', nameEn: 'Diamond', color: '#00d2ff', iconBg: 'bg-[#00d2ff]' },
];
