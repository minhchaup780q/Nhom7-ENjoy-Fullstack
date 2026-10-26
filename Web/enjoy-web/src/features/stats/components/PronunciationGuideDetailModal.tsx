import React, { useState } from 'react';
import { type PhoneticItem } from '../../pronunciation/components/PronunciationGuidePage';
import { findGuidePhoneticItem } from '../../learning/services/pronunciationHelper';

interface Props {
  focusPhoneme: string;
  word: string;
  onClose: () => void;
}

export const PronunciationGuideDetailModal: React.FC<Props> = ({
  focusPhoneme,
  word,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const cleanSymbol = focusPhoneme.replace(/[\/ˈˌ.]/g, '').trim();
  const guideItem: PhoneticItem | undefined = findGuidePhoneticItem(focusPhoneme);
  const mouthTip = guideItem?.type === 'vowel'
    ? `Mở rộng khẩu hình miệng theo đúng nguyên âm /${cleanSymbol}/ và phát âm to rõ.`
    : `Đặt vị trí lưỡi và răng chuẩn xác, đẩy luồng hơi dứt khoát theo phụ âm /${cleanSymbol}/.`;

  const playSound = (textToSpeak: string, isPhonemeChar = false) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = isPhonemeChar ? 0.75 : 0.85;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const soundTextToPlay = guideItem?.soundText || cleanSymbol;
  const exampleWord = guideItem?.word || word;

  return (
    <div className="fixed inset-0 z-70 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 font-display">
              Hướng dẫn đọc âm /{cleanSymbol}/
            </h3>
            <p className="text-xs text-slate-400">
              {guideItem?.type === 'vowel' ? 'Nguyên âm tiếng Anh' : 'Phụ âm tiếng Anh'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Khung Trọng Tâm Ký Tự IPA */}
        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col items-center justify-center space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
            Ký hiệu IPA
          </span>
          <div className="text-4xl font-mono font-bold text-sky-600">
            /{cleanSymbol}/
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Cách phát âm: <span className="font-mono text-sky-600 font-bold">"{soundTextToPlay}"</span>
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => playSound(soundTextToPlay, true)}
              disabled={isPlaying}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white hover:bg-sky-50 text-sky-700 border-sky-200'
              }`}
            >
              {isPlaying ? 'Đang phát...' : `Nghe âm /${cleanSymbol}/`}
            </button>

            <button
              onClick={() => playSound(exampleWord, false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer"
            >
              Từ mẫu: "{exampleWord}"
            </button>
          </div>
        </div>

        {/* Khẩu hình miệng */}
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800">
              Khẩu hình răng - môi - lưỡi:
            </div>
            <p className="text-slate-600 leading-relaxed">
              {mouthTip}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            Đã hiểu cách đọc
          </button>
        </div>
      </div>
    </div>
  );
};
