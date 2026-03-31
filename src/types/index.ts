export type IdeaStatus = 'new' | 'discussion' | 'selected' | 'rejected';
export type IdeaColor = 'yellow' | 'pink' | 'blue' | 'green';
export type IdeaScope = 'public' | 'personal' | 'team';
export type TeamRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  adminId: string; // The user.id of the creator/leader
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
}

export interface Board {
  id: string;
  teamId: string;
  name: string;
  adminId: string;
  activeDecisionRound?: {
    endTime: string;
    active: boolean;
  };
}

export interface Idea {
  id: string;
  boardId?: string; // Kept for optional board logic
  teamId?: string;
  scope: IdeaScope;
  title: string;
  description?: string;
  color: IdeaColor;
  status: IdeaStatus;
  createdBy: string;
  authorName: string;
  voteCount: number;
}

export interface Vote {
  id: string;
  userId: string;
  ideaId: string;
}

export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}
