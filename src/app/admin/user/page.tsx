'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  email?: string;
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const filtered = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Kelola User</h1>
        <p className="text-xs text-gray-500">{users.length} user terdaftar</p>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari user..." className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-xs" />

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Nama</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Bergabung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={3} className="px-5 py-10 text-center text-gray-400">Memuat...</td></tr> :
            filtered.length === 0 ? <tr><td colSpan={3} className="px-5 py-10 text-center text-gray-400">Tidak ada user</td></tr> :
            filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                      {(user.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name || 'User'}</p>
                      <p className="text-[11px] text-gray-500">{user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 sm:table-cell">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-600">
                  {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
