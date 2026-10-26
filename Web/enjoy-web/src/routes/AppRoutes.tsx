import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LearningMap } from '../features/learning/components/LearningMap';
import { ExploreDashboard } from '../features/explore/components/ExploreDashboard';
import { ProfilePage } from '../features/profile/components/ProfilePage';
import { PracticePage } from '../features/practice/components/PracticePage';
import { ExamStatsPage } from '../features/stats/components/ExamStatsPage';
import { PersonalizedPracticePage } from '../features/practice/components/PersonalizedPracticePage';
import { LoginPage } from '../features/auth/components/LoginPage';
import { RegisterPage } from '../features/auth/components/RegisterPage';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { PronunciationGuidePage } from '../features/pronunciation/components/PronunciationGuidePage';
import { PlacementTestPage } from '../features/placement-test/components/PlacementTestPage';
import { ExamPage } from '../features/exam/components/ExamPage';
import { LeaderboardPage } from '../features/leaderboard/components/LeaderboardPage';
import type { Session } from '../features/learning/types';

import { AdminDashboard } from '../features/admin/components/AdminDashboard';
import { AdminLessons } from '../features/admin/components/AdminLessons';
import { AdminUsers } from '../features/admin/components/AdminUsers';
import { AdminSystem } from '../features/admin/components/AdminSystem';
import { AdminProfile } from '../features/admin/components/AdminProfile';

import { isAdminRole } from '../features/auth/types';

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
  if (!isAdminRole(role)) {
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
        {/* Welcome / Placement Test - hiện khi user mới đăng ký */}
        <Route path="/welcome" element={<PlacementTestPage />} />
        <Route path="/learn" element={<LearningMap onStartSession={onStartSession} />} />
        <Route path="/explore" element={<ExploreDashboard />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/exams" element={<ExamPage />} />
        <Route path="/exams/:examId" element={<ExamPage />} />
        <Route path="/exam" element={<Navigate to="/exams" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/stats" element={<ExamStatsPage />} />
        <Route path="/practice/personalization" element={<PersonalizedPracticePage />} />
        <Route path="/practice/supplementary" element={<PersonalizedPracticePage />} />
        <Route path="/pronunciation" element={<PronunciationGuidePage />} />
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
        element={<Navigate to={isAuthenticated ? (isAdminRole(user?.role) ? '/admin/dashboard' : '/learn') : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? (isAdminRole(user?.role) ? '/admin/dashboard' : '/learn') : "/login"} replace />}
      />

    </Routes>
  );
};
