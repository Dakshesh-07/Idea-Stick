import React, { createContext, useContext, useEffect, useState } from 'react';
import { Board, Idea, Team, Comment } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface BoardContextType {
  currentBoard: Board | null;
  ideas: Idea[];
  teams: Team[];
  comments: Comment[];
  loading: boolean;
  setCurrentBoardId: (id: string | null) => void;
  // CRUD Methods
  addIdea: (idea: Omit<Idea, 'id'>) => Promise<void>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  updateIdeaStatus: (id: string, status: 'new' | 'discussion' | 'selected' | 'rejected') => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  voteIdea: (id: string) => Promise<void>;
  addTeam: (teamName: string) => Promise<string>;
  joinTeam: (teamId: string) => Promise<void>;
  updateBoard: (updates: Partial<Board>) => Promise<void>;
  createBoard: (board: Omit<Board, 'id'>) => Promise<string>;
  addComment: (ideaId: string, content: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIdeas([]);
        setTeams([]);
        setBoards([]);
        setComments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch ideas - Supabase RLS will handle filtering based on user role and scope
        const { data: iData, error: iErr } = await supabase.from('ideas').select('*');
        if (iErr) throw iErr;
        
        if (iData) {
          setIdeas(iData.map(i => ({
            id: i.id, boardId: i.board_id, teamId: i.team_id, scope: i.scope || 'public', 
            title: i.title, description: i.description, color: i.color, status: i.status, 
            createdBy: i.created_by, authorName: i.author_name, voteCount: i.vote_count
          })));
        }

        // Fetch comments globally - Supabase RLS will restrict to accessible ideas
        const { data: cData, error: cErr } = await supabase.from('comments').select('*');
        if (cErr) throw cErr;
        
        if (cData) setComments(cData.map(c => ({
          id: c.id, ideaId: c.idea_id, userId: c.user_id, userName: c.user_name, content: c.content, timestamp: c.timestamp
        })));

        // Fetch teams where user is a member
        const { data: tData, error: tErr } = await supabase.from('teams').select('*');
        if (tErr) throw tErr;
        
        if (tData) setTeams(tData.map(t => ({ id: t.id, name: t.name, adminId: t.admin_id })));

        // Fetch boards for those teams
        const { data: bData, error: bErr } = await supabase.from('boards').select('*');
        if (bErr) throw bErr;
        
        if (bData) setBoards(bData.map(b => ({ id: b.id, name: b.name, teamId: b.team_id, adminId: b.admin_id, activeDecisionRound: b.active_decision_round })));

      } catch (err) {
        console.error("Supabase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        // Soft refresh stub
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (currentBoardId) {
      const b = boards.find(b => b.id === currentBoardId);
      setCurrentBoard(b || null);
    } else {
      setCurrentBoard(null);
    }
  }, [currentBoardId, boards]);

  const addIdea = async (ideaData: Omit<Idea, 'id'>) => {
    // If team scope, verify user is a member (additional client-side check)
    if (ideaData.scope === 'team' && !teams.some(t => t.id === ideaData.teamId)) {
      throw new Error("Unauthorized: You are not a member of this team.");
    }

    const { data, error } = await supabase.from('ideas').insert({
      board_id: ideaData.boardId,
      team_id: ideaData.teamId,
      scope: ideaData.scope,
      title: ideaData.title,
      description: ideaData.description,
      color: ideaData.color,
      status: ideaData.status,
      created_by: ideaData.createdBy,
      author_name: ideaData.authorName,
      vote_count: ideaData.voteCount
    }).select().single();

    if (error) { console.error(error); throw error; }
    
    const newIdea: Idea = {
      id: data.id, boardId: data.board_id, teamId: data.team_id, scope: data.scope, 
      title: data.title, description: data.description, color: data.color, 
      status: data.status, createdBy: data.created_by, authorName: data.author_name, 
      voteCount: data.vote_count
    };
    setIdeas(prev => [...prev, newIdea]);
  };

  const updateIdea = async (id: string, updates: Partial<Idea>) => {
    const payload: any = {};
    if (updates.title) payload.title = updates.title;
    if (updates.description) payload.description = updates.description;
    if (updates.color) payload.color = updates.color;
    if (updates.status) payload.status = updates.status;
    if (updates.voteCount !== undefined) payload.vote_count = updates.voteCount;
    if (updates.teamId !== undefined) payload.team_id = updates.teamId;
    if (updates.scope !== undefined) payload.scope = updates.scope;

    const { error } = await supabase.from('ideas').update(payload).eq('id', id);
    if (!error) {
      setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, ...updates } : idea));
    } else {
      console.error(error);
    }
  };

  const updateIdeaStatus = async (id: string, status: 'new' | 'discussion' | 'selected' | 'rejected') => {
    if (!user) return;
    
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;

    if (idea.scope === 'team') {
       const team = teams.find(t => t.id === idea.teamId);
       if (team && team.adminId !== user.id && (status === 'selected' || status === 'rejected')) {
         alert("Only the team admin can accept or reject ideas.");
         return;
       }
    } else if (idea.scope === 'public') {
       // Public ideas can't be strictly "Accepted/Rejected" by non-owners for now, or maybe only by author.
       if (idea.createdBy !== user.id && (status === 'selected' || status === 'rejected')) {
         alert("Only the original author can transition public ideas to selected/rejected.");
         return;
       }
    }

    await updateIdea(id, { status });
  };

  const deleteIdea = async (id: string) => {
    const { error } = await supabase.from('ideas').delete().eq('id', id);
    if (!error) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    } else {
      console.error(error);
    }
  };

  const voteIdea = async (id: string) => {
    const idea = ideas.find(i => i.id === id);
    if (!idea || !user) return;
    
    // Optimistic vote increment
    const { error } = await supabase.from('ideas').update({ vote_count: idea.voteCount + 1 }).eq('id', id);
    if (!error) {
      setIdeas(prev => prev.map(i => i.id === id ? { ...i, voteCount: i.voteCount + 1 } : i));
    }
  };

  const addTeam = async (teamName: string) => {
    if (!user) throw new Error("Not logged in");
    const { data: team, error } = await supabase.from('teams').insert({
      name: teamName,
      admin_id: user.id
    }).select().single();
    
    if (error || !team) throw error;
    
    await supabase.from('team_members').insert({
      team_id: team.id,
      user_id: user.id,
      role: 'admin'
    });

    const newTeam = { id: team.id, name: team.name, adminId: team.admin_id };
    setTeams(prev => [...prev, newTeam]);
    return team.id;
  };

  const joinTeam = async (teamId: string) => {
    if (!user) throw new Error("Not logged in");
    const { data: team, error: teamErr } = await supabase.from('teams').select('*').eq('id', teamId).single();
    if (teamErr || !team) throw new Error("Team not found or invalid code");

    const { error } = await supabase.from('team_members').insert({
      team_id: teamId,
      user_id: user.id,
      role: 'member'
    });
    if (error && error.code !== '23505') throw error;

    const newTeamObj = { id: team.id, name: team.name, adminId: team.admin_id };
    setTeams(prev => [...prev, newTeamObj]);
    alert("Successfully joined team!");
  };

  const createBoard = async (boardData: Omit<Board, 'id'>) => {
    const { data, error } = await supabase.from('boards').insert({
      name: boardData.name,
      team_id: boardData.teamId,
      admin_id: boardData.adminId
    }).select().single();

    if (error || !data) throw error;
    const newBoard = { id: data.id, name: data.name, teamId: data.team_id, adminId: data.admin_id };
    setBoards(prev => [...prev, newBoard]);
    return data.id;
  };

  const updateBoard = async (updates: Partial<Board>) => {
    if (!currentBoardId) return;
    const payload: any = {};
    if (updates.activeDecisionRound) payload.active_decision_round = updates.activeDecisionRound;

    const { error } = await supabase.from('boards').update(payload).eq('id', currentBoardId);
    if (!error) {
      setBoards(prev => prev.map(b => b.id === currentBoardId ? { ...b, ...updates } : b));
    }
  };

  const addComment = async (ideaId: string, content: string) => {
    if (!user) return;
    const { data, error } = await supabase.from('comments').insert({
      idea_id: ideaId,
      user_id: user.id,
      user_name: user.name,
      content,
    }).select().single();

    if (error || !data) { console.error(error); return; }

    const newComment = {
      id: data.id, ideaId: data.idea_id, userId: data.user_id, userName: data.user_name, content: data.content, timestamp: data.timestamp
    };
    setComments(prev => [...prev, newComment]);
  };

  return (
    <BoardContext.Provider value={{ 
      currentBoard, 
      ideas, // Unfiltered exposed globally, let Views filter them
      teams, 
      comments,
      loading, 
      setCurrentBoardId,
      addIdea,
      updateIdea,
      updateIdeaStatus,
      deleteIdea,
      voteIdea,
      addTeam,
      joinTeam,
      createBoard,
      updateBoard,
      addComment
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
