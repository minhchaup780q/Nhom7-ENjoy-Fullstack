import { useLocation } from 'react-router-dom';
import { SidebarLeft } from './layouts/SidebarLeft';
import { TopHeader } from './layouts/TopHeader';
import { SidebarAdmin } from './layouts/SidebarAdmin';
import { AppRoutes } from './routes/AppRoutes';
import { CommunityChatWidget } from './features/chat/components/CommunityChatWidget';
import './App.css';

// Bộ điều phối Giao diện chính (TopHeader trên đỉnh + SidebarLeft bên trái + Main content)
function App() {
  const location = useLocation();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  // Trang Welcome / Placement Test: ẩn toàn bộ sidebar, hiện full-screen
  const isWelcomePage = location.pathname === '/welcome';
  const isAdminPage = location.pathname.startsWith('/admin');

  // 1. Trang Welcome / Placement Test => Full-screen không sidebar
  if (isWelcomePage) {
    return (
      <div className="min-h-screen bg-white w-full">
        <AppRoutes />
      </div>
    );
  }

  // 2. Trang Đăng nhập / Đăng ký => Căn giữa không sidebar
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-white w-full">
        <AppRoutes />
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
            <AppRoutes />
          </div>
        </main>
      </div>
    );
  }

  // 4. Các trang người dùng: SidebarLeft bên trái + TopHeader trên đỉnh + Main content
  return (
    <div className="min-h-screen bg-[#f8fafc] flex w-full relative">
      {/* Sidebar Left Navigation Menu */}
      <SidebarLeft />

      {/* Main Container Content Area with Top Header */}
      <div className="flex-grow min-h-screen pl-64 flex flex-col bg-[#f8fafc]">
        {/* Thanh Top Header chứa Streak, Gems, Hearts, Khóa học, Avatar */}
        <TopHeader />

        {/* Nội dung trang */}
        <main className="flex-grow flex flex-col w-full">
          <AppRoutes />
        </main>
      </div>

      {/* Widget Chat Cộng Đồng luôn nổi cố định ở góc dưới bên phải */}
      <CommunityChatWidget />
    </div>
  );
}

export default App;
