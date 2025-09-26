import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import LeadsTable from '../components/LeadsTable';
import AddLeadModal from '../components/AddLeadModal';
import EditLeadModal from '../components/EditLeadModal';
import DeleteLeadModal from '../components/DeleteLeadModal';
import ViewLeadModal from '../components/ViewLeadModal';
import { supabase } from '../integrations/supabase/client';
import { Lead } from '../types';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [leadToView, setLeadToView] = useState<Lead | null>(null);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    setIsDeleting(true);
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadToDelete.id);
    
    setIsDeleting(false);
    if (error) {
      console.error('Error deleting lead:', error);
    } else {
      setLeadToDelete(null);
      fetchLeads(); // Refresh list
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">Gerenciamento de Leads</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center bg-brand-cta text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-400 transition-all duration-200 shadow-lg hover:shadow-sky-500/50"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="ml-3">Novo Lead</span>
        </button>
      </div>
      {loading ? (
        <div className="text-center text-brand-light">Carregando leads...</div>
      ) : (
        <LeadsTable 
          leads={leads}
          onView={setLeadToView}
          onEdit={setLeadToEdit}
          onDelete={setLeadToDelete}
        />
      )}
      <AddLeadModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLeadAdded={fetchLeads}
      />
      <EditLeadModal
        isOpen={!!leadToEdit}
        onClose={() => setLeadToEdit(null)}
        onLeadUpdated={() => {
          setLeadToEdit(null);
          fetchLeads();
        }}
        lead={leadToEdit}
      />
      <DeleteLeadModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDeleteLead}
        isLoading={isDeleting}
      />
      <ViewLeadModal
        isOpen={!!leadToView}
        onClose={() => setLeadToView(null)}
        lead={leadToView}
      />
    </div>
  );
};

export default Leads;