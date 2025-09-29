import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  changeType: 'increase' | 'decrease';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, icon, changeType }) => {
  const isIncrease = changeType === 'increase';
  return (
    <div className="dashboard-card bg-brand-card p-6 rounded-2xl border border-brand-accent/20 shadow-lg hover:shadow-brand-cta/20 hover:border-brand-cta/50 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="dashboard-stat-label text-brand-light font-medium">{title}</p>
          <span className="dashboard-stat text-4xl font-bold text-brand-primary mt-1">{value}</span>
        </div>
        <div className="bg-brand-secondary p-3 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        {isIncrease ? (
          <ArrowUpRight className="w-5 h-5 text-green-400" />
        ) : (
          <ArrowDownRight className="w-5 h-5 text-red-400" />
        )}
        <span className={`font-semibold ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
        <span className="text-brand-light">vs mês passado</span>
      </div>
    </div>
  );
};

export default DashboardCard;