import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button3D } from '../../../components/ui/Button3D';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import { chatbotApi, type AdaptiveChallenge } from '../../learning/services/chatbotApi';
import type { Vocabulary } from '../../learning/types';
import { FlashcardExercise } from '../../learning/components/exercises/FlashcardExercise';
import { MistakePracticePlayer } from '../../practice/components/MistakePracticePlayer';
import { PersonalizedSpeakingModal } from './PersonalizedSpeakingModal';

interface SkillDef {
  key: string;
  index: number;
  nameVi: string;
  nameEn: string;
  color: string;
  bgLight: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Props {
  skillKey: string;
  skillScore: number;
  skillDef: SkillDef;
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

export const PersonalizedSkillModal: React.FC<Props> = ({
  skillKey,
  skillScore,
  skillDef,
  onClose,
}) => {
  // Nếu là kỹ năng Speaking (Phát âm), chuyển sang modal Speaking đồng bộ
  if (skillKey === 'speaking') {
    return <PersonalizedSpeakingModal skillScore={skillScore} onClose={onClose} />;
  }

  const [activeTab, setActiveTab] = useState<'mistake_list' | 'ai_challenge'>('mistake_list');
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  // Mini Relearn Modal state (Vòng 1 - Flashcard)
  const [relearnItem, setRelearnItem] = useState<{
    item: MistakeItem;
    flipped?: boolean;
  } | null>(null);

  // Chế độ mở toàn màn hình (Session Player hoặc Batch Flashcard)
  const [playerMode, setPlayerMode] = useState<'none' | 'flashcard' | 'practice'>('none');

  // AI Challenge State
  const [aiChallenge, setAiChallenge] = useState<AdaptiveChallenge | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedAiOption, setSelectedAiOption] = useState<string | null>(null);
  const [aiAnswerChecked, setAiAnswerChecked] = useState(false);
  const [aiAnswerCorrect, setAiAnswerCorrect] = useState(false);

  // Danh sách chủ đề duy nhất trích xuất từ dữ liệu thực tế
  const topics = useMemo(() => {
    const set = new Set<string>();
    mistakes.forEach((m) => {
      const t = m.keyword?.trim();
      if (t) set.add(t);
    });
    if (set.size === 0) return ['Tất cả'];
    return ['Tất cả', ...Array.from(set)];
  }, [mistakes]);

  // Lọc danh sách theo chủ đề đã chọn
  const filteredMistakes = useMemo(() => {
    if (selectedTopic === 'Tất cả') return mistakes;
    return mistakes.filter((m) => (m.keyword?.trim() || 'Chủ đề chung') === selectedTopic);
  }, [mistakes, selectedTopic]);

  const getRoundTypeBySkill = (key: string): number => {
    switch (key) {
      case 'listening': return 5;
      case 'speaking': return 3;
      case 'reading': return 6;
      case 'writing': return 4;
      case 'vocabGrammar': return 2;
      default: return 4;
    }
  };

  const getSkillActionName = (key: string): string => {
    switch (key) {
      case 'writing': return 'Luyện Viết';
      case 'listening': return 'Luyện Nghe';
      case 'reading': return 'Luyện Đọc';
      case 'vocabGrammar': return 'Nối Từ';
      default: return 'Luyện Tập';
    }
  };

  const roundType = getRoundTypeBySkill(skillKey);

  // Fetch dữ liệu từ Backend
  const fetchMistakes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mistakeApi.getUserMistakesPaged({ roundType, size: 50 });
      if (res && res.content && res.content.length > 0) {
        setMistakes(res.content);
        return;
      }
      const allMistakes = await mistakeApi.getRoadmapMistakes();
      if (allMistakes && allMistakes.length > 0) {
        setMistakes(allMistakes.slice(0, 20));
        return;
      }
      setMistakes([]);
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu từ vựng:', err);
      setMistakes([]);
    } finally {
      setLoading(false);
    }
  }, [roundType]);

  useEffect(() => {
    fetchMistakes();
  }, [fetchMistakes]);

  // Sinh thử thách thích ứng AI theo đúng chủ đề đang chọn
  const loadAiChallenge = useCallback(async (forceRefresh = false) => {
    if (aiChallenge && !forceRefresh) return;
    setIsAiLoading(true);
    setSelectedAiOption(null);
    setAiAnswerChecked(false);
    setAiAnswerCorrect(false);

    const sourceList = filteredMistakes.length > 0 ? filteredMistakes : mistakes;
    const mistakeItems = sourceList.slice(0, 4).map(m => ({
      word: m.contentText || m.keyword || '',
      translation: m.translation || '',
      wrongAttempt: m.wrongAnswerSubmitted || '',
    }));

    const topicLabel = selectedTopic !== 'Tất cả' ? selectedTopic : skillDef.nameVi;

    try {
      const challenge = await chatbotApi.generateAdaptiveChallenge(
        skillDef.nameVi,
        mistakeItems.length > 0 ? mistakeItems : [{ word: 'book', translation: 'quyển sách', wrongAttempt: 'bok' }],
        topicLabel
      );
      setAiChallenge(challenge);
    } catch (err) {
      console.warn('Lỗi khi tạo thử thách AI:', err);
    } finally {
      setIsAiLoading(false);
    }
  }, [aiChallenge, filteredMistakes, mistakes, selectedTopic, skillDef.nameVi]);

  useEffect(() => {
    if (activeTab === 'ai_challenge') {
      loadAiChallenge(false);
    }
  }, [activeTab, loadAiChallenge]);

  // Phát âm thanh chuẩn
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
      u.pitch = 1.0;
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

  // Convert filtered mistakes sang Vocabulary cho Flashcard toàn màn hình
  const flashcardVocabs: Vocabulary[] = useMemo(() => {
    const list = filteredMistakes.length > 0 ? filteredMistakes : mistakes;
    return list.map(m => ({
      id: m.questionId || m.id,
      word: m.contentText || m.keyword || '',
      translation: m.translation || '',
      imageUrl: m.imageUrl,
      audioUrl: m.audioUrl,
    }));
  }, [filteredMistakes, mistakes]);

  // Nếu đang mở chế độ luyện tập toàn màn hình
  if (playerMode === 'practice' && filteredMistakes.length > 0) {
    return (
      <MistakePracticePlayer
        mistakes={filteredMistakes}
        onClose={() => {
          setPlayerMode('none');
          fetchMistakes();
        }}
        onFinished={() => {
          setPlayerMode('none');
          fetchMistakes();
        }}
      />
    );
  }

  if (playerMode === 'flashcard' && flashcardVocabs.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-display font-black text-slate-800 text-base">
              Ôn Thẻ Ghi Nhớ ({flashcardVocabs.length} từ)
            </span>
            <button
              onClick={() => setPlayerMode('none')}
              className="p-1 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer font-bold text-xs"
            >
              Đóng
            </button>
          </div>
          <FlashcardExercise
            vocabularies={flashcardVocabs}
            onComplete={() => setPlayerMode('none')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-display font-black text-slate-800">
                Cá Nhân Hoá Kỹ Năng {skillDef.nameVi}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-600 text-white shadow-xs">
                {skillScore}%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {mistakes.length > 0 
                ? `Khắc phục ${mistakes.length} câu làm sai và rèn luyện phản xạ cùng AI` 
                : 'Bé làm rất tốt! Cùng luyện tập củng cố kiến thức nhé!'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/80 rounded-2xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-sm font-bold"
          >
            Đóng
          </button>
        </div>

        {/* 2 Tab Lựa Chọn - Không icon */}
        <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mistake_list')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-display text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'mistake_list'
                ? 'bg-white text-slate-900 border-slate-300 shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60'
            }`}
          >
            <span>DANH SÁCH TỪ CẦN ÔN</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'mistake_list' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {filteredMistakes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai_challenge')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-display text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'ai_challenge'
                ? 'bg-white text-slate-900 border-slate-300 shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60'
            }`}
          >
            <span>THỬ THÁCH AI THÍCH ỨNG</span>
          </button>
        </div>

        {/* Thanh Lọc Theo Chủ Đề (Topic Filter Bar) */}
        {topics.length > 1 && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Chủ đề:
            </span>
            {topics.map((topicName) => (
              <button
                key={topicName}
                onClick={() => setSelectedTopic(topicName)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  selectedTopic === topicName
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {topicName}
                {topicName !== 'Tất cả' && (
                  <span className="ml-1.5 text-[10px] opacity-75">
                    ({mistakes.filter(m => (m.keyword?.trim() || 'Chủ đề chung') === topicName).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Danh Sách Thẻ Từ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/40">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-blue-600">
              <p className="text-xs font-bold text-slate-600">Đang chuẩn bị bài học cho bé...</p>
            </div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* TAB 1: DANH SÁCH TỪ CẦN ÔN                                */}
              {/* ========================================================= */}
              {activeTab === 'mistake_list' && (
                <div className="space-y-3 animate-fadeIn">
                  {filteredMistakes.length === 0 ? (
                    <div className="text-center py-12 space-y-2 bg-white rounded-2xl border border-slate-200">
                      <p className="text-sm font-bold text-slate-700">
                        {selectedTopic === 'Tất cả'
                          ? 'Tuyệt vời! Bé không có lỗi sai ở kỹ năng này.'
                          : `Không có từ nào cần ôn trong chủ đề "${selectedTopic}".`}
                      </p>
                    </div>
                  ) : (
                    filteredMistakes.map((m) => {
                      const wordText = m.contentText || m.keyword || '';
                      const wrongText = m.wrongAnswerSubmitted || 'chưa đúng';

                      return (
                        <div
                          key={m.id}
                          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          {/* Từ vựng & Lỗi sai */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-display font-black text-slate-800">{wordText}</span>
                              <span className="text-xs font-semibold text-slate-500">({m.translation})</span>
                              <button
                                onClick={() => playWord(wordText, `item_${m.id}`, m.audioUrl)}
                                className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer border transition-colors ${
                                  playingKey === `item_${m.id}`
                                    ? 'bg-blue-50 border-blue-300 text-blue-600'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                                }`}
                              >
                                Nghe
                              </button>
                            </div>

                            <div className="text-xs flex items-center gap-1.5">
                              <span className="text-slate-500 font-medium">
                                {skillKey === 'writing' ? 'Bé đã viết:' : 'Lần trước bé chọn:'}
                              </span>
                              <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 line-through">
                                {wrongText}
                              </span>
                            </div>
                          </div>

                          {/* 2 Nút hành động */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setRelearnItem({ item: m, flipped: false })}
                              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-all shadow-2xs active:scale-95"
                            >
                              Học Vòng 1
                            </button>

                            <button
                              onClick={() => setPlayerMode('practice')}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all shadow-2xs active:scale-95"
                            >
                              {getSkillActionName(skillKey)}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: THỬ THÁCH AI THÍCH ỨNG THEO CHỦ ĐỀ                 */}
              {/* ========================================================= */}
              {activeTab === 'ai_challenge' && (
                <div className="space-y-3 animate-fadeIn">
                  {isAiLoading ? (
                    <div className="py-12 text-center space-y-2 bg-white rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-blue-600">AI đang tạo câu chuyện ôn tập thích ứng...</p>
                    </div>
                  ) : aiChallenge ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                      {/* Tiêu đề câu chuyện */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-sm font-display font-black text-slate-800">
                          {aiChallenge.title}
                        </span>
                        <button
                          onClick={() => loadAiChallenge(true)}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          Đổi câu chuyện
                        </button>
                      </div>

                      {/* Đoạn văn ngắn chêm từ khóa */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {aiChallenge.story.split('**').map((part, i) =>
                          i % 2 === 1 ? (
                            <span key={i} className="font-bold text-blue-700 px-1.5 py-0.5 mx-0.5 bg-blue-50 rounded-md border border-blue-200 shadow-2xs">
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        )}
                      </div>

                      {/* Câu hỏi trắc nghiệm */}
                      <div className="space-y-2.5">
                        <p className="text-xs font-bold text-slate-800">
                          <strong>Câu hỏi:</strong> {aiChallenge.question}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          {aiChallenge.options.map((opt, idx) => {
                            const isSelected = selectedAiOption === opt;
                            let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                            if (isSelected) {
                              if (aiAnswerChecked) {
                                btnStyle = aiAnswerCorrect
                                  ? 'bg-emerald-500 border-emerald-500 text-white font-bold'
                                  : 'bg-rose-500 border-rose-500 text-white font-bold';
                              } else {
                                btnStyle = 'bg-blue-50 border-blue-500 text-blue-700 font-bold';
                              }
                            }

                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (!aiAnswerChecked) setSelectedAiOption(opt);
                                }}
                                disabled={aiAnswerChecked}
                                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Phản hồi kết quả */}
                        <div className="flex items-center justify-between pt-1">
                          {aiAnswerChecked ? (
                            <div className="text-xs font-bold">
                              {aiAnswerCorrect ? (
                                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                  Chính xác! Bé rất thông minh!
                                </span>
                              ) : (
                                <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                                  Đáp án đúng là: <strong>{aiChallenge.correctAnswer}</strong>
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Chọn 1 đáp án và bấm Kiểm Tra</span>
                          )}

                          {!aiAnswerChecked ? (
                            <Button3D
                              variant="blue"
                              size="sm"
                              disabled={!selectedAiOption}
                              onClick={handleAiCheck}
                              className="px-5"
                            >
                              KIỂM TRA
                            </Button3D>
                          ) : (
                            <Button3D
                              variant="green"
                              size="sm"
                              onClick={() => loadAiChallenge(true)}
                              className="px-5"
                            >
                              CÂU TIẾP THEO
                            </Button3D>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Mini Flashcard Vòng 1 */}
        {relearnItem && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-center">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm font-display font-black text-slate-800">
                  Ôn Vòng 1: Thẻ Từ Vựng
                </span>
                <button
                  onClick={() => setRelearnItem(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer font-bold text-xs"
                >
                  Đóng
                </button>
              </div>

              <div
                onClick={() =>
                  setRelearnItem((prev) => (prev ? { ...prev, flipped: !prev.flipped } : null))
                }
                className="h-36 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none hover:border-blue-400 transition-all"
              >
                {!relearnItem.flipped ? (
                  <div className="space-y-1">
                    <span className="text-3xl font-display font-black text-slate-800">
                      {relearnItem.item.contentText || relearnItem.item.keyword}
                    </span>
                    <p className="text-xs text-slate-400 font-medium">(Bấm để xem nghĩa)</p>
                  </div>
                ) : (
                  <div className="space-y-1 animate-in zoom-in-95">
                    <span className="text-2xl font-display font-black text-blue-600">
                      {relearnItem.item.translation}
                    </span>
                    <p className="text-xs text-slate-500 font-medium">
                      ({relearnItem.item.contentText || relearnItem.item.keyword})
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => playWord(relearnItem.item.contentText || relearnItem.item.keyword || '', 'flash_item', relearnItem.item.audioUrl)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200"
                >
                  Nghe
                </button>
                <Button3D variant="blue" size="sm" onClick={() => setRelearnItem(null)} className="px-5">
                  ĐÃ THUỘC
                </Button3D>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-display font-extrabold text-xs tracking-wider cursor-pointer shadow-xs transition-all"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
