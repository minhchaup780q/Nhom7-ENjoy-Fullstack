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
  const { vocabResult, grammarResult, speakingResult } = result;

  // Phân loại màu speaking
  const speakingColor =
    speakingResult.wrongRate > 0.4 ? '#ef4444' :
    speakingResult.wrongRate > 0.2 ? '#f59e0b' : '#10b981';

  return (
    <div className="pt-result-page">
      <div className="pt-result-header">
        <span className="pt-result-emoji">🎉</span>
        <h1 className="pt-result-title">Kết quả kiểm tra đầu vào</h1>
        <p className="pt-result-subtitle">
          Dựa trên kết quả, chúng tôi đã tạo lộ trình học tối ưu cho bạn!
        </p>
      </div>

      {/* ---- VÒNG 1: TỪ VỰNG ---- */}
      <div className="pt-result-section">
        <h2 className="pt-result-section-title">
          📚 Vòng 1 · Từ vựng
          <span className="pt-result-score">
            {vocabResult.correct}/{vocabResult.total} đúng
          </span>
        </h2>

        {vocabResult.mistakes.length === 0 ? (
          <p className="pt-result-all-correct">✅ Bạn đã làm đúng toàn bộ từ vựng!</p>
        ) : (
          <div className="pt-result-mistakes">
            {vocabResult.mistakes.map((m, i) => (
              <div key={i} className="pt-result-mistake-item">
                <p className="pt-mistake-topic">
                  📌 Topic: <strong>{m.topicTitle}</strong>
                </p>
                <p className="pt-mistake-detail">
                  Chưa vững các từ: <strong>{m.wrongWords.join(', ')}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- VÒNG 2: NGỮ PHÁP ---- */}
      <div className="pt-result-section">
        <h2 className="pt-result-section-title">
          📝 Vòng 2 · Ngữ pháp
          <span className="pt-result-score">
            {grammarResult.correct}/{grammarResult.total} đúng
          </span>
        </h2>

        {grammarResult.total === 0 ? (
          <p className="pt-result-na">— Không có dữ liệu ngữ pháp trong bài kiểm tra</p>
        ) : grammarResult.mistakes.length === 0 ? (
          <p className="pt-result-all-correct">✅ Bạn đã làm đúng toàn bộ phần ngữ pháp!</p>
        ) : (
          <div className="pt-result-mistakes">
            {grammarResult.mistakes.map((m, i) => (
              <div key={i} className="pt-result-mistake-item">
                <p className="pt-mistake-sentence">
                  ✏️ Câu sai: <em>{m.wrongSentence}</em>
                </p>
                <p className="pt-mistake-correct">
                  ✅ Đúng: <strong>{m.correctSentence}</strong>
                </p>
                <p className="pt-mistake-grammar-tag">
                  💡 Chưa vững: <strong>{m.grammarName}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- VÒNG 3: SPEAKING ---- */}
      <div className="pt-result-section">
        <h2 className="pt-result-section-title">
          🎤 Vòng 3 · Phát âm
          <span className="pt-result-score">
            {speakingResult.correct}/{speakingResult.total} đúng
          </span>
        </h2>

        {speakingResult.total === 0 ? (
          <p className="pt-result-na">— Không có dữ liệu phát âm trong bài kiểm tra</p>
        ) : (
          <>
            {speakingResult.mistakes.length > 0 && (
              <div className="pt-result-mistakes">
                {speakingResult.mistakes.map((m, i) => (
                  <div key={i} className="pt-result-mistake-item">
                    <p className="pt-mistake-sentence">
                      🎯 Câu cần nói: <strong>{m.sentence}</strong>
                    </p>
                    <p className="pt-mistake-detail">
                      🔊 Bạn đã nói: <em>{m.recognizedText || '(không nhận được)'}</em>
                    </p>
                    {m.score !== null && (
                      <p className="pt-mistake-score">Điểm: {m.score?.toFixed(0)}/100</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-speaking-overall" style={{ borderColor: speakingColor }}>
              <span className="pt-speaking-label">Nhận xét tổng quan:</span>
              <span className="pt-speaking-comment" style={{ color: speakingColor }}>
                {speakingResult.overallComment}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ---- CTA ---- */}
      <div className="pt-result-cta">
        <button
          id="btn-start-learning-path"
          className="pt-start-btn"
          onClick={onStartLearning}
        >
          🚀 Bắt đầu Lộ Trình Của Bạn
        </button>
      </div>
    </div>
  );
};
