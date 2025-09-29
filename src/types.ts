export interface Property {
  id: string;
  name: string | null;
  image_url: string;
  address: string;
  price: number;
  status: 'À Venda' | 'Pendente' | 'Vendido';
  beds: number;
  baths: number;
  sqft: number;
  user_id?: string;
  created_at?: string;
}

export interface ChartDataPoint {
  month: string;
  sales: number;
}

export interface ActivityLog {
  id: number;
  user: string;
  userImage: string;
  action: string;
  target: string;
  timestamp: string;
  icon: React.ReactNode;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: string;
  assignedTo: string;
  user_id?: string;
  created_at?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string;
  user_id?: string;
  created_at?: string;
}

export interface PurchaseOrder {
  id: string;
  user_id: string;
  client_id: string;
  property_id: string;
  status: 'Pendente' | 'Vendido' | 'Cancelado';
  created_at: string;
}

export interface PurchaseOrderWithDetails extends PurchaseOrder {
  clients: {
    id: string;
    name: string;
  };
  properties: {
    id: string;
    name: string | null;
    address: string;
    status: 'À Venda' | 'Pendente' | 'Vendido';
  };
}