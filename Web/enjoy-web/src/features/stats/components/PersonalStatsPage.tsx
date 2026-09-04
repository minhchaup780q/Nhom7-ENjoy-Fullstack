import React, { useState } from 'react';
import { 
  SpeakerWaveIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

// Mock Data dành riêng cho Trang Thống kê cá nhân của User
interface DailyStudyTime {
  day: string; // T2, T3, T4...
  minutes: number;
  targetMinutes: number;
}

interface SkillStats {
  listening: number;
  speaking: number;
  vocabulary: number;
  reaction: number;
}

interface MistakeWord {
  id: number;
  word: string;
  phonetic: string;
  translation: string;
  wrongAnswer: string;
  accuracyScore: number;
  status: 'MASTERED' | 'NEEDS_PRACTICE';
  lastPracticed: string;
}

interface RecentSession {
  id: number;
  title: string;
  topic: string;
  completedAt: string;
  score: number;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressText: string;
}

const MOCK_WEEKLY_ACTIVITY: DailyStudyTime[] = [
  { day: 'Thứ 2', minutes: 25, targetMinutes: 20 },
  { day: 'Thứ 3', minutes: 15, targetMinutes: 20 },
  { day: 'Thứ 4', minutes: 30, targetMinutes: 20 },
  { day: 'Thứ 5', minutes: 20, targetMinutes: 20 },
  { day: 'Thứ 6', minutes: 18, targetMinutes: 20 },
  { day: 'Thứ 7', minutes: 22, targetMinutes: 20 },
  { day: 'CN', minutes: 10, targetMinutes: 20 },
];

const MOCK_SKILLS: SkillStats = {
  listening: 94,
  speaking: 88,
  vocabulary: 82,
  reaction: 96,
};

const MOCK_MISTAKE_WORDS: MistakeWord[] = [
  {
    id: 1,
    word: "Elephant",
    phonetic: "/ˈel.ɪ.fənt/",
    translation: "Con voi",
    wrongAnswer: "e-le-fan",
    accuracyScore: 78,
    status: "NEEDS_PRACTICE",
    lastPracticed: "Hôm nay, 10:15"
  },
  {
    id: 2,
    word: "Strawberry",
    phonetic: "/ˈstrɔː.bər.i/",
    translation: "Quả dâu tây",
    wrongAnswer: "stao-be-ri",
    accuracyScore: 72,
    status: "NEEDS_PRACTICE",
    lastPracticed: "Hôm qua, 19:30"
  },
  {
    id: 3,
    word: "Butterfly",
    phonetic: "/ˈbʌt.ə.flaɪ/",
    translation: "Con bướm",
    wrongAnswer: "ba-to-flai",
    accuracyScore: 96,
    status: "MASTERED",
    lastPracticed: "2 ngày trước"
  },
  {
    id: 4,
    word: "Giraffe",
    phonetic: "/dʒɪˈrɑːf/",
    translation: "Hươu cao cổ",
    wrongAnswer: "zi-rap",
    accuracyScore: 94,
    status: "MASTERED",
    lastPracticed: "3 ngày trước"
  }
];

const MOCK_RECENT_SESSIONS: RecentSession[] = [
  {
    id: 1,
    title: "Bài 4: Động vật hoang dã",
    topic: "Chủ đề: Thế giới động vật",
    completedAt: "Hôm nay, 10:20",
    score: 100
  },
  {
    id: 2,
    title: "Bài 3: Các loài thú cưng",
    topic: "Chủ đề: Thế giới động vật",
    completedAt: "Hôm qua, 19:45",
    score: 95
  },
  {
    id: 3,
    title: "Bài 2: Trái cây nhiệt đới",
    topic: "Chủ đề: Rau củ & Quả ngọt",
    completedAt: "2 ngày trước",
    score: 90
  }
];

const MOCK_MILESTONES: Milestone[] = [
  {
    id: 1,
    title: "Bước Khởi Đầu",
    description: "Hoàn thành bài học đầu tiên trong hệ thống",
    isUnlocked: true,
    unlockedAt: "Đã mở khóa",
    progressText: "1 / 1 bài"
  },
  {
    id: 2,
    title: "Chăm Chỉ 7 Ngày",
    description: "Duy trì chuỗi học tập liên tục trong 7 ngày",
    isUnlocked: true,
    unlockedAt: "Đã mở khóa",
    progressText: "7 / 7 ngày"
  },
  {
    id: 3,
    title: "Nhà Phát Âm Xuất Sắc",
    description: "Đạt điểm phát âm AI trên 85% trong 10 bài",
    isUnlocked: true,
    unlockedAt: "Đã mở khóa",
    progressText: "10 / 10 bài"
  },
  {
    id: 4,
    title: "Bậc Thầy Từ Vựng",
    description: "Làm chủ và thuộc lòng 50 từ vựng",
    isUnlocked: false,
    progressText: "32 / 50 từ"
  }
];

export const PersonalStatsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mistakes' | 'history' | 'milestones'>('mistakes');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const totalWeeklyMinutes = MOCK_WEEKLY_ACTIVITY.reduce((acc, curr) => acc + curr.minutes, 0);
  const maxMinutesInChart = Math.max(...MOCK_WEEKLY_ACTIVITY.map(d => d.minutes), 35);

  const handlePlayVoice = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      setPlayingAudio(word);
      utterance.onend = () => setPlayingAudio(null);
      utterance.onerror = () => setPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    }
  };

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
          Theo dõi chi tiết hiệu suất học tập, phát âm AI và các kỹ năng của bạn
        </p>
      </div>

      {/* 2. Bốn thẻ chỉ số tổng quan (Stat Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Thẻ 1: Bài học hoàn thành */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Bài hoàn thành</span>
          <p className="text-2xl font-display font-black text-slate-800">
            18
          </p>
          <p className="text-xs text-slate-400">bài học đã vượt qua</p>
        </div>

        {/* Thẻ 2: Thời lượng học tuần này */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Thời lượng tuần</span>
          <p className="text-2xl font-display font-black text-slate-800">
            {totalWeeklyMinutes} <span className="text-sm font-normal text-slate-500">phút</span>
          </p>
          <p className="text-xs text-slate-400">trung bình 20 phút / ngày</p>
        </div>

        {/* Thẻ 3: Điểm tích lũy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Điểm tích lũy</span>
          <p className="text-2xl font-display font-black text-slate-800">
            980 <span className="text-sm font-normal text-slate-500">EXP</span>
          </p>
          <p className="text-xs text-slate-400">hạng Bạc trong tuần</p>
        </div>

        {/* Thẻ 4: Điểm phát âm AI */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Độ chuẩn phát âm</span>
          <p className="text-2xl font-display font-black text-slate-800">
            {MOCK_SKILLS.speaking}%
          </p>
          <p className="text-xs text-slate-400">chấm bởi Faster-Whisper</p>
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
          {MOCK_WEEKLY_ACTIVITY.map((item, idx) => {
            const heightPercent = Math.round((item.minutes / maxMinutesInChart) * 100);
            const isTargetReached = item.minutes >= item.targetMinutes;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold text-slate-700">
                  {item.minutes}p
                </span>

                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-28">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isTargetReached ? 'bg-[#ff5e97]' : 'bg-slate-400'
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

      {/* 5. Tabs chi tiết: Từ cần luyện, Lịch sử, Thành tích */}
      <div className="space-y-4">
        {/* Thanh chọn Tab */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('mistakes')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'mistakes'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            Từ cần luyện phát âm ({MOCK_MISTAKE_WORDS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            Bài học gần đây ({MOCK_RECENT_SESSIONS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'milestones'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            Cột mốc thành tích ({MOCK_MILESTONES.filter(m => m.isUnlocked).length}/{MOCK_MILESTONES.length})
          </button>
        </div>

        {/* Tab 1: Từ cần luyện phát âm */}
        {activeTab === 'mistakes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_MISTAKE_WORDS.map((item) => {
              const isMastered = item.status === 'MASTERED';
              const isPlaying = playingAudio === item.word;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-display font-bold text-slate-900">
                          {item.word}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          {item.phonetic}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Nghĩa: {item.translation}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isMastered 
                        ? 'bg-slate-100 text-slate-800 border border-slate-300' 
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                      {isMastered ? 'Đã thành thạo' : 'Cần luyện thêm'}
                    </span>
                  </div>

                  {/* Chi tiết phát âm */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Lần trước bạn đọc:</span>
                      <span className="text-rose-600 line-through font-mono">
                        "{item.wrongAnswer}"
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Độ chuẩn xác AI:</span>
                      <span className="font-bold text-slate-800">
                        {item.accuracyScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Gần nhất: {item.lastPracticed}
                    </span>

                    <button
                      type="button"
                      onClick={() => handlePlayVoice(item.word)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <SpeakerWaveIcon className={`w-4 h-4 ${isPlaying ? 'text-[#ff5e97]' : ''}`} />
                      Nghe phát âm chuẩn
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Lịch sử hoàn thành */}
        {activeTab === 'history' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-2xs">
            {MOCK_RECENT_SESSIONS.map((session) => (
              <div
                key={session.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {session.topic}
                  </span>
                  <h4 className="font-display font-bold text-sm text-slate-800">
                    {session.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Thời gian: {session.completedAt}
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

        {/* Tab 3: Cột mốc thành tích */}
        {activeTab === 'milestones' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_MILESTONES.map((mile) => (
              <div
                key={mile.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  mile.isUnlocked
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : 'bg-slate-50/70 border-dashed border-slate-300 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-slate-900">
                      {mile.title}
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      mile.isUnlocked
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {mile.isUnlocked ? 'Đã đạt được' : 'Chưa hoàn thành'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {mile.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-400 font-semibold">
                  <span>Tiến độ:</span>
                  <strong className="text-slate-700">{mile.progressText}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
