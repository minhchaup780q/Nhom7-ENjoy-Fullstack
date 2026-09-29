import React, { useState } from 'react';
import { SpeakerWaveIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
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

  // Phát âm thanh của ký tự IPA hoặc từ ví dụ (giống tab Phát Âm)
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
    <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-display font-black text-slate-800">
              Hướng Dẫn Đọc Âm /{cleanSymbol}/
            </h3>
            <p className="text-[11px] font-medium text-slate-500">
              {guideItem?.type === 'vowel' ? 'Nguyên âm tiếng Anh' : 'Phụ âm tiếng Anh'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            aria-label="Đóng"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Khung Trọng Tâm Ký Tự IPA */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-pink-50/80 to-white border-2 border-pink-200/80 flex flex-col items-center justify-center space-y-2 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-100/80 px-2.5 py-0.5 rounded-full border border-pink-200">
            Bảng Ký Hiệu Quốc Tế (IPA)
          </span>
          <div className="text-4xl font-mono font-black text-pink-600">
            /{cleanSymbol}/
          </div>
          <p className="text-xs font-bold text-slate-600">
            Cách đọc chuẩn: <span className="font-mono text-pink-600 font-black">"{soundTextToPlay}"</span>
          </p>

          {/* Nút nghe âm & từ ví dụ */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => playSound(soundTextToPlay, true)}
              disabled={isPlaying}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                isPlaying
                  ? 'bg-pink-100 text-pink-700 border-pink-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <SpeakerWaveIcon className="w-3.5 h-3.5 text-pink-500" />
              Nghe âm /{cleanSymbol}/
            </button>

            <button
              onClick={() => playSound(exampleWord, false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <SpeakerWaveIcon className="w-3.5 h-3.5 text-slate-400" />
              Từ mẫu: "{exampleWord}"
            </button>
          </div>
        </div>

        {/* Khẩu hình miệng chi tiết */}
        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-800">
              Khẩu hình răng - môi - lưỡi:
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              {mouthTip}
            </p>
          </div>

          {/* Thông tin video hỗ trợ (sẵn sàng khi update video) */}
          <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium">Video hướng dẫn khẩu hình:</span>
            <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
              Đang chuẩn bị video
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button3D
            variant="pink"
            size="sm"
            onClick={onClose}
            className="w-full text-xs font-bold"
          >
            ĐÃ HIỂU CÁCH ĐỌC
          </Button3D>
        </div>
      </div>
    </div>
  );
};
