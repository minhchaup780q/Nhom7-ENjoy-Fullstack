import { useState } from 'react';
import { SidebarLeft } from './layouts/SidebarLeft';
import { SidebarRight } from './layouts/SidebarRight';
import { AppRoutes } from './routes/AppRoutes';
import { SessionPlayer } from './features/learning/components/SessionPlayer';
import type { Session } from './features/learning/types';
import './App.css';

function App() {
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
