import React from 'react';
import { PersonalizedSpeakingModal } from './PersonalizedSpeakingModal';
import { PersonalizedVocabModal } from './PersonalizedVocabModal';
import { PersonalizedWritingModal } from './PersonalizedWritingModal';
import { PersonalizedReadingModal } from './PersonalizedReadingModal';

interface SkillDef {
  key: string;
  index: number;
  nameVi: string;
  nameEn: string;
  color: string;
  bgLight: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Props {
  skillKey: string;
  skillScore: number;
  skillDef: SkillDef;
  onClose: () => void;
}

export const PersonalizedSkillModal: React.FC<Props> = ({
  skillKey,
  skillScore,
  onClose,
}) => {
  switch (skillKey) {
    case 'speaking':
      return <PersonalizedSpeakingModal skillScore={skillScore} onClose={onClose} />;
    case 'vocabGrammar':
      return <PersonalizedVocabModal skillScore={skillScore} onClose={onClose} />;
    case 'writing':
      return <PersonalizedWritingModal skillScore={skillScore} onClose={onClose} />;
    case 'reading':
      return <PersonalizedReadingModal skillScore={skillScore} onClose={onClose} />;
    default:
      return null;
  }
};
