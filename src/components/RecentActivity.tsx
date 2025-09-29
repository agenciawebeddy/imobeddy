import React from 'react';
import { UserPlus, MessageCircle, FileCheck2, Handshake } from 'lucide-react';
import { ActivityLog } from '../types';

const activityData: ActivityLog[] = [
  { id: 1, user: 'John Doe', userImage: 'https://picsum.photos/seed/user1/40/40', action: 'adicionou um novo lead', target: 'Jane Smith', timestamp: 'há 5m', icon: <UserPlus className="w-5 h-5 text-green-400" /> },
  { id: 2, user: 'Você', userImage: 'https://picsum.photos/seed/realty-user/40/40', action: 'enviou uma mensagem para', target: 'Mike Johnson', timestamp: 'há 1h', icon: <MessageCircle className="w-5 h-5 text-blue-400" /> },
  { id: 3, user: 'Sistema', userImage: 'https://picsum.photos/seed/system/40/40', action: 'atualizou o status do imóvel para "Vendido"', target: 'Rua Principal, 123', timestamp: 'há 3h', icon: <FileCheck2 className="w-5 h-5 text-purple-400" /> },
  { id: 4, user: 'Emily White', userImage: 'https://picsum.photos/seed/user2/40/40', action: 'fechou um negócio de', target: 'R$450.000', timestamp: 'há 1d', icon: <Handshake className="w-5 h-5 text-amber-400" /> },
  { id: 5, user: 'Você', userImage: 'https://picsum.photos/seed/realty-user/40/40', action: 'adicionou um novo lead', target: 'Chris Brown', timestamp: 'há 2d', icon: <UserPlus className="w-5 h-5 text-green-400" /> },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg h-full">
      <h3 className="text-xl font-bold text-brand-primary mb-6">Atividade Recente</h3>
      <ul className="space-y-6">
        {activityData.map((item, index) => (
          <li key={item.id} className="flex items-start">
            <div className="relative">
              <img src={item.userImage} alt={item.user} className="w-10 h-10 rounded-full" />
              {index < activityData.length - 1 && <div className="absolute top-12 left-1/2 -translate-x-1/2 h-full w-0.5 bg-brand-accent/30" style={{height: 'calc(100% - 1rem)'}}></div>}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center space-x-2">
                <div className="bg-brand-secondary p-2 rounded-full">{item.icon}</div>
                <div>
                  <p className="text-sm text-brand-secondary">
                    <span className="font-bold">{item.user}</span> {item.action}{' '}
                    <span className="font-bold text-brand-cta">{item.target}</span>
                  </p>
                  <p className="text-xs text-brand-light mt-1">{item.timestamp}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;