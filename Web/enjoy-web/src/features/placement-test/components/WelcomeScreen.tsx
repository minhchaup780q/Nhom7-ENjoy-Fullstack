import React from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../learning/services/learningApi';
import { useAuthStore } from '../../auth/store/useAuthStore';

interface WelcomeScreenProps {
  onStartFromBasic: () => void;
  onTakePlacementTest: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartFromBasic,
  onTakePlacementTest,
}) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        {/* Logo / Mascot */}
        <div className="welcome-mascot">
          <span className="mascot-emoji">🦋</span>
        </div>

        {/* Heading */}
        <h1 className="welcome-title">Chào mừng đến với ENjoy!</h1>
        <p className="welcome-subtitle">
          Hãy để chúng tôi tạo lộ trình học tiếng Anh phù hợp nhất cho bạn.
        </p>

        {/* Choices */}
        <div className="welcome-choices">
          {/* Option 1: Start from basic */}
          <button
            id="btn-start-basic"
            className="welcome-choice-btn welcome-choice-basic"
            onClick={onStartFromBasic}
          >
            <div className="choice-icon">📚</div>
            <div className="choice-content">
              <h3 className="choice-title">Bắt đầu từ cơ bản</h3>
              <p className="choice-desc">
                Học từng bước từ đầu với lộ trình đầy đủ, phù hợp cho người mới bắt đầu.
              </p>
            </div>
            <div className="choice-arrow">→</div>
          </button>

          {/* Option 2: Placement test */}
          <button
            id="btn-placement-test"
            className="welcome-choice-btn welcome-choice-test"
            onClick={onTakePlacementTest}
          >
            <div className="choice-icon">🎯</div>
            <div className="choice-content">
              <h3 className="choice-title">Xác định trình độ hiện tại</h3>
              <p className="choice-desc">
                Làm bài kiểm tra nhanh để chúng tôi tạo lộ trình học tối ưu, bỏ qua phần đã biết.
              </p>
            </div>
            <div className="choice-arrow">→</div>
          </button>
        </div>

        {/* Info */}
        <p className="welcome-note">
          ✨ Bài kiểm tra gồm 3 vòng ngắn (từ vựng, ngữ pháp, phát âm) — khoảng 5–10 phút
        </p>
      </div>
    </div>
  );
};
