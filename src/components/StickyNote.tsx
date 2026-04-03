import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Trash2, Pin, Globe2, Lock, Users } from 'lucide-react';
import { Idea } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useBoard } from '../contexts/BoardContext';
import { motion } from 'motion/react';

interface StickyNoteProps {
  idea: Idea;
  isAdmin: boolean;
  onClick?: () => void;
  key?: string | number;
}

const colorMap = {
  yellow: 'bg-[#fef3c7] text-[#615a39]',
  pink: 'bg-[#f1dde9] text-[#5c4e57]',
  blue: 'bg-[#9396ff] text-[#0a0081]',
  green: 'bg-[#fcf1c5] text-[#4e4828]',
};

export function StickyNote({ idea, isAdmin, onClick }: StickyNoteProps) {
  const { user, openAuthModal } = useAuth();
  const { voteIdea, deleteIdea, comments } = useBoard();
  const [voted, setVoted] = useState(false);

  const ideaComments = comments.filter(c => c.ideaId === idea.id);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return openAuthModal();
    if (voted) return;

    try {
      await voteIdea(idea.id);
      setVoted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin && idea.createdBy !== user?.id) return;
    if (confirm('Delete this idea?')) {
      try {
        await deleteIdea(idea.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const rotation = React.useMemo(() => (Math.random() * 4 - 2).toFixed(1), []);

  const ScopeIcon = idea.scope === 'public' ? Globe2 : idea.scope === 'personal' ? Lock : Users;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02, rotate: 0 }}
      onClick={onClick}
      style={{ rotate: `${rotation}deg` }}
      className={cn(
        "p-6 rounded-2xl shadow-sm cursor-pointer transition-all relative group flex flex-col break-inside-avoid mb-6",
        colorMap[idea.color],
        idea.status === 'selected' && "ring-4 ring-green-500 shadow-lg shadow-green-500/20",
        idea.status === 'rejected' && "opacity-60 grayscale-[0.3]"
      )}
    >
      <div className="absolute -top-3 -right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
        <Pin className="w-4 h-4 text-indigo-600" />
      </div>

      <div className="flex items-center gap-1.5 mb-3 bg-white/40 px-2 py-1 rounded-full w-fit">
        <ScopeIcon className="w-3 h-3 opacity-70" />
        <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{idea.scope}</span>
      </div>

      <h4 className="font-headline font-bold text-lg mb-2">{idea.title}</h4>
      <p className="text-xs opacity-80 mb-6 line-clamp-3">{idea.description || ""}</p>

      <div className="flex justify-between items-end mt-auto">
        <div className="flex items-center gap-2">
          <img 
            alt={idea.authorName} 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
            src={`https://ui-avatars.com/api/?name=${idea.authorName}`} 
          />
          <span className="text-[10px] font-bold uppercase tracking-tight">{idea.authorName}</span>
        </div>

        <div className="flex items-center gap-3 opacity-70">
          <button 
            onClick={handleVote}
            className={cn(
              "flex items-center gap-1 text-[11px] font-bold hover:scale-110 transition-transform bg-black/5 px-2 py-1 rounded-full",
              voted && "text-indigo-700 bg-indigo-50"
            )}
          >
            <ThumbsUp className={cn("w-3 h-3", voted && "fill-current")} />
            {idea.voteCount || 0}
          </button>
          <div className="flex items-center gap-1 text-[11px] font-bold bg-black/5 px-2 py-1 rounded-full">
            <MessageSquare className="w-3 h-3" />
            {ideaComments.length}
          </div>
          {(isAdmin || idea.createdBy === user?.id) && (
            <button 
              onClick={handleDelete}
              className="text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
