import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string, type: 'sms' | 'email') => Promise<void>;
  updateUser: (updates: any) => Promise<void>;
  resetPasswordForEmail: (email: string, options?: any) => Promise<void>;
  signInWithOAuth: (provider: string, options?: any) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const verifyOtp = async (email: string, token: string, type: 'sms' | 'email' = 'email') => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) throw error;
  };

  const updateUser = async (updates: any) => {
    const { error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
  };

  const resetPasswordForEmail = async (email: string, options?: any) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, options);
    if (error) throw error;
  };

  const signInWithOAuth = async (provider: string, options?: any) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signOut,
        signIn,
        signUp,
        signInWithOtp,
        verifyOtp,
        updateUser,
        resetPasswordForEmail,
        signInWithOAuth,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};