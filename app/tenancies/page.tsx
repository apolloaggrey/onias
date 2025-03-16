'use client';
import { useEffect, useState } from 'react';

interface Tenancy {
  tenancy_id: number;
  apartment_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string | null;
  rent_amount: number;
  deposit_amount: number;
  internet_plan_id: number | null;
  active: number;
  final_balance: number | null;
}

export default function TenanciesPage() {
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [form, setForm] = useState({
    apartment_id: '', tenant_id: '', start_date: '', end_date: '', rent_amount: '', deposit_amount: '', internet_plan_id: '', active: '1', final_balance: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTenancies();
  }, []);

  const fetchTenancies = async () => {
    const res = await fetch('/api/tenancies');
    const data = await res.json();
    setTenancies(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/tenancies/${editingId}` : '/api/tenancies';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        apartment_id: parseInt(form.apartment_id),
        tenant_id: parseInt(form.tenant_id),
        rent_amount: parseFloat(form.rent_amount),
        deposit_amount: parseFloat(form.deposit_amount),
        internet_plan_id: parseInt(form.internet_plan_id) || null,
        active: parseInt(form.active),
        final_balance: parseFloat(form.final_balance) || null,
      }),
    });
    setForm({ apartment_id: '', tenant_id: '', start_date: '', end_date: '', rent_amount: '', deposit_amount: '', internet_plan_id: '', active: '1', final_balance: '' });
    setEditingId(null);
    fetchTenancies();
  };

  const handleEdit = (tenancy: Tenancy) => {
    setForm({
      apartment_id: tenancy.apartment_id.toString(),
      tenant_id: tenancy.tenant_id.toString(),
      start_date: tenancy.start_date,
      end_date: tenancy.end_date || '',
      rent_amount: tenancy.rent_amount.toString(),
      deposit_amount: tenancy.deposit_amount.toString(),
      internet_plan_id: tenancy.internet_plan_id?.toString() || '',
      active: tenancy.active.toString(),
      final_balance: tenancy.final_balance?.toString() || '',
    });
    setEditingId(tenancy.tenancy_id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/tenancies/${id}`, { method: 'DELETE' });
    fetchTenancies();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Tenancies</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <input
          type="number"
          placeholder="Apartment ID"
          value={form.apartment_id}
          onChange={(e) => setForm({ ...form, apartment_id: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Tenant ID"
          value={form.tenant_id}
          onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Rent Amount"
          value={form.rent_amount}
          onChange={(e) => setForm({ ...form, rent_amount: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Deposit Amount"
          value={form.deposit_amount}
          onChange={(e) => setForm({ ...form, deposit_amount: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Internet Plan ID"
          value={form.internet_plan_id}
          onChange={(e) => setForm({ ...form, internet_plan_id: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <input
          type="number"
          placeholder="Final Balance"
          value={form.final_balance}
          onChange={(e) => setForm({ ...form, final_balance: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? 'Update' : 'Add'} Tenancy
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Apt ID</th>
            <th className="p-2">Tenant ID</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Rent</th>
            <th className="p-2">Deposit</th>
            <th className="p-2">Internet</th>
            <th className="p-2">Active</th>
            <th className="p-2">Balance</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenancies.map((tenancy) => (
            <tr key={tenancy.tenancy_id}>
              <td className="p-2">{tenancy.tenancy_id}</td>
              <td className="p-2">{tenancy.apartment_id}</td>
              <td className="p-2">{tenancy.tenant_id}</td>
              <td className="p-2">{tenancy.start_date}</td>
              <td className="p-2">{tenancy.end_date}</td>
              <td className="p-2">{tenancy.rent_amount}</td>
              <td className="p-2">{tenancy.deposit_amount}</td>
              <td className="p-2">{tenancy.internet_plan_id}</td>
              <td className="p-2">{tenancy.active ? 'Yes' : 'No'}</td>
              <td className="p-2">{tenancy.final_balance}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(tenancy)} className="bg-yellow-500 text-white p-1 mr-2 rounded">Edit</button>
                <button onClick={() => handleDelete(tenancy.tenancy_id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}