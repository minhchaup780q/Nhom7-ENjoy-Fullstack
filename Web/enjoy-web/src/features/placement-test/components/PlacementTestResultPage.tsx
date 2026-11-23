import React from 'react';
import type { PlacementTestResult } from '../../learning/types/placementTest';

interface PlacementTestResultPageProps {
  result: PlacementTestResult;
  onStartLearning: () => void;
}

export const PlacementTestResultPage: React.FC<PlacementTestResultPageProps> = ({
  result,
  onStartLearning,
}) => {
  const {
    totalCorrect = 0,
    totalQuestions = 0,
    skippedTopics = [],
    round1Result,
    round2Result,
    round3Result,
    vocabResult,
    grammarResult,
    speakingResult,
  } = result;

  // Sử dụng dữ liệu mới nếu có, fallback sang dữ liệu cũ
  const r1 = round1Result || (vocabResult ? { correct: vocabResult.correct, total: vocabResult.total, mistakes: [] } : null);
  const r2 = round2Result || (grammarResult ? { correct: grammarResult.correct, total: grammarResult.total, mistakes: [] } : null);
  const r3 = round3Result || (speakingResult ? { correct: speakingResult.correct, total: speakingResult.total, mistakes: [] } : null);

  const displayTotalCorrect = totalCorrect || (
    (r1?.correct || 0) + (r2?.correct || 0) + (r3?.correct || 0)
  );
  const displayTotalQuestions = totalQuestions || (
    (r1?.total || 0) + (r2?.total || 0) + (r3?.total || 0)
  );

  return (
    <div className="pt-result-page">
      <div className="pt-result-header">
        <span className="pt-result-emoji">🎉</span>
        <h1 className="pt-result-title">Kết quả kiểm tra đầu vào</h1>
        <p className="pt-result-subtitle">
          Bé đã hoàn thành xuất sắc bài thi với kết quả{' '}
          <strong>
            {displayTotalCorrect} / {displayTotalQuestions} câu đúng
          </strong>
          !
        </p>
      </div>

      {/* DANH SÁCH CHỦ ĐỀ ĐƯỢC MIỄN HỌC (SKIP TOPIC) */}
      {skippedTopics && skippedTopics.length > 0 ? (
        <div className="pt-result-section">
          <div className="pt-skipped-box">
            <div className="pt-skipped-title">
              <span>🚀</span>
              <span>Chủ đề được miễn học (Đã hoàn thành 100%):</span>
            </div>
            <p className="text-sm text-text-muted mb-3">
              Bé đã làm đúng tất cả các câu của những chủ đề dưới đây nên hệ thống đã tự động mở khóa vượt cấp cho bé!
            </p>
            <div className="pt-skipped-tags">
              {skippedTopics.map((topic, i) => (
                <span key={i} className="pt-skipped-tag">
                  ✓ {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-result-section">
          <p className="text-sm text-text-muted italic">
            💡 Bé chưa hoàn thành tối đa điểm một chủ đề trọn vẹn nào, lộ trình học sẽ giữ đầy đủ tất cả bài học để bé luyện tập từ đầu nhé!
          </p>
        </div>
      )}

      {/* ---- VÒNG 1: NGHE CHỌN ẢNH ---- */}
      {r1 && (
        <div className="pt-result-section">
          <h2 className="pt-result-section-title">
            🎧 Vòng 1 · Nghe và chọn hình ảnh
            <span className="pt-result-score">
              {r1.correct}/{r1.total} đúng
            </span>
          </h2>

          {r1.mistakes.length === 0 ? (
            <p className="pt-result-all-correct">✅ Bé đã làm đúng toàn bộ phần nghe chọn ảnh!</p>
          ) : (
            <div className="pt-result-mistakes">
              {r1.mistakes.map((m, i) => (
                <div key={i} className="pt-result-mistake-item">
                  <p className="pt-mistake-topic">
                    📌 Chủ đề: <strong>{m.topic}</strong>
                  </p>
                  <p className="pt-mistake-detail text-red-500 font-semibold">
                    Lựa chọn chưa chính xác (Lựa chọn của bé: {m.selectedOptionId})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- VÒNG 2: NỐI TỪ VỚI NGHĨA ---- */}
      {r2 && (
        <div className="pt-result-section">
          <h2 className="pt-result-section-title">
            📚 Vòng 2 · Nối từ với nghĩa
            <span className="pt-result-score">
              {r2.correct}/{r2.total} đúng
            </span>
          </h2>

          {r2.mistakes.length === 0 ? (
            <p className="pt-result-all-correct">✅ Bé đã nối chính xác toàn bộ các từ vựng!</p>
          ) : (
            <div className="pt-result-mistakes">
              {r2.mistakes.map((m, i) => (
                <div key={i} className="pt-result-mistake-item">
                  <p className="pt-mistake-topic">
                    📌 Chủ đề: <strong>{m.topic}</strong>
                  </p>
                  <p className="pt-mistake-detail">
                    Từ: <strong>{m.word}</strong> — Nghĩa đúng là:{' '}
                    <strong className="text-emerald-600">{m.correctMeaning}</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- VÒNG 3: SẮP XẾP CÂU ---- */}
      {r3 && (
        <div className="pt-result-section">
          <h2 className="pt-result-section-title">
            📝 Vòng 3 · Sắp xếp câu hoàn chỉnh
            <span className="pt-result-score">
              {r3.correct}/{r3.total} đúng
            </span>
          </h2>

          {r3.mistakes.length === 0 ? (
            <p className="pt-result-all-correct">✅ Bé đã sắp xếp chính xác toàn bộ các câu!</p>
          ) : (
            <div className="pt-result-mistakes">
              {r3.mistakes.map((m, i) => (
                <div key={i} className="pt-result-mistake-item">
                  <p className="pt-mistake-topic">
                    📌 Chủ đề: <strong>{m.topic}</strong>
                  </p>
                  <p className="pt-mistake-sentence text-red-500">
                    ✏️ Câu của bé: <em>{m.userSentence || '(để trống)'}</em>
                  </p>
                  <p className="pt-mistake-correct text-emerald-600">
                    ✅ Câu đúng: <strong>{m.correctSentence}</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- CTA ---- */}
      <div className="pt-result-cta">
        <button
          id="btn-start-learning-path"
          className="pt-start-btn"
          onClick={onStartLearning}
        >
          🚀 Bắt đầu Lộ Trình Học Của Bé
        </button>
      </div>
    </div>
  );
};
