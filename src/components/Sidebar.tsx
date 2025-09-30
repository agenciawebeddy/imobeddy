import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-bg-primary border-r border-border z-50 transform -translate-x-full lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out lg:ease-out">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Menu</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate('/')}
            className="w-full text-left p-3 rounded-lg hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/listings')}
            className="w-full text-left p-3 rounded-lg hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
          >
            Imóveis
          </button>
          <button 
            onClick={() => navigate('/leads')}
            className="w-full text-left p-3 rounded-lg hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
          >
            Leads
          </button>
          <button 
            onClick={() => navigate('/clients')}
            className="w-full text-left p-3 rounded-lg hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
          >
            Clientes
          </button>
          <button 
            onClick={() => navigate('/purchase-orders')}
            className="w-full text-left p-3 rounded-lg hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
          >
            Ordens de Compra
          </button>
          <button 
            onClick={() => navigate('/reports')}
            className="w-full text-left p-3 rounded-lg hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
          >
            Relatórios
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="w-full text-left p-3 rounded-lg hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
          >
            Configurações
          </button>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button 
            onClick={signOut}
            className="w-full bg-error text-bg-primary p-3 rounded-lg hover:bg-error/90 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={() => {/* Close sidebar logic here */}}
      />
    </div>
  );
};

export default Sidebar;