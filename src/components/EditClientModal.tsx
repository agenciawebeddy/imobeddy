import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { X } from 'lucide-react';
import { Client } from '../types';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientUpdated: () => void;
  client: Client | null;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, onClientUpdated, client }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email || '');
      setPhone(client.phone || '');
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setIsLoading(true);
    setError(null);

    const { error: updateError } = await supabase.from('clients').update({
      name,
      email,
      phone,
    }).eq('id', client.id);

    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      onClientUpdated();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-brand-primary p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-white"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-brand-primary mb-6">Editar Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
          <input type="tel" placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="text-brand-light font-bold py-2 px-4 rounded-lg hover:bg-brand-accent mr-2">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-brand-cta text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-400 disabled:opacity-50">
              {isLoading ? 'Atualizando...' : 'Atualizar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;