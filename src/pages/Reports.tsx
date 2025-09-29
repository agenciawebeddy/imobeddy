import React from 'react';
import { FileText, TrendingUp, UserCheck } from 'lucide-react';
import SalesChart from '../components/SalesChart';

const ReportCard: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg flex flex-col items-center justify-center text-center hover:border-brand-cta/50 transition-colors">
    <div className="bg-brand-secondary p-4 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-brand-primary text-lg">{title}</h3>
    <p className="text-brand-light text-sm mt-1">Clique para gerar o relatório</p>
  </div>
);

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">Relatórios</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <ReportCard title="Relatório de Vendas" icon={<TrendingUp className="w-8 h-8 text-brand-cta" />} />
        <ReportCard title="Desempenho da Fonte de Leads" icon={<UserCheck className="w-8 h-8 text-green-400" />} />
        <ReportCard title="Desempenho do Corretor" icon={<FileText className="w-8 h-8 text-amber-400" />} />
      </div>
      <SalesChart />
    </div>
  );
};

export default Reports;