import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../learning/services/learningApi';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { WelcomeScreen } from './WelcomeScreen';
import {
  ListenAndChooseImageRound,
  MatchPairRound,
  SentenceBuilderRound,
} from './PlacementTestRounds';
import { PlacementTestResultPage } from './PlacementTestResultPage';
import { TargetSelectionScreen } from './TargetSelectionScreen';
import type {
  PlacementTestData,
  PlacementTestResult,
  Round1Answer,
  Round2Answer,
  Round3Answer,
  Round1Question,
  Round2Question,
  Round3Question,
} from '../../learning/types/placementTest';

type Step =
  | 'welcome'
  | 'loading-test'
  | 'round-1'
  | 'round-2'
  | 'round-3'
  | 'submitting'
  | 'result'
  | 'target-selection';

export const PlacementTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userId = Number(user?.id);

  const [step, setStep] = useState<Step>('welcome');
  const [testData, setTestData] = useState<PlacementTestData | null>(null);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tự động chuyển hướng vào lộ trình nếu user đã hoàn thành bài test trước đó
  useEffect(() => {
    if (userId) {
      learningApi.getPlacementTestStatus(userId).then((res: any) => {
        const hasCompleted = Boolean(res?.hasCompleted ?? res?.data?.hasCompleted);
        if (hasCompleted) {
          navigate('/learn', { replace: true });
        }
      }).catch(() => {});
    }
  }, [userId, navigate]);

  // Câu trả lời của 3 vòng
  const [round1Answers, setRound1Answers] = useState<Round1Answer[]>([]);
  const [round2Answers, setRound2Answers] = useState<Round2Answer[]>([]);

  // Trích xuất danh sách câu hỏi từng vòng từ S3 JSON
  const round1Data = testData?.rounds?.find(
    r => r.round_number === 1 || r.type === 'LISTEN_AND_CHOOSE_IMAGE'
  );
  const round1Questions = (round1Data?.questions || []) as Round1Question[];

  const round2Data = testData?.rounds?.find(
    r => r.round_number === 2 || r.type === 'MATCH_PAIR'
  );
  const round2Questions = (round2Data?.questions || []) as Round2Question[];

  const round3Data = testData?.rounds?.find(
    r => r.round_number === 3 || r.type === 'SENTENCE_BUILDER'
  );
  const round3Questions = (round3Data?.questions || []) as Round3Question[];

  // ---- Bắt đầu từ cơ bản (bỏ qua bài test) ----
  const handleStartBasic = async () => {
    try {
      await learningApi.submitPlacementTest(userId, {
        testId: testData?.test_id,
        round1Answers: [],
        round2Answers: [],
        round3Answers: [],
      });
    } catch {
      // Ignore: vẫn tiếp tục sang chọn target
    }
    setStep('target-selection');
  };

  // ---- Bắt đầu kiểm tra: tải trực tiếp từ S3 ----
  const handleStartTest = async () => {
    setStep('loading-test');
    setError(null);
    try {
      const res = await learningApi.fetchPlacementTestFromS3();
      if (!res || !res.rounds || res.rounds.length === 0) {
        setError('Hệ thống bài kiểm tra hiện chưa có câu hỏi. Bé vui lòng thử lại sau nhé!');
        setStep('welcome');
        return;
      }

      setTestData(res);

      const r1 = res.rounds.find(
        r => r.round_number === 1 || r.type === 'LISTEN_AND_CHOOSE_IMAGE'
      );
      const r2 = res.rounds.find(
        r => r.round_number === 2 || r.type === 'MATCH_PAIR'
      );
      const r3 = res.rounds.find(
        r => r.round_number === 3 || r.type === 'SENTENCE_BUILDER'
      );

      if (r1 && r1.questions && r1.questions.length > 0) {
        setStep('round-1');
      } else if (r2 && r2.questions && r2.questions.length > 0) {
        setStep('round-2');
      } else if (r3 && r3.questions && r3.questions.length > 0) {
        setStep('round-3');
      } else {
        setError('Các vòng thi trong đề thi hiện chưa có câu hỏi. Bé vui lòng thử lại sau!');
        setStep('welcome');
      }
    } catch (err) {
      console.error('Error fetching placement test from S3:', err);
      setError('Không thể tải bài kiểm tra từ máy chủ. Bé vui lòng thử lại nhé!');
      setStep('welcome');
    }
  };

  // ---- Hoàn thành vòng 1: Nghe chọn ảnh ----
  const handleRound1Complete = (answers: Round1Answer[]) => {
    setRound1Answers(answers);
    if (round2Questions.length > 0) {
      setStep('round-2');
    } else if (round3Questions.length > 0) {
      setStep('round-3');
    } else {
      handleSubmit(answers, [], []);
    }
  };

  // ---- Hoàn thành vòng 2: Nối từ với nghĩa ----
  const handleRound2Complete = (answers: Round2Answer[]) => {
    setRound2Answers(answers);
    if (round3Questions.length > 0) {
      setStep('round-3');
    } else {
      handleSubmit(round1Answers, answers, []);
    }
  };

  // ---- Hoàn thành vòng 3: Sắp xếp câu -> Nộp bài ----
  const handleRound3Complete = (answers: Round3Answer[]) => {
    handleSubmit(round1Answers, round2Answers, answers);
  };

  // ---- Nộp bài lên backend để chấm điểm & tạo lộ trình ----
  const handleSubmit = async (
    r1: Round1Answer[],
    r2: Round2Answer[],
    r3: Round3Answer[]
  ) => {
    setStep('submitting');
    try {
      const res = await learningApi.submitPlacementTest(userId, {
        testId: testData?.test_id,
        round1Answers: r1,
        round2Answers: r2,
        round3Answers: r3,
      });
      setResult((res as any)?.data || res);
      setStep('result');
    } catch (err) {
      console.error('Error submitting placement test:', err);
      setError('Có lỗi xảy ra khi nộp bài thi. Bé vui lòng thử lại nhé!');
      setStep('round-3');
    }
  };

  const handleStartLearning = () => {
    setStep('target-selection');
  };

  const handleTargetConfirm = () => {
    navigate('/learn', { replace: true });
  };

  // ---- RENDER ----
  if (step === 'loading-test' || step === 'submitting') {
    return (
      <div className="pt-loading">
        <div className="pt-spinner-large" />
        <p>
          {step === 'loading-test'
            ? 'Đang tải bài kiểm tra từ hệ thống...'
            : 'Đang chấm điểm và tạo lộ trình tối ưu cho bé...'}
        </p>
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

      {step === 'round-1' && (
        <ListenAndChooseImageRound
          questions={round1Questions}
          onComplete={handleRound1Complete}
        />
      )}

      {step === 'round-2' && (
        <MatchPairRound
          questions={round2Questions}
          onComplete={handleRound2Complete}
        />
      )}

      {step === 'round-3' && (
        <SentenceBuilderRound
          questions={round3Questions}
          onComplete={handleRound3Complete}
        />
      )}

      {step === 'result' && result && (
        <PlacementTestResultPage
          result={result}
          onStartLearning={handleStartLearning}
        />
      )}

      {step === 'target-selection' && (
        <TargetSelectionScreen
          userId={userId}
          onConfirm={handleTargetConfirm}
        />
      )}
    </div>
  );
};
