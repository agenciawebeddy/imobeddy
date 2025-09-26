import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { X } from 'lucide-react';
import { Property } from '../types';
import ImageUploader from './ImageUploader';

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingUpdated: () => void;
  listing: Property | null;
}

const EditListingModal: React.FC<EditListingModalProps> = ({ isOpen, onClose, onListingUpdated, listing }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [sqft, setSqft] = useState('');
  const [status, setStatus] = useState<'À Venda' | 'Pendente' | 'Vendido'>('À Venda');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (listing) {
      setName(listing.name || '');
      setAddress(listing.address);
      setPrice(String(listing.price));
      setBeds(String(listing.beds));
      setBaths(String(listing.baths));
      setSqft(String(listing.sqft));
      setStatus(listing.status);
      setImageUrl(listing.image_url || '');
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setIsLoading(true);
    setError(null);

    const { error: updateError } = await supabase.from('properties').update({
      name,
      address,
      price: Number(price),
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      status,
      image_url: imageUrl,
    }).eq('id', listing.id);

    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      onListingUpdated();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-brand-primary p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-white"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-brand-primary mb-6">Editar Imóvel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUploader onUpload={(url) => setImageUrl(url)} defaultImageUrl={listing?.image_url} />
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="text-brand-light font-bold py-2 px-4 rounded-lg hover:bg-brand-accent mr-2">Cancelar</button>
            <button type="submit" disabled={isLoading} className="bg-brand-cta text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-400 disabled:opacity-50">
              {isLoading ? 'Atualizando...' : 'Atualizar Imóvel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;