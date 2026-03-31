import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (name?: string, avatar?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const syncProfile = async (sessionUser: any) => {
    const name = sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Unknown';
    const avatar = sessionUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
    
    // Ensure the profile exists in the public table
    const { error } = await supabase.from('profiles').upsert({
      id: sessionUser.id,
      name,
      email: sessionUser.email,
      avatar
    });
    
    if (error) console.error('Failed to sync profile:', error);

    setUser({
      id: sessionUser.id,
      name,
      email: sessionUser.email || '',
      avatar,
    });
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      alert('Login failed. Ensure Supabase credentials are set in .env.');
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    closeAuthModal();
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (error) throw error;
    
    // Supabase will automatically log them in if email confirmation is disabled.
    if (data.session) {
      closeAuthModal();
    } else {
      throw new Error("Signup successful! Please confirm your email address before logging in.");
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (name?: string, avatar?: string) => {
    try {
       const userUpdatePayload: any = { data: {} };
       if (name) userUpdatePayload.data.full_name = name;
       if (avatar) userUpdatePayload.data.avatar_url = avatar;

       const { data, error } = await supabase.auth.updateUser(userUpdatePayload);
       if (error) throw error;
       if (data.user) await syncProfile(data.user);
    } catch (e) {
       console.error("Failed to update profile", e);
       throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, isAuthModalOpen, openAuthModal, closeAuthModal, 
      loginWithGoogle, loginWithEmail, signupWithEmail, updateProfile, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
