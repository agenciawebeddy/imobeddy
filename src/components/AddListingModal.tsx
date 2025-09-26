import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { Client } from '../types';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingAdded: () => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ isOpen, onClose, onListingAdded }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [sqft, setSqft] = useState('');
  const [status, setStatus] = useState<'À Venda' | 'Pendente' | 'Vendido'>('À Venda');
  const [imageUrl, setImageUrl] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchClients = async () => {
        const { data, error } = await supabase.from('clients').select('id, name');
        if (error) {
          console.error('Error fetching clients:', error);
        } else {
          setClients(data as Client[]);
        }
      };
      fetchClients();
      // Reset form
      setName('');
      setAddress('');
      setPrice('');
      setBeds('');
      setBaths('');
      setSqft('');
      setStatus('À Venda');
      setImageUrl('');
      setSelectedClientId('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Você precisa estar logado para adicionar um imóvel.");
      setIsLoading(false);
      return;
    }

    const { data: propertyData, error: insertError } = await supabase.from('properties').insert({
      name,
      address,
      price: Number(price),
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      status,
      image_url: imageUrl,
      user_id: user.id,
    }).select().single();

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    if (selectedClientId && propertyData) {
      const { error: linkError } = await supabase.from('purchase_orders').insert({
        client_id: selectedClientId,
        property_id: propertyData.id,
        user_id: user.id,
        status: 'Pendente',
      });

      if (linkError) {
        setError(`Imóvel criado, mas falha ao vincular cliente: ${linkError.message}`);
        setIsLoading(false);
        // Still call success functions because the main action succeeded.
        onListingAdded();
        onClose();
        return;
      }
    }

    setIsLoading(false);
    onListingAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-brand-primary p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-white"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-brand-primary mb-6">Adicionar Novo Imóvel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUploader onUpload={(url) => setImageUrl(url)} />
          <input type="text" placeholder="Nome do Imóvel" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
          <input type="text" placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
            <input type="number" placeholder="Quartos" value={beds} onChange={(e) => setBeds(e.target.value)} required className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
            <input type="number" placeholder="Banheiros" value={baths} onChange={(e) => setBaths(e.target.value)} required className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
            <input type="number" placeholder="Área (m²)" value={sqft} onChange={(e) => setSqft(e.target.value)} required className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50">
            <option value="À Venda">À Venda</option>
            <option value="Pendente">Pendente</option>
            <option value="Vendido">Vendido</option>
          </select>
          <select 
            value={selectedClientId} 
            onChange={(e) => setSelectedClientId(e.target.value)} 
            className="w-full bg-brand-secondary p-3 rounded-lg border border-brand-accent/50"
          >
            <option value="">Vincular a um cliente (Opcional)</option>
            {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="text-brand-light font-bold py-2 px-4 rounded-lg hover:bg-brand-accent mr-2">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-brand-cta text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-400 disabled:opacity-50">
              {isLoading ? 'Salvando...' : 'Salvar Imóvel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListingModal;