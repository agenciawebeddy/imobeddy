import React, { useState, useEffect, useCallback } from 'react';
import PropertyListings from '../components/PropertyListings';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { Property } from '../types';
import AddListingModal from '../components/AddListingModal';
import EditListingModal from '../components/EditListingModal';
import DeleteListingModal from '../components/DeleteListingModal';
import ViewPropertyModal from '../components/ViewPropertyModal';

const Listings: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [listingToEdit, setListingToEdit] = useState<Property | null>(null);
  const [listingToDelete, setListingToDelete] = useState<Property | null>(null);
  const [listingToView, setListingToView] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data as Property[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;
    setIsDeleting(true);
    const { error } = await supabase.from('properties').delete().eq('id', listingToDelete.id);
    setIsDeleting(false);
    if (error) {
      console.error('Error deleting property:', error);
    } else {
      setListingToDelete(null);
      fetchListings();
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">Listagem de Imóveis</h2>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-brand-cta text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-400 transition-all duration-200 shadow-lg hover:shadow-sky-500/50">
          <PlusCircle className="w-6 h-6" />
          <span className="ml-3">Novo Imóvel</span>
        </button>
      </div>
      {loading ? (
        <p className="text-center text-brand-light">Carregando imóveis...</p>
      ) : (
        <PropertyListings 
          properties={properties}
          onView={setListingToView}
          onEdit={setListingToEdit}
          onDelete={setListingToDelete}
        />
      )}
      <AddListingModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onListingAdded={fetchListings}
      />
      <EditListingModal
        isOpen={!!listingToEdit}
        onClose={() => setListingToEdit(null)}
        onListingUpdated={() => {
          setListingToEdit(null);
          fetchListings();
        }}
        listing={listingToEdit}
      />
      <DeleteListingModal
        isOpen={!!listingToDelete}
        onClose={() => setListingToDelete(null)}
        onConfirm={handleDeleteListing}
        isLoading={isDeleting}
      />
      <ViewPropertyModal
        isOpen={!!listingToView}
        onClose={() => setListingToView(null)}
        property={listingToView}
      />
    </div>
  );
};

export default Listings;