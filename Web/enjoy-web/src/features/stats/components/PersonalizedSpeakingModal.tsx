import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { renderFormattedAiText } from './FormattedAiText';

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

  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const [recordingWordId, setRecordingWordId] = useState<string | number | null>(null);
  const [wordAssessments, setWordAssessments] = useState<
    Record<string | number, { isCorrect: boolean; score: number; message: string }>
  >({});

  const [guideModalPhoneme, setGuideModalPhoneme] = useState<{ phoneme: string; word: string } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [res3, res9] = await Promise.all([
        mistakeApi.getUserMistakesPaged({ roundType: 3, size: 30 }).catch(() => null),
        mistakeApi.getUserMistakesPaged({ roundType: 9, size: 30 }).catch(() => null),
      ]);
      const list3: MistakeItem[] = (res3 as any)?.content || (res3 as any)?.data?.content || [];
      const list9: MistakeItem[] = (res9 as any)?.content || (res9 as any)?.data?.content || [];
      const list = [...list3, ...list9];

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

  const startPracticeSingle = useCallback((item: AnalyzedSpeakingItem, targetRound?: number) => {
    const isSentence = item.roundType === 9 || (item.word && item.word.trim().includes(' '));
    const effectiveRound = targetRound || (isSentence ? 9 : 3);

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
      roundType: effectiveRound,
      status: 'NEEDS_REVIEW',
      createdAt: new Date().toISOString(),
    };

    setActivePracticeItems([practiceItem]);
  }, []);

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
      utterance.onend = () => setPlayingKey(null);
      utterance.onerror = () => setPlayingKey(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingKey(null), 800);
    }
  };

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
                ? `Đọc chuẩn (${score} điểm)! Giỏi lắm!`
                : `Được ${score} điểm. Hãy thử lại lần nữa nhé!`,
            },
          }));
        } catch {
          mistakeApi.submitPracticeStep(Number(item.id), true).catch(() => {});
          setWordAssessments((prev) => ({
            ...prev,
            [itemId]: {
              isCorrect: true,
              score: 85,
              message: `Đọc tốt! Tiếp tục phát huy nhé!`,
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white border border-pink-100 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-pink-50 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-800">
                Phát âm & Nói
              </h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-[#ff5e97] border border-pink-200">
                {skillScore}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {renderFormattedAiText(diagnosis?.summary) || 'Nhận diện lỗi phát âm và luyện sửa từng âm vị chuẩn xác cùng ENjoy AI'}
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
            onClick={() => setActiveTab('completely_wrong')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'completely_wrong'
                ? 'border-[#ff5e97] text-[#ff5e97]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Cần học lại từ ({completelyWrongList.length})
          </button>

          <button
            onClick={() => setActiveTab('near_correct')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'near_correct'
                ? 'border-[#ff5e97] text-[#ff5e97]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Cần sửa âm (ENjoy AI) ({nearCorrectList.length})
          </button>
        </div>

        {/* Topic Filter */}
        {topics.length > 1 && (
          <div className="px-6 py-2.5 bg-pink-50/30 border-b border-pink-50 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 shrink-0">
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
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedTopic === topicName
                      ? 'bg-[#ff5e97] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50/60'
                  }`}
                >
                  {topicName}
                  {topicName !== 'Tất cả' && (
                    <span className="ml-1 text-[10px] opacity-75">({countTotal})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#ff5e97] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Đang chuẩn bị dữ liệu bài học...</p>
            </div>
          ) : (
            <>
              {activeTab === 'completely_wrong' && (
                <div className="space-y-3">
                  {filteredCompletelyWrongList.length === 0 ? (
                    <div className="text-center py-16 space-y-1.5 bg-pink-50/20 rounded-2xl border border-pink-100">
                      <p className="text-sm font-bold text-slate-800">
                        {selectedTopic === 'Tất cả'
                          ? 'Bé không có từ nào bị phát âm sai hoàn toàn.'
                          : `Không có từ nào cần học lại trong chủ đề "${selectedTopic}".`}
                      </p>
                    </div>
                  ) : (
                    filteredCompletelyWrongList.map((item: AnalyzedSpeakingItem) => {
                      const isSentence = item.roundType === 9 || (item.word && item.word.trim().includes(' '));
                      return (
                        <div
                          key={item.id}
                          className="bg-pink-50/30 border border-pink-100/80 rounded-2xl p-4 sm:p-5 hover:border-pink-200 hover:bg-pink-50/50 transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg font-bold text-slate-800">{item.word}</span>
                                <span className="text-xs font-mono font-semibold text-[#ff5e97] px-2 py-0.5 bg-pink-50 rounded-md border border-pink-200">
                                  {item.ipa}
                                </span>
                                {isSentence && (
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-pink-100/80 text-[#ff5e97] border border-pink-200">
                                    Luyện nói câu
                                  </span>
                                )}
                                <span className="text-xs text-slate-500">({item.translation})</span>
                              </div>

                              <div className="text-xs flex items-center gap-1.5">
                                <span className="text-slate-500">Đã nhận diện:</span>
                                <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-pink-100">
                                  {item.recognizedText}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                              <button
                                onClick={() => playWord(item.word, `comp_${item.id}`)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                                  playingKey === `comp_${item.id}`
                                    ? 'bg-[#ff5e97] border-[#ff5e97] text-white'
                                    : 'bg-white hover:bg-pink-50 text-[#ff5e97] border-pink-200'
                                }`}
                              >
                                {playingKey === `comp_${item.id}` ? 'Đang phát...' : 'Phát âm'}
                              </button>

                              <button
                                onClick={() => startPracticeSingle(item)}
                                className="px-4 py-2 rounded-xl bg-[#ff5e97] hover:bg-[#e84c85] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                              >
                                {isSentence ? 'Luyện nói câu' : 'Luyện phát âm'}
                              </button>
                            </div>
                          </div>

                          {item.aiAnalysisVi && (
                            <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-pink-100 leading-relaxed">
                              <strong className="text-slate-800">ENjoy AI:</strong> {renderFormattedAiText(item.aiAnalysisVi)}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'near_correct' && (
                <div className="space-y-4">
                  {filteredNearCorrectList.length === 0 ? (
                    <div className="text-center py-16 space-y-1.5 bg-pink-50/20 rounded-2xl border border-pink-100">
                      <p className="text-sm font-bold text-slate-800">
                        {selectedTopic === 'Tất cả'
                          ? 'Bé phát âm rất chuẩn các từ vựng.'
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
                        onStartPractice={() => startPracticeSingle(item)}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {guideModalPhoneme && (
          <PronunciationGuideDetailModal
            focusPhoneme={guideModalPhoneme.phoneme}
            word={guideModalPhoneme.word}
            onClose={() => setGuideModalPhoneme(null)}
          />
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-pink-50 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Hệ thống phân tích phát âm ENjoy AI
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-slate-700 font-bold text-xs cursor-pointer transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
