import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import type { TopicWeakWordDetail } from '../../exam/types';
import {
  ArrowLeftIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/solid';

// ──────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getRandomLetter(): string {
  return 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
}

function generateLetterOptions(correctLetter: string): string[] {
  const options = new Set<string>([correctLetter.toLowerCase()]);
  while (options.size < 4) {
    options.add(getRandomLetter());
  }
  return shuffle(Array.from(options));
}

function speakWord(word: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// ──────────────────────────────────────────────
// Mock Fallback Words Across All Topics
// ──────────────────────────────────────────────
const WORD_IMAGE_MAP: Record<string, string> = {
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
  elephant: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400',
  monkey: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400',
  duck: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400',
  tiger: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400',
  horse: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400',
  frog: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
  hippo: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400',
  zebra: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?w=400',
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
  orange: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  egg: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
  car: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
  bus: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
  bike: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
  plane: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=400',
  boat: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?w=400',
  train: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
  shirt: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
  hat: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=400',
  shoe: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  skirt: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
  jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
  eye: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  hand: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
  arm: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
  mouth: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400',
  book: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
  pencil: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
  ball: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400',
  robot: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  house: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
  chair: 'https://images.unsplash.com/photo-1580481077195-c2284b34fb50?w=400',
  clock: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400',
  bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
  guitar: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
};

const MOCK_FALLBACK_WORDS: TopicWeakWordDetail[] = [
  // Animals
  { id: 101, word: 'cat', translation: 'Con mèo', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.cat },
  { id: 102, word: 'dog', translation: 'Con chó', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.dog },
  { id: 103, word: 'elephant', translation: 'Con voi', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.elephant },
  { id: 104, word: 'monkey', translation: 'Con khỉ', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.monkey },
  { id: 105, word: 'duck', translation: 'Con vịt', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.duck },
  { id: 106, word: 'fish', translation: 'Con cá', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.fish },
  { id: 107, word: 'tiger', translation: 'Con hổ', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.tiger },
  { id: 108, word: 'horse', translation: 'Con ngựa', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.horse },
  { id: 109, word: 'bird', translation: 'Con chim', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.bird },
  { id: 110, word: 'frog', translation: 'Con ếch', topic: 'Animals', imageUrl: WORD_IMAGE_MAP.frog },
  // Food & drink
  { id: 201, word: 'apple', translation: 'Quả táo', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.apple },
  { id: 202, word: 'banana', translation: 'Quả chuối', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.banana },
  { id: 203, word: 'orange', translation: 'Quả cam', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.orange },
  { id: 204, word: 'cake', translation: 'Bánh ngọt', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.cake },
  { id: 205, word: 'milk', translation: 'Sữa', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.milk },
  { id: 206, word: 'bread', translation: 'Bánh mì', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.bread },
  { id: 207, word: 'egg', translation: 'Quả trứng', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.egg },
  { id: 208, word: 'water', translation: 'Nước uống', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.water },
  { id: 209, word: 'burger', translation: 'Bánh kẹp burger', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.burger },
  { id: 210, word: 'tomato', translation: 'Quả cà chua', topic: 'Food & drink', imageUrl: WORD_IMAGE_MAP.tomato },
  // Transport
  { id: 301, word: 'car', translation: 'Xe ô tô', topic: 'Transport', imageUrl: WORD_IMAGE_MAP.car },
  { id: 302, word: 'bus', translation: 'Xe buýt', topic: 'Transport', imageUrl: WORD_IMAGE_MAP.bus },
  { id: 303, word: 'bike', translation: 'Xe đạp', topic: 'Transport', imageUrl: WORD_IMAGE_MAP.bike },
  { id: 304, word: 'plane', translation: 'Máy bay', topic: 'Transport', imageUrl: WORD_IMAGE_MAP.plane },
  { id: 305, word: 'boat', translation: 'Con thuyền', topic: 'Transport', imageUrl: WORD_IMAGE_MAP.boat },
  { id: 306, word: 'train', translation: 'Tàu hỏa', topic: 'Transport', imageUrl: WORD_IMAGE_MAP.train },
  // Clothes
  { id: 401, word: 'shirt', translation: 'Áo sơ mi', topic: 'Clothes', imageUrl: WORD_IMAGE_MAP.shirt },
  { id: 402, word: 'hat', translation: 'Cái mũ', topic: 'Clothes', imageUrl: WORD_IMAGE_MAP.hat },
  { id: 403, word: 'shoe', translation: 'Chiếc giày', topic: 'Clothes', imageUrl: WORD_IMAGE_MAP.shoe },
  { id: 404, word: 'skirt', translation: 'Chân váy', topic: 'Clothes', imageUrl: WORD_IMAGE_MAP.skirt },
  { id: 405, word: 'jacket', translation: 'Áo khoác', topic: 'Clothes', imageUrl: WORD_IMAGE_MAP.jacket },
  // The body and the face
  { id: 501, word: 'eye', translation: 'Mắt', topic: 'The body and the face', imageUrl: WORD_IMAGE_MAP.eye },
  { id: 502, word: 'hand', translation: 'Bàn tay', topic: 'The body and the face', imageUrl: WORD_IMAGE_MAP.hand },
  { id: 503, word: 'arm', translation: 'Cánh tay', topic: 'The body and the face', imageUrl: WORD_IMAGE_MAP.arm },
  { id: 504, word: 'mouth', translation: 'Miệng', topic: 'The body and the face', imageUrl: WORD_IMAGE_MAP.mouth },
  // School & Toys & Home
  { id: 601, word: 'book', translation: 'Quyển sách', topic: 'School', imageUrl: WORD_IMAGE_MAP.book },
  { id: 602, word: 'pencil', translation: 'Bút chì', topic: 'School', imageUrl: WORD_IMAGE_MAP.pencil },
  { id: 701, word: 'ball', translation: 'Quả bóng', topic: 'Toys', imageUrl: WORD_IMAGE_MAP.ball },
  { id: 702, word: 'robot', translation: 'Người máy', topic: 'Toys', imageUrl: WORD_IMAGE_MAP.robot },
  { id: 801, word: 'house', translation: 'Ngôi nhà', topic: 'The home', imageUrl: WORD_IMAGE_MAP.house },
  { id: 802, word: 'chair', translation: 'Cái ghế', topic: 'The home', imageUrl: WORD_IMAGE_MAP.chair },
  { id: 803, word: 'clock', translation: 'Đồng hồ', topic: 'The home', imageUrl: WORD_IMAGE_MAP.clock },
  { id: 804, word: 'bed', translation: 'Cái giường', topic: 'The home', imageUrl: WORD_IMAGE_MAP.bed },
  { id: 901, word: 'guitar', translation: 'Đàn ghi-ta', topic: 'Sports & leisure', imageUrl: WORD_IMAGE_MAP.guitar },
];

// Helper lấy ảnh đại diện cho từ vựng
function getWordImage(item: TopicWeakWordDetail): string {
  if (item.imageUrl && item.imageUrl.trim() !== '') return item.imageUrl;
  const wordKey = item.word.toLowerCase().trim();
  if (WORD_IMAGE_MAP[wordKey]) return WORD_IMAGE_MAP[wordKey];
  return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';
}

// ──────────────────────────────────────────────
// Type defs
// ──────────────────────────────────────────────
type GameMode = 'select' | 'listen-pick' | 'fill-letter';
type AnswerState = 'idle' | 'correct' | 'wrong';

const BATCH_SIZE = 10;
const PICK_CHOICES = 5;

// ──────────────────────────────────────────────
// GAME 1: Listen & Pick Picture
// ──────────────────────────────────────────────
interface ListenPickGameProps {
  words: TopicWeakWordDetail[];
  batchIndex: number;
  totalBatches: number;
  onComplete: (score: number, total: number) => void;
}

const ListenPickGame: React.FC<ListenPickGameProps> = ({ words, batchIndex, totalBatches, onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choices, setChoices] = useState<TopicWeakWordDetail[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const batch = words.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE);
  const currentWord = batch[questionIndex];

  const buildChoices = useCallback(() => {
    if (!currentWord) return [];
    const pool = words.filter((w) => w.id !== currentWord.id);
    const distractors = shuffle(pool).slice(0, PICK_CHOICES - 1);
    return shuffle([currentWord, ...distractors]);
  }, [currentWord, words]);

  useEffect(() => {
    if (currentWord) {
      setChoices(buildChoices());
      setSelected(null);
      setAnswerState('idle');
      setTimeout(() => speakWord(currentWord.word), 400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  const handleSelect = (choiceIdx: number) => {
    if (answerState !== 'idle' || !currentWord) return;
    setSelected(choiceIdx);
    const isCorrect = choices[choiceIdx].id === currentWord.id;
    const state: AnswerState = isCorrect ? 'correct' : 'wrong';
    setAnswerState(state);
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    timerRef.current = setTimeout(() => {
      if (questionIndex < batch.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        onComplete(newScore, batch.length);
      }
    }, 900);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!currentWord) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SpeakerWaveIcon className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-gray-700 text-sm">Nghe &amp; Chọn ảnh đúng</span>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          {questionIndex + 1}/{batch.length} · Đợt {batchIndex + 1}/{totalBatches}
        </span>
      </div>

      <div
        className="flex items-center justify-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 cursor-pointer select-none hover:bg-blue-100 transition-colors"
        onClick={() => speakWord(currentWord.word)}
      >
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <SpeakerWaveIcon className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-0.5">Bấm để nghe lại</p>
          <p className="text-lg font-black text-blue-800">Chọn hình ảnh đúng với từ vừa nghe</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Điểm: {score}/{questionIndex}</span>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${batch.length > 0 ? (questionIndex / batch.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {choices.map((choice, idx) => {
          const isSelected = selected === idx;
          const isCorrectChoice = choice.id === currentWord.id;
          let borderClass = 'border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer';
          if (isSelected && answerState === 'correct') borderClass = 'border-emerald-500 bg-emerald-50 shadow-emerald-200 shadow-lg';
          else if (isSelected && answerState === 'wrong') borderClass = 'border-red-400 bg-red-50 shadow-red-200 shadow-lg';
          else if (!isSelected && answerState !== 'idle' && isCorrectChoice) borderClass = 'border-emerald-500 bg-emerald-50';

          return (
            <button
              key={choice.id + '-' + idx}
              onClick={() => handleSelect(idx)}
              className={`relative rounded-2xl border-2 overflow-hidden bg-white transition-all duration-200 aspect-square flex items-center justify-center ${borderClass}`}
            >
              <img src={getWordImage(choice)} alt={choice.word} className="w-full h-full object-contain p-2" loading="lazy" />
              {isSelected && answerState === 'correct' && (
                <div className="absolute top-1 right-1"><CheckCircleIcon className="w-5 h-5 text-emerald-600" /></div>
              )}
              {isSelected && answerState === 'wrong' && (
                <div className="absolute top-1 right-1"><XCircleIcon className="w-5 h-5 text-red-500" /></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// GAME 2: Fill the Missing Letter
// ──────────────────────────────────────────────
interface FillLetterGameProps {
  words: TopicWeakWordDetail[];
  batchIndex: number;
  totalBatches: number;
  onComplete: (score: number, total: number) => void;
}

const FillLetterGame: React.FC<FillLetterGameProps> = ({ words, batchIndex, totalBatches, onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [missingIdx, setMissingIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const batch = words.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE);
  const currentWord = batch[questionIndex];

  useEffect(() => {
    if (!currentWord) return;
    const word = currentWord.word.toLowerCase();
    const idx = word.length > 1 ? Math.floor(Math.random() * word.length) : 0;
    setMissingIdx(idx);
    setOptions(generateLetterOptions(word[idx]));
    setSelected(null);
    setAnswerState('idle');
    setTimeout(() => speakWord(currentWord.word), 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  const handleSelect = (letter: string) => {
    if (answerState !== 'idle' || !currentWord) return;
    setSelected(letter);
    const correctLetter = currentWord.word.toLowerCase()[missingIdx];
    const isCorrect = letter === correctLetter;
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    timerRef.current = setTimeout(() => {
      if (questionIndex < batch.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        onComplete(newScore, batch.length);
      }
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!currentWord) return null;

  const word = currentWord.word.toLowerCase();

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔡</span>
          <span className="font-bold text-gray-700 text-sm">Điền chữ cái còn thiếu</span>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          {questionIndex + 1}/{batch.length} · Đợt {batchIndex + 1}/{totalBatches}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Điểm: {score}/{questionIndex}</span>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${batch.length > 0 ? (questionIndex / batch.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
        <div
          className="w-36 h-36 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center shrink-0 cursor-pointer"
          onClick={() => speakWord(currentWord.word)}
        >
          <img src={getWordImage(currentWord)} alt="" className="w-full h-full object-contain p-3" />
        </div>

        <div className="flex flex-col items-center gap-4 flex-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Chọn chữ cái đúng để hoàn thành từ</p>

          <div className="flex items-center gap-1.5 justify-center flex-wrap">
            {word.split('').map((ch, i) => (
              <div
                key={i}
                className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all duration-300 ${
                  i === missingIdx
                    ? answerState === 'correct'
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                      : answerState === 'wrong'
                      ? 'border-red-400 bg-red-50 text-red-600'
                      : 'border-violet-400 bg-violet-50 text-violet-300'
                    : 'border-gray-200 bg-gray-50 text-gray-800'
                }`}
              >
                {i === missingIdx
                  ? answerState !== 'idle'
                    ? ch.toUpperCase()
                    : '?'
                  : ch.toUpperCase()}
              </div>
            ))}
          </div>

          {currentWord.translation && (
            <p className="text-sm text-gray-400 italic">({currentWord.translation})</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((letter) => {
          const correctLetter = word[missingIdx];
          const isSelected = selected === letter;
          let cls = 'border-gray-200 bg-white hover:border-violet-400 hover:bg-violet-50 hover:shadow-md cursor-pointer';
          if (isSelected && answerState === 'correct') cls = 'border-emerald-500 bg-emerald-100 text-emerald-700 shadow-emerald-200 shadow-lg';
          else if (isSelected && answerState === 'wrong') cls = 'border-red-400 bg-red-50 text-red-600 shadow-red-200 shadow-lg';
          else if (!isSelected && answerState !== 'idle' && letter === correctLetter) cls = 'border-emerald-500 bg-emerald-50 text-emerald-700';

          return (
            <button
              key={letter}
              onClick={() => handleSelect(letter)}
              className={`py-4 rounded-2xl border-2 text-3xl font-black uppercase transition-all duration-200 ${cls}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Result Screen
// ──────────────────────────────────────────────
interface ResultScreenProps {
  score: number;
  total: number;
  batchIndex: number;
  totalBatches: number;
  onNextBatch: () => void;
  onRestart: () => void;
  onBack: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score, total, batchIndex, totalBatches, onNextBatch, onRestart, onBack,
}) => {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
  const isLast = batchIndex >= totalBatches - 1;

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto text-center py-8">
      <div className="text-6xl">{pct >= 90 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>

      <div>
        <h2 className="text-3xl font-display font-extrabold text-gray-900">
          {pct >= 90 ? 'Xuất sắc!' : pct >= 60 ? 'Tốt lắm!' : 'Cố lên!'}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Đợt {batchIndex + 1}/{totalBatches} · Đúng {score}/{total} câu ({pct}%)
        </p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <StarIcon
            key={s}
            className={`w-10 h-10 transition-all ${s <= stars ? 'text-amber-400 scale-110' : 'text-gray-200'}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full">
        {!isLast && (
          <button
            onClick={onNextBatch}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowRightIcon className="w-4 h-4" />
            Đợt tiếp theo ({batchIndex + 2}/{totalBatches})
          </button>
        )}
        {isLast && (
          <div className="flex items-center justify-center gap-2 py-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">Đã hoàn thành tất cả các đợt!</span>
          </div>
        )}
        <button
          onClick={onRestart}
          className="w-full py-3 border-2 border-violet-200 text-violet-700 font-bold rounded-2xl hover:bg-violet-50 transition-all cursor-pointer"
        >
          Chơi lại từ đầu
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
        >
          Về chọn trò chơi
        </button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Game Select Screen
// ──────────────────────────────────────────────
interface GameSelectProps {
  wordCount: number;
  totalBatches: number;
  onSelectGame: (mode: 'listen-pick' | 'fill-letter') => void;
  onGoBack: () => void;
}

const GameSelectScreen: React.FC<GameSelectProps> = ({ wordCount, totalBatches, onSelectGame, onGoBack }) => (
  <div className="flex flex-col gap-8 max-w-2xl mx-auto">
    <div>
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Quay lại thống kê
      </button>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
          <SparklesIcon className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-display font-extrabold text-gray-900">Luyện tập bổ trợ</h1>
      </div>
      <p className="text-sm text-gray-500 ml-[52px]">
        {wordCount} từ vựng · {totalBatches} đợt (mỗi đợt tối đa {BATCH_SIZE} từ) · Từ nhiều chủ đề khác nhau
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <button
        onClick={() => onSelectGame('listen-pick')}
        className="group bg-white rounded-3xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] transition-all duration-300 p-6 text-left cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-4 transition-colors">
          <SpeakerWaveIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Nghe &amp; Chọn ảnh</h3>
        <p className="text-sm text-gray-500">
          Nghe từ vựng và chọn hình ảnh tương ứng trong {PICK_CHOICES} lựa chọn.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
          <span>🎧</span> Luyện kỹ năng nghe
        </div>
      </button>

      <button
        onClick={() => onSelectGame('fill-letter')}
        className="group bg-white rounded-3xl border-2 border-violet-200 hover:border-violet-400 hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] transition-all duration-300 p-6 text-left cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center mb-4 transition-colors">
          <span className="text-3xl">🔡</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Điền chữ cái</h3>
        <p className="text-sm text-gray-500">
          Một từ bị mất một chữ cái — hãy chọn chữ đúng để hoàn thành từ.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
          <span>✏️</span> Luyện đánh vần
        </div>
      </button>
    </div>

    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-xl mt-0.5">💡</span>
      <div>
        <p className="text-sm font-bold text-amber-800">Gợi ý</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Từ vựng được lấy từ tất cả chủ đề và xáo trộn ngẫu nhiên. Mỗi đợt gồm tối đa {BATCH_SIZE} từ.
          Hoàn thành hết {totalBatches} đợt để ôn luyện toàn bộ!
        </p>
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export const SupplementaryPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [allWords, setAllWords] = useState<TopicWeakWordDetail[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>('select');
  const [batchIndex, setBatchIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultScore, setResultScore] = useState(0);
  const [resultTotal, setResultTotal] = useState(0);

  const totalBatches = Math.max(1, Math.ceil(allWords.length / BATCH_SIZE));

  useEffect(() => {
    setLoading(true);
    if (!user?.id) {
      setAllWords(shuffle(MOCK_FALLBACK_WORDS));
      setLoading(false);
      return;
    }
    vocabStatsApi
      .getTopicWeakWords(user.id, 'Tất cả các chủ đề')
      .then((words) => {
        if (words && words.length > 0) {
          const enriched = words.map((w) => ({
            ...w,
            imageUrl: getWordImage(w),
          }));
          setAllWords(shuffle(enriched));
        } else {
          // Luôn nạp dữ liệu từ tất cả các chủ đề (fake data) khi chưa có bài thi sai
          setAllWords(shuffle(MOCK_FALLBACK_WORDS));
        }
      })
      .catch((err) => {
        console.warn('Lỗi khi tải từ vựng, tự động dùng danh sách từ vựng bổ trợ:', err);
        setAllWords(shuffle(MOCK_FALLBACK_WORDS));
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleGameComplete = (score: number, total: number) => {
    setResultScore(score);
    setResultTotal(total);
    setShowResult(true);
  };

  const handleNextBatch = () => {
    setBatchIndex((i) => i + 1);
    setShowResult(false);
  };

  const handleRestart = () => {
    setAllWords((prev) => shuffle(prev));
    setBatchIndex(0);
    setShowResult(false);
  };

  const handleBackToSelect = () => {
    setGameMode('select');
    setBatchIndex(0);
    setShowResult(false);
  };

  const handleStartGame = (mode: 'listen-pick' | 'fill-letter') => {
    setAllWords((prev) => shuffle(prev));
    setBatchIndex(0);
    setShowResult(false);
    setGameMode(mode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-text-muted">Đang tải từ vựng...</p>
        </div>
      </div>
    );
  }

  // Nếu danh sách rỗng thì fallback ngay lập tức sang MOCK_FALLBACK_WORDS để không bị chặn màn hình
  const activeWords = allWords.length > 0 ? allWords : MOCK_FALLBACK_WORDS;
  const currentTotalBatches = Math.max(1, Math.ceil(activeWords.length / BATCH_SIZE));

  return (
    <div className="min-h-screen bg-surface pb-16">
      <div className="bg-white border-b-[3px] border-[#8c4513] shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/stats')}
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <p className="text-xs text-primary font-bold uppercase tracking-widest">Luyện tập bổ trợ</p>
          <h1 className="text-lg font-display font-extrabold text-text-main">Trò chơi từ vựng</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {gameMode === 'select' && (
          <GameSelectScreen
            wordCount={activeWords.length}
            totalBatches={currentTotalBatches}
            onSelectGame={handleStartGame}
            onGoBack={() => navigate('/stats')}
          />
        )}

        {gameMode === 'listen-pick' && !showResult && (
          <ListenPickGame
            words={activeWords}
            batchIndex={batchIndex}
            totalBatches={currentTotalBatches}
            onComplete={handleGameComplete}
          />
        )}

        {gameMode === 'fill-letter' && !showResult && (
          <FillLetterGame
            words={activeWords}
            batchIndex={batchIndex}
            totalBatches={currentTotalBatches}
            onComplete={handleGameComplete}
          />
        )}

        {showResult && (
          <ResultScreen
            score={resultScore}
            total={resultTotal}
            batchIndex={batchIndex}
            totalBatches={currentTotalBatches}
            onNextBatch={handleNextBatch}
            onRestart={handleRestart}
            onBack={handleBackToSelect}
          />
        )}
      </div>
    </div>
  );
};
