import React, { useState, useEffect } from 'react';
import { KanbanBoard } from '../KanbanBoard';
import { useBoard } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';
import { Users, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export function TeamBoardsView() {
  const { teams } = useBoard();
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<{ id: string, name: string, avatar: string, role: string }[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0].id);
    }
  }, [teams, selectedTeam]);

  useEffect(() => {
    if (!selectedTeam) {
      setTeamMembers([]);
      return;
    }
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        // Step 1: Get team_members rows for this team
        const { data: memberRows, error: memberErr } = await supabase
          .from('team_members')
          .select('user_id, role')
          .eq('team_id', selectedTeam);

        console.log('[TeamBoard] team_members query result:', { memberRows, memberErr, selectedTeam });

        // If query fails or returns nothing, fall back to showing the current user
        if (memberErr || !memberRows || memberRows.length === 0) {
          console.warn('[TeamBoard] No members from DB, showing current user as fallback');
          if (user) {
            setTeamMembers([{
              id: user.id,
              role: 'member',
              name: user.name,
              avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
            }]);
          } else {
            setTeamMembers([]);
          }
          setLoadingMembers(false);
          return;
        }

        // Step 2: Get profiles for those user_ids
        const userIds = memberRows.map((m: any) => m.user_id);
        const { data: profiles, error: profileErr } = await supabase
          .from('profiles')
          .select('id, name, avatar')
          .in('id', userIds);

        console.log('[TeamBoard] profiles query result:', { profiles, profileErr });

        // Step 3: Merge them together
        const profileMap = new Map<string, any>();
        (profiles || []).forEach((p: any) => profileMap.set(p.id, p));

        const members = memberRows.map((m: any) => {
          const profile = profileMap.get(m.user_id);
          const name = profile?.name || (m.user_id === user?.id ? user.name : 'Unknown User');
          return {
            id: m.user_id,
            role: m.role,
            name,
            avatar: profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
          };
        });
        console.log('[TeamBoard] Final members:', members);
        setTeamMembers(members);
      } catch (err) {
        console.error("[TeamBoard] Error fetching team members:", err);
        // Fallback even on crash
        if (user) {
          setTeamMembers([{
            id: user.id,
            role: 'member',
            name: user.name,
            avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
          }]);
        }
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [selectedTeam, user]);

  if (teams.length === 0) {
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-900/5 mt-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">👥</span>
          </div>
          <h2 className="text-3xl font-headline font-bold text-slate-800 text-center mb-3">Team Workspaces</h2>
          <p className="text-slate-500 text-center max-w-sm">Sign in to collaborate, vote, and manage ideas securely with your remote teams.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-900/5">
        <Users className="w-16 h-16 text-indigo-200 mb-6" />
        <h2 className="text-2xl font-headline font-bold text-slate-800 text-center">You aren't in any teams yet</h2>
        <p className="text-slate-500 text-center mt-2 max-w-sm">Create a team via the sidebar to start collaborating with others securely.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
           <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
             <Users className="w-5 h-5" />
           </span>
           <div>
             <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Team</h2>
             <select 
               value={selectedTeam || ''}
               onChange={e => setSelectedTeam(e.target.value)}
               className="text-2xl font-headline font-bold text-slate-800 bg-transparent border-none p-0 cursor-pointer focus:ring-0"
             >
               {teams.map(t => (
                 <option key={t.id} value={t.id}>{t.name}</option>
               ))}
             </select>
             {/* Stacked member avatars below team name */}
             {teamMembers.length > 0 && (
               <div className="flex items-center mt-1.5">
                 <div className="flex items-center -space-x-2">
                   {teamMembers.map((member, idx) => (
                     <img
                       key={member.id}
                       src={member.avatar}
                       alt={member.name}
                       title={`${member.name}${member.role === 'admin' ? ' (Admin)' : ''}${member.id === user?.id ? ' (You)' : ''}`}
                       className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-default"
                       style={{ zIndex: teamMembers.length - idx }}
                     />
                   ))}
                 </div>
                 <span className="ml-2.5 text-xs font-medium text-slate-400">
                   {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
                 </span>
               </div>
             )}
             {loadingMembers && (
               <span className="mt-1 text-xs text-slate-400 animate-pulse">Loading members...</span>
             )}
           </div>
        </div>

        {selectedTeam && (
          <button 
            onClick={() => {
              navigator.clipboard.writeText(selectedTeam);
              toast.success("Team Invite Code copied! Send this code to your friends.");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 border border-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Invite Members
          </button>
        )}
      </div>
      
      {selectedTeam && <KanbanBoard filter={{ scope: 'team', teamId: selectedTeam }} />}
    </div>
  );
}
