import { supabase } from '@/lib/supabase';

export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return data?.role === 'admin';
}

export async function getAdminProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (data?.role !== 'admin') return null;

  return {
    id: user.id,
    email: user.email,
    name: data.full_name || user.user_metadata?.full_name || 'Admin',
    role: data.role,
  };
}

// Dashboard stats
export async function getDashboardStats() {
  const [ordersRes, destinationsRes, usersRes] = await Promise.all([
    supabase.from('orders').select('id, total_price, status, created_at'),
    supabase.from('destinations').select('id', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }),
  ]);

  const orders = ordersRes.data || [];
  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'confirmed' || o.status === 'completed')
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  return {
    totalOrders: orders.length,
    totalRevenue,
    totalDestinations: destinationsRes.count || 0,
    totalUsers: usersRes.count || 0,
    recentOrders: orders.slice(0, 5),
  };
}

// Destinations CRUD
export async function getAdminDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function createDestination(dest: {
  name: string;
  slug: string;
  country: string;
  description: string;
  image: string;
  price_start_from: number;
  duration: string;
}) {
  const { data, error } = await supabase
    .from('destinations')
    .insert(dest)
    .select()
    .single();

  return { data, error };
}

export async function updateDestination(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('destinations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteDestination(id: string) {
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);

  return { error };
}

export async function toggleDestinationStatus(id: string, isActive: boolean) {
  return updateDestination(id, { is_active: isActive });
}

// Orders management
export async function getAdminOrders(status?: string) {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  return { error };
}
