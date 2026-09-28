import React, { useState, useCallback } from 'react';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { Mascot } from '../../../components/ui/Mascot';

export interface PhoneticItem {
  symbol: string;
  soundText: string;
  word: string;
  vietnameseMeaning?: string;
  type: 'vowel' | 'consonant';
}

export const VOWELS_DATA: PhoneticItem[] = [
  // Hàng 1
  { symbol: 'ɑ', soundText: 'ah', word: 'hot', vietnameseMeaning: 'nóng', type: 'vowel' },
  { symbol: 'æ', soundText: 'a', word: 'cat', vietnameseMeaning: 'con mèo', type: 'vowel' },
  { symbol: 'ʌ', soundText: 'uh', word: 'but', vietnameseMeaning: 'nhưng', type: 'vowel' },
  // Hàng 2
  { symbol: 'ɛ', soundText: 'eh', word: 'bed', vietnameseMeaning: 'cái giường', type: 'vowel' },
  { symbol: 'eɪ', soundText: 'ay', word: 'say', vietnameseMeaning: 'nói', type: 'vowel' },
  { symbol: 'ə', soundText: 'er', word: 'bird', vietnameseMeaning: 'con chim', type: 'vowel' },
  // Hàng 3
  { symbol: 'ɪ', soundText: 'ih', word: 'ship', vietnameseMeaning: 'con tàu', type: 'vowel' },
  { symbol: 'i', soundText: 'ee', word: 'sheep', vietnameseMeaning: 'con cừu', type: 'vowel' },
  { symbol: 'ə', soundText: 'uh', word: 'about', vietnameseMeaning: 'về', type: 'vowel' },
  // Hàng 4
  { symbol: 'oʊ', soundText: 'oh', word: 'boat', vietnameseMeaning: 'chiếc thuyền', type: 'vowel' },
  { symbol: 'ʊ', soundText: 'oo', word: 'foot', vietnameseMeaning: 'bàn chân', type: 'vowel' },
  { symbol: 'u', soundText: 'ooh', word: 'food', vietnameseMeaning: 'thức ăn', type: 'vowel' },
  // Hàng 5
  { symbol: 'aʊ', soundText: 'ow', word: 'cow', vietnameseMeaning: 'con bò', type: 'vowel' },
  { symbol: 'aɪ', soundText: 'eye', word: 'time', vietnameseMeaning: 'thời gian', type: 'vowel' },
  { symbol: 'ɔɪ', soundText: 'oy', word: 'boy', vietnameseMeaning: 'cậu bé', type: 'vowel' },
];

export const CONSONANTS_DATA: PhoneticItem[] = [
  // Hàng 1
  { symbol: 'b', soundText: 'buh', word: 'book', vietnameseMeaning: 'quyển sách', type: 'consonant' },
  { symbol: 'tʃ', soundText: 'chuh', word: 'chair', vietnameseMeaning: 'cái ghế', type: 'consonant' },
  { symbol: 'd', soundText: 'duh', word: 'day', vietnameseMeaning: 'ngày', type: 'consonant' },
  // Hàng 2
  { symbol: 'f', soundText: 'fah', word: 'fish', vietnameseMeaning: 'con cá', type: 'consonant' },
  { symbol: 'g', soundText: 'guh', word: 'go', vietnameseMeaning: 'đi', type: 'consonant' },
  { symbol: 'h', soundText: 'huh', word: 'home', vietnameseMeaning: 'nhà', type: 'consonant' },
  // Hàng 3
  { symbol: 'dʒ', soundText: 'juh', word: 'job', vietnameseMeaning: 'công việc', type: 'consonant' },
  { symbol: 'k', soundText: 'kuh', word: 'key', vietnameseMeaning: 'chìa khóa', type: 'consonant' },
  { symbol: 'l', soundText: 'luh', word: 'lion', vietnameseMeaning: 'sư tử', type: 'consonant' },
  // Hàng 4
  { symbol: 'm', soundText: 'muh', word: 'moon', vietnameseMeaning: 'mặt trăng', type: 'consonant' },
  { symbol: 'n', soundText: 'nuh', word: 'nose', vietnameseMeaning: 'cái mũi', type: 'consonant' },
  { symbol: 'ŋ', soundText: 'ing', word: 'sing', vietnameseMeaning: 'hát', type: 'consonant' },
  // Hàng 5
  { symbol: 'p', soundText: 'puh', word: 'pig', vietnameseMeaning: 'con heo', type: 'consonant' },
  { symbol: 'ɹ', soundText: 'ruh', word: 'red', vietnameseMeaning: 'màu đỏ', type: 'consonant' },
  { symbol: 's', soundText: 'suh', word: 'see', vietnameseMeaning: 'nhìn thấy', type: 'consonant' },
  // Hàng 6
  { symbol: 'ʒ', soundText: 'zhuh', word: 'measure', vietnameseMeaning: 'đo lường', type: 'consonant' },
  { symbol: 'ʃ', soundText: 'shh', word: 'shoe', vietnameseMeaning: 'chiếc giày', type: 'consonant' },
  { symbol: 't', soundText: 'tuh', word: 'time', vietnameseMeaning: 'thời gian', type: 'consonant' },
  // Hàng 7
  { symbol: 'ð', soundText: 'the', word: 'then', vietnameseMeaning: 'sau đó', type: 'consonant' },
  { symbol: 'θ', soundText: 'three', word: 'think', vietnameseMeaning: 'suy nghĩ', type: 'consonant' },
  { symbol: 'v', soundText: 'vuh', word: 'very', vietnameseMeaning: 'rất', type: 'consonant' },
  // Hàng 8
  { symbol: 'w', soundText: 'wuh', word: 'water', vietnameseMeaning: 'nước', type: 'consonant' },
  { symbol: 'j', soundText: 'yuh', word: 'you', vietnameseMeaning: 'bạn', type: 'consonant' },
  { symbol: 'z', soundText: 'zuh', word: 'zoo', vietnameseMeaning: 'sở thú', type: 'consonant' },
];

