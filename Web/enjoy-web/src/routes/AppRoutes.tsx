import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LearningMap } from '../features/learning/components/LearningMap';
import { ExploreDashboard } from '../features/explore/components/ExploreDashboard';
import { LoginPage } from '../features/auth/components/LoginPage';
import { RegisterPage } from '../features/auth/components/RegisterPage';
import { useAuthStore } from '../features/auth/store/useAuthStore';
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

interface ProtectedRouteProps {
  isAuthenticated: boolean;
}


// Dùng để kiểm tra đã login hay chưa cho toàn bộ các url
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

interface AppRoutesProps {
  onStartSession: (session: Session) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ onStartSession }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - Bắt buộc phải đăng nhập */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/learn" element={<LearningMap onStartSession={onStartSession} />} />
        <Route path="/explore" element={<ExploreDashboard />} />
        <Route path="/practice" element={<FeatureUnderDevelopment tabName="LUYỆN TẬP" />} />
        <Route path="/leaderboard" element={<FeatureUnderDevelopment tabName="BẢNG XẾP HẠNG" />} />
        <Route path="/quests" element={<FeatureUnderDevelopment tabName="NHIỆM VỤ" />} />
        <Route path="/shop" element={<FeatureUnderDevelopment tabName="CỬA HÀNG" />} />
        <Route path="/profile" element={<FeatureUnderDevelopment tabName="HỒ SƠ" />} />
      </Route>

      {/* Redirect Routes */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/learn" : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/learn" : "/login"} replace />}
      />
    </Routes>
  );
};
