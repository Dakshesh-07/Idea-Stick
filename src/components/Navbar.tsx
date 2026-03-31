import React, { useState } from 'react';
import { Search, Bell, LogOut, Link } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBoard } from '../contexts/BoardContext';
import { toast } from 'react-hot-toast';
import { ViewState } from '../App';
import { cn } from '../lib/utils';

interface NavbarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export function Navbar({ currentView, setCurrentView }: NavbarProps) {
  const { user, logout, openAuthModal } = useAuth();
  const { currentBoard, updateBoard } = useBoard();
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const inviteMembers = () => {
    if (!currentBoard) return;
    navigator.clipboard.writeText(currentBoard.teamId);
    toast.success("Invite code copied to clipboard!");
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 w-full sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="flex items-center gap-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            className="bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-indigo-600/20 text-sm" 
            placeholder="Search ideas..." 
            type="text"
          />
        </div>
        <nav className="hidden md:flex gap-6">
          <button 
            onClick={() => setCurrentView('my-boards')}
            className={cn("font-semibold font-manrope text-sm transition-colors", currentView === 'my-boards' ? "text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600" : "text-slate-500 hover:text-indigo-600")}
          >
            My Boards
          </button>
          <button 
            onClick={() => setCurrentView('team-boards')}
            className={cn("font-semibold font-manrope text-sm transition-colors", currentView === 'team-boards' ? "text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600" : "text-slate-500 hover:text-indigo-600")}
          >
            Team Boards
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {currentBoard && currentBoard.adminId === user?.id && (
          <button 
            onClick={() => setIsDecisionModalOpen(true)}
            className="px-4 py-2 text-slate-600 font-semibold text-sm hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Decision Mode
          </button>
        )}
        
        {currentBoard && currentBoard.adminId === user?.id && (
          <button 
            onClick={inviteMembers}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            Invite Team
          </button>
        )}
        
        <div className="flex items-center gap-2 ml-4">
          {user && (
            <button className="p-2 text-slate-500 hover:bg-indigo-50 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
          )}
          
          {user ? (
            <div className="group relative">
              <img 
                alt="User Profile" 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm cursor-pointer" 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-slate-50 mb-2">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={openAuthModal}
              className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all ml-2"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
