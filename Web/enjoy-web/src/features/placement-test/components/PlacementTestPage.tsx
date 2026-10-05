import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../learning/services/learningApi';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { WelcomeScreen } from './WelcomeScreen';
import { VocabRound, GrammarRound, SpeakingRound } from './PlacementTestRounds';
import { PlacementTestResultPage } from './PlacementTestResultPage';
import type {
  PlacementTestData,
  PlacementTestResult,
  VocabAnswer,
  GrammarAnswer,
  SpeakingAnswer,
} from '../../learning/types/placementTest';

type Step =
  | 'welcome'
  | 'loading-test'
  | 'vocab'
  | 'grammar'
  | 'speaking'
  | 'submitting'
  | 'result';

export const PlacementTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userId = Number(user?.id);

  const [step, setStep] = useState<Step>('welcome');
  const [testData, setTestData] = useState<PlacementTestData | null>(null);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Collected answers
  const [vocabAnswers, setVocabAnswers] = useState<VocabAnswer[]>([]);
  const [grammarAnswers, setGrammarAnswers] = useState<GrammarAnswer[]>([]);

  // ---- Bắt đầu từ cơ bản ----
  const handleStartBasic = async () => {
    try {
      // Gọi API submit với bài trống => backend không tạo SKIPPED nào => học full
      await learningApi.submitPlacementTest(userId, {
        vocabAnswers: [],
        grammarAnswers: [],
        speakingAnswers: [],
      });
    } catch {
      // Ignore: vẫn cho đi vào trang learn
    }
    navigate('/learn', { replace: true });
  };

  // ---- Bắt đầu kiểm tra ----
  const handleStartTest = async () => {
    setStep('loading-test');
    setError(null);
    try {
      const res = await learningApi.generatePlacementTest();
      setTestData(res);
      setStep('vocab');
    } catch (err) {
      setError('Không thể tải bài kiểm tra. Vui lòng thử lại.');
      setStep('welcome');
    }
  };

  // ---- Hoàn thành từng vòng ----
  const handleVocabComplete = (answers: VocabAnswer[]) => {
    setVocabAnswers(answers);
    // Nếu có vòng grammar thì vào grammar, không thì vào speaking
    if (testData && testData.grammarRound.length > 0) {
      setStep('grammar');
    } else {
      setStep('speaking');
    }
  };

  const handleGrammarComplete = (answers: GrammarAnswer[]) => {
    setGrammarAnswers(answers);
    if (testData && testData.speakingRound.length > 0) {
      setStep('speaking');
    } else {
      handleSubmit(vocabAnswers, answers, []);
    }
  };

  const handleSpeakingComplete = (answers: SpeakingAnswer[]) => {
    handleSubmit(vocabAnswers, grammarAnswers, answers);
  };

  const handleSubmit = async (
    vocab: VocabAnswer[],
    grammar: GrammarAnswer[],
    speaking: SpeakingAnswer[]
  ) => {
    setStep('submitting');
    try {
      const res = await learningApi.submitPlacementTest(userId, {
        vocabAnswers: vocab,
        grammarAnswers: grammar,
        speakingAnswers: speaking,
      });
      setResult(res);
      setStep('result');
    } catch {
      setError('Có lỗi khi nộp bài. Vui lòng thử lại.');
      setStep('speaking');
    }
  };

  const handleStartLearning = () => {
    navigate('/learn', { replace: true });
  };

  // ---- RENDER ----
  if (step === 'loading-test' || step === 'submitting') {
    return (
      <div className="pt-loading">
        <div className="pt-spinner-large" />
        <p>{step === 'loading-test' ? 'Đang tải bài kiểm tra...' : 'Đang nộp bài và tạo lộ trình...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-error">
        <p>{error}</p>
        <button onClick={() => setStep('welcome')}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="placement-test-page">
      {step === 'welcome' && (
        <WelcomeScreen
          onStartFromBasic={handleStartBasic}
          onTakePlacementTest={handleStartTest}
        />
      )}

      {step === 'vocab' && testData && (
        <VocabRound
          questions={testData.vocabRound}
          onComplete={handleVocabComplete}
        />
      )}

      {step === 'grammar' && testData && (
        <GrammarRound
          questions={testData.grammarRound}
          onComplete={handleGrammarComplete}
        />
      )}

      {step === 'speaking' && testData && (
        <SpeakingRound
          questions={testData.speakingRound}
          assessPronunciation={learningApi.assessPronunciation}
          onComplete={handleSpeakingComplete}
        />
      )}

      {step === 'result' && result && (
        <PlacementTestResultPage
          result={result}
          onStartLearning={handleStartLearning}
        />
      )}
    </div>
  );
};
