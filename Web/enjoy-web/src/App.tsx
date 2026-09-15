import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarLeft } from './layouts/SidebarLeft';
import { SidebarRight } from './layouts/SidebarRight';
import { SidebarAdmin } from './layouts/SidebarAdmin';
import { AppRoutes } from './routes/AppRoutes';
import { SessionPlayer } from './features/learning/components/SessionPlayer';
import type { Session } from './features/learning/types';
import './App.css';

// Bộ điều phối Giao diện chính (khi nào nên hiện/ẩn Sidebar )
function App() {
  const [playingSession, setPlayingSession] = useState<Session | null>(null);
  const location = useLocation();

  // 1. Kiểm tra xem người dùng có đang ở trang Login hoặc Register hay không
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  // 2. Trường hợp 1: Người dùng đang học bài -> Ẩn toàn bộ Sidebar để hiển thị màn hình làm bài tập tràn màn hình (Full-screen)
  if (playingSession) {
    return (
      <SessionPlayer
        session={playingSession}
        onClose={() => setPlayingSession(null)}
      />
    );
  }

  // 3. Người dùng đang ở trang Đăng nhập / Đăng ký => Ẩn 2 Sidebar bên trái & bên phải để hiển thị Form Đăng nhập căn giữa
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-white w-full">
        <AppRoutes onStartSession={(session) => setPlayingSession(session)} />
      </div>
    );
  }

  // 4. Người dùng đang ở trang Admin => Hiển thị Sidebar Admin
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

  // 5. Người dùng ở các trang bình thường -> Hiển thị đầy đủ Bố cục 3 cột (Sidebar trái - Nội dung chính AppRoutes - Sidebar phải)
  return (
    <div className="min-h-screen bg-white flex w-full relative">
      {/* Sidebar Left Navigation Menu */}
      <SidebarLeft />

      {/* Main Container Content Area */}
      <main className="flex-grow min-h-screen pl-64 pr-0 lg:pr-80 flex flex-col bg-bg-light">
        <AppRoutes onStartSession={(session) => setPlayingSession(session)} />
      </main>

      {/* Sidebar Right Info Stats Widgets */}
      <div className="w-80 fixed right-0 top-0 bottom-0 border-l-2 border-border-main overflow-y-auto hidden lg:block bg-white">
        <SidebarRight />
      </div>
    </div>
  );
}

export default App;
