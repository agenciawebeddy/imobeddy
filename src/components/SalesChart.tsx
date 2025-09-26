import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Legend } from 'recharts';
import { supabase } from '../integrations/supabase/client';
import { ChartDataPoint } from '../types';
import { LoaderCircle } from 'lucide-react';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-primary/80 backdrop-blur-sm p-4 border border-brand-accent/50 rounded-lg shadow-lg">
        <p className="label font-semibold text-brand-primary">{`${label}`}</p>
        <p className="intro text-brand-cta">{`Vendas : R$${payload[0].value.toLocaleString('pt-BR')}`}</p>
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      
      const { data: sales, error } = await supabase
        .from('purchase_orders')
        .select('created_at, properties(price)')
        .eq('status', 'Vendido');

      if (error) {
        console.error('Error fetching sales data:', error);
        setLoading(false);
        return;
      }

      const monthlySales: { [key: string]: number } = {
        'Jan': 0, 'Fev': 0, 'Mar': 0, 'Abr': 0, 'Mai': 0, 'Jun': 0,
        'Jul': 0, 'Ago': 0, 'Set': 0, 'Out': 0, 'Nov': 0, 'Dez': 0
      };
      
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

      sales.forEach(sale => {
        const price = (sale.properties as { price: number } | null)?.price;
        if (price) {
          const saleDate = new Date(sale.created_at);
          const monthIndex = saleDate.getMonth();
          const monthName = monthNames[monthIndex];
          monthlySales[monthName] += price;
        }
      });

      const chartData = monthNames.map(month => ({
        month,
        sales: monthlySales[month]
      }));

      setData(chartData);
      setLoading(false);
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg h-96 flex justify-center items-center">
        <LoaderCircle className="w-10 h-10 text-brand-cta animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-brand-primary p-6 rounded-2xl border border-brand-accent/20 shadow-lg h-96">
      <h3 className="text-xl font-bold text-brand-primary mb-4">Performance de Vendas</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#38BDF8" strokeOpacity={0.3} />
          <XAxis dataKey="month" stroke="#778DA9" tick={{ fill: '#E0E1DD' }} />
          <YAxis stroke="#778DA9" tick={{ fill: '#E0E1DD' }} tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(119, 141, 169, 0.1)' }} />
          <Legend wrapperStyle={{ bottom: 0 }}/>
          <Area type="monotone" dataKey="sales" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" name="Vendas" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;