import React, { useState, useEffect } from 'react';
import { LineChart, Users, Handshake, Home, LoaderCircle } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { Property } from '../types';

import DashboardCard from '../components/DashboardCard';
import SalesChart from '../components/SalesChart';
import RecentActivity from '../components/RecentActivity';
import PropertyListings from '../components/PropertyListings';
import ViewPropertyModal from '../components/ViewPropertyModal';
import CreateSampleDataButton from '../components/CreateSampleDataButton';

interface DashboardStats {
  totalSales: number;
  newLeadsCount: number;
  soldPropertiesCount: number;
  activePropertiesCount: number;
}

const Dashboard: React.FC = () => {
  const [recentListings, setRecentListings] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [listingToView, setListingToView] = useState<Property | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      const [
        salesData,
        leadsData,
        soldPropertiesData,
        activePropertiesData,
        recentListingsData
      ] = await Promise.all([
        supabase.from('properties').select('price').eq('status', 'Vendido'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'Vendido'),
        supabase.from('properties').select('*', { count: 'exact', head: true }).in('status', ['À Venda', 'Pendente']),
        supabase.from('properties').select('*').order('created_at', { ascending: false }).limit(3)
      ]);

      if (salesData.error || leadsData.error || soldPropertiesData.error || activePropertiesData.error || recentListingsData.error) {
        console.error("Error fetching dashboard data:", {
          sales: salesData.error,
          leads: leadsData.error,
          sold: soldPropertiesData.error,
          active: activePropertiesData.error,
          listings: recentListingsData.error
        });
      } else {
        const totalSales = salesData.data?.reduce((sum, prop) => sum + prop.price, 0) || 0;
        setStats({
          totalSales,
          newLeadsCount: leadsData.count || 0,
          soldPropertiesCount: soldPropertiesData.count || 0,
          activePropertiesCount: activePropertiesData.count || 0,
        });
        setRecentListings(recentListingsData.data as Property[]);
      }
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `R$${(value / 1_000_000).toFixed(1).replace('.', ',')}M`;
    }
    if (value >= 1_000) {
      return `R$${Math.floor(value / 1_000)}k`;
    }
    return `R$${value.toLocaleString('pt-BR')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="w-12 h-12 text-brand-cta animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Botão para criar dados de exemplo */}
      <CreateSampleDataButton />
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Vendas Totais (Ano)"
          value={formatCurrency(stats?.totalSales ?? 0)}
          change="+12.5%"
          icon={<LineChart className="w-8 h-8 text-brand-cta" />}
          changeType="increase"
        />
        <DashboardCard
          title="Novos Leads"
          value={String(stats?.newLeadsCount ?? 0)}
          change="+5.2%"
          icon={<Users className="w-8 h-8 text-green-400" />}
          changeType="increase"
        />
        <DashboardCard
          title="Imóveis Vendidos"
          value={String(stats?.soldPropertiesCount ?? 0)}
          change="-2.1%"
          icon={<Handshake className="w-8 h-8 text-amber-400" />}
          changeType="decrease"
        />
        <DashboardCard
          title="Imóveis Ativos"
          value={String(stats?.activePropertiesCount ?? 0)}
          change="+1.8%"
          icon={<Home className="w-8 h-8 text-indigo-400" />}
          changeType="increase"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sales Chart & Property Listings */}
        <div className="lg:col-span-2 space-y-8">
          <SalesChart />
          <PropertyListings 
            title="Imóveis Recentes" 
            properties={recentListings} 
            onView={setListingToView}
          />
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
      
      <ViewPropertyModal
        isOpen={!!listingToView}
        onClose={() => setListingToView(null)}
        property={listingToView}
      />
    </div>
  );
};

export default Dashboard;