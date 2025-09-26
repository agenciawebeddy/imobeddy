import React from 'react';
import { X, User, Mail, Phone, BarChart, Tag } from 'lucide-react';
import { Lead } from '../types';

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | undefined | null }> = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="text-brand-cta mr-4 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-brand-light">{label}</p>
      <p className="text-brand-primary font-semibold">{value || 'N/A'}</p>
    </div>
  </div>
);

const ViewLeadModal: React.FC<ViewLeadModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-brand-primary p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-brand-primary mb-6">Detalhes do Lead</h2>
        <div className="space-y-6">
          <DetailItem icon={<User size={20} />} label="Nome" value={lead.name} />
          <DetailItem icon={<Mail size={20} />} label="Email" value={lead.email} />
          <DetailItem icon={<Phone size={20} />} label="Telefone" value={lead.phone} />
          <DetailItem icon={<BarChart size={20} />} label="Fonte" value={lead.source} />
          <DetailItem icon={<Tag size={20} />} label="Status" value={lead.status} />
        </div>
        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="bg-brand-cta text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-400 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadModal;