import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StickyNote, Zap, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export function LandingPage({ onEnterGuest }: { onEnterGuest?: () => void }) {
  const { openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <StickyNote className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-indigo-600 font-headline">IdeaStick</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={openAuthModal}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Log In
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4" />
            Real-time Collaboration
          </div>
          <h2 className="text-7xl font-black font-headline leading-tight tracking-tight">
            Sprout your <span className="text-indigo-600">best ideas</span> together.
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
            IdeaStick is the tactile digital studio for teams who want to brainstorm, vote, and decide on big concepts in real-time.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={onEnterGuest || openAuthModal}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-indigo-600/20 transition-all w-fit"
            >
              Start Brainstorming
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Team Sync</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Secure Boards</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-600/10 rounded-[3rem] blur-3xl"></div>
          <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 rotate-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#fef3c7] p-6 rounded-2xl h-48 -rotate-2 shadow-sm">
                <div className="w-8 h-8 bg-white/50 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-black/10 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-black/10 rounded"></div>
              </div>
              <div className="bg-[#9396ff] p-6 rounded-2xl h-48 rotate-3 shadow-sm">
                <div className="w-8 h-8 bg-white/50 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-white/20 rounded"></div>
              </div>
              <div className="bg-[#f1dde9] p-6 rounded-2xl h-48 rotate-1 shadow-sm">
                <div className="w-8 h-8 bg-white/50 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-black/10 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-black/10 rounded"></div>
              </div>
              <div className="bg-[#fcf1c5] p-6 rounded-2xl h-48 -rotate-1 shadow-sm">
                <div className="w-8 h-8 bg-white/50 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-black/10 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-black/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
