import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarLeft } from './layouts/SidebarLeft';
import { TopHeader } from './layouts/TopHeader';
import { SidebarAdmin } from './layouts/SidebarAdmin';
import { AppRoutes } from './routes/AppRoutes';
import { SessionPlayer } from './features/learning/components/SessionPlayer';
import { CommunityChatWidget } from './features/chat/components/CommunityChatWidget';
import type { Session } from './features/learning/types';
import './App.css';

// Bộ điều phối Giao diện chính (TopHeader trên đỉnh + SidebarLeft bên trái + Main content)
function App() {
  const [playingSession, setPlayingSession] = useState<Session | null>(null);
  const location = useLocation();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  // Trang Welcome / Placement Test: ẩn toàn bộ sidebar, hiện full-screen
  const isWelcomePage = location.pathname === '/welcome';
  const isAdminPage = location.pathname.startsWith('/admin');

  // 1. Trang Welcome / Placement Test => Full-screen không sidebar
  if (isWelcomePage) {
    return (
      <div className="min-h-screen bg-white w-full">
        <AppRoutes onStartSession={(session) => setPlayingSession(session)} />
      </div>
    );
  }

  // 2. Trang Đăng nhập / Đăng ký => Căn giữa không sidebar
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-white w-full">
        <AppRoutes onStartSession={(session) => setPlayingSession(session)} />
      </div>
    );
  }

  // 3. Trang Admin => Hiển thị Sidebar Admin
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex w-full relative">
        <SidebarAdmin />
        <main className="flex-grow min-h-screen pl-64 pr-0 flex flex-col bg-[#f8fafc]">
          <div className="p-8 w-full flex-grow flex flex-col">
            <AppRoutes onStartSession={(session) => setPlayingSession(session)} />
          </div>
        </main>
      </div>
    );
  }

  // 4. Các trang người dùng: SidebarLeft bên trái + TopHeader trên đỉnh + Main content
  return (
    <div className="min-h-screen bg-[#f8fafc] flex w-full relative">
      {/* Full-screen Session Player khi đang học bài */}
      {playingSession && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <SessionPlayer
            session={playingSession}
            onClose={() => setPlayingSession(null)}
          />
        </div>
      )}

      {/* Sidebar Left Navigation Menu */}
      <SidebarLeft />

      {/* Main Container Content Area with Top Header */}
      <div className="flex-grow min-h-screen pl-64 flex flex-col bg-[#f8fafc]">
        {/* Thanh Top Header chứa Streak, Gems, Hearts, Khóa học, Avatar */}
        <TopHeader />

        {/* Nội dung trang */}
        <main className="flex-grow flex flex-col w-full">
          <AppRoutes onStartSession={(session) => setPlayingSession(session)} />
        </main>
      </div>

      {/* Widget Chat Cộng Đồng luôn nổi cố định ở góc dưới bên phải */}
      <CommunityChatWidget />
    </div>
  );
}

export default App;
