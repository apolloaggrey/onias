'use client';
import { useEffect, useState } from 'react';

interface TenantMoveHistory {
  tenancy_id: number;
  tenant_name: string;
  apartment_number: string;
  property_name: string;
  move_in_date: string;
  move_out_date: string | null;
  tenancy_status: 'Active' | 'Inactive';
}

export default function TenantMoveHistoryPage() {
  const [history, setHistory] = useState<TenantMoveHistory[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch('/api/tenant-move-history');
    const data = await res.json();
    setHistory(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Tenant Move History</h1>
      
      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Tenancy ID</th>
            <th className="p-2">Tenant Name</th>
            <th className="p-2">Apartment</th>
            <th className="p-2">Property</th>
            <th className="p-2">Move In</th>
            <th className="p-2">Move Out</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.tenancy_id}>
              <td className="p-2">{entry.tenancy_id}</td>
              <td className="p-2">{entry.tenant_name}</td>
              <td className="p-2">{entry.apartment_number}</td>
              <td className="p-2">{entry.property_name}</td>
              <td className="p-2">{entry.move_in_date}</td>
              <td className="p-2">{entry.move_out_date || 'N/A'}</td>
              <td className="p-2">{entry.tenancy_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}