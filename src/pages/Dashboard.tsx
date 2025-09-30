import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalSales: number;
  newLeadsCount: number;
  soldPropertiesCount: number;
  activePropertiesCount: number;
}

interface Property {
  id: string;
  name?: string;
  address: string;
  price: number;
  status: 'À Venda' | 'Pendente' | 'Vendido';
  beds: number;
  baths: number;
  sqft: number;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: string;
  assignedTo: string;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string;
}

interface PurchaseOrder {
  id: string;
  status: 'Pendente' | 'Vendido' | 'Cancelado';
  created_at: string;
  clients: {
    id: string;
    name: string;
  };
  properties: {
    id: string;
    name?: string | null;
    address: string;
    status: 'À Venda' | 'Pendente' | 'Vendido';
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentListings, setRecentListings] = useState<Property[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          { data: salesData, error: salesError },
          { data: leadsData, error: leadsError },
          { data: soldPropertiesData, error: soldError },
          { data: activePropertiesData, error: activeError },
          { data: recentListingsData, error: listingsError },
          { data: recentActivityData, error: activityError }
        ] = await Promise.all([
          supabase.from('properties').select('price').eq('status', 'Vendido'),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'Vendido'),
          supabase.from('properties').select('*', { count: 'exact', head: true }).in('status', ['À Venda', 'Pendente']),
          supabase.from('properties').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('purchase_orders').select(`
            id,
            user: clients ( id, name, email, phone, last_contact ),
            property: properties ( id, name, address, status, price, beds, baths, sqft )
          `).order('created_at', { ascending: false }).limit(5)
        ]);

        if (salesError || leadsError || soldError || activeError || listingsError || activityError) {
          console.error('Error fetching dashboard data:', {
            sales: salesError,
            leads: leadsError,
            sold: soldError,
            active: activeError,
            listings: listingsError,
            activity: activityError
          });
          setError('Erro ao carregar dados do dashboard');
        } else {
          const totalSales = salesData?.reduce((sum, prop) => sum + prop.price, 0) || 0;
          setStats({
            totalSales,
            newLeadsCount: leadsData?.count || 0,
            soldPropertiesCount: soldPropertiesData?.count || 0,
            activePropertiesCount: activePropertiesData?.count || 0,
          });
          setRecentListings(recentListingsData as Property[]);
          setRecentActivity(activityData as any[]);
        }
      } catch (error) {
        console.error('Error in fetchDashboardData:', error);
        setError('Erro inesperado ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `R$${Math.floor(value / 1_000_000)}M`;
    }
    if (value >= 1_000) {
      return `R$${Math.floor(value / 1_000)}k`;
    }
    return `R$${value.toLocaleString('pt-BR')}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Vendas Totais (Ano)
              </Typography>
              <Typography variant="h4">
                {formatCurrency(stats?.totalSales ?? 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Novos Leads
              </Typography>
              <Typography variant="h4">
                {stats?.newLeadsCount ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Imóveis Vendidos
              </Typography>
              <Typography variant="h4">
                {stats?.soldPropertiesCount ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Imóveis Ativos
              </Typography>
              <Typography variant="h4">
                {stats?.activePropertiesCount ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance de Vendas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recentListings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atividade Recente
              </Typography>
              <List dense>
                {recentActivity.slice(0, 5).map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemText
                      primary={`${activity.user}: ${activity.action}`}
                      secondary={activity.timestamp}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Listings */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Imóveis Recentes
          </Typography>
          <Grid container spacing={2}>
            {recentListings.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {property.name || property.address}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {property.address}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      R$ {property.price.toLocaleString('pt-BR')}
                    </Typography>
                    <Chip label={property.status} color="primary" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;