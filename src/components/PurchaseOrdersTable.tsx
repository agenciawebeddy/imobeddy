import React from 'react';
import { PurchaseOrderWithDetails } from '../types';
import { Eye } from 'lucide-react';

interface PurchaseOrdersTableProps {
  orders: PurchaseOrderWithDetails[];
  onStatusChange: (orderId: string, propertyId: string, newStatus: PurchaseOrderWithDetails['status'], oldStatus: PurchaseOrderWithDetails['status']) => void;
  onViewDetails?: (order: PurchaseOrderWithDetails) => void;
}

const StatusSelect: React.FC<{ order: PurchaseOrderWithDetails; onStatusChange: PurchaseOrdersTableProps['onStatusChange'] }> = ({ order, onStatusChange }) => {
  const statusOptions: PurchaseOrderWithDetails['status'][] = ['Pendente', 'Vendido', 'Cancelado'];
  
  const statusColorClasses = {
    'Pendente': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    'Vendido': 'bg-green-500/20 text-green-300 border-green-500/50',
    'Cancelado': 'bg-red-500/20 text-red-300 border-red-500/50',
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PurchaseOrderWithDetails['status'];
    onStatusChange(order.id, order.properties.id, newStatus, order.status);
  };

  return (
    <select
      value={order.status}
      onChange={handleChange}
      className={`w-full bg-brand-secondary p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-cta transition-colors ${statusColorClasses[order.status]}`}
    >
      {statusOptions.map(status => (
        <option key={status} value={status} className="bg-brand-primary text-white">
          {status}
        </option>
      ))}
    </select>
  );
};

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({ orders, onStatusChange, onViewDetails }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  if (orders.length === 0) {
    return (
      <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg text-center">
        <p className="text-brand-light">Nenhuma ordem de compra encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-5 items-center px-4 pb-2 border-b border-brand-accent/20 text-brand-light font-bold">
          <p>Cliente</p>
          <p>Imóvel</p>
          <p>Data</p>
          <p>Status</p>
          <p>Ações</p>
        </div>
        {/* Rows */}
        {orders.map(order => (
          <div key={order.id} className="grid grid-cols-5 items-center bg-brand-secondary p-4 rounded-xl hover:bg-brand-accent/50 transition-colors duration-200">
            <p className="font-semibold text-brand-primary">{order.clients.name}</p>
            <p className="text-brand-light">{order.properties.name || order.properties.address}</p>
            <p className="text-brand-light">{formatDate(order.created_at)}</p>
            <div>
              <StatusSelect order={order} onStatusChange={onStatusChange} />
            </div>
            <div className="flex gap-2">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(order)}
                  className="p-2 bg-brand-cta/20 text-brand-cta border border-brand-cta/50 rounded-lg hover:bg-brand-cta/30 transition-colors duration-200 flex items-center justify-center"
                  title="Ver Detalhes"
                >
                  <Eye size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrdersTable;