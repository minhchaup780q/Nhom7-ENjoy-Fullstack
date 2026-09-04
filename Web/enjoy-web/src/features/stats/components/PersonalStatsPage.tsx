import React, { useState, useEffect } from 'react';
import { learningApi, type UserStats, type DailyStudyTime, type RecentSession } from '../../learning/services/learningApi';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const DEFAULT_WEEKLY_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

const MOCK_SKILLS = {
  listening: 94,
  speaking: 88,
  vocabulary: 82,
  reaction: 96,
};

export const PersonalStatsPage: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await learningApi.getUserStats();
      const data = (res as any)?.data !== undefined ? (res as any).data : res;
      console.log("Thống kê học tập nhận được từ server:", data);
      setStats(data);
    } catch (err) {
      console.error("Lỗi khi tải thống kê học tập từ backend:", err);
      // Fallback nếu có lỗi mạng hoặc chưa login
      setStats({
        totalCompletedLessons: 0,
        weeklyStudyMinutes: 0,
        dailyStudyTime: DEFAULT_WEEKLY_DAYS.map(day => ({
          day,
          date: '',
          minutes: 0,
          targetMinutes: 20
        })),
        recentSessions: []
      });
    } finally {
      setLoading(false);
    }
  };

  const totalWeeklyMinutes = stats?.weeklyStudyMinutes ?? 0;
  const dailyData: DailyStudyTime[] = stats?.dailyStudyTime?.length 
    ? stats.dailyStudyTime 
    : DEFAULT_WEEKLY_DAYS.map(day => ({ day, date: '', minutes: 0, targetMinutes: 20 }));

  const maxMinutesInChart = Math.max(...dailyData.map(d => d.minutes), 30);
  const recentSessions: RecentSession[] = stats?.recentSessions || [];

  if (loading) {
    return (
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <ArrowPathIcon className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-display font-bold text-slate-500">Đang tải thống kê học tập...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 space-y-8 select-none">
      
      {/* 1. Header Trang */}
      <div className="border-b border-slate-200 pb-5 space-y-1">
        <span className="text-xs font-display font-bold text-[#ff5e97] uppercase tracking-wider">
          Phân tích & Tiến trình
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          THỐNG KÊ HỌC TẬP CÁ NHÂN
        </h1>
        <p className="text-sm text-slate-600">
          Theo dõi chi tiết hiệu suất học tập, thời lượng và mức độ thành thạo các kỹ năng
        </p>
      </div>

      {/* 2. Thẻ chỉ số tổng quan (Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Thẻ 1: Bài học hoàn thành */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Bài hoàn thành</span>
          <p className="text-3xl font-display font-black text-slate-800">
            {stats?.totalCompletedLessons ?? 0}
          </p>
          <p className="text-xs text-slate-400">bài học đã vượt qua</p>
        </div>

        {/* Thẻ 2: Thời lượng học tuần này */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thời lượng tuần</span>
          <p className="text-3xl font-display font-black text-slate-800">
            {totalWeeklyMinutes} <span className="text-sm font-normal text-slate-500">phút</span>
          </p>
          <p className="text-xs text-slate-400">trung bình {Math.round(totalWeeklyMinutes / 7)} phút / ngày</p>
        </div>
      </div>

      {/* 3. Biểu đồ thời gian học tập 7 ngày trong tuần */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-display font-bold text-slate-800 uppercase tracking-wide">
              Thời gian học 7 ngày qua
            </h3>
            <p className="text-xs text-slate-500">Mục tiêu hàng ngày: 20 phút</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            Tổng: {totalWeeklyMinutes} phút
          </span>
        </div>

        {/* Cột biểu đồ 7 ngày */}
        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44">
          {dailyData.map((item, idx) => {
            const heightPercent = maxMinutesInChart > 0 
              ? Math.max(item.minutes > 0 ? 8 : 2, Math.round((item.minutes / maxMinutesInChart) * 100))
              : 2;
            const isTargetReached = item.minutes >= item.targetMinutes;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold text-slate-700">
                  {item.minutes}p
                </span>

                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-28">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      item.minutes === 0
                        ? 'bg-slate-200'
                        : isTargetReached 
                          ? 'bg-[#ff5e97]' 
                          : 'bg-slate-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-500">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Đánh giá Ma trận 4 Kỹ Năng */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-sm font-display font-bold text-slate-800 uppercase tracking-wide">
            Đánh giá năng lực 4 kỹ năng
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kỹ năng 1: Nghe */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Kỹ năng Nghe (Listening)</span>
              <span className="text-slate-900 font-extrabold">{MOCK_SKILLS.listening}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full transition-all duration-500" style={{ width: `${MOCK_SKILLS.listening}%` }} />
            </div>
          </div>

          {/* Kỹ năng 2: Nói */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Kỹ năng Phát âm (Speaking)</span>
              <span className="text-slate-900 font-extrabold">{MOCK_SKILLS.speaking}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#ff5e97] h-full rounded-full transition-all duration-500" style={{ width: `${MOCK_SKILLS.speaking}%` }} />
            </div>
          </div>

          {/* Kỹ năng 3: Từ vựng */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Từ vựng & Chính tả (Vocabulary)</span>
              <span className="text-slate-900 font-extrabold">{MOCK_SKILLS.vocabulary}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full transition-all duration-500" style={{ width: `${MOCK_SKILLS.vocabulary}%` }} />
            </div>
          </div>

          {/* Kỹ năng 4: Phản xạ */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Phản xạ & Trắc nghiệm (Quiz)</span>
              <span className="text-slate-900 font-extrabold">{MOCK_SKILLS.reaction}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full transition-all duration-500" style={{ width: `${MOCK_SKILLS.reaction}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Lịch sử bài học gần đây */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-display font-bold text-slate-800 uppercase tracking-wide">
            Bài học gần đây ({recentSessions.length})
          </h3>
          <span className="text-xs text-slate-400">Các bài học đã hoàn thành</span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            Bé chưa có bài học nào được hoàn thành gần đây. Hãy vào phần <strong>HỌC</strong> để bắt đầu nhé!
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-300 transition-all"
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {session.topic}
                  </span>
                  <h4 className="font-display font-bold text-sm text-slate-800">
                    {session.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Thời gian hoàn thành: {session.completedAt} ({session.durationMinutes} phút)
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-slate-800">
                    {session.score} / 100 điểm
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 text-xs font-bold">
                    Hoàn thành
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
