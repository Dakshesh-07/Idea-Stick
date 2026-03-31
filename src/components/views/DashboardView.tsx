import React from 'react';
import { KanbanBoard } from '../KanbanBoard';

export function DashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-headline font-bold text-slate-800">Public Ideas Engine</h2>
          <p className="text-slate-500 mt-1">Discover inspiration or find collaborators for your next big thing.</p>
        </div>
      </div>
      <KanbanBoard filter={{ scope: 'public' }} />
    </div>
  );
}
