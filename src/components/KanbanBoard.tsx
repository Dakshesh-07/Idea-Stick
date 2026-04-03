import React, { useState, useMemo } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { StickyNote } from './StickyNote';
import { IdeaDetailModal } from './IdeaDetailModal';
import { IdeaStatus, Idea, IdeaScope } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const columns: { id: IdeaStatus; label: string }[] = [
  { id: 'new', label: 'New Ideas' },
  { id: 'discussion', label: 'Under Discussion' },
  { id: 'selected', label: 'Selected' },
  { id: 'rejected', label: 'Rejected' },
];

export interface KanbanFilter {
  scope?: IdeaScope;
  createdBy?: string;
  teamId?: string;
}

export function KanbanBoard({ filter }: { filter?: KanbanFilter }) {
  const { ideas, teams } = useBoard();
  const { user } = useAuth();
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [activeStatus, setActiveStatus] = useState<IdeaStatus>('new');

  const filteredIdeas = useMemo(() => {
    let result = ideas;
    if (filter) {
      if (filter.scope) result = result.filter(i => i.scope === filter.scope);
      if (filter.createdBy) result = result.filter(i => i.createdBy === filter.createdBy);
      if (filter.teamId) result = result.filter(i => i.teamId === filter.teamId);
    }
    return result;
  }, [ideas, filter]);

  const ideasInActiveStatus = useMemo(() => 
    filteredIdeas.filter(idea => idea.status === activeStatus),
    [filteredIdeas, activeStatus]
  );

  const checkIsAdmin = (idea: Idea) => {
    if (idea.scope === 'team') {
      const team = teams.find(t => t.id === idea.teamId);
      return team?.adminId === user?.id;
    }
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-200/60">
        {columns.map(column => {
          const isActive = activeStatus === column.id;
          const count = filteredIdeas.filter(i => i.status === column.id).length;
          
          return (
            <button
              key={column.id}
              onClick={() => setActiveStatus(column.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              {column.label}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-black",
                isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-200/70 text-slate-500"
              )}>
                {count}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 border-2 border-indigo-600/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStatus}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {ideasInActiveStatus.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {ideasInActiveStatus.map(idea => (
                  <StickyNote 
                    key={idea.id} 
                    idea={idea} 
                    isAdmin={checkIsAdmin(idea)} 
                    onClick={() => setSelectedIdea(idea)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl grayscale opacity-50">📋</span>
                </div>
                <h3 className="text-xl font-headline font-bold text-slate-800">No ideas in this section yet</h3>
                <p className="text-slate-500 mt-2 text-center max-w-xs">
                  Ideas will appear here once they are added or moved to this status.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <IdeaDetailModal idea={selectedIdea} isOpen={!!selectedIdea} onClose={() => setSelectedIdea(null)} />
    </div>
  );
}
