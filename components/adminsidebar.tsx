import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/admin" className="p-2 hover:bg-gray-700 rounded">Dashboard / List Data</Link>
        <Link href="/admin/input" className="p-2 hover:bg-gray-700 rounded">Tambah Data</Link>
        <Link href="/peta" className="p-2 hover:bg-gray-700 rounded mt-4 text-yellow-400">Lihat Peta Website</Link>
      </nav>
    </aside>
  );
}