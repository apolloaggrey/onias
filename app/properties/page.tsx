'use client';
import { useEffect, useState } from 'react';

interface Property {
  property_id: number;
  name: string;
  address: string;
  description: string;
  conservancy_fee: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState({ name: '', address: '', description: '', conservancy_fee: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/properties/${editingId}` : '/api/properties';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, conservancy_fee: parseFloat(form.conservancy_fee) || null }),
    });
    setForm({ name: '', address: '', description: '', conservancy_fee: '' });
    setEditingId(null);
    fetchProperties();
  };

  const handleEdit = (prop: Property) => {
    setForm({
      name: prop.name,
      address: prop.address,
      description: prop.description || '',
      conservancy_fee: prop.conservancy_fee?.toString() || '',
    });
    setEditingId(prop.property_id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    fetchProperties();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Properties</h1>
      
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
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Conservancy Fee"
          value={form.conservancy_fee}
          onChange={(e) => setForm({ ...form, conservancy_fee: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? 'Update' : 'Add'} Property
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Address</th>
            <th className="p-2">Description</th>
            <th className="p-2">Fee</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop) => (
            <tr key={prop.property_id}>
              <td className="p-2">{prop.property_id}</td>
              <td className="p-2">{prop.name}</td>
              <td className="p-2">{prop.address}</td>
              <td className="p-2">{prop.description}</td>
              <td className="p-2">{prop.conservancy_fee}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(prop)} className="bg-yellow-500 text-white p-1 mr-2 rounded">Edit</button>
                <button onClick={() => handleDelete(prop.property_id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}