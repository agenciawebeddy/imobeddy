import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { X } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onClientAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Você precisa estar logado para adicionar um cliente.");
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('clients').insert({
      name,
      email,
      phone,
      user_id: user.id,
    });

    setIsLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      onClientAdded();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-brand-primary p-4 sm:p-6 md:p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-brand-light hover:text-white">
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-primary mb-4 sm:mb-6 pr-8">Adicionar Novo Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nome" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50 text-sm sm:text-base" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50 text-sm sm:text-base" 
          />
          <input 
            type="tel" 
            placeholder="Telefone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50 text-sm sm:text-base" 
          />
          {error && <p className="text-red-400 text-xs sm:text-sm">{error}</p>}
          <div className="flex flex-col sm:flex-row sm:justify-end pt-4 gap-2 sm:gap-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="text-brand-light font-bold py-2 px-4 rounded-lg hover:bg-brand-accent sm:mr-2 text-sm sm:text-base order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="bg-brand-cta text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-400 disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
            >
              {isLoading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;