export const PronunciationGuidePage: React.FC = () => {
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Tải danh sách giọng đọc tiếng Anh từ hệ thống
  React.useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = allVoices.filter((v) => v.lang.startsWith('en'));
      
      setAvailableVoices(englishVoices.length > 0 ? englishVoices : allVoices);

      if (!selectedVoiceURI && englishVoices.length > 0) {
        // Tự động ưu tiên chọn giọng nữ tự nhiên chất lượng cao nhất
        const preferred =
          englishVoices.find((v) => /natural|jenny|aria|ava|samantha|zira|female/i.test(v.name)) ||
          englishVoices.find((v) => v.lang.startsWith('en-US')) ||
          englishVoices[0];
        if (preferred) setSelectedVoiceURI(preferred.voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceURI]);

  // Phát âm thanh của nguyên âm/phụ âm trước, sau đó phát từ ví dụ
  const playPhoneticSound = useCallback(
    (item: PhoneticItem) => {
      const key = `${item.symbol}_${item.word}`;
      setPlayingKey(key);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const voices = window.speechSynthesis.getVoices();
        const activeVoice = voices.find((v) => v.voiceURI === selectedVoiceURI) || null;

        // 1. Phát âm thanh của ký tự IPA / nguyên âm / phụ âm
        const soundUtterance = new SpeechSynthesisUtterance(item.soundText);
        soundUtterance.lang = 'en-US';
        if (activeVoice) soundUtterance.voice = activeVoice;
        soundUtterance.rate = 0.88;
        soundUtterance.pitch = 1.0; // Tông giọng tự nhiên, chuẩn người thật

        // 2. Khi âm IPA đọc xong -> phát từ ví dụ
        soundUtterance.onend = () => {
          setTimeout(() => {
            const wordUtterance = new SpeechSynthesisUtterance(item.word);
            wordUtterance.lang = 'en-US';
            if (activeVoice) wordUtterance.voice = activeVoice;
            wordUtterance.rate = 0.88;
            wordUtterance.pitch = 1.0;
            wordUtterance.onend = () => setPlayingKey(null);
            wordUtterance.onerror = () => setPlayingKey(null);
            window.speechSynthesis.speak(wordUtterance);
          }, 180);
        };

        soundUtterance.onerror = () => setPlayingKey(null);
        window.speechSynthesis.speak(soundUtterance);
      } else {
        setTimeout(() => setPlayingKey(null), 1200);
      }
    },
    [selectedVoiceURI]
  );

  return (
    <div className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full select-none animate-fadeIn pb-24">
      
      {/* Header Duolingo-style với Mascot ENjoy */}
      <div className="text-center space-y-3 mb-6">
        <div className="flex justify-center mb-1">
          <Mascot expression="happy" size={100} />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <span>Cùng học phát âm cùng ENJOY nhé!</span>
        </h1>
        
        <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
          Nhấn vào từng âm để nghe cách phát âm chuẩn và từ ví dụ tương ứng
        </p>

        {/* Bộ chọn người đọc / Giọng đọc tiếng Anh */}
        {availableVoices.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-600">Giọng đọc:</span>
            <select
              value={selectedVoiceURI}
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              className="px-3 py-1.5 rounded-xl border-2 border-rose-200 bg-white text-xs font-bold text-slate-700 shadow-2xs hover:border-primary focus:border-primary focus:outline-none cursor-pointer transition-colors max-w-xs"
            >
              {availableVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name.replace(/Microsoft |Google |Apple /gi, '')} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KHỐI 1: NGUYÊN ÂM (VOWELS) */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="h-0.5 bg-rose-100 flex-1" />
          <span className="text-xs font-black text-primary uppercase tracking-widest px-3 py-1 bg-rose-50 border border-rose-200/60 rounded-full">
            Nguyên âm ({VOWELS_DATA.length})
          </span>
          <div className="h-0.5 bg-rose-100 flex-1" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {VOWELS_DATA.map((item) => {
            const key = `${item.symbol}_${item.word}`;
            const isPlaying = playingKey === key;
            return (
              <button
                key={key}
                onClick={() => playPhoneticSound(item)}
                className={`group bg-white border-2 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-2xs hover:shadow-md active:scale-95 ${
                  isPlaying
                    ? 'border-primary bg-rose-50/70 ring-2 ring-primary/30 scale-102'
                    : 'border-slate-200 hover:border-primary/50'
                }`}
              >
                {/* Ký hiệu IPA */}
                <span className={`text-xl sm:text-2xl font-bold font-sans transition-colors ${
                  isPlaying ? 'text-primary' : 'text-slate-800 group-hover:text-primary'
                }`}>
                  {item.symbol}
                </span>

                {/* Từ ví dụ */}
                <span className="text-xs font-semibold text-slate-500 mt-0.5 group-hover:text-slate-700">
                  {item.word}
                </span>

                {/* Gạch chân Duolingo style */}
                <div className={`w-7 h-1 rounded-full mt-2 transition-all ${
                  isPlaying ? 'bg-primary w-10' : 'bg-slate-200 group-hover:bg-rose-300'
                }`} />

                {/* Loa mini nhấp nháy khi đang phát */}
                {isPlaying && (
                  <SpeakerWaveIcon className="w-4 h-4 text-primary absolute top-2 right-2 animate-bounce" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* KHỐI 2: PHỤ ÂM (CONSONANTS) */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-0.5 bg-rose-100 flex-1" />
          <span className="text-xs font-black text-primary uppercase tracking-widest px-3 py-1 bg-rose-50 border border-rose-200/60 rounded-full">
            Phụ âm ({CONSONANTS_DATA.length})
          </span>
          <div className="h-0.5 bg-rose-100 flex-1" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CONSONANTS_DATA.map((item) => {
            const key = `${item.symbol}_${item.word}`;
            const isPlaying = playingKey === key;
            return (
              <button
                key={key}
                onClick={() => playPhoneticSound(item)}
                className={`group bg-white border-2 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-2xs hover:shadow-md active:scale-95 ${
                  isPlaying
                    ? 'border-primary bg-rose-50/70 ring-2 ring-primary/30 scale-102'
                    : 'border-slate-200 hover:border-primary/50'
                }`}
              >
                {/* Ký hiệu IPA */}
                <span className={`text-xl sm:text-2xl font-bold font-sans transition-colors ${
                  isPlaying ? 'text-primary' : 'text-slate-800 group-hover:text-primary'
                }`}>
                  {item.symbol}
                </span>

                {/* Từ ví dụ */}
                <span className="text-xs font-semibold text-slate-500 mt-0.5 group-hover:text-slate-700">
                  {item.word}
                </span>

                {/* Gạch chân Duolingo style */}
                <div className={`w-7 h-1 rounded-full mt-2 transition-all ${
                  isPlaying ? 'bg-primary w-10' : 'bg-slate-200 group-hover:bg-rose-300'
                }`} />

                {/* Loa mini nhấp nháy khi đang phát */}
                {isPlaying && (
                  <SpeakerWaveIcon className="w-4 h-4 text-primary absolute top-2 right-2 animate-bounce" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

