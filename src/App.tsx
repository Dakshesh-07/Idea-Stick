// Core Application Routes
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BoardProvider, useBoard } from './contexts/BoardContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { IdeaSprout, IdeaModal } from './components/IdeaModal';
import { DecisionRoundBanner } from './components/DecisionRoundBanner';
import { LandingPage } from './components/LandingPage';
import { TeamOnboardingModal } from './components/TeamOnboardingModal';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/views/DashboardView';
import { MyBoardsView } from './components/views/MyBoardsView';
import { TeamBoardsView } from './components/views/TeamBoardsView';
import { SettingsView } from './components/views/SettingsView';
import { Toaster } from 'react-hot-toast';
import { Plus } from 'lucide-react';

export type ViewState = 'dashboard' | 'my-boards' | 'team-boards' | 'settings';

function AppContent() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const { teams, loading: boardLoading } = useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
          <p className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Loading IdeaStick...</p>
        </div>
      </div>
    );
  }

  if (!user && !guestMode) {
    return (
      <>
        <LandingPage onEnterGuest={() => setGuestMode(true)} />
        <AuthModal />
      </>
    );
  }

  // Deprecating hard-forcing modal open on app launch to allow Dashboard exploration
  // const hasNoTeams = user && !boardLoading && teams.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        openTeamModal={() => setIsTeamModalOpen(true)} 
      />
      
      <main className="ml-64 min-h-screen relative">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        
        <div className="max-w-7xl mx-auto px-8 py-8">
          <DecisionRoundBanner />
          
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'my-boards' && <MyBoardsView />}
          {currentView === 'team-boards' && <TeamBoardsView />}
          {currentView === 'settings' && <SettingsView />}
        </div>

        <IdeaSprout />
        
        <button 
          onClick={() => {
            if (!user) {
              openAuthModal();
              return;
            }
            setIsModalOpen(true);
          }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-[70]"
        >
          <Plus className="w-8 h-8" />
        </button>

        <IdeaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <TeamOnboardingModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
        <AuthModal />
      </main>

      {/* Visual Texture Layer */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BoardProvider>
          <AppContent />
        </BoardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
