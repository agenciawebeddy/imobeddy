import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { PurchaseOrderWithDetails } from '../types';
import PurchaseOrdersTable from '../components/PurchaseOrdersTable';
import ViewOrderDetailsModal from '../components/ViewOrderDetailsModal';

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderWithDetails | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchPurchaseOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        id,
        status,
        created_at,
        clients ( id, name, email, phone, last_contact ),
        properties ( id, name, address, status, price, beds, baths, sqft )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchase orders:', error);
    } else {
      setOrders(data as any);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const handleStatusChange = async (
    orderId: string,
    propertyId: string,
    newStatus: PurchaseOrderWithDetails['status'],
    oldStatus: PurchaseOrderWithDetails['status']
  ) => {
    // Update order status
    const { error: orderError } = await supabase
      .from('purchase_orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (orderError) {
      console.error('Error updating order status:', orderError);
      return;
    }

    // If status changed to 'Vendido', update property status
    if (newStatus === 'Vendido') {
      const { error: propertyError } = await supabase
        .from('properties')
        .update({ status: 'Vendido' })
        .eq('id', propertyId);
      if (propertyError) console.error('Error updating property status:', propertyError);
    } 
    // If status changed FROM 'Vendido' to something else, revert property status
    else if (oldStatus === 'Vendido' && newStatus !== 'Vendido') {
      const { error: propertyError } = await supabase
        .from('properties')
        .update({ status: 'À Venda' })
        .eq('id', propertyId);
      if (propertyError) console.error('Error reverting property status:', propertyError);
    }

    // Refresh the list to show changes
    fetchPurchaseOrders();
  };

  const handleViewDetails = (order: PurchaseOrderWithDetails) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">Ordens de Compra</h2>
      </div>
      {loading ? (
        <p className="text-center text-brand-light">Carregando ordens de compra...</p>
      ) : (
        <PurchaseOrdersTable 
          orders={orders} 
          onStatusChange={handleStatusChange}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Modal */}
      <ViewOrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default PurchaseOrders;