import { supabase } from '@/lib/supabase';

export interface OrderData {
  destination_slug: string;
  destination_name: string;
  package_name?: string;
  date?: string;
  adults: number;
  children: number;
  total_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  destination_slug: string;
  destination_name: string;
  package_name: string | null;
  date: string | null;
  adults: number;
  children: number;
  total_price: number;
  status: string;
  created_at: string;
}

export async function createOrder(order: OrderData): Promise<{ success: boolean; orderId?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      destination_slug: order.destination_slug,
      destination_name: order.destination_name,
      package_name: order.package_name || null,
      date: order.date || null,
      adults: order.adults,
      children: order.children,
      total_price: order.total_price,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return { success: false };
  }

  return { success: true, orderId: data?.id };
}

export async function getOrders(): Promise<Order[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data || [];
}
