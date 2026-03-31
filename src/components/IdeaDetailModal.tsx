import React, { useState } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { Idea } from '../types';
import { X, Send, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

interface Props {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IdeaDetailModal({ idea, isOpen, onClose }: Props) {
  const { ideas, currentBoard, comments, addComment, updateIdeaStatus, addIdea, updateIdea, teams } = useBoard();
  const { user, openAuthModal } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isDuplicating, setIsDuplicating] = useState(false);

  if (!isOpen || !idea) return null;

  // React state fix: Use the live idea from the context so updates (like changing scope) reflect immediately
  const liveIdea = ideas.find(i => i.id === idea.id) || idea;

  const ideaComments = comments.filter(c => c.ideaId === liveIdea.id).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!commentText.trim()) return;
    await addComment(idea.id, commentText);
    setCommentText('');
  };

  const handleDuplicate = async () => {
    if (!user) return openAuthModal();
    setIsDuplicating(true);
    try {
      await addIdea({
         title: liveIdea.title,
         description: liveIdea.description,
         color: liveIdea.color,
         scope: 'personal',
         status: 'new',
         createdBy: user.id,
         authorName: user.name,
         voteCount: 0
      });
      alert('Idea successfully duplicated to Your Private Sandbox!');
      onClose();
    } catch(err) {
      console.error(err);
      alert('Failed to duplicate idea');
    }
    setIsDuplicating(false);
  };

  const checkIsAdmin = () => {
    if (liveIdea.scope === 'team') {
      const team = teams.find(t => t.id === liveIdea.teamId);
      return team?.adminId === user?.id;
    }
    return false; // Can't "accept" personal or public ideas strictly in this UI yet
  };
  const isAdmin = checkIsAdmin();
  const isOwner = liveIdea.createdBy === user?.id;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <div className="flex gap-2">
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block border",
                liveIdea.status === 'new' && "bg-blue-50 text-blue-600 border-blue-200",
                liveIdea.status === 'discussion' && "bg-yellow-50 text-yellow-600 border-yellow-200",
                liveIdea.status === 'selected' && "bg-green-50 text-green-600 border-green-200",
                liveIdea.status === 'rejected' && "bg-red-50 text-red-600 border-red-200"
              )}>
                {liveIdea.status}
              </span>
            </div>
            <h2 className="font-headline text-2xl font-bold text-slate-800">{liveIdea.title}</h2>
            <div className="flex items-center gap-2 mt-2">
               <img src={`https://ui-avatars.com/api/?name=${liveIdea.authorName}`} className="w-5 h-5 rounded-full" />
               <p className="text-xs font-semibold text-slate-500">Suggested by {liveIdea.authorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Discussion */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          
          {isOwner && (
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-in fade-in">
              <h3 className="text-xs font-bold uppercase text-indigo-400 mb-3 tracking-wider">Visibility & Scope</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <select 
                   value={liveIdea.scope}
                   onChange={async (e) => {
                     const newScope = e.target.value as any;
                     if (newScope === 'team') {
                       if (teams.length === 0) {
                         alert("You don't have any teams to share this with! Create one from the sidebar.");
                         return;
                       }
                       // Default to first team if none
                       await updateIdea(liveIdea.id, { scope: newScope, teamId: teams[0].id });
                     } else {
                       await updateIdea(liveIdea.id, { scope: newScope });
                     }
                   }}
                   className="w-full bg-white border text-sm font-semibold border-slate-200 rounded-xl px-4 py-3 text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
                 >
                   <option value="public">🌍 Public (Everyone)</option>
                   <option value="personal">👤 Personal (Just Me)</option>
                   <option value="team">👥 Team (Collaborators)</option>
                 </select>
                 
                 {liveIdea.scope === 'team' && (
                   <select
                     value={liveIdea.teamId || ''}
                     onChange={async (e) => await updateIdea(liveIdea.id, { teamId: e.target.value })}
                     className="w-full bg-white border text-sm font-semibold border-slate-200 rounded-xl px-4 py-3 text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer animate-in fade-in slide-in-from-left-2"
                   >
                     {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                   </select>
                 )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Details</h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{liveIdea.description || "No specific details provided."}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">Discussion ({ideaComments.length})</h3>
            <div className="space-y-4 mb-4">
              {ideaComments.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{c.userName}</span>
                    <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(c.timestamp))} ago</span>
                  </div>
                  <p className="text-sm text-slate-600">{c.content}</p>
                </div>
              ))}
              {ideaComments.length === 0 && (
                <p className="text-sm text-center text-slate-500 italic py-4">No comments yet. Start the discussion!</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
              <button type="submit" className="bg-indigo-600 text-white p-2 px-3 rounded-xl hover:bg-indigo-700">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
           {liveIdea.scope === 'public' && liveIdea.createdBy !== user?.id && (
              <button 
                onClick={handleDuplicate}
                disabled={isDuplicating}
                className="col-span-2 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isDuplicating ? "Duplicating..." : "Duplicate to My Boards"}
              </button>
           )}

           {isAdmin && (
              <>
                 <button 
                   onClick={async () => { await updateIdeaStatus(liveIdea.id, 'selected'); onClose(); }}
                   className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
                 >
                    <CheckCircle className="w-5 h-5" /> Accept Idea
                 </button>
                 <button 
                   onClick={async () => { await updateIdeaStatus(liveIdea.id, 'rejected'); onClose(); }}
                   className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                 >
                    <XCircle className="w-5 h-5" /> Reject Idea
                 </button>
              </>
           )}
        </div>
      </div>
    </div>
  );
}
