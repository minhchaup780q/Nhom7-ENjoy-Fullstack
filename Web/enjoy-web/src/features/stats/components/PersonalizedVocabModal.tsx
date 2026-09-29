import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import { chatbotApi, type AdaptiveChallenge } from '../../learning/services/chatbotApi';
import { MistakePracticePlayer } from '../../practice/components/MistakePracticePlayer';
import { renderFormattedAiText } from './FormattedAiText';

interface Props {
  skillScore: number;
  onClose: () => void;
}

const getAssetUrl = (path?: string | null) => {
  if (!path) return '';
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
};

export const PersonalizedVocabModal: React.FC<Props> = ({ skillScore, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mistake_list' | 'ai_challenge'>('mistake_list');
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const [activePracticeItems, setActivePracticeItems] = useState<MistakeItem[] | null>(null);

  // AI Challenge State
  const [aiChallenge, setAiChallenge] = useState<AdaptiveChallenge | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedAiOption, setSelectedAiOption] = useState<string | null>(null);
  const [aiAnswerChecked, setAiAnswerChecked] = useState(false);
  const [aiAnswerCorrect, setAiAnswerCorrect] = useState(false);

  const fetchMistakes = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        mistakeApi.getUserMistakesPaged({ roundType: 1, size: 50 }).catch(() => ({ content: [] })),
        mistakeApi.getUserMistakesPaged({ roundType: 2, size: 50 }).catch(() => ({ content: [] })),
      ]);
      const items1: MistakeItem[] = (res1 as any)?.content || (res1 as any)?.data?.content || [];
      const items2: MistakeItem[] = (res2 as any)?.content || (res2 as any)?.data?.content || [];

      const map = new Map<string, MistakeItem>();
      [...items1, ...items2].forEach((item) => {
        const key = (item.contentText || item.keyword || String(item.id)).toLowerCase().trim();
        if (!map.has(key)) {
          map.set(key, item);
        }
      });
      setMistakes(Array.from(map.values()));
    } catch (err) {
      console.error('Lỗi khi tải danh sách từ vựng sai:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMistakes(true);
  }, [fetchMistakes]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    mistakes.forEach((m) => {
      const t = m.keyword?.trim();
      if (t) set.add(t);
    });
    if (set.size === 0) return ['Tất cả'];
    return ['Tất cả', ...Array.from(set)];
  }, [mistakes]);

  const filteredMistakes = useMemo(() => {
    if (selectedTopic === 'Tất cả') return mistakes;
    return mistakes.filter((m) => (m.keyword?.trim() || 'Chủ đề chung') === selectedTopic);
  }, [mistakes, selectedTopic]);

  const loadAiChallenge = useCallback(async (forceRefresh = false) => {
    setIsAiLoading(true);
    setSelectedAiOption(null);
    setAiAnswerChecked(false);
    setAiAnswerCorrect(false);

    if (!forceRefresh) {
      try {
        const dbChallenge = await mistakeApi.getAiChallenge('vocabGrammar', selectedTopic);
        if (
          dbChallenge &&
          dbChallenge.story &&
          dbChallenge.question &&
          Array.isArray(dbChallenge.options) &&
          dbChallenge.options.length > 0 &&
          dbChallenge.correctAnswer
        ) {
          setAiChallenge({
            title: dbChallenge.title,
            story: dbChallenge.story,
            storyVi: dbChallenge.storyVi || '',
            question: dbChallenge.question,
            options: dbChallenge.options,
            correctAnswer: dbChallenge.correctAnswer,
            hint: dbChallenge.hint || '',
          });
          setIsAiLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Lỗi khi tải AI challenge từ CSDL:', err);
      }
    }

    const sourceList = filteredMistakes.length > 0 ? filteredMistakes : mistakes;
    const mistakeItems = sourceList.map(m => ({
      word: m.contentText || m.keyword || '',
      translation: m.translation || '',
      wrongAttempt: m.wrongAnswerSubmitted || '',
    }));

    const topicLabel = selectedTopic !== 'Tất cả' ? selectedTopic : 'Từ vựng';

    try {
      const challenge = await chatbotApi.generateAdaptiveChallenge(
        'Từ vựng',
        mistakeItems.length > 0 ? mistakeItems : [{ word: 'book', translation: 'quyển sách', wrongAttempt: 'bok' }],
        topicLabel
      );
      setAiChallenge(challenge);

      await mistakeApi.saveAiChallenge({
        skillKey: 'vocabGrammar',
        topicId: selectedTopic,
        topicName: selectedTopic,
        title: challenge.title,
        story: challenge.story,
        storyVi: challenge.storyVi,
        question: challenge.question,
        options: challenge.options,
        correctAnswer: challenge.correctAnswer,
        hint: challenge.hint,
      });
    } catch (err) {
      console.warn('Lỗi khi tạo thử thách AI:', err);
    } finally {
      setIsAiLoading(false);
    }
  }, [filteredMistakes, mistakes, selectedTopic]);

  useEffect(() => {
    if (activeTab === 'ai_challenge') {
      loadAiChallenge(false);
    }
  }, [activeTab, selectedTopic, loadAiChallenge]);

  const playWord = useCallback((text: string, keyId: string, audioUrl?: string) => {
    setPlayingKey(keyId);
    if (audioUrl) {
      new Audio(getAssetUrl(audioUrl)).play().catch(() => {});
      setTimeout(() => setPlayingKey(null), 800);
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      u.onend = () => setPlayingKey(null);
      u.onerror = () => setPlayingKey(null);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setPlayingKey(null), 800);
    }
  }, []);

  const handleAiCheck = () => {
    if (!selectedAiOption || !aiChallenge) return;
    setAiAnswerChecked(true);
    setAiAnswerCorrect(selectedAiOption.trim().toLowerCase() === aiChallenge.correctAnswer.trim().toLowerCase());
  };

  /**
   * Kẹp 2 màn liên tiếp: Màn 1 (Flashcard ôn toàn bộ từ) -> Màn 2 (Bài tập nối từ củng cố)
   */
  const startPracticeWithFlashcards = (items: MistakeItem[]) => {
    const flashcardItems = items.map((item, idx) => ({
      ...item,
      id: item.id * 10000 + idx * 2 + 1,
      roundType: 1,
    }));
    const practiceItems = items.map((item, idx) => ({
      ...item,
      id: item.id * 10000 + idx * 2 + 2,
      roundType: 2,
    }));
    setActivePracticeItems([...flashcardItems, ...practiceItems]);
  };

  if (activePracticeItems && activePracticeItems.length > 0) {
    return (
      <MistakePracticePlayer
        mistakes={activePracticeItems}
        onClose={() => {
          setActivePracticeItems(null);
          fetchMistakes(false);
        }}
        onFinished={() => {
          setActivePracticeItems(null);
          fetchMistakes(false);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white border border-pink-100 rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-pink-50 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-800">
                Từ vựng
              </h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-[#ff5e97] border border-pink-200">
                {skillScore}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {mistakes.length > 0 
                ? `Có ${mistakes.length} từ vựng cần cải thiện` 
                : 'Đã hoàn thành tốt các từ vựng'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-pink-50/70 hover:bg-pink-100 text-slate-500 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-pink-50 px-6 bg-white">
          <button
            onClick={() => setActiveTab('mistake_list')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'mistake_list'
                ? 'border-[#ff5e97] text-[#ff5e97]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Từ vựng cần ôn tập ({mistakes.length})
          </button>
          <button
            onClick={() => setActiveTab('ai_challenge')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'ai_challenge'
                ? 'border-[#ff5e97] text-[#ff5e97]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Thử thách ENjoy AI
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          {activeTab === 'mistake_list' ? (
            <>
              {topics.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-semibold text-slate-400 shrink-0">Chủ đề:</span>
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                        selectedTopic === t
                          ? 'bg-[#ff5e97] text-white shadow-xs'
                          : 'bg-pink-50/60 text-slate-600 hover:bg-pink-100/70'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#ff5e97] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">Đang tải danh sách từ vựng...</span>
                </div>
              ) : filteredMistakes.length === 0 ? (
                <div className="py-16 text-center space-y-1.5">
                  <h3 className="font-bold text-slate-800 text-sm">Không có từ vựng nào cần ôn tập</h3>
                  <p className="text-xs text-slate-400">
                    Bé đã ghi nhớ rất tốt các từ vựng này.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMistakes.map((m) => {
                    const isPlaying = playingKey === String(m.id);
                    const mastery = m.masteryScore ?? 0;
                    const streak = m.correctStreakDays ?? 0;

                    return (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-pink-50/30 border border-pink-100/80 flex items-center justify-between gap-4 hover:border-pink-200 hover:bg-pink-50/50 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => playWord(m.contentText || m.keyword || '', String(m.id), m.audioUrl)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isPlaying
                                ? 'bg-[#ff5e97] border-[#ff5e97] text-white'
                                : 'bg-white border-pink-200 text-[#ff5e97] hover:border-pink-300'
                            }`}
                          >
                            {isPlaying ? 'Đang phát...' : 'Phát âm'}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm truncate">
                                {m.contentText || m.keyword}
                              </span>
                              {m.keyword && (
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-pink-50 text-[#ff5e97] font-semibold border border-pink-200 shrink-0">
                                  {m.keyword}
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5">
                              <span className="text-xs text-slate-500">
                                {m.translation || 'Chưa có bản dịch'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-[11px] font-semibold text-slate-500 block">
                              {streak >= 3 ? 'Đã nắm vững' : `Cần ôn ${3 - streak} ngày`}
                            </span>
                            <div className="w-16 bg-pink-100 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div
                                className="bg-[#ff5e97] h-full rounded-full transition-all"
                                style={{ width: `${Math.round(mastery * 100)}%` }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => startPracticeWithFlashcards([m])}
                            className="px-3.5 py-2 rounded-xl bg-[#ff5e97] hover:bg-[#e84c85] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            Luyện từ này
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {isAiLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#ff5e97] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">ENjoy AI đang tạo câu hỏi tình huống...</span>
                </div>
              ) : aiChallenge ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-pink-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#ff5e97] uppercase tracking-wider">
                        {aiChallenge.title || 'Tình huống câu chuyện'}
                      </span>
                      <button
                        onClick={() => loadAiChallenge(true)}
                        className="text-xs text-[#ff5e97] hover:underline font-semibold cursor-pointer"
                      >
                        Đổi bài khác
                      </button>
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      "{renderFormattedAiText(aiChallenge.story)}"
                    </p>
                    {aiChallenge.storyVi && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        ({renderFormattedAiText(aiChallenge.storyVi)})
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-pink-100 space-y-3">
                    <h4 className="font-bold text-sm text-slate-800">
                      {renderFormattedAiText(aiChallenge.question)}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiChallenge.options.map((opt, idx) => {
                        const isSelected = selectedAiOption === opt;
                        let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700';

                        if (aiAnswerChecked) {
                          if (opt.trim().toLowerCase() === aiChallenge.correctAnswer.trim().toLowerCase()) {
                            btnStyle = 'border-[#ff5e97] bg-pink-50 text-[#ff5e97] font-bold';
                          } else if (isSelected) {
                            btnStyle = 'border-rose-400 bg-rose-50 text-rose-700';
                          }
                        } else if (isSelected) {
                          btnStyle = 'border-[#ff5e97] bg-pink-50 text-[#ff5e97] font-bold ring-2 ring-pink-200';
                        }

                        return (
                          <button
                            key={idx}
                            disabled={aiAnswerChecked}
                            onClick={() => setSelectedAiOption(opt)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {aiAnswerChecked && opt.trim().toLowerCase() === aiChallenge.correctAnswer.trim().toLowerCase() && (
                              <span className="text-[#ff5e97] font-bold">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {aiAnswerChecked && (
                      <div className={`p-3 rounded-xl text-xs font-medium ${aiAnswerCorrect ? 'bg-pink-50 text-[#ff5e97] border border-pink-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        {aiAnswerCorrect ? 'Chính xác! Bạn đã vận dụng từ vựng đúng ngữ cảnh.' : `Chưa chính xác. Đáp án đúng là: ${aiChallenge.correctAnswer}`}
                        {aiChallenge.hint && <p className="mt-1 text-slate-600">Gợi ý: {renderFormattedAiText(aiChallenge.hint)}</p>}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      {!aiAnswerChecked ? (
                        <button
                          disabled={!selectedAiOption}
                          onClick={handleAiCheck}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                            selectedAiOption ? 'bg-[#ff5e97] hover:bg-[#e84c85] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Kiểm tra đáp án
                        </button>
                      ) : (
                        <button
                          onClick={() => loadAiChallenge(true)}
                          className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          Thử thách tiếp theo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Không thể tải thử thách lúc này. Vui lòng thử lại sau.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'mistake_list' && filteredMistakes.length > 0 && (
          <div className="px-6 py-4 border-t border-pink-50 bg-white flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Tổng số: {filteredMistakes.length} từ
            </span>
            <button
              onClick={() => startPracticeWithFlashcards(filteredMistakes)}
              className="px-5 py-2.5 rounded-2xl bg-[#ff5e97] hover:bg-[#e84c85] text-white text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              Luyện tập tất cả
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
