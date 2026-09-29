import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BASE_URL } from '../../../services/apiClient';
import { mistakeApi, type MistakeItem } from '../../learning/services/mistakeApi';
import { MistakePracticePlayer } from '../../practice/components/MistakePracticePlayer';

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

export const PersonalizedListeningModal: React.FC<Props> = ({ skillScore, onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [activePracticeItems, setActivePracticeItems] = useState<MistakeItem[] | null>(null);

  const fetchMistakes = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await mistakeApi.getUserMistakesPaged({ roundType: 5, size: 50 });
      const items: MistakeItem[] = (res as any)?.content || (res as any)?.data?.content || [];
      setMistakes(items);
    } catch (err) {
      console.error('Lỗi khi tải danh sách câu nghe sai:', err);
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
                Luyện nghe
              </h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-[#ff5e97] border border-pink-200">
                {skillScore}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {mistakes.length > 0 
                ? `Có ${mistakes.length} câu luyện nghe cần ôn tập` 
                : 'Đã hoàn thành tốt các bài luyện nghe'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-pink-50/70 hover:bg-pink-100 text-slate-500 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white">
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
              <span className="text-xs text-slate-500">Đang tải danh sách câu nghe...</span>
            </div>
          ) : filteredMistakes.length === 0 ? (
            <div className="py-16 text-center space-y-1.5">
              <h3 className="font-bold text-slate-800 text-sm">Không có câu nghe nào cần ôn tập</h3>
              <p className="text-xs text-slate-400">
                Khả năng nhận diện âm thanh của bé rất tốt.
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
                        {isPlaying ? 'Đang phát...' : 'Nghe lại'}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm truncate">
                            {m.contentText || m.keyword}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-pink-50 text-[#ff5e97] font-semibold border border-pink-200 shrink-0">
                            Kéo thả nghe
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <span className="text-xs text-slate-500">
                            {m.translation || 'Nghe âm thanh và xác định vị trí'}
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
                        onClick={() => setActivePracticeItems([m])}
                        className="px-3.5 py-2 rounded-xl bg-[#ff5e97] hover:bg-[#e84c85] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        Luyện tập
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredMistakes.length > 0 && (
          <div className="px-6 py-4 border-t border-pink-50 bg-white flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Tổng số: {filteredMistakes.length} câu
            </span>
            <button
              onClick={() => setActivePracticeItems(filteredMistakes)}
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
