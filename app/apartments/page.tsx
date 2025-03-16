'use client';
import { useEffect, useState } from 'react';

interface Apartment {
  apartment_id: number;
  property_id: number;
  apartment_number: string;
  apartment_type: 'studio' | 'one_bedroom' | 'two_bedroom' | 'three_bedroom';
  switch_name: string;
  port_number: number;
}

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [form, setForm] = useState({ property_id: '', apartment_number: '', apartment_type: '', switch_name: '', port_number: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    const res = await fetch('/api/apartments');
    const data = await res.json();
    setApartments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/apartments/${editingId}` : '/api/apartments';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, property_id: parseInt(form.property_id), port_number: parseInt(form.port_number) || null }),
    });
    setForm({ property_id: '', apartment_number: '', apartment_type: '', switch_name: '', port_number: '' });
    setEditingId(null);
    fetchApartments();
  };

  const handleEdit = (apt: Apartment) => {
    setForm({
      property_id: apt.property_id.toString(),
      apartment_number: apt.apartment_number,
      apartment_type: apt.apartment_type || '',
      switch_name: apt.switch_name || '',
      port_number: apt.port_number?.toString() || '',
    });
    setEditingId(apt.apartment_id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/apartments/${id}`, { method: 'DELETE' });
    fetchApartments();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Apartments</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <input
          type="number"
          placeholder="Property ID"
          value={form.property_id}
          onChange={(e) => setForm({ ...form, property_id: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Apartment Number"
          value={form.apartment_number}
          onChange={(e) => setForm({ ...form, apartment_number: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={form.apartment_type}
          onChange={(e) => setForm({ ...form, apartment_type: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Type</option>
          <option value="studio">Studio</option>
          <option value="one_bedroom">One Bedroom</option>
          <option value="two_bedroom">Two Bedroom</option>
          <option value="three_bedroom">Three Bedroom</option>
        </select>
        <input
          type="text"
          placeholder="Switch Name"
          value={form.switch_name}
          onChange={(e) => setForm({ ...form, switch_name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Port Number"
          value={form.port_number}
          onChange={(e) => setForm({ ...form, port_number: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? 'Update' : 'Add'} Apartment
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Property ID</th>
            <th className="p-2">Number</th>
            <th className="p-2">Type</th>
            <th className="p-2">Switch</th>
            <th className="p-2">Port</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map((apt) => (
            <tr key={apt.apartment_id}>
              <td className="p-2">{apt.apartment_id}</td>
              <td className="p-2">{apt.property_id}</td>
              <td className="p-2">{apt.apartment_number}</td>
              <td className="p-2">{apt.apartment_type}</td>
              <td className="p-2">{apt.switch_name}</td>
              <td className="p-2">{apt.port_number}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(apt)} className="bg-yellow-500 text-white p-1 mr-2 rounded">Edit</button>
                <button onClick={() => handleDelete(apt.apartment_id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}