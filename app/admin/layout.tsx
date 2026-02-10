"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/adminsidebar"; 
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // SIDEBAR CONTROL
  const [isMinimized, setIsMinimized] = useState(false);

  // Security Check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // TAMPILAN LOADING
  if (status === "loading") {
    return (
      // Background disamakan dengan halaman utama (Slate-50)
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          {/* Spinner Lime Green */}
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-lime-500"></div>
          <p className="text-slate-400 font-bold text-xs tracking-widest uppercase animate-pulse">
            Memuat Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // MAIN LAYOUT
  return (
    // UBAH BACKGROUND: bg-slate-50 (Lebih bersih & premium dibanding gray-100)
    <div className="flex min-h-screen bg-slate-50">
      
      {/* SIDEBAR */}
      <AdminSidebar 
        isMinimized={isMinimized} 
        setIsMinimized={setIsMinimized} 
      />

      {/* KONTEN UTAMA */}
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isMinimized ? "ml-20" : "ml-64"
        }`}
      >
        
        {/* HEADER*/}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-lime-500 animate-pulse"></div>
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Control Panel
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">
                {session?.user?.name || "Super Admin"}
              </p>
              
              <div className="flex justify-end">
                <span className="text-[10px] font-bold text-lime-600 bg-lime-100 px-2 py-0.5 rounded-full">
                  ONLINE
                </span>
              </div>
            </div>
            
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-lime-100 to-white flex items-center justify-center text-lime-700 font-black border border-lime-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* AREA KONTEN */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}