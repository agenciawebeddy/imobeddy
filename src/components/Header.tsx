import React, { useState, useEffect } from 'react';
import { Search, Bell, Mail, X, Menu } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Property } from '../types';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Função para buscar imóveis no Supabase
  const searchProperties = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`name.ilike.%${term}%,address.ilike.%${term}%`)
        .limit(10);

      if (error) {
        console.error('Erro ao buscar imóveis:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProperties(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleResultClick = (property: Property) => {
    // Por enquanto, apenas fecha os resultados
    // Futuramente pode navegar para a página do imóvel
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <header className="h-16 sm:h-20 lg:h-24 bg-brand-primary flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-brand-accent/20 flex-shrink-0 relative">
      {/* Botão hamburger para mobile */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden text-brand-light hover:text-brand-primary transition-colors p-2"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 relative max-w-md mx-4 lg:mx-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light" />
          <input
            type="text"
            placeholder="Buscar por imóveis..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter placeholder-brand-light rounded-full py-2 sm:py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-cta transition-all duration-200 text-sm sm:text-base"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-light hover:text-brand-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Resultados da busca */}
        {showResults && (
          <div className="absolute top-full left-0 mt-2 w-full bg-brand-primary border border-brand-accent/50 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-brand-light">
                Buscando...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => handleResultClick(property)}
                    className="w-full px-4 py-3 text-left hover:bg-brand-secondary transition-colors border-b border-brand-accent/20 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={property.image_url} 
                        alt={property.name || property.address}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-brand-primary text-sm">
                          {property.name || property.address}
                        </p>
                        {property.name && (
                          <p className="text-brand-light text-xs">
                            {property.address}
                          </p>
                        )}
                        <p className="text-brand-cta text-sm font-bold">
                          R$ {property.price.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-brand-light">
                Nenhum imóvel encontrado
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
        <button className="relative text-brand-light hover:text-brand-primary transition-colors hidden sm:block">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button className="relative text-brand-light hover:text-brand-primary transition-colors">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
        </button>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.email?.charAt(0).toUpperCase() || 'U'}&background=38BDF8&color=fff`}
            alt="User Avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-brand-cta"
          />
          <div className="hidden sm:block">
            <h3 className="font-semibold text-brand-primary text-sm lg:text-base">{user?.email || 'Carregando...'}</h3>
            <p className="text-xs lg:text-sm text-brand-light">Corretor(a)</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;