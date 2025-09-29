import React, { useState, useEffect } from 'react';
import { X, BedDouble, Bath, Square, MapPin, Calendar, DollarSign, User, Mail, Phone } from 'lucide-react';
import { Property, Client } from '../types';
import { supabase } from '../integrations/supabase/client';

interface ViewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const StatusBadge: React.FC<{ status: Property['status'] }> = ({ status }) => {
  const baseClasses = 'px-4 py-2 text-sm font-bold rounded-full';
  const statusClasses = {
    'À Venda': 'bg-green-500/20 text-green-300 border border-green-500/30',
    'Pendente': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    'Vendido': 'bg-red-500/20 text-red-300 border border-red-500/30',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ViewPropertyModal: React.FC<ViewPropertyModalProps> = ({ isOpen, onClose, property }) => {
  const [linkedClient, setLinkedClient] = useState<Client | null>(null);
  const [loadingClient, setLoadingClient] = useState(false);

  // Buscar cliente relacionado ao imóvel
  useEffect(() => {
    const fetchLinkedClient = async () => {
      if (!property || !isOpen) {
        setLinkedClient(null);
        return;
      }

      setLoadingClient(true);
      
      try {
        // Primeiro, buscar purchase_order relacionada ao imóvel
        const { data: purchaseOrders, error: orderError } = await supabase
          .from('purchase_orders')
          .select('client_id')
          .eq('property_id', property.id);

        if (orderError) {
          console.log('Erro ao buscar purchase_orders:', orderError);
          setLinkedClient(null);
          return;
        }

        if (!purchaseOrders || purchaseOrders.length === 0) {
          console.log('Nenhuma purchase_order encontrada para este imóvel');
          setLinkedClient(null);
          return;
        }

        // Pegar o primeiro cliente vinculado
        const clientId = purchaseOrders[0].client_id;

        // Buscar os dados completos do cliente
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();

        if (clientError) {
          console.log('Erro ao buscar dados do cliente:', clientError);
          setLinkedClient(null);
        } else {
          console.log('Cliente encontrado:', clientData);
          setLinkedClient(clientData as Client);
        }
      } catch (error) {
        console.error('Erro ao buscar cliente vinculado:', error);
        setLinkedClient(null);
      } finally {
        setLoadingClient(false);
      }
    };

    fetchLinkedClient();
  }, [property, isOpen]);

  if (!isOpen || !property) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-2 sm:p-4">
      <div className="bg-brand-primary rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-brand-light hover:text-white bg-brand-secondary/80 rounded-full p-2 transition-colors"
        >
          <X size={20} className="sm:hidden" />
          <X size={24} className="hidden sm:block" />
        </button>
        
        {/* Header com imagem */}
        <div className="relative">
          <img 
            src={property.image_url} 
            alt={property.name || property.address}
            className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-t-2xl"
          />
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
            <StatusBadge status={property.status} />
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Título e preço */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-2">
              {property.name || 'Imóvel sem nome'}
            </h2>
            <div className="flex items-center text-brand-light mb-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-base sm:text-lg">{property.address}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cta mr-2" />
              <span className="text-2xl sm:text-4xl font-bold text-brand-cta">
                R$ {property.price ? property.price.toLocaleString('pt-BR') : 'Não informado'}
              </span>
            </div>
          </div>

          {/* Características principais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-brand-secondary p-4 sm:p-6 rounded-xl border border-brand-accent/20">
              <div className="flex items-center mb-3">
                <BedDouble className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cta mr-3" />
                <span className="text-brand-light font-medium text-sm sm:text-base">Quartos</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-brand-primary">{property.beds}</span>
            </div>
            
            <div className="bg-brand-secondary p-4 sm:p-6 rounded-xl border border-brand-accent/20">
              <div className="flex items-center mb-3">
                <Bath className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cta mr-3" />
                <span className="text-brand-light font-medium text-sm sm:text-base">Banheiros</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-brand-primary">{property.baths}</span>
            </div>
            
            <div className="bg-brand-secondary p-4 sm:p-6 rounded-xl border border-brand-accent/20">
              <div className="flex items-center mb-3">
                <Square className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cta mr-3" />
                <span className="text-brand-light font-medium text-sm sm:text-base">Área</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-brand-primary">{property.sqft} m²</span>
            </div>
          </div>

          {/* Informações do Cliente Relacionado */}
          {loadingClient ? (
            <div className="bg-brand-secondary p-4 sm:p-6 rounded-xl border border-brand-accent/20 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-brand-primary mb-4">Cliente Relacionado</h3>
              <p className="text-brand-light">Carregando informações do cliente...</p>
            </div>
          ) : linkedClient ? (
            <div className="bg-brand-secondary p-4 sm:p-6 rounded-xl border border-brand-accent/20 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-brand-primary mb-4 flex items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cta mr-3" />
                Cliente Relacionado
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-brand-light font-medium text-sm sm:text-base">Nome:</span>
                  <p className="text-brand-primary font-semibold text-sm sm:text-base">{linkedClient.name}</p>
                </div>
                <div>
                  <span className="text-brand-light font-medium text-sm sm:text-base">Email:</span>
                  <p className="text-brand-primary flex items-center text-sm sm:text-base">
                    <Mail className="w-4 h-4 mr-2 text-brand-cta" />
                    <span className="truncate">{linkedClient.email}</span>
                  </p>
                </div>
                <div>
                  <span className="text-brand-light font-medium text-sm sm:text-base">Telefone:</span>
                  <p className="text-brand-primary flex items-center text-sm sm:text-base">
                    <Phone className="w-4 h-4 mr-2 text-brand-cta" />
                    {linkedClient.phone}
                  </p>
                </div>
                <div>
                  <span className="text-brand-light font-medium text-sm sm:text-base">Último Contato:</span>
                  <p className="text-brand-primary text-sm sm:text-base">{formatDate(linkedClient.lastContact)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-secondary p-4 sm:p-6 rounded-xl border border-brand-accent/20 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-brand-primary mb-4 flex items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cta mr-3" />
                Cliente Relacionado
              </h3>
              <p className="text-brand-light text-center py-4 text-sm sm:text-base">Nenhum cliente vinculado a este imóvel.</p>
            </div>
          )}

          {/* Informações adicionais */}
          <div className="bg-brand-secondary p-4 sm:p-6 rounded-xl border border-brand-accent/20">
            <h3 className="text-lg sm:text-xl font-bold text-brand-primary mb-4">Informações Adicionais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-brand-light font-medium text-sm sm:text-base">ID do Imóvel:</span>
                <p className="text-brand-primary font-mono text-xs sm:text-sm break-all">{property.id}</p>
              </div>
              <div>
                <span className="text-brand-light font-medium">Data de Cadastro:</span>
                <p className="text-brand-primary">{formatDate(property.created_at)}</p>
              </div>
              <div>
                <span className="text-brand-light font-medium">Status:</span>
                <p className="text-brand-primary">{property.status}</p>
              </div>
              <div>
                <span className="text-brand-light font-medium">Preço por m²:</span>
                <p className="text-brand-primary font-bold">
                  R$ {(property.price / property.sqft).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Botão de fechar */}
          <div className="flex justify-end mt-8">
            <button 
              onClick={onClose}
              className="bg-brand-cta text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-400 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyModal;