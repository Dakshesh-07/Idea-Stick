import React, { useState, useEffect } from 'react';
import { KanbanBoard } from '../KanbanBoard';
import { useBoard } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';
import { Users } from 'lucide-react';

export function TeamBoardsView() {
  const { teams } = useBoard();
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0].id);
    }
  }, [teams, selectedTeam]);

  if (teams.length === 0) {
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-900/5 mt-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">👥</span>
          </div>
          <h2 className="text-3xl font-headline font-bold text-slate-800 text-center mb-3">Team Workspaces</h2>
          <p className="text-slate-500 text-center max-w-sm">Sign in to collaborate, vote, and manage ideas securely with your remote teams.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-900/5">
        <Users className="w-16 h-16 text-indigo-200 mb-6" />
        <h2 className="text-2xl font-headline font-bold text-slate-800 text-center">You aren't in any teams yet</h2>
        <p className="text-slate-500 text-center mt-2 max-w-sm">Create a team via the sidebar to start collaborating with others securely.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
           <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
             <Users className="w-5 h-5" />
           </span>
           <div>
             <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Team</h2>
             <select 
               value={selectedTeam || ''}
               onChange={e => setSelectedTeam(e.target.value)}
               className="text-2xl font-headline font-bold text-slate-800 bg-transparent border-none p-0 cursor-pointer focus:ring-0"
             >
               {teams.map(t => (
                 <option key={t.id} value={t.id}>{t.name}</option>
               ))}
             </select>
           </div>
        </div>
      </div>
      
      {selectedTeam && <KanbanBoard filter={{ scope: 'team', teamId: selectedTeam }} />}
    </div>
  );
}
