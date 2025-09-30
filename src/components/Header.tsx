import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-bg-primary border-b border-border p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 
          className="text-2xl font-bold text-text-primary cursor-pointer"
          onClick={() => navigate('/')}
        >
          ImobEddy
        </h1>
        <nav className="hidden md:flex space-x-6">
          <button 
            onClick={() => navigate('/listings')}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Imóveis
          </button>
          <button 
            onClick={() => navigate('/leads')}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Leads
          </button>
          <button 
            onClick={() => navigate('/clients')}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Clientes
          </button>
          <button 
            onClick={() => navigate('/purchase-orders')}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Ordens
          </button>
          <button 
            onClick={() => navigate('/reports')}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Relatórios
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Configurações
          </button>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-text-secondary hidden md:block">
              Olá, {user.email}
            </span>
            <button 
              onClick={signOut}
              className="bg-accent text-bg-primary px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Sair
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-border transition-colors"
              title={`Alternar para ${theme === 'dark' ? 'claro' : 'escuro'} modo`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="bg-accent text-bg-primary px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;