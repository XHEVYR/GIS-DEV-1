import AdminSidebar from "@/components/adminsidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Statis */}
      <AdminSidebar />
      
      {/* Konten Berubah-ubah */}
      <main className="flex-1 p-8 ml-64"> 
        {children}
      </main>
    </div>
  );
}