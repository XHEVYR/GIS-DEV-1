import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InputPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", lat: "", lon: "", category: "hotel", description: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert("Data Berhasil Disimpan!");
    router.push('/admin');
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tambah Lokasi Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="border p-2 rounded" placeholder="Nama Tempat" onChange={e => setForm({...form, name: e.target.value})} required />
        <div className="flex gap-4">
            <input className="border p-2 rounded w-1/2" placeholder="Latitude (Contoh: -7.81)" onChange={e => setForm({...form, lat: e.target.value})} required />
            <input className="border p-2 rounded w-1/2" placeholder="Longitude (Contoh: 112.01)" onChange={e => setForm({...form, lon: e.target.value})} required />
        </div>
        <select className="border p-2 rounded" onChange={e => setForm({...form, category: e.target.value})}>
            <option value="hotel">Hotel</option>
            <option value="cafe">Cafe</option>
            <option value="wisata">Wisata</option>
        </select>
        <textarea className="border p-2 rounded" placeholder="Deskripsi Singkat" onChange={e => setForm({...form, description: e.target.value})} />
        <button className="bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">SIMPAN DATA</button>
      </form>
    </div>
  );
}