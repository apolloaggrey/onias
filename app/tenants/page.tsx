'use client';
import { useEffect, useState } from 'react';

interface Tenant {
  tenant_id: number;
  name: string;
  id_passport_number: string;
  contact: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState({ name: '', id_passport_number: '', contact: '', email: '', emergency_contact_name: '', emergency_contact_phone: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const res = await fetch('/api/tenants');
    const data = await res.json();
    setTenants(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/tenants/${editingId}` : '/api/tenants';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', id_passport_number: '', contact: '', email: '', emergency_contact_name: '', emergency_contact_phone: '' });
    setEditingId(null);
    fetchTenants();
  };

  const handleEdit = (tenant: Tenant) => {
    setForm({
      name: tenant.name,
      id_passport_number: tenant.id_passport_number,
      contact: tenant.contact || '',
      email: tenant.email || '',
      emergency_contact_name: tenant.emergency_contact_name || '',
      emergency_contact_phone: tenant.emergency_contact_phone || '',
    });
    setEditingId(tenant.tenant_id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
    fetchTenants();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Tenants</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="ID/Passport Number"
          value={form.id_passport_number}
          onChange={(e) => setForm({ ...form, id_passport_number: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Emergency Contact Name"
          value={form.emergency_contact_name}
          onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Emergency Contact Phone"
          value={form.emergency_contact_phone}
          onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? 'Update' : 'Add'} Tenant
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">ID/Passport</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Email</th>
            <th className="p-2">Emergency Name</th>
            <th className="p-2">Emergency Phone</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.tenant_id}>
              <td className="p-2">{tenant.tenant_id}</td>
              <td className="p-2">{tenant.name}</td>
              <td className="p-2">{tenant.id_passport_number}</td>
              <td className="p-2">{tenant.contact}</td>
              <td className="p-2">{tenant.email}</td>
              <td className="p-2">{tenant.emergency_contact_name}</td>
              <td className="p-2">{tenant.emergency_contact_phone}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(tenant)} className="bg-yellow-500 text-white p-1 mr-2 rounded">Edit</button>
                <button onClick={() => handleDelete(tenant.tenant_id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}