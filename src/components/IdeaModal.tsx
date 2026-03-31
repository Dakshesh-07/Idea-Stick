import React, { useState } from 'react';
import { X, Globe2, Lock, Users } from 'lucide-react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { IdeaColor, IdeaStatus, IdeaScope } from '../types';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export function IdeaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addIdea, teams } = useBoard();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<IdeaColor>('yellow');
  const [scope, setScope] = useState<IdeaScope>('public');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;

    if (scope === 'team' && !selectedTeamId) {
      toast.error("You need to select a team or create one first!");
      return;
    }

    try {
      await addIdea({
        title,
        description,
        color,
        scope,
        teamId: scope === 'team' ? selectedTeamId : undefined,
        status: 'new' as IdeaStatus,
        createdBy: user.id,
        authorName: user.name,
        voteCount: 0,
      });
      setTitle('');
      setDescription('');
      setScope('public');
      onClose();
      toast.success("Idea planted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to plant idea.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-headline text-2xl font-bold text-slate-800 tracking-tight">Create New Idea</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-500 text-sm">Capture your next big thought.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-2">Where do you want to post this idea?</label>
            <div className="grid grid-cols-3 gap-3">
               <button type="button" onClick={() => setScope('public')} className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", scope === 'public' ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-white hover:border-indigo-200")}>
                  <Globe2 className={cn("w-6 h-6 mb-2", scope === 'public' ? "text-indigo-600" : "text-slate-400")} />
                  <span className={cn("text-xs font-bold", scope === 'public' ? "text-indigo-700" : "text-slate-500")}>🌍 Public</span>
               </button>
               <button type="button" onClick={() => setScope('personal')} className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", scope === 'personal' ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-white hover:border-indigo-200")}>
                  <Lock className={cn("w-6 h-6 mb-2", scope === 'personal' ? "text-indigo-600" : "text-slate-400")} />
                  <span className={cn("text-xs font-bold", scope === 'personal' ? "text-indigo-700" : "text-slate-500")}>👤 Personal</span>
               </button>
               <button type="button" onClick={() => setScope('team')} className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", scope === 'team' ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-white hover:border-indigo-200")}>
                  <Users className={cn("w-6 h-6 mb-2", scope === 'team' ? "text-indigo-600" : "text-slate-400")} />
                  <span className={cn("text-xs font-bold", scope === 'team' ? "text-indigo-700" : "text-slate-500")}>👥 Team</span>
               </button>
            </div>
            
            {scope === 'team' && (
              <div className="animate-in slide-in-from-top-2 p-4 bg-slate-50 rounded-xl mt-2 border border-slate-100">
                {teams.length > 0 ? (
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 block">Select Team</label>
                     <select 
                       value={selectedTeamId}
                       onChange={e => setSelectedTeamId(e.target.value)}
                       required
                       className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-600"
                     >
                       <option value="" disabled>Choose a team...</option>
                       {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                     </select>
                   </div>
                ) : (
                   <p className="text-sm text-red-600 font-semibold text-center">You need to create or join a team first to post here.</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-6">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-none px-0 py-2 font-headline text-xl font-semibold placeholder:text-slate-200 focus:ring-0 focus:outline-none border-b-2 border-slate-100 focus:border-indigo-600 transition-colors" 
              placeholder="What's the core concept?" 
              type="text"
              required
            />
          </div>

          <div className="space-y-2">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300" 
              placeholder="Deep dive into the details..." 
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
             <div className="flex items-center gap-2">
              {(['yellow', 'pink', 'blue', 'green'] as IdeaColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full border-4 border-white shadow-sm transition-transform hover:scale-110 relative",
                    c === 'yellow' && "bg-[#fef3c7]",
                    c === 'pink' && "bg-[#f1dde9]",
                    c === 'blue' && "bg-[#9396ff]",
                    c === 'green' && "bg-[#fcf1c5]",
                    color === c && "ring-2 ring-indigo-600"
                  )}
                />
              ))}
            </div>

            <button 
              type="submit"
              disabled={scope === 'team' && teams.length === 0}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              Add Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Stub for IdeaSprout so it doesn't break App.tsx, but make it visually just trigger Modal 
// In App.tsx I didn't actually pass an open function to IdeaSprout, so I will just return null to cleanly deprecate it while maintaining exports.
export function IdeaSprout() {
  return null;
}
