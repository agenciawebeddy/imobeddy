import React from 'react';
import { BedDouble, Bath, Square, Eye, Edit, Trash2 } from 'lucide-react';
import { Property } from '../types';

const StatusBadge: React.FC<{ status: Property['status'] }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full';
  const statusClasses = {
    'À Venda': 'bg-green-500/20 text-green-300',
    'Pendente': 'bg-amber-500/20 text-amber-300',
    'Vendido': 'bg-red-500/20 text-red-300',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface PropertyListingsProps {
  title?: string;
  properties: Property[];
  onView?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

const PropertyListings: React.FC<PropertyListingsProps> = ({ title, properties, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-brand-primary p-4 sm:p-6 rounded-2xl border border-brand-accent/20 shadow-lg">
      {title && <h3 className="text-xl font-bold text-brand-primary mb-4">{title}</h3>}
       {properties.length === 0 ? (
        <p className="text-brand-light text-center py-8">Nenhum imóvel encontrado.</p>
      ) : (
        <div className="space-y-4">
          {properties.map(prop => (
            <div key={prop.id} className="bg-brand-secondary p-4 rounded-xl hover:bg-brand-accent/50 transition-colors duration-200">
              {/* Layout mobile/tablet - cards */}
              <div className="lg:hidden space-y-4">
                <div className="flex space-x-4">
                  <img src={prop.image_url} alt={prop.name || prop.address} className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {prop.name ? (
                      <>
                        <p className="font-bold text-brand-primary text-base sm:text-lg truncate">{prop.name}</p>
                        <p className="font-semibold text-brand-light text-sm truncate">{prop.address}</p>
                      </>
                    ) : (
                      <p className="font-semibold text-brand-secondary text-sm sm:text-base">{prop.address}</p>
                    )}
                    <p className="text-lg font-bold text-brand-cta mt-1">R${prop.price.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center text-brand-light">
                      <BedDouble size={16} className="mr-1" />
                      <span>{prop.beds}</span>
                    </div>
                    <div className="flex items-center text-brand-light">
                      <Bath size={16} className="mr-1" />
                      <span>{prop.baths}</span>
                    </div>
                    <div className="flex items-center text-brand-light">
                      <Square size={16} className="mr-1" />
                      <span>{prop.sqft}m²</span>
                    </div>
                  </div>
                  <StatusBadge status={prop.status} />
                </div>
                
                {(onView || onEdit || onDelete) && (
                  <div className="flex justify-end space-x-2 pt-2 border-t border-brand-accent/20">
                    {onView && (
                      <button onClick={() => onView(prop)} className="text-brand-light hover:text-brand-cta transition-colors p-2">
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(prop)} className="text-brand-light hover:text-green-400 transition-colors p-2">
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(prop)} className="text-brand-light hover:text-red-400 transition-colors p-2">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Layout desktop - horizontal */}
              <div className="hidden lg:flex lg:items-center">
                <img src={prop.image_url} alt={prop.name || prop.address} className="w-32 h-24 object-cover rounded-lg" />
                <div className="flex-1 ml-4 grid grid-cols-4 items-center gap-4">
                  <div className="col-span-2">
                    {prop.name ? (
                      <>
                        <p className="font-bold text-brand-primary text-lg">{prop.name}</p>
                        <p className="font-semibold text-brand-light text-sm">{prop.address}</p>
                      </>
                    ) : (
                      <p className="font-semibold text-brand-secondary">{prop.address}</p>
                    )}
                    <p className="text-lg font-bold text-brand-cta mt-1">R${prop.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center text-brand-light">
                      <BedDouble size={16} className="mr-1" />
                      <span>{prop.beds}</span>
                    </div>
                    <div className="flex items-center text-brand-light">
                      <Bath size={16} className="mr-1" />
                      <span>{prop.baths}</span>
                    </div>
                    <div className="flex items-center text-brand-light">
                      <Square size={16} className="mr-1" />
                      <span>{prop.sqft}m²</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <StatusBadge status={prop.status} />
                    {(onView || onEdit || onDelete) && (
                      <div className="flex space-x-3">
                        {onView && (
                          <button onClick={() => onView(prop)} className="text-brand-light hover:text-brand-cta transition-colors">
                            <Eye size={18} />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(prop)} className="text-brand-light hover:text-green-400 transition-colors">
                            <Edit size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(prop)} className="text-brand-light hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListings;