import React, { useEffect, useState } from 'react';
import { Timer, Info } from 'lucide-react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export function DecisionRoundBanner() {
  const { currentBoard, ideas, updateBoard, updateIdea } = useBoard();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!currentBoard?.activeDecisionRound?.active) return;

    const interval = setInterval(async () => {
      const end = new Date(currentBoard.activeDecisionRound!.endTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('00:00');
        
        // Admin handles the selection logic
        if (user?.id === currentBoard.adminId) {
          await endDecisionRound();
        }
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBoard, user]);

  const endDecisionRound = async () => {
    if (!currentBoard) return;

    // Select top 3 ideas with at least 1 vote
    const topIdeas = [...ideas]
      .filter(i => i.voteCount > 0 && i.status !== 'selected')
      .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
      .slice(0, 3);

    // Call updateIdea sequentially or in parallel
    for (const idea of topIdeas) {
      await updateIdea(idea.id, { status: 'selected' });
    }

    await updateBoard({
      activeDecisionRound: {
        endTime: currentBoard.activeDecisionRound?.endTime || new Date().toISOString(),
        active: false
      }
    });
  };

  if (!currentBoard?.activeDecisionRound?.active) return null;

  return (
    <section className="mb-12">
      <div className="bg-indigo-600/10 backdrop-blur-sm p-6 rounded-2xl relative overflow-hidden flex items-center justify-between border border-indigo-600/20">
        <div className="flex items-start gap-4 z-10">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-indigo-900">Decision Round Active</h3>
            <p className="text-sm text-indigo-700/80 max-w-2xl mt-1">
              The team is voting! Support your favorite ideas. Top-voted ideas will be automatically selected when the timer ends.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="font-headline font-bold tracking-wider">{timeLeft}</span>
            </div>
          </div>
          
          {user?.id === currentBoard.adminId && (
            <button 
              onClick={endDecisionRound}
              className="bg-white text-indigo-600 px-6 py-2 rounded-full font-headline font-bold text-sm shadow-sm hover:bg-indigo-50 transition-all"
            >
              Finish Early
            </button>
          )}
        </div>

        <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
