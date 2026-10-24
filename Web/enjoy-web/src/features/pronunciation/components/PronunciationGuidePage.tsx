import React, { useState, useCallback } from 'react';
import { SpeakerWaveIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Mascot } from '../../../components/ui/Mascot';
import { PersonalizedSpeakingModal } from '../../stats/components/PersonalizedSpeakingModal';

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
  const [showPersonalizedModal, setShowPersonalizedModal] = useState(false);

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
    <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full select-none animate-fadeIn pb-24">
      
      {/* Header với Mascot ENjoy */}
      <div className="text-center space-y-3 mb-8">
        <div className="flex justify-center mb-1">
          <Mascot expression="happy" size={90} />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>Bảng Ký Tự Phát Âm Chuẩn Quốc Tế IPA</span>
        </h1>
        
        <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">
          Nhấn vào từng âm để luyện nghe cách phát âm chuẩn xác theo giọng bản ngữ kèm từ vựng ví dụ trực quan.
        </p>

        {/* Bộ chọn người đọc & Nút Cá nhân hóa phát âm */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {availableVoices.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="material-symbols-outlined text-[16px] text-slate-400">record_voice_over</span>
              <span className="text-xs font-bold text-slate-600">Giọng đọc:</span>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="bg-transparent text-xs font-bold text-sky-600 focus:outline-none cursor-pointer"
              >
                {availableVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name.replace(/Microsoft |Google |Apple /gi, '')} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowPersonalizedModal(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-display font-extrabold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">magic_button</span>
            <span>Cá nhân hoá Phát âm AI</span>
          </button>
        </div>
      </div>

      {/* KHỐI 1: NGUYÊN ÂM (VOWELS) */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs font-display font-extrabold text-sky-700 uppercase tracking-wider px-3.5 py-1 bg-sky-50 border border-sky-100 rounded-full shadow-2xs">
            Nguyên âm ({VOWELS_DATA.length})
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {VOWELS_DATA.map((item) => {
            const key = `${item.symbol}_${item.word}`;
            const isPlaying = playingKey === key;
            return (
              <button
                key={key}
                onClick={() => playPhoneticSound(item)}
                className={`group bg-white border rounded-2xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-xs hover:shadow-md active:scale-95 ${
                  isPlaying
                    ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-200 scale-102'
                    : 'border-slate-200/90 hover:border-sky-300'
                }`}
              >
                {/* Ký hiệu IPA */}
                <span className={`text-2xl font-bold font-sans transition-colors ${
                  isPlaying ? 'text-sky-600' : 'text-slate-900 group-hover:text-sky-600'
                }`}>
                  {item.symbol}
                </span>

                {/* Từ ví dụ */}
                <span className="text-xs font-medium text-slate-500 mt-1 group-hover:text-slate-800">
                  {item.word} {item.vietnameseMeaning ? `(${item.vietnameseMeaning})` : ''}
                </span>

                {/* Gạch chân trang nhã */}
                <div className={`h-1 rounded-full mt-2.5 transition-all ${
                  isPlaying ? 'bg-sky-600 w-10' : 'bg-slate-200 group-hover:bg-sky-300 w-7'
                }`} />

                {/* Loa mini nhấp nháy khi đang phát */}
                {isPlaying && (
                  <span className="material-symbols-outlined text-[16px] text-sky-600 absolute top-2.5 right-2.5 animate-bounce">
                    volume_up
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* KHỐI 2: PHỤ ÂM (CONSONANTS) */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs font-display font-extrabold text-indigo-700 uppercase tracking-wider px-3.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full shadow-2xs">
            Phụ âm ({CONSONANTS_DATA.length})
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CONSONANTS_DATA.map((item) => {
            const key = `${item.symbol}_${item.word}`;
            const isPlaying = playingKey === key;
            return (
              <button
                key={key}
                onClick={() => playPhoneticSound(item)}
                className={`group bg-white border rounded-2xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-xs hover:shadow-md active:scale-95 ${
                  isPlaying
                    ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-200 scale-102'
                    : 'border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                {/* Ký hiệu IPA */}
                <span className={`text-2xl font-bold font-sans transition-colors ${
                  isPlaying ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'
                }`}>
                  {item.symbol}
                </span>

                {/* Từ ví dụ */}
                <span className="text-xs font-medium text-slate-500 mt-1 group-hover:text-slate-800">
                  {item.word} {item.vietnameseMeaning ? `(${item.vietnameseMeaning})` : ''}
                </span>

                {/* Gạch chân trang nhã */}
                <div className={`h-1 rounded-full mt-2.5 transition-all ${
                  isPlaying ? 'bg-indigo-600 w-10' : 'bg-slate-200 group-hover:bg-indigo-300 w-7'
                }`} />

                {/* Loa mini nhấp nháy khi đang phát */}
                {isPlaying && (
                  <span className="material-symbols-outlined text-[16px] text-indigo-600 absolute top-2.5 right-2.5 animate-bounce">
                    volume_up
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Cá nhân hóa Phát âm Speaking AI */}
      {showPersonalizedModal && (
        <PersonalizedSpeakingModal
          skillScore={80}
          onClose={() => setShowPersonalizedModal(false)}
        />
      )}

    </div>
  );
};

