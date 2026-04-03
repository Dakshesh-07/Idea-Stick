import React from 'react';
import { LayoutDashboard, StickyNote as StickyNoteIcon, Users, Settings, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBoard } from '../contexts/BoardContext';
import { cn } from '../lib/utils';
import { ViewState } from '../App';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  openTeamModal: () => void;
}

export function Sidebar({ currentView, setCurrentView, openTeamModal }: SidebarProps) {
  const { user, openAuthModal } = useAuth();
  const { teams } = useBoard();

  const handleCreateTeam = () => {
    if (!user) return openAuthModal();
    openTeamModal();
  };

  const navItems: Array<{ id: ViewState; icon: any; label: string }> = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'my-boards', icon: StickyNoteIcon, label: 'My Boards' },
    ...(teams.length > 0 ? [{ id: 'team-boards' as ViewState, icon: Users, label: 'Team Boards' }] : []),
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-white dark:bg-slate-950 shadow-xl shadow-indigo-900/5 flex flex-col py-6 z-40 border-r border-slate-100 dark:border-slate-800 transition-colors">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <StickyNoteIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-indigo-600 font-headline">IdeaStick</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Collaborative Studio</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-manrope text-sm font-semibold transition-all duration-200",
              currentView === item.id 
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600" 
                : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:translate-x-1"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button 
          onClick={handleCreateTeam}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
          New Team
        </button>
      </div>
    </aside>
  );
}
