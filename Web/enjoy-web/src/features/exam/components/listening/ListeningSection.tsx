import React, { useState } from 'react';
import { useExamStore } from '../../store/useExamStore';
import { ExamAudioPlayer } from '../ExamAudioPlayer';
import { ListeningPart1 } from './ListeningPart1';
import { ListeningPart2 } from './ListeningPart2';
import { ListeningPart3 } from './ListeningPart3';
import { ListeningPart4 } from './ListeningPart4';
import type { PartAnswer } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/solid';

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

  const handlePrev = () => {
    if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-5xl mx-auto w-full px-4 pt-6 pb-6 flex-1">
        {/* Part Indicator */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-main">
            Phần {currentPart + 1} <span className="text-text-muted text-base font-medium">/ 4</span>
          </h2>
        </div>

        {/* Audio Player (top) */}
        <ExamAudioPlayer
          key={currentPart}
          src={currentAudio}
          label={`Listening - Part ${currentPart + 1}`}
        />

        {/* Part Content */}
        <div>
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
      </div>

      {/* Nút điều hướng Trái - Phải */}
      <button
        onClick={handlePrev}
        disabled={currentPart === 0}
        className="fixed top-1/2 left-4 lg:left-[280px] -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-border-main text-text-muted hover:text-primary hover:border-primary shadow-lg transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronLeftIcon className="w-6 h-6 pr-0.5" />
      </button>

      <button
        onClick={handleNext}
        className="fixed top-1/2 right-4 lg:right-8 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:bg-primary/90 transition-all hover:scale-110"
        title={currentPart < 3 ? 'Part tiếp theo' : 'Hoàn thành Listening'}
      >
        {currentPart < 3 ? (
          <ChevronRightIcon className="w-6 h-6 pl-0.5" />
        ) : (
          <CheckIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};
