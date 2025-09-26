import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../pages/Dashboard';
import Listings from '../pages/Listings';
import Leads from '../pages/Leads';
import Clients from '../pages/Clients';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import PurchaseOrders from '../pages/PurchaseOrders';
import AddListingModal from './AddListingModal';

const MainLayout: React.FC = () => {
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenAddListingModal = useCallback(() => {
    setIsAddListingModalOpen(true);
  }, []);

  const handleCloseAddListingModal = useCallback(() => {
    setIsAddListingModalOpen(false);
  }, []);

  const handleListingAdded = useCallback(() => {
    setIsAddListingModalOpen(false);
    // Aqui podemos adicionar lógica adicional se necessário, como refresh de dados
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-brand-primary text-brand-primary font-sans">
      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <Sidebar 
        onOpenAddListingModal={handleOpenAddListingModal} 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-secondary p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <AddListingModal 
        isOpen={isAddListingModalOpen}
        onClose={handleCloseAddListingModal}
        onListingAdded={handleListingAdded}
      />
    </div>
  );
};

export default MainLayout;