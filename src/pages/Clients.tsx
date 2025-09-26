import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import ClientsTable from '../components/ClientsTable';
import { supabase } from '../integrations/supabase/client';
import { Client } from '../types';
import AddClientModal from '../components/AddClientModal';
import EditClientModal from '../components/EditClientModal';
import DeleteClientModal from '../components/DeleteClientModal';
import ViewClientModal from '../components/ViewClientModal';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientToView, setClientToView] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data as Client[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    const { error } = await supabase.from('clients').delete().eq('id', clientToDelete.id);
    setIsDeleting(false);
    if (error) {
      console.error('Error deleting client:', error);
    } else {
      setClientToDelete(null);
      fetchClients();
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">Gerenciamento de Clientes</h2>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-brand-cta text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-400 transition-all duration-200 shadow-lg hover:shadow-sky-500/50">
          <PlusCircle className="w-6 h-6" />
          <span className="ml-3">Novo Cliente</span>
        </button>
      </div>
      {loading ? (
        <p className="text-center text-brand-light">Carregando clientes...</p>
      ) : (
        <ClientsTable 
          clients={clients}
          onView={setClientToView}
          onEdit={setClientToEdit}
          onDelete={setClientToDelete}
        />
      )}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClientAdded={fetchClients}
      />
      <EditClientModal
        isOpen={!!clientToEdit}
        onClose={() => setClientToEdit(null)}
        onClientUpdated={() => {
          setClientToEdit(null);
          fetchClients();
        }}
        client={clientToEdit}
      />
      <DeleteClientModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        isLoading={isDeleting}
      />
      <ViewClientModal
        isOpen={!!clientToView}
        onClose={() => setClientToView(null)}
        client={clientToView}
      />
    </div>
  );
};

export default Clients;