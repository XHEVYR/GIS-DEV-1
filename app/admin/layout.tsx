import AdminSidebar from "@/components/adminsidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 h-screen overflow-auto">{children}</main>
    </div>
  );
}