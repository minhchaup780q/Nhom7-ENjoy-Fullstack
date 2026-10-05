import React, { useState } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { ExamAudioPlayer } from '../ExamAudioPlayer';
import { ListeningPart1 } from './ListeningPart1';
import { ListeningPart2 } from './ListeningPart2';
import { ListeningPart3 } from './ListeningPart3';
import { ListeningPart4 } from './ListeningPart4';
import type { PartAnswer } from '../../types';

interface Props {
  onFinish: () => void;
}

const PARTS = ['Part 1', 'Part 2', 'Part 3', 'Part 4'];

export const ListeningSection: React.FC<Props> = ({ onFinish }) => {
  const { currentExam, userAnswers, setListeningAnswer } = useExamStore();
  const [currentPart, setCurrentPart] = useState(0);

  if (!currentExam) return null;
  const lis = currentExam.listeningPayload;

  const currentAudio = [
    lis.part1.audio_url,
    lis.part2.audio_url,
    lis.part3.audio_url,
    lis.part4.audio_url,
  ][currentPart];

  const handleNext = () => {
    if (currentPart < 3) {
      setCurrentPart(currentPart + 1);
    } else {
      onFinish();
    }
  };

  const updateAnswers = (partKey: keyof typeof userAnswers.listening, answers: PartAnswer[]) => {
    setListeningAnswer(partKey, answers);
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 pt-6 pb-24">
      {/* Part Tabs */}
      <div className="flex gap-2 mb-6">
        {PARTS.map((label, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPart(idx)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all
              ${idx === currentPart
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface text-text-muted hover:bg-primary/10'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Audio Player (top) */}
      <ExamAudioPlayer
        key={currentPart}
        src={currentAudio}
        label={`Listening - Part ${currentPart + 1}`}
      />

      {/* Part Content */}
      <div className="pb-4">
        {currentPart === 0 && (
          <ListeningPart1
            data={lis.part1}
            answers={userAnswers.listening.part1}
            onChange={(ans) => updateAnswers('part1', ans)}
          />
        )}
        {currentPart === 1 && (
          <ListeningPart2
            data={lis.part2}
            answers={userAnswers.listening.part2}
            onChange={(ans) => updateAnswers('part2', ans)}
          />
        )}
        {currentPart === 2 && (
          <ListeningPart3
            data={lis.part3}
            answers={userAnswers.listening.part3}
            onChange={(ans) => updateAnswers('part3', ans)}
          />
        )}
        {currentPart === 3 && (
          <ListeningPart4
            data={lis.part4}
            answers={userAnswers.listening.part4}
            onChange={(ans) => updateAnswers('part4', ans)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 right-6 z-20">
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
        >
          {currentPart < 3 ? 'Part tiếp theo →' : 'Hoàn thành Listening →'}
        </button>
      </div>
    </div>
  );
};
