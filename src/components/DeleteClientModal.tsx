import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-brand-primary p-8 rounded-2xl border border-brand-accent/20 shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-white"><X size={24} /></button>
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-500/20 p-3 rounded-full mb-4"><AlertTriangle className="w-8 h-8 text-red-400" /></div>
          <h2 className="text-2xl font-bold text-brand-primary mb-2">Excluir Cliente</h2>
          <p className="text-brand-light mb-6">Você tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-center space-x-4 w-full">
            <button onClick={onClose} className="flex-1 text-brand-light font-bold py-3 px-4 rounded-lg hover:bg-brand-accent">Cancelar</button>
            <button onClick={onConfirm} disabled={isLoading} className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50">
              {isLoading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;