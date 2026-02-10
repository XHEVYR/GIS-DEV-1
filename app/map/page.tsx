"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutDashboard} from "lucide-react";

// Import Peta secara dinamis (Client side only)
const Map = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-600"></div>
      <p className="text-sm font-bold animate-pulse uppercase tracking-widest">
        Memuat Peta Kawasan...
      </p>
    </div>
  ),
});

export default function UniversalMapPage() {
  const { data: session } = useSession();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* Floating Navigation Controls */}
      <div className="absolute top-6 left-6 z-1000 flex gap-3">
        {session && (
          <Link
            href="/admin"
            className="bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-white hover:bg-black hover:scale-105 transition-all flex items-center gap-2 group"
          >
            <LayoutDashboard size={18} className="text-lime-400" />
            <span className="text-sm font-bold">Dashboard</span>
          </Link>
        )}
      </div>

      {/* Info Badge */}
      <div className="absolute top-6 right-6 z-1000 hidden md:block">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-lime-500 animate-pulse"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            GIS <span className="text-lime-600">Kawasan Blitar</span> • Live
            Mode
          </p>
        </div>
      </div>

      {/* Area Peta Fullscreen */}
      <div className="flex-1 relative z-0">
        <Map />
      </div>
    </div>
  );
}
