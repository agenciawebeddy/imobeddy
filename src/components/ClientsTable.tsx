import React from 'react';
import { Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { Client } from '../types';

interface ClientsTableProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onView, onEdit, onDelete }) => {
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-brand-primary p-4 sm:p-6 rounded-2xl border border-brand-accent/20 shadow-lg">
      {clients.length === 0 ? (
        <p className="text-brand-light text-center py-8">Nenhum cliente encontrado.</p>
      ) : (
        <div className="space-y-4">
          {/* Header para desktop */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 pb-2 border-b border-brand-accent/20">
            <p className="font-semibold text-brand-light">Nome</p>
            <p className="font-semibold text-brand-light">Email</p>
            <p className="font-semibold text-brand-light">Telefone</p>
            <p className="font-semibold text-brand-light">Último Contato</p>
            <p className="font-semibold text-brand-light text-right">Ações</p>
          </div>
          
          {clients.map(client => (
            <div key={client.id} className="bg-brand-secondary p-4 rounded-xl hover:bg-brand-accent/50 transition-colors duration-200">
              {/* Layout mobile/tablet - cards */}
              <div className="lg:hidden space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-brand-primary text-lg">{client.name}</p>
                    <p className="text-brand-light text-sm">{client.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => onView(client)} className="text-brand-light hover:text-brand-cta transition-colors p-1"><Eye size={18} /></button>
                    <button onClick={() => onEdit(client)} className="text-brand-light hover:text-green-400 transition-colors p-1"><Edit size={18} /></button>
                    <button onClick={() => onDelete(client)} className="text-brand-light hover:text-red-400 transition-colors p-1"><Trash2 size={18} /></button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-brand-light">{client.phone}</p>
                  <div className="text-brand-light flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(client.lastContact)}
                  </div>
                </div>
              </div>
              
              {/* Layout desktop - grid */}
              <div className="hidden lg:grid lg:grid-cols-5 gap-4 items-center">
                <p className="font-semibold text-brand-primary">{client.name}</p>
                <p className="text-brand-light">{client.email}</p>
                <p className="text-brand-light">{client.phone}</p>
                <div className="text-brand-light flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(client.lastContact)}
                </div>
                <div className="flex justify-end items-center space-x-3">
                  <button onClick={() => onView(client)} className="text-brand-light hover:text-brand-cta transition-colors"><Eye size={18} /></button>
                  <button onClick={() => onEdit(client)} className="text-brand-light hover:text-green-400 transition-colors"><Edit size={18} /></button>
                  <button onClick={() => onDelete(client)} className="text-brand-light hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsTable;