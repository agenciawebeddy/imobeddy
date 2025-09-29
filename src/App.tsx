import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Ou um componente de loading
  }

  return (
    <ThemeProvider>
      <Router>
        {!session ? <Login /> : <MainLayout />}
      </Router>
    </ThemeProvider>
  );
};

export default App;