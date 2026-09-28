import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  XMarkIcon, 
  SpeakerWaveIcon, 
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
import { Mascot } from '../../../components/ui/Mascot';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import { chatbotApi, type AdaptiveChallenge } from '../../learning/services/chatbotApi';
import { learningApi } from '../../learning/services/learningApi';
import type { Vocabulary } from '../../learning/types';
import { FlashcardExercise } from '../../learning/components/exercises/FlashcardExercise';
import { MistakePracticePlayer } from '../../practice/components/MistakePracticePlayer';

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

interface TopicGroup {
  id: string;
  nameVi: string;
  nameEn: string;
  items: MistakeItem[];
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
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'ai_challenge'>('diagnosis');
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isFromRoadmap, setIsFromRoadmap] = useState(false);
  
  // Flashcard review riêng lẻ (Single Item Modal)
  const [reviewItem, setReviewItem] = useState<MistakeItem | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Chế độ mở toàn màn hình (Session Player hoặc Batch Flashcard)
  const [playerMode, setPlayerMode] = useState<'none' | 'flashcard' | 'practice'>('none');

  // AI Challenge State (Có lưu trữ ngữ cảnh theo từng Topic, tránh gọi tạo mới liên tục)
  const [aiChallengeCache, setAiChallengeCache] = useState<Record<string, AdaptiveChallenge>>({});
  const [aiChallenge, setAiChallenge] = useState<AdaptiveChallenge | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedAiOption, setSelectedAiOption] = useState<string | null>(null);
  const [aiAnswerChecked, setAiAnswerChecked] = useState(false);
  const [aiAnswerCorrect, setAiAnswerCorrect] = useState(false);

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
      case 'listening': return 'Luyện Nghe & Chọn Tranh (Màn 5)';
      case 'speaking': return 'Luyện Phát Âm Chuẩn (Màn 3)';
      case 'reading': return 'Luyện Đọc & Ngữ Pháp (Màn 6)';
      case 'writing': return 'Luyện Viết & Xếp Chữ (Màn 4)';
      case 'vocabGrammar': return 'Luyện Từ Vựng & Nối Từ (Màn 2)';
      default: return 'Luyện Tập Thực Hành';
    }
  };

  const roundType = getRoundTypeBySkill(skillKey);

  // Fetch 100% dữ liệu thật từ Backend (Mistakes hoặc Lộ trình bài học đang học)
  const fetchMistakes = useCallback(async () => {
    setLoading(true);
    setIsFromRoadmap(false);
    try {
      // 1. Ưu tiên lấy danh sách lỗi sai của kĩ năng này
      const res = await mistakeApi.getUserMistakesPaged({ roundType, size: 50 });
      if (res && res.content && res.content.length > 0) {
        setMistakes(res.content);
        return;
      }

      // 2. Nếu kĩ năng này chưa có lỗi, kiểm tra các câu làm sai trong toàn bộ lộ trình
      const allMistakes = await mistakeApi.getRoadmapMistakes();
      if (allMistakes && allMistakes.length > 0) {
        setMistakes(allMistakes.map((m: MistakeItem) => ({ ...m, roundType })));
        return;
      }

      // 3. Nếu chưa từng làm sai câu nào, lấy từ vựng thực tế trong lộ trình học của Level 1 / Topic đầu tiên
      const levels = await learningApi.getLevels();
      if (levels && levels.length > 0) {
        const topics = await learningApi.getTopicsByLevel(levels[0].id);
        if (topics && topics.length > 0) {
          const roadmapItems: MistakeItem[] = [];
          for (const topic of topics.slice(0, 3)) {
            const parts = await learningApi.getPartsByTopic(topic.id);
            if (parts && parts.length > 0) {
              const vocabs = await learningApi.getPartVocabularies(parts[0].id);
              if (vocabs && vocabs.length > 0) {
                vocabs.forEach((v: Vocabulary, vIdx: number) => {
                  roadmapItems.push({
                    id: 1000 + vIdx + topic.id * 10,
                    userId: 1,
                    questionId: v.id,
                    contentText: v.word,
                    translation: v.translation,
                    imageUrl: v.imageUrl,
                    audioUrl: v.audioUrl,
                    keyword: topic.title,
                    roundType,
                    wrongAnswerSubmitted: 'Chưa học',
                    status: 'NEEDS_REVIEW',
                    correctStreakDays: 0,
                    masteryScore: 0,
                    createdAt: new Date().toISOString(),
                  });
                });
              }
            }
          }
          if (roadmapItems.length > 0) {
            setMistakes(roadmapItems);
            setIsFromRoadmap(true);
            return;
          }
        }
      }

      setMistakes([]);
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu từ vựng / lỗi sai:', err);
      setMistakes([]);
    } finally {
      setLoading(false);
    }
  }, [roundType]);

  useEffect(() => {
    fetchMistakes();
  }, [fetchMistakes]);

  // Phân nhóm câu sai theo Topic
  const topicGroups: TopicGroup[] = useMemo(() => {
    const map: Record<string, MistakeItem[]> = {};
    
    mistakes.forEach(m => {
      const topicName = m.keyword || 'Tổng Hợp';
      if (!map[topicName]) {
        map[topicName] = [];
      }
      map[topicName].push(m);
    });

    return Object.entries(map).map(([name, items], idx) => ({
      id: `topic-${idx}`,
      nameVi: name,
      nameEn: name,
      items,
    }));
  }, [mistakes]);

  // Lọc danh sách theo Topic được chọn
  const filteredMistakes = useMemo(() => {
    if (selectedTopicId === 'all') return mistakes;
    const group = topicGroups.find(g => g.id === selectedTopicId);
    return group ? group.items : mistakes;
  }, [selectedTopicId, mistakes, topicGroups]);

  // Helpers đọc/ghi bộ nhớ lưu trữ bền vững (LocalStorage + DB)
  const getStorageKey = useCallback((skill: string, topic: string) => `enjoy_ai_challenge_${skill}_${topic}`, []);

  const getStoredAiChallenge = useCallback((skill: string, topic: string): AdaptiveChallenge | null => {
    try {
      const raw = localStorage.getItem(getStorageKey(skill, topic));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.question && Array.isArray(parsed.options) && parsed.options.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return null;
  }, [getStorageKey]);

  const setStoredAiChallenge = useCallback((skill: string, topic: string, data: AdaptiveChallenge) => {
    try {
      localStorage.setItem(getStorageKey(skill, topic), JSON.stringify(data));
    } catch {}
  }, [getStorageKey]);

  // Sinh và lưu trữ ngữ cảnh AI (Chỉ tạo mới khi bấm nút đổi hoặc chưa từng có dữ liệu)
  const loadAiChallenge = useCallback(async (forceRefresh = false) => {
    const cacheKey = `${skillKey}_${selectedTopicId}`;

    // 1. Nếu không forceRefresh, ưu tiên đọc ngay từ LocalStorage / RAM (Tức thì, không tạo mới khi thoát ra vào lại)
    if (!forceRefresh) {
      if (aiChallengeCache[cacheKey]) {
        setAiChallenge(aiChallengeCache[cacheKey]);
        setSelectedAiOption(null);
        setAiAnswerChecked(false);
        setAiAnswerCorrect(false);
        return;
      }

      const localSaved = getStoredAiChallenge(skillKey, selectedTopicId);
      if (localSaved) {
        setAiChallenge(localSaved);
        setAiChallengeCache(prev => ({ ...prev, [cacheKey]: localSaved }));
        setSelectedAiOption(null);
        setAiAnswerChecked(false);
        setAiAnswerCorrect(false);
        return;
      }
    }

    setIsAiLoading(true);
    setSelectedAiOption(null);
    setAiAnswerChecked(false);
    setAiAnswerCorrect(false);

    const activeGroupName = selectedTopicId !== 'all' 
      ? (topicGroups.find(g => g.id === selectedTopicId)?.nameVi || 'Tổng hợp')
      : (filteredMistakes[0]?.keyword || topicGroups[0]?.nameVi || 'Tổng hợp');

    // 2. Nếu LocalStorage chưa có và không forceRefresh, kiểm tra Database
    if (!forceRefresh) {
      try {
        const dbSaved = await mistakeApi.getAiChallenge(skillKey, selectedTopicId);
        if (dbSaved && dbSaved.question && dbSaved.options && dbSaved.options.length > 0) {
          const loadedChallenge: AdaptiveChallenge = {
            title: dbSaved.title,
            story: dbSaved.story,
            storyVi: dbSaved.storyVi || '',
            question: dbSaved.question,
            options: dbSaved.options,
            correctAnswer: dbSaved.correctAnswer,
            hint: dbSaved.hint || '',
          };
          setStoredAiChallenge(skillKey, selectedTopicId, loadedChallenge);
          setAiChallenge(loadedChallenge);
          setAiChallengeCache(prev => ({
            ...prev,
            [cacheKey]: loadedChallenge,
          }));
          setIsAiLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Không thể đọc AI Challenge từ DB, chuyển sang sinh mới:', err);
      }
    }

    // 3. CHỈ KHI chưa từng có dữ liệu ở cả Storage và DB, hoặc người dùng chủ động bấm "Đổi ngữ cảnh AI"
    const mistakeItems = filteredMistakes.slice(0, 4).map(m => ({
      word: m.contentText || m.keyword || '',
      translation: m.translation || '',
      wrongAttempt: m.wrongAnswerSubmitted || '',
    }));

    try {
      const challenge = await chatbotApi.generateAdaptiveChallenge(
        skillDef.nameVi,
        mistakeItems.length > 0 ? mistakeItems : [{ word: 'book', translation: 'quyển sách', wrongAttempt: 'bok' }],
        activeGroupName
      );
      
      // Lưu vào LocalStorage & State
      setStoredAiChallenge(skillKey, selectedTopicId, challenge);
      setAiChallenge(challenge);
      setAiChallengeCache(prev => ({
        ...prev,
        [cacheKey]: challenge,
      }));

      // Lưu vào Database vĩnh viễn
      await mistakeApi.saveAiChallenge({
        skillKey,
        topicId: selectedTopicId,
        topicName: activeGroupName,
        title: challenge.title,
        story: challenge.story,
        storyVi: challenge.storyVi,
        question: challenge.question,
        options: challenge.options,
        correctAnswer: challenge.correctAnswer,
        hint: challenge.hint,
      });
    } catch (err) {
      console.error('Failed to generate AI challenge:', err);
    } finally {
      setIsAiLoading(false);
    }
  }, [filteredMistakes, selectedTopicId, topicGroups, skillDef.nameVi, skillKey, aiChallengeCache, getStoredAiChallenge, setStoredAiChallenge]);

  // Khi chuyển sang tab AI Challenge hoặc đổi Topic thì lấy từ cache hoặc tải mới
  useEffect(() => {
    if (activeTab === 'ai_challenge') {
      loadAiChallenge(false);
    }
  }, [activeTab, selectedTopicId]); // eslint-disable-line react-hooks/exhaustive-deps

  const playAudio = (word: string, audioUrl?: string) => {
    if (audioUrl) {
      new Audio(getAssetUrl(audioUrl)).play().catch(() => {});
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const vocabularies: Vocabulary[] = filteredMistakes.map(m => ({
    id: m.questionId || m.id,
    word: m.contentText || m.keyword || '',
    translation: m.translation || '',
    imageUrl: m.imageUrl,
    audioUrl: m.audioUrl,
  }));

  const handleAiCheck = () => {
    if (!selectedAiOption || !aiChallenge) return;
    const isRight = selectedAiOption.trim().toLowerCase() === aiChallenge.correctAnswer.trim().toLowerCase();
    setAiAnswerCorrect(isRight);
    setAiAnswerChecked(true);
  };

  // Mở Single Flashcard Modal
  const openSingleReview = (item: MistakeItem) => {
    setReviewItem(item);
    setIsFlipped(false);
    playAudio(item.contentText || item.keyword || '', item.audioUrl);
  };

  const IconComponent = skillDef.icon;

  // 1. Chơi Flashcard toàn bộ chủ đề đã lọc
  if (playerMode === 'flashcard') {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded-xl font-bold text-xs">
              Bước 1: Ôn lại từ vựng ({filteredMistakes.length} từ)
            </span>
          </div>
          <button 
            onClick={() => setPlayerMode('none')}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full max-w-xl flex-1 flex flex-col justify-center">
          <FlashcardExercise
            vocabularies={vocabularies}
            onComplete={() => setPlayerMode('none')}
          />
        </div>
      </div>
    );
  }

  // 2. Chơi Luyện tập chính thức (Reorder / MatchWord / Speaking / etc.)
  if (playerMode === 'practice') {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
        
        {/* Header Modal Tinh Tế với Điểm Nhấn Màu Sắc Kỹ Năng */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${skillDef.color}15`,
                borderColor: `${skillDef.color}35`,
                color: skillDef.color,
              }}
            >
              <IconComponent className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Khắc phục kỹ năng: <span style={{ color: skillDef.color }}>{skillDef.nameVi}</span> ({skillDef.nameEn})
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                  skillScore >= 80 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : skillScore >= 50
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {skillScore}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ôn tập từ vựng làm sai theo chủ đề và thử thách thích ứng thông minh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Cân Đối - Tone Hồng Chủ Đạo */}
        <div className="px-5 pt-1 border-b border-slate-200 flex items-center gap-6 bg-slate-50/60">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diagnosis'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Lộ trình ôn tập</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'diagnosis' ? 'bg-pink-100 text-pink-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {filteredMistakes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai_challenge')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_challenge'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Thử thách với ENJOY AI</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
              AI
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">

          {/* TAB 1: DANH SÁCH LỖI SAI & LỘ TRÌNH ÔN */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Mascot Bubble Thông báo Tone Hồng Nhẹ */}
              <div className="bg-pink-50/70 border border-pink-100 rounded-xl p-3.5 text-xs text-pink-950 flex items-center gap-3">
                <Mascot expression={isFromRoadmap ? 'happy' : 'thinking'} size={48} />
                <p className="leading-relaxed">
                  {isFromRoadmap 
                    ? 'Bé chưa có lỗi sai ở kỹ năng này! Dưới đây là các từ vựng trong bài học đang học để bé luyện tập củng cố.'
                    : 'Chọn từng chủ đề bên dưới để ôn lại các câu bé đã làm sai. Nhấn vào từng thẻ để lật xem nghĩa và nghe âm thanh.'}
                </p>
              </div>

              {/* Bộ lọc Topic - Nổi bật Tone Hồng */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => setSelectedTopicId('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      selectedTopicId === 'all'
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    Tất cả ({mistakes.length})
                  </button>

                  {topicGroups.map((g) => {
                    const isSelected = selectedTopicId === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setSelectedTopicId(g.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-pink-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                        }`}
                      >
                        <span>{g.nameVi}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-pink-400 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {g.items.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Danh sách thẻ từ vựng sạch sẽ, điểm nhấn tone hồng */}
              <div className="space-y-2">
                {loading ? (
                  <div className="py-8 text-center text-xs text-slate-400">Đang tải dữ liệu...</div>
                ) : filteredMistakes.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Chưa có từ vựng nào trong chủ đề này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredMistakes.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => openSingleReview(m)}
                        className="bg-white border border-slate-200 hover:border-pink-300 hover:shadow-xs rounded-xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {m.imageUrl && (
                            <img
                              src={getAssetUrl(m.imageUrl)}
                              alt={m.contentText}
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors truncate">
                                {m.contentText || m.keyword}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playAudio(m.contentText || m.keyword || '', m.audioUrl);
                                }}
                                className="p-1 text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 rounded-md cursor-pointer transition-colors"
                                title="Nghe phát âm"
                              >
                                <SpeakerWaveIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[11px] text-slate-500 block truncate font-medium">
                              {m.translation || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Tag kết quả lần trước */}
                        <div className="text-right shrink-0">
                          <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                            m.wrongAnswerSubmitted === 'Chưa học'
                              ? 'text-slate-600 bg-slate-100 border-slate-200'
                              : 'text-rose-600 bg-rose-50 border-rose-200 line-through'
                          }`}>
                            {m.wrongAnswerSubmitted || 'Chưa đúng'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Khối Hành Động 2 Bước Tươi Sáng & Hiện Đại */}
              <div className="bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-white border-2 border-pink-100 rounded-2xl p-4 sm:p-4.5 space-y-3.5 shadow-xs mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-pink-500 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Lộ trình ôn tập 2 bước ({skillDef.nameVi})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Ôn lại lý thuyết thẻ ghi nhớ rồi làm bài tập phản xạ kỹ năng
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                    {filteredMistakes.length} từ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white border border-pink-100 hover:border-pink-300 rounded-xl p-3 flex flex-col justify-between shadow-xs transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Bước 1
                        </span>
                        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.2 rounded border border-pink-100">
                          Ghi nhớ
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mb-0.5">
                        Xem Thẻ Flashcard
                      </p>
                      <p className="text-[11px] text-slate-500 mb-3 line-clamp-1">
                        Lật thẻ xem nghĩa & nghe âm thanh
                      </p>
                    </div>

                    <Button3D
                      variant="pink"
                      size="sm"
                      fullWidth
                      disabled={filteredMistakes.length === 0}
                      onClick={() => setPlayerMode('flashcard')}
                    >
                      BẮT ĐẦU BƯỚC 1
                    </Button3D>
                  </div>

                  <div className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-xl p-3 flex flex-col justify-between shadow-xs transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Bước 2
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                          Thực hành
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mb-0.5">
                        Luyện Kỹ Năng {skillDef.nameVi}
                      </p>
                      <p className="text-[11px] text-slate-500 mb-3 line-clamp-1">
                        {getSkillActionName(skillKey)}
                      </p>
                    </div>

                    <Button3D
                      variant="green"
                      size="sm"
                      fullWidth
                      disabled={filteredMistakes.length === 0}
                      onClick={() => setPlayerMode('practice')}
                    >
                      BẮT ĐẦU BƯỚC 2
                    </Button3D>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TRỢ LÝ AI CAN THIỆP (REAL BACKEND AI ADAPTIVE CHALLENGE CÓ LƯU TRỮ NGỮ CẢNH) */}
          {activeTab === 'ai_challenge' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Header Tab AI với Điểm Nhấn Tone Hồng */}
              <div className="bg-gradient-to-r from-pink-50/80 to-rose-50/80 border border-pink-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Ngữ cảnh AI: Chủ đề <span className="text-pink-600 font-bold">{selectedTopicId !== 'all' ? topicGroups.find(g => g.id === selectedTopicId)?.nameVi : (filteredMistakes[0]?.keyword || 'Tổng hợp')}</span>
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Câu chuyện ngắn chêm từ khóa tiếng Anh bé đã làm sai giúp ghi nhớ tự nhiên
                  </p>
                </div>

                <button
                  onClick={() => loadAiChallenge(true)}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-white hover:bg-pink-50 text-pink-600 rounded-lg border border-pink-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  title="Chỉ tạo ngữ cảnh mới khi bạn bấm vào đây"
                >
                  <ArrowPathIcon className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                  Đổi ngữ cảnh AI
                </button>
              </div>

              {/* Trạng thái đang tải AI */}
              {isAiLoading && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center space-y-2 text-center">
                  <Mascot expression="thinking" size={60} />
                  <span className="text-xs font-bold text-pink-600">
                    AI đang soạn câu chuyện theo chủ đề...
                  </span>
                </div>
              )}

              {/* Hộp câu chuyện AI sinh ra */}
              {!isAiLoading && aiChallenge && (
                <div className="bg-white border border-pink-200/80 rounded-xl p-4 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">
                      {aiChallenge.title}
                    </span>
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md border border-pink-200">
                      Ngữ cảnh đã lưu
                    </span>
                  </div>

                  {/* Đoạn văn tiếng Việt chêm từ khóa tiếng Anh nổi bật */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                      {aiChallenge.story.split('**').map((part, i) => 
                        i % 2 === 1 ? (
                          <span key={i} className="text-amber-900 font-bold px-2 py-0.5 mx-1 bg-amber-100 border border-amber-300 rounded-md inline-block shadow-2xs">
                            {part}
                          </span>
                        ) : part
                      )}
                    </p>
                  </div>

                  {/* Gợi ý mẹo nhớ nếu có */}
                  {aiChallenge.hint && (
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
                      <strong className="font-bold text-amber-950">💡 Gợi ý mẹo nhớ:</strong> {aiChallenge.hint}
                    </div>
                  )}

                  {/* Câu đố tương tác */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-xs font-bold text-slate-800 block">
                      Câu hỏi: {aiChallenge.question}
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {aiChallenge.options.map((opt, idx) => {
                        const isSelected = selectedAiOption === opt;
                        let btnClass = 'bg-white hover:bg-pink-50/50 text-slate-800 border-slate-200 hover:border-pink-300';
                        
                        if (isSelected) {
                          if (aiAnswerChecked) {
                            btnClass = aiAnswerCorrect 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-rose-600 text-white border-rose-600 shadow-xs';
                          } else {
                            btnClass = 'bg-pink-50 text-pink-900 border-pink-500 ring-2 ring-pink-400/30';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!aiAnswerChecked) setSelectedAiOption(opt);
                            }}
                            disabled={aiAnswerChecked}
                            className={`p-2.5 rounded-lg border-2 font-bold text-xs transition-all cursor-pointer ${btnClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback kết quả */}
                    <div className="flex items-center justify-between pt-2">
                      {aiAnswerChecked ? (
                        <div className="text-xs">
                          {aiAnswerCorrect ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              🎉 Chính xác! Bé làm rất tốt.
                            </span>
                          ) : (
                            <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
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
                        >
                          KIỂM TRA
                        </Button3D>
                      ) : (
                        <Button3D
                          variant="green"
                          size="sm"
                          onClick={() => loadAiChallenge(true)}
                        >
                          ĐỔI CÂU TIẾP THEO
                        </Button3D>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* MODAL REVIEW RIÊNG 1 TỪ VỰNG (SINGLE FLASHCARD MODAL) */}
      {reviewItem && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-xs w-full space-y-3.5 shadow-2xl text-center">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">
                Thẻ từ vựng
              </span>
              <button 
                onClick={() => setReviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Thẻ Lật 2 Mặt Tương Tác */}
            <div 
              onClick={() => setIsFlipped(f => !f)}
              className="w-full aspect-4/3 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-pink-300 hover:bg-pink-50/20 transition-all select-none"
            >
              {!isFlipped ? (
                <>
                  {reviewItem.imageUrl && (
                    <img 
                      src={getAssetUrl(reviewItem.imageUrl)} 
                      alt={reviewItem.contentText}
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                  )}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-lg font-bold text-slate-900">
                      {reviewItem.contentText || reviewItem.keyword}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(reviewItem.contentText || reviewItem.keyword || '', reviewItem.audioUrl);
                      }}
                      className="p-1 text-pink-600 hover:text-pink-800 bg-pink-50 rounded-md cursor-pointer"
                    >
                      <SpeakerWaveIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Bấm để lật xem nghĩa</span>
                </>
              ) : (
                <div className="space-y-1 py-4">
                  <span className="text-xs text-slate-400">Nghĩa tiếng Việt:</span>
                  <p className="text-xl font-bold text-pink-900">
                    {reviewItem.translation || '—'}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">Bấm để lật lại</span>
                </div>
              )}
            </div>

            {/* Lỗi sai lần trước */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
              <span className="text-slate-500">Lần trước bé gõ:</span>
              <span className="font-semibold text-rose-600 line-through">
                {reviewItem.wrongAnswerSubmitted || 'Chưa đúng'}
              </span>
            </div>

            <Button3D
              variant="blue"
              fullWidth
              size="sm"
              onClick={() => setReviewItem(null)}
            >
              ĐÃ XEM XONG
            </Button3D>
          </div>
        </div>
      )}

    </div>
  );
};


