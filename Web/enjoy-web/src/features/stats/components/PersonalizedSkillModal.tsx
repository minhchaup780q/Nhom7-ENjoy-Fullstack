import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button3D } from '../../../components/ui/Button3D';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import { chatbotApi, type AdaptiveChallenge } from '../../learning/services/chatbotApi';
import { MistakePracticePlayer } from '../../practice/components/MistakePracticePlayer';
import { PersonalizedSpeakingModal } from './PersonalizedSpeakingModal';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

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

  // Chế độ mở phiên luyện tập bài học (kết nối trực tiếp MistakePracticePlayer & Mistake API)
  const [activePracticeItems, setActivePracticeItems] = useState<MistakeItem[] | null>(null);

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
      case 'writing': return 4;        // Màn 4: Sắp xếp từ/chữ (Writing)
      case 'vocabGrammar': return 2;   // Màn 2: Nối từ vựng (Vocabulary)
      case 'listening': return 5;      // Màn 5: Kéo thả âm thanh (Listening)
      case 'reading': return 6;        // Màn 6: Ngữ pháp trắc nghiệm (Reading)
      case 'speaking': return 3;       // Màn 3: Phát âm (Speaking)
      default: return 2;
    }
  };

  const getSkillActionName = (key: string): string => {
    switch (key) {
      case 'writing': return 'Luyện Viết';
      case 'listening': return 'Luyện Nghe';
      case 'reading': return 'Luyện Đọc';
      case 'vocabGrammar': return 'Học Vòng 2';
      default: return 'Luyện Tập';
    }
  };

  const roundType = getRoundTypeBySkill(skillKey);

  // Fetch dữ liệu từ Backend - Phân tách dữ liệu chính xác theo từng vòng (Không lấy lẫn lộn)
  const fetchMistakes = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const targetRound = getRoundTypeBySkill(skillKey);
      // Không truyền status để lấy TẤT CẢ trạng thái (NEEDS_REVIEW + REVIEWED)
      // Backend khi status=null sẽ trả tất cả câu sai của roundType này
      const res = await mistakeApi.getUserMistakesPaged({ roundType: targetRound, size: 50 });
      if (res?.content && Array.isArray(res.content)) {
        const filtered = res.content.filter((m) => m.roundType === targetRound);
        setMistakes(filtered);
      } else {
        setMistakes([]);
      }
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu câu làm sai:', err);
      setMistakes([]);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, [skillKey]);

  useEffect(() => {
    fetchMistakes();
  }, [fetchMistakes]);

  // Bắt đầu luyện tập bài học cho từ vựng / câu cụ thể (Màn 1 & Màn 2 liên tiếp)
  const startPracticeWord = useCallback((item: MistakeItem, rounds: number[] = [1, 2]) => {
    const practiceItems: MistakeItem[] = rounds.map((r) => ({
      ...item,
      roundType: r,
    }));
    setActivePracticeItems(practiceItems);
  }, []);

  // Sinh thử thách thích ứng AI theo đúng chủ đề đang chọn (Lưu vào CSDL Backend, chỉ tạo mới khi bấm đổi)
  const loadAiChallenge = useCallback(async (forceRefresh = false) => {
    setIsAiLoading(true);
    setSelectedAiOption(null);
    setAiAnswerChecked(false);
    setAiAnswerCorrect(false);

    // 1. Nếu không phải forceRefresh, ưu tiên đọc từ CSDL Backend trước
    if (!forceRefresh) {
      try {
        const dbChallenge = await mistakeApi.getAiChallenge(skillKey, selectedTopic);
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

    // 2. Nếu chưa có trong CSDL hoặc bấm nút Đổi thử thách: Gọi AI sinh thử thách mới
    const sourceList = filteredMistakes.length > 0 ? filteredMistakes : mistakes;
    const mistakeItems = sourceList.map(m => ({
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

      // 3. Tự động lưu dữ liệu AI vừa sinh vào CSDL Backend để tái sử dụng
      await mistakeApi.saveAiChallenge({
        skillKey,
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
  }, [filteredMistakes, mistakes, selectedTopic, skillDef.nameVi, skillKey]);

  useEffect(() => {
    if (activeTab === 'ai_challenge') {
      loadAiChallenge(false);
    }
  }, [activeTab, selectedTopic]);

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

  // Mở trực tiếp UI bài học của MistakePracticePlayer (đã tích hợp đầy đủ chấm điểm & ghi nhận hoàn thành vào Mistake API)
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-display font-black text-slate-800">
                Cá Nhân Hoá Kỹ Năng {skillDef.nameVi}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-pink-100 text-pink-700 border border-pink-200 shadow-2xs">
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
                activeTab === 'mistake_list' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-slate-200 text-slate-600'
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
            <span>THỬ THÁCH ENJOY AI</span>
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
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-pink-500">
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
                                    ? 'bg-pink-50 border-pink-300 text-pink-600'
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
                              <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 line-through">
                                {wrongText}
                              </span>
                            </div>
                          </div>

                          {/* Các nút hành động */}
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                            {skillKey === 'vocabGrammar' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startPracticeWord(m, [1])}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-all shadow-2xs active:scale-95"
                                >
                                  Màn 1: Thẻ từ
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startPracticeWord(m, [2])}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-all shadow-2xs active:scale-95"
                                >
                                  Màn 2: Nối từ
                                </button>
                                <Button3D
                                  variant="pink"
                                  size="sm"
                                  onClick={() => startPracticeWord(m, [1, 2])}
                                  className="text-[11px]"
                                >
                                  Học Màn 1 & 2
                                </Button3D>
                              </>
                            ) : (
                              <Button3D
                                variant="pink"
                                size="sm"
                                onClick={() => startPracticeWord(m, [roundType || 4])}
                                className="text-[11px]"
                              >
                                {getSkillActionName(skillKey)}
                              </Button3D>
                            )}
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
                      <p className="text-xs font-bold text-pink-500">ENjoy AI đang tạo câu chuyện ôn tập thích ứng...</p>
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
                          className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs active:scale-95"
                          title="Bấm để tạo thử thách / câu chuyện ENjoy AI mới"
                        >
                          <ArrowPathIcon className="w-5 h-5" />
                          Đổi thử thách khác 
                        </button>
                      </div>

                      {/* Đoạn văn ngắn chêm từ khóa */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {aiChallenge.story.split('**').map((part, i) =>
                          i % 2 === 1 ? (
                            <span key={i} className="font-bold text-pink-700 px-1.5 py-0.5 mx-0.5 bg-pink-50 rounded-md border border-pink-200 shadow-2xs">
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
                          <strong>Câu hỏi:</strong>{' '}
                          {aiChallenge.question.split('**').map((part, i) =>
                            i % 2 === 1 ? (
                              <span key={i} className="font-bold text-pink-700 px-1.5 py-0.5 mx-0.5 bg-pink-50 rounded-md border border-pink-200 shadow-2xs">
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          )}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          {aiChallenge.options.map((opt, idx) => {
                            const isSelected = selectedAiOption === opt;
                            let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                            if (isSelected) {
                              if (aiAnswerChecked) {
                                btnStyle = aiAnswerCorrect
                                  ? 'bg-emerald-500 border-emerald-500 text-white font-bold'
                                  : 'bg-pink-500 border-pink-500 text-white font-bold';
                              } else {
                                btnStyle = 'bg-pink-50 border-pink-400 text-pink-700 font-bold';
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
                                <span className="text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200">
                                  Đáp án đúng là: <strong>{aiChallenge.correctAnswer}</strong>
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Chọn 1 đáp án và bấm Kiểm Tra</span>
                          )}

                          {!aiAnswerChecked ? (
                            <Button3D
                              variant="pink"
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
