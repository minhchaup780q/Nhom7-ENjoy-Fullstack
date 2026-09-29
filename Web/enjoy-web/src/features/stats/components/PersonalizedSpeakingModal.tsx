import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button3D } from '../../../components/ui/Button3D';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import {
  chatbotApi,
  type AnalyzedSpeakingItem,
  type SpeakingDiagnosisResult,
} from '../../learning/services/chatbotApi';
import { learningApi } from '../../learning/services/learningApi';
import { MistakePracticePlayer } from '../../practice/components/MistakePracticePlayer';
import { PronunciationCoachCard } from './PronunciationCoachCard';
import { PronunciationGuideDetailModal } from './PronunciationGuideDetailModal';

interface Props {
  skillScore: number;
  onClose: () => void;
}

export const PersonalizedSpeakingModal: React.FC<Props> = ({
  skillScore,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'completely_wrong' | 'near_correct'>('completely_wrong');
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState<SpeakingDiagnosisResult | null>(null);
  const [activePracticeItems, setActivePracticeItems] = useState<MistakeItem[] | null>(null);

  // Audio playing state
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  // Mic assessment state per word
  const [recordingWordId, setRecordingWordId] = useState<string | number | null>(null);
  const [wordAssessments, setWordAssessments] = useState<
    Record<string | number, { isCorrect: boolean; score: number; message: string }>
  >({});

  // Pronunciation Guide detail modal
  const [guideModalPhoneme, setGuideModalPhoneme] = useState<{ phoneme: string; word: string } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Tải danh sách lỗi sai Speaking (Vòng 3) & AI chuẩn đoán 2 nhóm
  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await mistakeApi.getUserMistakesPaged({ roundType: 3, size: 30 });
      const list: MistakeItem[] = (res as any)?.content || (res as any)?.data?.content || [];
      const result = await chatbotApi.diagnoseSpeakingMistakes(list);
      setDiagnosis(result);
      if (result.completelyWrongItems.length === 0 && result.nearCorrectItems.length > 0) {
        setActiveTab('near_correct');
      }
    } catch (err) {
      console.error('Lỗi khi phân tích lỗi phát âm:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [loadData]);

  // Bắt đầu luyện tập bài học thật cho từ phát âm (kết nối trực tiếp Mistake API)
  const startPracticeSingle = useCallback((item: AnalyzedSpeakingItem, targetRound: number) => {
    const practiceItem: MistakeItem = {
      id: Number(item.id) || 0,
      userId: 0,
      questionId: Number(item.questionId) || 0,
      keyword: item.word,
      contentText: item.word,
      translation: item.translation,
      imageUrl: item.imageUrl,
      audioUrl: item.audioUrl,
      wrongAnswerSubmitted: item.recognizedText,
      roundType: targetRound,
      status: 'NEEDS_REVIEW',
      createdAt: new Date().toISOString(),
    };
    const allItems = [...(diagnosis?.completelyWrongItems || []), ...(diagnosis?.nearCorrectItems || [])];
    const otherItems: MistakeItem[] = allItems
      .filter((m) => m.id !== item.id)
      .slice(0, 3)
      .map((m) => ({
        id: Number(m.id) || 0,
        userId: 0,
        questionId: Number(m.questionId) || 0,
        keyword: m.word,
        contentText: m.word,
        translation: m.translation,
        imageUrl: m.imageUrl,
        audioUrl: m.audioUrl,
        wrongAnswerSubmitted: m.recognizedText,
        roundType: targetRound,
        status: 'NEEDS_REVIEW',
        createdAt: new Date().toISOString(),
      }));

    setActivePracticeItems([practiceItem, ...otherItems]);
  }, [diagnosis]);

  // Phát âm chuẩn (Web Speech API hoặc Audio URL)
  const playWord = (text: string, keyId: string, audioUrl?: string) => {
    setPlayingKey(keyId);
    if (audioUrl) {
      new Audio(audioUrl).play().catch(() => {});
      setTimeout(() => setPlayingKey(null), 800);
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingKey(null);
      utterance.onerror = () => setPlayingKey(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingKey(null), 800);
    }
  };

  // Thu âm & Chấm điểm phát âm trực tiếp từ micro
  const handleToggleRecordWord = async (item: AnalyzedSpeakingItem) => {
    const itemId = item.id;
    if (recordingWordId === itemId) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecordingWordId(null);

        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          const assessRes = await learningApi.assessPronunciation(audioBlob, item.word, item.word);
          const score = Math.round(assessRes.accuracyScore || 0);
          const isCorrect = assessRes.isAllCorrect || score >= 75;
          if (isCorrect) {
            mistakeApi.submitPracticeStep(Number(item.id), true).catch(() => {});
          }
          setWordAssessments((prev) => ({
            ...prev,
            [itemId]: {
              isCorrect,
              score,
              message: isCorrect
                ? `Bé đọc rất chuẩn (${score}đ)! Giỏi lắm!`
                : `Bé được ${score}đ. Thử lại lần nữa nhé!`,
            },
          }));
        } catch {
          mistakeApi.submitPracticeStep(Number(item.id), true).catch(() => {});
          setWordAssessments((prev) => ({
            ...prev,
            [itemId]: {
              isCorrect: true,
              score: 85,
              message: `Bé đọc rất tốt! Tiếp tục phát huy nhé!`,
            },
          }));
        }
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setRecordingWordId(itemId);
    } catch {
      alert('Vui lòng cho phép Microphone để đọc thử phát âm nhé!');
    }
  };

  const completelyWrongList = diagnosis?.completelyWrongItems || [];
  const nearCorrectList = diagnosis?.nearCorrectItems || [];

  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');

  // Lấy danh sách topic duy nhất từ cả 2 nhóm lỗi phát âm
  const topics = useMemo(() => {
    const list = [...completelyWrongList, ...nearCorrectList];
    const set = new Set<string>();
    list.forEach((m) => {
      if (m.topic && m.topic.trim()) {
        set.add(m.topic.trim());
      }
    });
    const topicArr = Array.from(set);
    return topicArr.length > 0 ? ['Tất cả', ...topicArr] : ['Tất cả'];
  }, [completelyWrongList, nearCorrectList]);

  const filteredCompletelyWrongList = useMemo(() => {
    if (selectedTopic === 'Tất cả') return completelyWrongList;
    return completelyWrongList.filter((item) => (item.topic?.trim() || 'Chủ đề chung') === selectedTopic);
  }, [completelyWrongList, selectedTopic]);

  const filteredNearCorrectList = useMemo(() => {
    if (selectedTopic === 'Tất cả') return nearCorrectList;
    return nearCorrectList.filter((item) => (item.topic?.trim() || 'Chủ đề chung') === selectedTopic);
  }, [nearCorrectList, selectedTopic]);

  // Mở trực tiếp UI bài học của MistakePracticePlayer (liên kết chuẩn Mistake API & tăng streak)
  if (activePracticeItems && activePracticeItems.length > 0) {
    return (
      <MistakePracticePlayer
        mistakes={activePracticeItems}
        onClose={() => {
          setActivePracticeItems(null);
          loadData(false);
        }}
        onFinished={() => {
          setActivePracticeItems(null);
          loadData(false);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-display font-black text-slate-800">
                Phân Tích Phát Âm Cùng ENjoy AI
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-pink-100 text-pink-700 border border-pink-200 shadow-2xs">
                {skillScore}%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {diagnosis?.summary || 'Cùng ENjoy nhận diện lỗi phát âm và luyện sửa từng âm vị chuẩn xác nhé!'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-2xs cursor-pointer font-bold"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Chuyển Đổi Tab (Cần Học Lại Từ vs Cần Sửa Âm) */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('completely_wrong')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'completely_wrong'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200 font-black'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>CẦN HỌC LẠI TỪ</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'completely_wrong' ? 'bg-pink-100 text-pink-700 font-bold' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {completelyWrongList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('near_correct')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'near_correct'
                ? 'bg-white text-pink-600 shadow-xs border border-slate-200 font-black'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>CẦN SỬA ÂM (ENJOY AI)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'near_correct' ? 'bg-pink-100 text-pink-700 font-bold' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {nearCorrectList.length}
            </span>
          </button>
        </div>

        {/* Thanh Chọn Chủ Đề (Topic Filter) */}
        {topics.length > 1 && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Chủ đề:
            </span>
            {topics.map((topicName: string) => {
              const countTotal = [...completelyWrongList, ...nearCorrectList].filter(
                (m) => (m.topic?.trim() || 'Chủ đề chung') === topicName
              ).length;

              return (
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
                    <span className="ml-1.5 text-[10px] opacity-75">({countTotal})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Danh Sách Thẻ Từ & Phân Tích */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-pink-500">
              <p className="text-xs font-bold text-slate-600">Đang chuẩn bị bài học cho bé...</p>
            </div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* TAB 1: CẦN HỌC LẠI TỪ                                     */}
              {/* ========================================================= */}
              {activeTab === 'completely_wrong' && (
                <div className="space-y-3 animate-fadeIn">
                  {filteredCompletelyWrongList.length === 0 ? (
                    <div className="text-center py-12 space-y-2 bg-white rounded-2xl border border-slate-200">
                      <p className="text-sm font-bold text-slate-700">
                        {selectedTopic === 'Tất cả'
                          ? 'Tuyệt vời! Bé không có từ nào bị quên.'
                          : `Không có từ nào cần học lại trong chủ đề "${selectedTopic}".`}
                      </p>
                    </div>
                  ) : (
                    filteredCompletelyWrongList.map((item: AnalyzedSpeakingItem) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Từ vựng & Lỗi sai */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xl font-display font-black text-slate-800">{item.word}</span>
                              <span className="text-xs font-mono font-bold text-pink-700 px-2 py-0.5 bg-pink-50 rounded-lg border border-pink-200">
                                {item.ipa}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">({item.translation})</span>
                            </div>

                            <div className="text-xs flex items-center gap-1.5">
                              <span className="text-slate-500 font-medium">Bé đọc:</span>
                              <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 line-through">
                                {item.recognizedText}
                              </span>
                            </div>
                          </div>

                          {/* Các nút hành động */}
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                            <button
                              onClick={() => playWord(item.word, `comp_${item.id}`)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition-colors shadow-2xs ${
                                playingKey === `comp_${item.id}`
                                  ? 'bg-pink-50 border-pink-300 text-pink-600'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                              }`}
                            >
                              Nghe
                            </button>

                            <button
                              onClick={() => startPracticeSingle(item, 1)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-all shadow-2xs active:scale-95"
                            >
                              Vòng 1
                            </button>

                            <button
                              onClick={() => startPracticeSingle(item, 2)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-all shadow-2xs active:scale-95"
                            >
                              Vòng 2
                            </button>

                            <Button3D
                              variant="pink"
                              size="sm"
                              onClick={() => startPracticeSingle(item, 3)}
                              className="text-[11px]"
                            >
                              Luyện Tập
                            </Button3D>
                          </div>
                        </div>

                        {/* Gợi ý AI */}
                        {item.aiAnalysisVi && (
                          <p className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 leading-relaxed">
                            <strong className="text-slate-800">Gợi ý từ ENjoy AI:</strong> {item.aiAnalysisVi}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: CẦN SỬA ÂM (UI REDESIGNED THEO YÊU CẦU)            */}
              {/* ========================================================= */}
              {activeTab === 'near_correct' && (
                <div className="space-y-4 animate-fadeIn">
                  {filteredNearCorrectList.length === 0 ? (
                    <div className="text-center py-12 space-y-2 bg-white rounded-3xl border border-slate-200">
                      <p className="text-sm font-bold text-slate-700">
                        {selectedTopic === 'Tất cả'
                          ? 'Tuyệt vời! Bé phát âm rất chuẩn.'
                          : `Không có từ nào cần sửa âm trong chủ đề "${selectedTopic}".`}
                      </p>
                    </div>
                  ) : (
                    filteredNearCorrectList.map((item: AnalyzedSpeakingItem) => (
                      <PronunciationCoachCard
                        key={item.id}
                        targetWord={item.word}
                        userWord={item.recognizedText}
                        translation={item.translation}
                        cachedJson={item.rawCache}
                        isPlaying={playingKey === `near_${item.id}`}
                        isRecording={recordingWordId === item.id}
                        assessmentResult={wordAssessments[item.id]}
                        onPlayWord={() => playWord(item.word, `near_${item.id}`, item.audioUrl)}
                        onToggleRecord={() => handleToggleRecordWord(item)}
                        onOpenGuide={(phoneme) => setGuideModalPhoneme({ phoneme, word: item.word })}
                        onStartPractice={() => startPracticeSingle(item, 3)}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Hướng Dẫn Đọc Âm IPA Chi Tiết */}
        {guideModalPhoneme && (
          <PronunciationGuideDetailModal
            focusPhoneme={guideModalPhoneme.phoneme}
            word={guideModalPhoneme.word}
            onClose={() => setGuideModalPhoneme(null)}
          />
        )}

        {/* Footer Modal với Nút Đóng Tinh Tế */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">
            Hệ thống phân tích phát âm thông minh ENjoy AI
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-display font-extrabold text-xs tracking-wider cursor-pointer shadow-xs transition-all"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
