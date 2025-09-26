import React from 'react';
import { X, User, MapPin, DollarSign, Phone, Mail, Calendar, Home, Bed, Bath, Car, Ruler } from 'lucide-react';

interface ViewOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const ViewOrderDetailsModal: React.FC<ViewOrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const { clients: client, properties: property } = order;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-primary border border-brand-accent/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-accent/20">
          <h2 className="text-2xl font-bold text-brand-light">Detalhes da Ordem de Compra</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-secondary rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-brand-light" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Seção do Cliente */}
          <div className="bg-brand-secondary p-6 rounded-xl border border-brand-accent/20">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-brand-cta mr-3" />
              <h3 className="text-xl font-semibold text-brand-light">Dados do Cliente</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">Nome</span>
                </div>
                <p className="text-lg text-brand-light ml-6">{client?.name || 'Não informado'}</p>
              </div>
              
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="text-lg text-brand-light ml-6">{client?.email || 'Não informado'}</p>
              </div>
              
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="font-medium">Telefone</span>
                </div>
                <p className="text-lg text-brand-light ml-6">{client?.phone || 'Não informado'}</p>
              </div>
              
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Último Contato</span>
                </div>
                <p className="text-lg text-brand-light ml-6">
                  {client?.last_contact ? new Date(client.last_contact).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Seção do Imóvel */}
          <div className="bg-brand-secondary p-6 rounded-xl border border-brand-accent/20">
            <div className="flex items-center mb-4">
              <Home className="w-6 h-6 text-brand-cta mr-3" />
              <h3 className="text-xl font-semibold text-brand-light">Dados do Imóvel</h3>
            </div>
            
            <div className="space-y-4">
              {/* Nome e Endereço */}
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <Home className="w-4 h-4 mr-2" />
                  <span className="font-medium">Nome</span>
                </div>
                <p className="text-lg text-brand-light ml-6">{property?.name || 'Não informado'}</p>
              </div>
              
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="font-medium">Endereço</span>
                </div>
                <p className="text-lg text-brand-light ml-6">{property?.address || 'Não informado'}</p>
              </div>

              {/* Preço */}
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-medium">Preço</span>
                </div>
                <p className="text-2xl font-bold text-brand-cta ml-6">
                  R$ {property?.price ? property.price.toLocaleString('pt-BR') : 'Não informado'}
                </p>
              </div>

              {/* Características do Imóvel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-brand-primary p-4 rounded-lg border border-brand-accent/20 text-center">
                  <Bed className="w-6 h-6 text-brand-cta mx-auto mb-2" />
                  <p className="text-sm text-brand-light mb-1">Quartos</p>
                  <p className="text-lg font-semibold text-brand-light">{property?.beds || 'N/A'}</p>
                </div>
                
                <div className="bg-brand-primary p-4 rounded-lg border border-brand-accent/20 text-center">
                  <Bath className="w-6 h-6 text-brand-cta mx-auto mb-2" />
                  <p className="text-sm text-brand-light mb-1">Banheiros</p>
                  <p className="text-lg font-semibold text-brand-light">{property?.baths || 'N/A'}</p>
                </div>
                
                <div className="bg-brand-primary p-4 rounded-lg border border-brand-accent/20 text-center">
                  <Ruler className="w-6 h-6 text-brand-cta mx-auto mb-2" />
                  <p className="text-sm text-brand-light mb-1">Área (m²)</p>
                  <p className="text-lg font-semibold text-brand-light">{property?.sqft || 'N/A'}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center text-brand-light mb-2">
                  <span className="font-medium">Status</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ml-6 ${
                  property?.status === 'À Venda' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                    : property?.status === 'Vendido'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                }`}>
                  {property?.status || 'Não informado'}
                </span>
              </div>
            </div>
          </div>

          {/* Status da Ordem */}
          <div className="bg-brand-secondary p-6 rounded-xl border border-brand-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-brand-light mb-2">Status da Ordem</h3>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  order.status === 'Concluída' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                    : order.status === 'Cancelada'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-light mb-1">Data da Ordem</p>
                <p className="text-lg font-semibold text-brand-light">
                  {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-brand-accent/20">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-cta text-white rounded-lg hover:bg-brand-cta/80 transition-colors duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetailsModal;