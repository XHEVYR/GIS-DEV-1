import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-400">GIS ADMIN</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin" className="p-3 bg-slate-800 rounded hover:bg-slate-700 block">
             Data Lokasi
          </Link>
          <Link href="/admin/input" className="p-3 bg-slate-800 rounded hover:bg-slate-700 block">
             Tambah Baru
          </Link>
          <div className="border-t border-slate-700 my-4"></div>
          <Link href="/peta" className="p-3 text-green-400 hover:text-green-300 block">
             Buka Website Peta
          </Link>
        </nav>
      </div>
    </aside>
  );
}