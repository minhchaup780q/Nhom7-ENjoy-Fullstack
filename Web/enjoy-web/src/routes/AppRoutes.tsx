import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LearningMap } from '../features/learning/components/LearningMap';
import { ExploreDashboard } from '../features/explore/components/ExploreDashboard';
import { ProfilePage } from '../features/profile/components/ProfilePage';
import { PracticeDashboard } from '../features/practice/components/PracticeDashboard';
import { PersonalStatsPage } from '../features/stats/components/PersonalStatsPage';
import { LoginPage } from '../features/auth/components/LoginPage';
import { RegisterPage } from '../features/auth/components/RegisterPage';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import type { Session } from '../features/learning/types';

import { AdminDashboard } from '../features/admin/components/AdminDashboard';
import { AdminLessons } from '../features/admin/components/AdminLessons';
import { AdminUsers } from '../features/admin/components/AdminUsers';
import { AdminSystem } from '../features/admin/components/AdminSystem';
import { AdminProfile } from '../features/admin/components/AdminProfile';

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

interface AdminRouteProps {
  isAuthenticated: boolean;
  role?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ isAuthenticated, role }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'ROLE_ADMIN') {
    return <Navigate to="/learn" replace />;
  }
  return <Outlet />;
};

interface AppRoutesProps {
  onStartSession: (session: Session) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ onStartSession }) => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - Bắt buộc phải đăng nhập */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/learn" element={<LearningMap onStartSession={onStartSession} />} />
        <Route path="/explore" element={<ExploreDashboard />} />
        <Route path="/practice" element={<PracticeDashboard />} />
        <Route path="/leaderboard" element={<FeatureUnderDevelopment tabName="BẢNG XẾP HẠNG" />} />
        <Route path="/quests" element={<FeatureUnderDevelopment tabName="NHIỆM VỤ" />} />
        <Route path="/shop" element={<FeatureUnderDevelopment tabName="CỬA HÀNG" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/stats" element={<PersonalStatsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute isAuthenticated={isAuthenticated} role={user?.role} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/lessons" element={<AdminLessons />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/system" element={<AdminSystem />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Redirect Routes */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? (user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/learn') : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? (user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/learn') : "/login"} replace />}
      />
    </Routes>
  );
};
