import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LearningMap } from '../features/learning/components/LearningMap';
import { ExploreDashboard } from '../features/explore/components/ExploreDashboard';
import type { Session } from '../features/learning/types';

interface FeatureUnderDevelopmentProps {
  tabName: string;
}

const FeatureUnderDevelopment: React.FC<FeatureUnderDevelopmentProps> = ({ tabName }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-4">
      <h2 className="text-3xl font-display font-extrabold text-primary">
        Tính năng đang cập nhật!
      </h2>
      <p className="text-sm font-semibold text-text-muted">
        Cảm ơn bé đã quan tâm! Thẻ <strong>{tabName}</strong> đang được hoàn thiện. 
        Hãy nhấn nút <strong>HỌC</strong> ở menu bên trái để chơi thử các bài tập tiếng Anh cùng Enjoy nha!
      </p>
    </div>
  );
};

interface AppRoutesProps {
  onStartSession: (session: Session) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ onStartSession }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/learn" replace />} />
      <Route path="/learn" element={<LearningMap onStartSession={onStartSession} />} />
      <Route path="/explore" element={<ExploreDashboard />} />
      <Route path="/practice" element={<FeatureUnderDevelopment tabName="LUYỆN TẬP" />} />
      <Route path="/leaderboard" element={<FeatureUnderDevelopment tabName="BẢNG XẾP HẠNG" />} />
      <Route path="/quests" element={<FeatureUnderDevelopment tabName="NHIỆM VỤ" />} />
      <Route path="/shop" element={<FeatureUnderDevelopment tabName="CỬA HÀNG" />} />
      <Route path="/profile" element={<FeatureUnderDevelopment tabName="HỒ SƠ" />} />
      <Route path="*" element={<Navigate to="/learn" replace />} />
    </Routes>
  );
};
