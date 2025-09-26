import React, { useState, useEffect, useCallback } from 'react';
import { X, User, Mail, Phone, Home, Calendar, PlusCircle } from 'lucide-react';
import { Client, Property, PurchaseOrder } from '../types';
import { supabase } from '../integrations/supabase/client';
import LinkPropertyModal from './LinkPropertyModal';

interface ViewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number | undefined | null }> = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="text-brand-cta mr-4 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-brand-light">{label}</p>
      <p className="text-brand-primary font-semibold">{value || 'N/A'}</p>
    </div>
  </div>
);

const ViewClientModal: React.FC<ViewClientModalProps> = ({ isOpen, onClose, client }) => {
  const [linkedProperties, setLinkedProperties] = useState<Property[]>([]);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const fetchLinkedProperties = useCallback(async () => {
    if (!client) return;
    
    const { data: orders, error: ordersError } = await supabase
      .from('purchase_orders')
      .select('property_id')
      .eq('client_id', client.id);

    if (ordersError || !orders || orders.length === 0) {
      setLinkedProperties([]);
      return;
    }

    const propertyIds = orders.map(o => o.property_id);
    
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .in('id', propertyIds);

    if (propertiesError) {
      console.error("Error fetching linked properties:", propertiesError);
      setLinkedProperties([]);
    } else {
      setLinkedProperties(properties as Property[]);
    }
  }, [client]);

  useEffect(() => {
    if (isOpen) {
      fetchLinkedProperties();
    }
  }, [isOpen, fetchLinkedProperties]);

  if (!isOpen || !client) return null;

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
        <div className="bg-brand-primary p-4 sm:p-6 md:p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-brand-light hover:text-white">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-primary mb-4 sm:mb-6 pr-8">Detalhes do Cliente</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <DetailItem icon={<User size={18} className="sm:w-5 sm:h-5" />} label="Nome" value={client.name} />
              <DetailItem icon={<Mail size={18} className="sm:w-5 sm:h-5" />} label="Email" value={client.email} />
              <DetailItem icon={<Phone size={18} className="sm:w-5 sm:h-5" />} label="Telefone" value={client.phone} />
              <DetailItem icon={<Calendar size={18} className="sm:w-5 sm:h-5" />} label="Último Contato" value={formatDate(client.lastContact)} />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h3 className="text-base sm:text-lg font-bold text-brand-primary">Imóveis de Interesse</h3>
                <button onClick={() => setIsLinkModalOpen(true)} className="flex items-center justify-center text-xs sm:text-sm bg-brand-cta/20 text-brand-cta font-semibold py-2 px-3 rounded-lg hover:bg-brand-cta/40">
                  <PlusCircle size={14} className="sm:w-4 sm:h-4 mr-2" />
                  Vincular
                </button>
              </div>
              <div className="space-y-3 max-h-48 sm:max-h-48 overflow-y-auto pr-2">
                {linkedProperties.length > 0 ? (
                  linkedProperties.map(prop => (
                    <div key={prop.id} className="bg-brand-secondary p-3 rounded-lg">
                      <p className="font-semibold text-brand-primary text-sm sm:text-base">{prop.name || prop.address}</p>
                      <p className="text-xs sm:text-sm text-brand-light">R${prop.price.toLocaleString('pt-BR')}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-brand-light text-xs sm:text-sm text-center py-4">Nenhum imóvel vinculado.</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-6 sm:pt-8">
            <button onClick={onClose} className="bg-brand-cta text-white font-bold py-2 px-4 sm:px-6 rounded-lg hover:bg-sky-400 transition-colors text-sm sm:text-base w-full sm:w-auto">
              Fechar
            </button>
          </div>
        </div>
      </div>
      <LinkPropertyModal 
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onPropertyLinked={() => {
          fetchLinkedProperties();
          setIsLinkModalOpen(false);
        }}
        client={client}
      />
    </>
  );
};

export default ViewClientModal;