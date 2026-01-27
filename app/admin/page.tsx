"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  address?: string;
  image?: string;
}

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Lokasi</h1>
        <Link href="/admin/input" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow transition">
          + Tambah Data
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nama Tempat</th>
              <th className="p-4 font-semibold text-gray-600">Kategori</th>
              <th className="p-4 font-semibold text-gray-600">Koordinat</th>
              <th className="p-4 font-semibold text-gray-600">Alamat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {places.map((place) => (
              <tr key={place.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">
                  {place.name}
                  {/* Tampilkan indikator kecil jika ada gambar */}
                  {place.image && <span className="ml-2 text-xs text-green-600 font-bold">📷</span>}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 uppercase">
                    {place.category}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm font-mono">
                  {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
                </td>
                <td className="p-4 text-gray-500 text-sm truncate max-w-xs">
                  {place.address || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {places.length === 0 && <p className="p-8 text-center text-gray-500">Belum ada data.</p>}
      </div>
    </div>
  );
}