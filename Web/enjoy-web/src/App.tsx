import { useState } from 'react';
import { SidebarLeft } from './layouts/SidebarLeft';
import { SidebarRight } from './layouts/SidebarRight';
import { LearningMap } from './features/learning/components/LearningMap';
import { SessionPlayer } from './features/learning/components/SessionPlayer';
import type { Session } from './features/learning/types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [playingSession, setPlayingSession] = useState<Session | null>(null);

  if (playingSession) {
    return (
      <SessionPlayer
        session={playingSession}
        onClose={() => setPlayingSession(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex w-full relative">
      {/* Sidebar Left Navigation Menu */}
      <SidebarLeft activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container Content Area */}
      <main className="flex-grow min-h-screen pl-64 pr-0 lg:pr-80 flex flex-col">
        {activeTab === 'learn' && (
          <LearningMap onStartSession={(session) => setPlayingSession(session)} />
        )}
        {activeTab !== 'learn' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-display font-extrabold text-primary">
              Tính năng đang cập nhật!
            </h2>
            <p className="text-sm font-semibold text-text-muted">
              Cảm ơn bé đã quan tâm! Thẻ <strong>{activeTab.toUpperCase()}</strong> đang được hoàn thiện. 
              Hãy nhấn nút <strong>HỌC</strong> ở menu bên trái để chơi thử các bài tập tiếng Anh cùng Enjoy nha!
            </p>
          </div>
        )}
      </main>

      {/* Sidebar Right Info Stats Widgets */}
      <div className="w-80 fixed right-0 top-0 bottom-0 border-l-2 border-border-main overflow-y-auto hidden lg:block bg-white">
        <SidebarRight />
      </div>
    </div>
  );
}

export default App;
