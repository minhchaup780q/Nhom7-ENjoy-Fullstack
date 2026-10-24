import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import {
  personalizedPracticeService,
  type ReadingExerciseData,
  type ListeningExerciseData,
} from '../services/personalizedPracticeService';
import type { TopicWeakWordDetail } from '../../exam/types';
import { PersonalizedReadingPart } from './PersonalizedReadingPart';
import { PersonalizedListeningPart } from './PersonalizedListeningPart';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  TrophyIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';

type PracticeRound = 'READING' | 'LISTENING' | 'SUMMARY';

export const PersonalizedPracticePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic') || 'ALL';

  const [loading, setLoading] = useState<boolean>(true);
  const [generatingAi, setGeneratingAi] = useState<boolean>(false);
  const [round, setRound] = useState<PracticeRound>('READING');

  // Toàn bộ từ yếu của topic
  const [weakWords, setWeakWords] = useState<TopicWeakWordDetail[]>([]);
  // Chia thành các trang 2 đến 4 từ
  const [wordPages, setWordPages] = useState<TopicWeakWordDetail[][]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Cache dữ liệu bài tập đã sinh bởi AI
  const [readingExercises, setReadingExercises] = useState<Record<number, ReadingExerciseData>>({});
  const [listeningExercises, setListeningExercises] = useState<Record<number, ListeningExerciseData>>({});

  // Tải danh sách từ yếu khi mount
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    personalizedPracticeService
      .loadWeakWords(Number(user.id), topicParam)
      .then((words) => {
        setWeakWords(words);
        const pages = personalizedPracticeService.chunkWordsIntoPages(words);
        setWordPages(pages);
        setCurrentPageIndex(0);
      })
      .finally(() => setLoading(false));
  }, [user?.id, topicParam]);

  // Sinh bài tập AI cho trang hiện tại khi chuyển trang hoặc đổi vòng
  useEffect(() => {
    if (wordPages.length === 0 || currentPageIndex >= wordPages.length) return;
    const currentWords = wordPages[currentPageIndex];

    const generateCurrentPage = async () => {
      setGeneratingAi(true);
      try {
        if (round === 'READING' && !readingExercises[currentPageIndex]) {
          const ex = await personalizedPracticeService.generateReadingExercise(
            currentPageIndex,
            topicParam === 'ALL' ? currentWords[0]?.topic || 'Chủ đề tổng hợp' : topicParam,
            currentWords
          );
          setReadingExercises((prev) => ({ ...prev, [currentPageIndex]: ex }));
        } else if (round === 'LISTENING' && !listeningExercises[currentPageIndex]) {
          const ex = await personalizedPracticeService.generateListeningExercise(
            currentPageIndex,
            topicParam === 'ALL' ? currentWords[0]?.topic || 'Chủ đề tổng hợp' : topicParam,
            currentWords
          );
          setListeningExercises((prev) => ({ ...prev, [currentPageIndex]: ex }));
        }
      } catch (err) {
        console.error('Lỗi khi sinh bài tập AI:', err);
      } finally {
        setGeneratingAi(false);
      }
    };

    generateCurrentPage();
  }, [round, currentPageIndex, wordPages, topicParam]);

  // Xử lý khi hoàn thành 1 trang Đọc
  const handleReadingPageComplete = () => {
    if (currentPageIndex + 1 < wordPages.length) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      // Hoàn thành hết các trang đọc -> Chuyển sang Vòng Nghe
      setRound('LISTENING');
      setCurrentPageIndex(0);
    }
  };

  // Xử lý khi hoàn thành 1 trang Nghe
  const handleListeningPageComplete = async () => {
    if (currentPageIndex + 1 < wordPages.length) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      // Hoàn thành hết các vòng -> Cập nhật trạng thái hoàn thành vào backend
      if (user?.id && weakWords.length > 0) {
        for (const w of weakWords) {
          try {
            await vocabStatsApi.completeWord(Number(user.id), w.word, w.topic);
          } catch (err) {
            console.warn(`Lỗi khi cập nhật hoàn thành từ ${w.word}:`, err);
          }
        }
      }
      setRound('SUMMARY');
    }
  };

  const availableTopics = Array.from(new Set(weakWords.map((w) => w.topic).filter(Boolean)));
  const currentPageTopic = wordPages[currentPageIndex]?.[0]?.topic || (topicParam === 'ALL' ? 'Tất cả các chủ đề' : topicParam);
  const currentTopicDisplay = topicParam === 'ALL' ? 'Tất cả các chủ đề' : topicParam;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-extrabold text-slate-700">Đang chuẩn bị danh sách từ vựng bài thi...</p>
      </div>
    );
  }

  // Nếu không có từ yếu nào
  if (weakWords.length === 0) {
    return (
      <div className="min-h-screen bg-surface p-6 md:p-10 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
          <CheckBadgeIcon className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 mb-2">
          Không có từ vựng cần cải thiện!
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Bé đã hoàn thành xuất sắc hoặc chưa có lỗi sai nào trong chủ đề <strong>{currentTopicDisplay}</strong>. Hãy thử sức thêm với các bài thi thử nhé!
        </p>
        <button
          onClick={() => navigate('/practice')}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer"
        >
          Quay lại trang Luyện tập
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* ── Top Header Navigation ── */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="p-2.5 rounded-2xl border-2 border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Quay lại danh sách luyện tập"
            >
              <ArrowLeftIcon className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <p className="text-[11px] font-black uppercase text-sky-600 tracking-widest">
                Luyện tập cá nhân hoá · {currentPageTopic}
              </p>
              <h1 className="text-lg md:text-xl font-display font-extrabold text-slate-900">
                {round === 'READING' && 'Vòng 1: Đọc đục lỗ (Reading Part 4)'}
                {round === 'LISTENING' && 'Vòng 2: Nghe hội thoại tương tác (Listening)'}
                {round === 'SUMMARY' && 'Tổng kết & Chúc mừng'}
              </h1>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl text-xs font-bold">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                round === 'READING'
                  ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                  : 'text-gray-500'
              }`}
            >
              <BookOpenIcon className="w-4 h-4 text-emerald-600" />
              <span>Vòng Đọc</span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                round === 'LISTENING'
                  ? 'bg-white text-violet-800 shadow-sm font-extrabold'
                  : 'text-gray-500'
              }`}
            >
              <SpeakerWaveIcon className="w-4 h-4 text-violet-600" />
              <span>Vòng Nghe</span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                round === 'SUMMARY'
                  ? 'bg-white text-amber-800 shadow-sm font-extrabold'
                  : 'text-gray-500'
              }`}
            >
              <TrophyIcon className="w-4 h-4 text-amber-500" />
              <span>Kết quả</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Topic Filter Chips ── */}
      {availableTopics.length > 1 && (
        <div className="bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-2">
          <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Chủ đề bài thi:</span>
            <button
              onClick={() => navigate('/practice/personalization?topic=ALL')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                topicParam === 'ALL'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Tất cả ({weakWords.length} từ)
            </button>
            {availableTopics.map((top) => {
              const count = weakWords.filter((w) => w.topic === top).length;
              return (
                <button
                  key={top}
                  onClick={() => navigate(`/practice/personalization?topic=${encodeURIComponent(top)}`)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    topicParam === top
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {top} ({count} từ)
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Content Container ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {generatingAi ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-display font-extrabold text-slate-800 text-lg">
                Trợ lý AI đang tạo bài tập đục lỗ cho bé...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Đang tạo câu chuyện &amp; ngữ cảnh tiếng Anh tự nhiên phù hợp với độ tuổi Starters
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* VÒNG 1: ĐỌC ĐỤC LỖ */}
            {round === 'READING' && readingExercises[currentPageIndex] && (
              <PersonalizedReadingPart
                data={readingExercises[currentPageIndex]}
                currentPage={currentPageIndex}
                totalPages={wordPages.length}
                onPageComplete={handleReadingPageComplete}
              />
            )}

            {/* VÒNG 2: NGHE HỘI THOẠI */}
            {round === 'LISTENING' && listeningExercises[currentPageIndex] && (
              <PersonalizedListeningPart
                data={listeningExercises[currentPageIndex]}
                currentPage={currentPageIndex}
                totalPages={wordPages.length}
                onPageComplete={handleListeningPageComplete}
              />
            )}

            {/* TỔNG KẾT VÒNG HỌC */}
            {round === 'SUMMARY' && (
              <div className="max-w-xl mx-auto bg-white rounded-3xl border-2 border-emerald-300 p-8 shadow-xl text-center flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-3xl flex items-center justify-center shadow-inner animate-bounce">
                  <TrophyIcon className="w-14 h-14" />
                </div>
                <div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                    Xuất sắc
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 mt-2">
                    Bé đã hoàn thành trọn vẹn 2 Vòng!
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    Các từ vựng lỗi sai của chủ đề <strong>{currentTopicDisplay}</strong> đã được củng cố cả về kỹ năng đọc hiểu và nghe hiểu hội thoại.
                  </p>
                </div>

                <div className="w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-200 flex items-center justify-around">
                  <div>
                    <span className="block text-2xl font-black text-sky-600">+{weakWords.length * 10}</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Điểm kinh nghiệm</span>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200" />
                  <div>
                    <span className="block text-2xl font-black text-emerald-600">{weakWords.length}</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Từ vựng đã cải thiện</span>
                  </div>
                </div>

                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">lock_open</span>
                  <span>Đã mở khóa các bài thi! Bạn có thể tiếp tục làm bài thi ngay bây giờ.</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <button
                    onClick={() => navigate('/exams')}
                    className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-extrabold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer uppercase text-xs tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Tiếp tục làm bài thi</span>
                  </button>
                  <button
                    onClick={() => navigate('/practice')}
                    className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-extrabold rounded-2xl transition-all active:scale-95 cursor-pointer uppercase text-xs tracking-wider"
                  >
                    Trang Luyện tập
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default PersonalizedPracticePage;
