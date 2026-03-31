import React from 'react';
import { KanbanBoard } from '../KanbanBoard';
import { useAuth } from '../../contexts/AuthContext';
import { useBoard } from '../../contexts/BoardContext';

export function MyBoardsView() {
  const { user } = useAuth();
  const { ideas } = useBoard();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-900/5 mt-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">💡</span>
        </div>
        <h2 className="text-3xl font-headline font-bold text-slate-800 text-center mb-3">Your Private Sandbox</h2>
        <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
          Sign in to unlock a dedicated, private space to stash your brilliant thoughts, half-baked concepts, and future masterpieces safely away from the public eye.
        </p>
      </div>
    );
  }

  const personalIdeas = ideas.filter(i => i.scope === 'personal' && i.createdBy === user.id);
  const selectedCount = personalIdeas.filter(i => i.status === 'selected').length;
  const discussionCount = personalIdeas.filter(i => i.status === 'discussion').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-headline font-bold text-slate-800">Your Private Sandbox</h2>
          <p className="text-slate-500 mt-1">Personal ideas visible only to you.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-center">
            <span className="block text-2xl font-black text-indigo-600">{personalIdeas.length}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Ideas</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-center">
            <span className="block text-2xl font-black text-green-500">{selectedCount}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Selected</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-center">
            <span className="block text-2xl font-black text-yellow-500">{discussionCount}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Discussion</span>
          </div>
        </div>
      </div>
      
      <KanbanBoard filter={{ scope: 'personal', createdBy: user.id }} />
    </div>
  );
}
