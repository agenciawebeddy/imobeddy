import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building, 
  Users, 
  UserPlus, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface SidebarProps {
  onOpenAddListingModal: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenAddListingModal, isOpen = false, onClose }) => {
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleMenuItemClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Building, label: 'Imóveis', path: '/listings' },
    { icon: UserPlus, label: 'Leads', path: '/leads' },
    { icon: Users, label: 'Clientes', path: '/clients' },
    { icon: FileText, label: 'Ordens de Compra', path: '/purchase-orders' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className={`sidebar w-64 bg-brand-card border-r border-brand-accent/20 flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="p-6 border-b border-brand-accent/20">
        <h1 className="text-2xl font-bold text-brand-primary">ImobEddy</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick}
                  className={`sidebar-item flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'active bg-brand-accent text-brand-primary' 
                      : 'text-brand-secondary hover:bg-brand-hover'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-6 pt-6 border-t border-brand-accent/20">
          <button
            onClick={onOpenAddListingModal}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-brand-accent text-brand-primary hover:bg-brand-accent/90 transition-colors font-medium"
          >
            <Plus size={20} />
            <span>Novo Imóvel</span>
          </button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-brand-accent/20">
        <button
          onClick={handleSignOut}
          className="sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-brand-secondary hover:bg-brand-hover transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;