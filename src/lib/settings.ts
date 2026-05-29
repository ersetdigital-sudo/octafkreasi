import { supabase } from '@/lib/supabase';

export interface BusinessSettings {
  name: string;
  description: string;
  email: string;
  whatsapp: string;
  address: string;
}

export interface FeeSettings {
  service_fee: number;
  insurance_fee: number;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface EWallet {
  id: string;
  wallet_type: string;
  wallet_number: string;
  wallet_name: string;
}

export async function getSettings<T>(key: string): Promise<T | null> {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('id', key)
    .single();

  return data?.value || null;
}

export async function getFees(): Promise<FeeSettings> {
  const fees = await getSettings<FeeSettings>('fees');
  return fees || { service_fee: 100000, insurance_fee: 150000 };
}

export async function getBusiness(): Promise<BusinessSettings> {
  const biz = await getSettings<BusinessSettings>('business');
  return biz || { name: 'Octaf Kreasi', description: '', email: '', whatsapp: '', address: '' };
}

export async function getActiveBanks(): Promise<BankAccount[]> {
  const { data } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  return data || [];
}

export async function getActiveEwallets(): Promise<EWallet[]> {
  const { data } = await supabase
    .from('ewallets')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  return data || [];
}
