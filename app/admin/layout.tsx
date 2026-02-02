"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/adminsidebar"; // Pastikan path ini sesuai
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. STATE UNTUK MENGONTROL SIDEBAR
  const [isMinimized, setIsMinimized] = useState(false);

  // Security Check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-500 font-medium text-sm">
            Memuat Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* 2. SIDEBAR DINAMIS (Kirim Props ke Sidebar) */}
      <AdminSidebar 
        isMinimized={isMinimized} 
        setIsMinimized={setIsMinimized} 
      />

      {/* 3. MAIN CONTENT (Margin Dinamis) */}
      {/* Jika minimized: ml-20 (80px), Jika full: ml-64 (256px) */}
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isMinimized ? "ml-20" : "ml-64"
        }`}
      >
        
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-30 transition-all">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
            Control Panel
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                Logged In
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* KONTEN HALAMAN */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}