import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { X } from 'lucide-react';
import { Client, Property } from '../types';

interface LinkPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyLinked: () => void;
  client: Client | null;
}

const LinkPropertyModal: React.FC<LinkPropertyModalProps> = ({ isOpen, onClose, onPropertyLinked, client }) => {
  const [properties, setProperties] = useState<Partial<Property>[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && client) {
      const fetchProperties = async () => {
        setIsLoading(true);
        setError(null);

        // 1. Fetch properties already linked to this client
        const { data: linkedOrders, error: linkedError } = await supabase
          .from('purchase_orders')
          .select('property_id')
          .eq('client_id', client.id);

        if (linkedError) {
          console.error('Error fetching linked properties:', linkedError);
          setError('Não foi possível carregar os imóveis vinculados.');
          setIsLoading(false);
          return;
        }

        const linkedPropertyIds = linkedOrders ? linkedOrders.map(o => o.property_id) : [];

        // 2. Fetch all properties that are not sold
        const { data, error: propertiesError } = await supabase
          .from('properties')
          .select('id, name, address')
          .not('status', 'eq', 'Vendido');
          
        if (propertiesError) {
          console.error('Error fetching properties:', propertiesError);
          setError('Não foi possível carregar os imóveis disponíveis.');
        } else {
          // 3. Filter out the already linked ones
          const availableProperties = data ? data.filter(p => !linkedPropertyIds.includes(p.id)) : [];
          
          setProperties(availableProperties);
          if (availableProperties.length > 0) {
            setSelectedPropertyId(availableProperties[0].id);
          } else {
            setSelectedPropertyId('');
          }
        }
        setIsLoading(false);
      };
      fetchProperties();
    }
  }, [isOpen, client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !selectedPropertyId) return;

    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Você precisa estar logado.");
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('purchase_orders').insert({
      client_id: client.id,
      property_id: selectedPropertyId,
      user_id: user.id,
      status: 'Pendente',
    });

    setIsLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      onPropertyLinked();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-brand-primary p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-white"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-brand-primary mb-6">Vincular Imóvel a {client?.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-light mb-2">Selecione o Imóvel</label>
            <select 
              value={selectedPropertyId} 
              onChange={(e) => setSelectedPropertyId(e.target.value)} 
              className="w-full bg-brand-secondary border border-brand-accent/50 text-brand-lighter rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-cta"
              disabled={isLoading || properties.length === 0}
            >
              {isLoading ? (
                <option>Carregando...</option>
              ) : properties.length > 0 ? (
                properties.map(prop => (
                  <option key={prop.id} value={prop.id}>{prop.name || prop.address}</option>
                ))
              ) : (
                <option value="" disabled>Nenhum imóvel disponível</option>
              )}
            </select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="text-brand-light font-bold py-2 px-4 rounded-lg hover:bg-brand-accent mr-2">Cancelar</button>
            <button type="submit" disabled={isLoading || properties.length === 0} className="bg-brand-cta text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-400 transition-colors disabled:opacity-50">
              {isLoading ? 'Vinculando...' : 'Vincular'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkPropertyModal;