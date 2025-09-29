import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Lead } from '../types';

interface LeadsTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const StatusBadge: React.FC<{ status: Lead['status'] }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full';
  const statusClasses = {
    'New': 'bg-blue-500/20 text-blue-300',
    'Contacted': 'bg-yellow-500/20 text-yellow-300',
    'Qualified': 'bg-green-500/20 text-green-300',
    'Lost': 'bg-red-500/20 text-red-300',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onView, onEdit, onDelete }) => {
  if (leads.length === 0) {
    return (
      <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg text-center">
        <p className="text-brand-light">Nenhum lead encontrado. Adicione um novo para começar!</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg">
      <div className="space-y-4">
        {leads.map(lead => (
          <div key={lead.id} className="grid grid-cols-6 items-center bg-brand-secondary p-4 rounded-xl hover:bg-brand-accent/50 transition-colors duration-200">
            <p className="font-semibold text-brand-primary">{lead.name}</p>
            <p className="text-brand-light">{lead.email}</p>
            <p className="text-brand-light">{lead.phone}</p>
            <p className="text-brand-light">{lead.source}</p>
            <div><StatusBadge status={lead.status} /></div>
            <div className="flex justify-end items-center space-x-3">
              <button onClick={() => onView(lead)} className="text-brand-light hover:text-brand-cta transition-colors"><Eye size={18} /></button>
              <button onClick={() => onEdit(lead)} className="text-brand-light hover:text-green-400 transition-colors"><Edit size={18} /></button>
              <button onClick={() => onDelete(lead)} className="text-brand-light hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsTable;