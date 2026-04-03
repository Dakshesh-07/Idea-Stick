import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StickyNote, Zap, Users, ShieldCheck, ArrowRight, Lightbulb, MessageSquare, Vote, CheckCircle, Sparkles, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function LandingPage({ onEnterGuest }: { onEnterGuest?: () => void }) {
  const { openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Lightbulb,
      title: 'Capture Ideas Instantly',
      description: 'Post sticky notes with a single click. Tag them by scope — public, personal, or team-only.',
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      icon: Users,
      title: 'Team Workspaces',
      description: 'Create private teams, invite members with a code, and collaborate on ideas in dedicated boards.',
      color: 'from-indigo-500 to-purple-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      icon: Vote,
      title: 'Vote & Prioritize',
      description: 'Upvote the best ideas. Let the crowd surface what matters most to the group.',
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: MessageSquare,
      title: 'Discussion Threads',
      description: 'Leave comments on any idea. Discuss, refine, and shape concepts as a team.',
      color: 'from-pink-400 to-rose-500',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access',
      description: 'Team admins control idea acceptance. Members contribute freely within clear boundaries.',
      color: 'from-sky-400 to-blue-500',
      bg: 'bg-sky-50 dark:bg-sky-950/30',
    },
    {
      icon: Sparkles,
      title: 'Kanban Workflow',
      description: 'Organize ideas into New, Discussion, Selected, or Rejected columns with drag-and-drop simplicity.',
      color: 'from-violet-400 to-purple-500',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create or Join a Team',
      description: 'Sign up, create a team workspace, or join an existing one with an invite code.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Post Your Ideas',
      description: 'Drop sticky notes onto the board. Add titles, descriptions, and pick a color to categorize.',
      icon: Lightbulb,
    },
    {
      step: '03',
      title: 'Discuss & Vote',
      description: 'Comment on ideas, upvote favorites, and watch the best concepts rise to the top.',
      icon: MessageSquare,
    },
    {
      step: '04',
      title: 'Decide & Ship',
      description: 'Team admins accept the winning ideas. Move them to "Selected" and start building.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <StickyNote className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-indigo-600 font-headline">IdeaStick</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            onClick={openAuthModal}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-600/20 transition-all"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4" />
            Real-time Collaboration
          </div>
          <h2 className="text-6xl lg:text-7xl font-black font-headline leading-tight tracking-tight">
            Sprout your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">best ideas</span> together.
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
            IdeaStick is the tactile digital studio for teams who want to brainstorm, vote, and decide on big concepts in real-time.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onEnterGuest || openAuthModal}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-indigo-600/20 transition-all"
            >
              Start Brainstorming
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={openAuthModal}
              className="px-8 py-4 rounded-2xl font-bold text-lg border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            >
              Sign Up Free
            </button>
          </div>
          
          <div className="flex items-center gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-400">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Public Board</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Team Sync</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Secure</span>
            </div>
          </div>
        </div>

        {/* Hero Visual — Animated sticky notes */}
        <div className="relative hidden lg:block">
          <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-[3rem] blur-3xl"></div>
          <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 rotate-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#fef3c7] dark:bg-amber-900/40 p-6 rounded-2xl h-48 -rotate-2 shadow-sm hover:rotate-0 transition-transform duration-500">
                <div className="w-8 h-8 bg-white/50 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-black/10 dark:bg-white/20 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-black/10 dark:bg-white/20 rounded"></div>
              </div>
              <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-6 rounded-2xl h-48 rotate-3 shadow-sm hover:rotate-0 transition-transform duration-500">
                <div className="w-8 h-8 bg-white/30 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-white/20 rounded"></div>
              </div>
              <div className="bg-[#f1dde9] dark:bg-pink-900/40 p-6 rounded-2xl h-48 rotate-1 shadow-sm hover:rotate-0 transition-transform duration-500">
                <div className="w-8 h-8 bg-white/50 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-black/10 dark:bg-white/20 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-black/10 dark:bg-white/20 rounded"></div>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/40 p-6 rounded-2xl h-48 -rotate-1 shadow-sm hover:rotate-0 transition-transform duration-500">
                <div className="w-8 h-8 bg-white/50 rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-black/10 dark:bg-white/20 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-black/10 dark:bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — Uniform card grid */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">Features</h3>
          <h2 className="text-4xl lg:text-5xl font-black font-headline">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ideate together</span></h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-lg">A complete toolkit for teams to capture, discuss, vote on, and ship the best ideas.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`${feature.bg} rounded-2xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold font-headline mb-2">{feature.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">How It Works</h3>
            <h2 className="text-4xl lg:text-5xl font-black font-headline">From idea to action in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">4 simple steps</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={step.step} className="relative group">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800"></div>
                )}
                <div className="relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600 transition-all group-hover:shadow-xl group-hover:-translate-y-1 duration-300">
                  <span className="text-5xl font-black font-headline text-indigo-100 dark:text-indigo-900/50 absolute top-4 right-6">{step.step}</span>
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-5 shadow-lg">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold font-headline mb-2">{step.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="relative">
            <h2 className="text-4xl lg:text-5xl font-black font-headline mb-4">Ready to brainstorm?</h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">Join teams around the world using IdeaStick to turn scattered thoughts into actionable plans.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={openAuthModal}
                className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onEnterGuest || openAuthModal}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Explore as Guest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <StickyNote className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-indigo-600 font-headline">IdeaStick</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                The collaborative digital studio for teams to brainstorm, vote, and decide on ideas together in real-time.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={onEnterGuest || openAuthModal} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">Public Board</button></li>
                <li><button onClick={openAuthModal} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">Team Boards</button></li>
                <li><button onClick={openAuthModal} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">My Boards</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/Dakshesh-07/Idea-Stick" target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} IdeaStick. Built with ❤️ for creative teams.</p>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
