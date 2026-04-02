export interface Order {
  id: string
  customer: string
  email: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  items: number
  date: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  sold: number
  revenue: number
  status: 'active' | 'draft' | 'archived'
  rating: number
  image: string
}

export interface Property {
  pr_id: number;
  property_title: string;
  pr_type_id: number;
  property_reason: string;
  price_guide: number;
  property_description: string;
  property_built_year: number;
  propert_status: 'Available' | 'Sold' | 'Leased';
  is_active: boolean;
  property_type?: {
    pr_type_name: string;
  };
  specifications?: {
    property_land_size: string;
    property_building_area: string;
    parking_area: number;
    number_of_rooms: number;
    number_of_bathrooms: number;
  };
  assets?: {
    asset_type: 'img' | 'video_link' | 'document';
    asset_value: string;
  }[];
  agents?: {
    user: {
      user_email: string;
      details?: {
        user_firstname: string;
        user_lastname: string;
        user_phone_number: string;
      };
    };
  }[];
  created_at?: string;
}

export interface Customer {
  id: string
  name: string
  email: string
  orders: number
  spent: number
  lastOrder: string
  status: 'active' | 'inactive' | 'vip'
  location: string
}

export interface DashboardStats {
  revenue: {
    total: number
    trend: number
    data: { date: string; value: number }[]
  }
  orders: {
    total: number
    trend: number
    data: { date: string; count: number }[]
  }
  customers: {
    total: number
    trend: number
    data: { date: string; count: number }[]
  }
  products: {
    total: number
    lowStock: number
    data: { name: string; sales: number }[]
  }
}

// Mock Data
export const mockOrders: Order[] = []

export const mockProducts: Product[] = []

export const mockCustomers: Customer[] = []

export const mockDashboardStats: DashboardStats = {
  revenue: {
    total: 0,
    trend: 0,
    data: []
  },
  orders: {
    total: 0,
    trend: 0,
    data: []
  },
  customers: {
    total: 0,
    trend: 0,
    data: []
  },
  products: {
    total: 0,
    lowStock: 0,
    data: []
  }
}

export const recentActivity: any[] = []