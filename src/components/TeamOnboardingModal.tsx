import React, { useState } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { X, Users, Plus, KeyRound } from 'lucide-react';

export function TeamOnboardingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { addTeam, joinTeam } = useBoard();
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'create') {
        if (!teamName) return;
        await addTeam(teamName);
      } else {
        if (!inviteCode) return;
        await joinTeam(inviteCode);
      }
      onClose();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="font-headline text-xl font-bold text-slate-800">Team Setup</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex grid-cols-2 bg-slate-50 text-center font-bold text-sm">
          <button 
            className={`flex-1 py-4 border-b-2 ${mode === 'create' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setMode('create')}
          >
            Create Team
          </button>
          <button 
            className={`flex-1 py-4 border-b-2 ${mode === 'join' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setMode('join')}
          >
            Join via Code
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {mode === 'create' ? (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Team Name</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  autoFocus
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 font-medium"
                  placeholder="E.g., Design Mavericks" 
                />
              </div>
            </div>
          ) : (
             <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Invite Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  autoFocus
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 font-medium font-mono text-sm tracking-widest"
                  placeholder="Paste code here..." 
                />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            {mode === 'create' ? <Plus className="w-5 h-5"/> : <Users className="w-5 h-5"/>}
            {mode === 'create' ? 'Create & Continue' : 'Join Team'}
          </button>
        </form>
      </div>
    </div>
  );
}
