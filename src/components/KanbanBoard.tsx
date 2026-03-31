import React, { useState, useMemo } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { StickyNote } from './StickyNote';
import { IdeaDetailModal } from './IdeaDetailModal';
import { IdeaStatus, Idea, IdeaScope } from '../types';
import { motion, AnimatePresence } from 'motion/react';

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

  const filteredIdeas = useMemo(() => {
    let result = ideas;
    if (filter) {
      if (filter.scope) result = result.filter(i => i.scope === filter.scope);
      if (filter.createdBy) result = result.filter(i => i.createdBy === filter.createdBy);
      if (filter.teamId) result = result.filter(i => i.teamId === filter.teamId);
    }
    return result;
  }, [ideas, filter]);

  const checkIsAdmin = (idea: Idea) => {
    if (idea.scope === 'team') {
      const team = teams.find(t => t.id === idea.teamId);
      return team?.adminId === user?.id;
    }
    return false;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        {columns.map(column => (
          <div key={column.id} className="space-y-6">
            <div className="sticky top-20 z-20 flex justify-between items-center py-2 bg-slate-50/80 backdrop-blur-sm">
              <h3 className="font-headline font-semibold text-lg text-slate-700">{column.label}</h3>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {filteredIdeas.filter(i => i.status === column.id).length}
              </span>
            </div>

            <div className="space-y-6 min-h-[500px]">
              <AnimatePresence mode="popLayout">
                {filteredIdeas
                  .filter(idea => idea.status === column.id)
                  .map(idea => (
                    <StickyNote 
                      key={idea.id} 
                      idea={idea} 
                      isAdmin={checkIsAdmin(idea)} 
                      onClick={() => setSelectedIdea(idea)}
                    />
                  ))}
              </AnimatePresence>
              
              {filteredIdeas.filter(i => i.status === column.id).length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-300 text-center">
                  <p className="text-sm italic">No ideas yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <IdeaDetailModal idea={selectedIdea} isOpen={!!selectedIdea} onClose={() => setSelectedIdea(null)} />
    </div>
  );
}
