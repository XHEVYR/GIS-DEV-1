"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react"; // 1. Tambah useEffect
import { 
  MapPin, 
  Building2, 
  Coffee, 
  Plane, 
  ArrowRight, 
  Globe, 
  LayoutDashboard,
  Maximize2,
  X, 
  Minimize2 
} from "lucide-react";

const Map = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
      <p className="text-sm font-semibold animate-pulse">Memuat Peta...</p>
    </div>
  ),
});

export default function LandingPage() {
  const { data: session } = useSession();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 2. FUNGSI MAGIC: Paksa Peta Refresh Ukuran saat Full Screen
  useEffect(() => {
    // Kita kasih delay sedikit agar DOM selesai berubah dulu
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
    return () => clearTimeout(timer);
  }, [isFullScreen]);

  const handleOpenMap = () => {
    setIsFullScreen(true);
  };

  const handleCloseMap = () => {
    setIsFullScreen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* NAVBAR */}
      <header className={`fixed w-full bg-white/90 backdrop-blur-md z-40 border-b border-slate-200/60 transition-transform duration-300 ${isFullScreen ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-lime-500 p-2 rounded-xl shadow-lg shadow-lime-500/30 text-white">
              <Globe size={20} strokeWidth={3} />
            </div>
            <span className="font-black text-xl text-slate-800 tracking-tight">
              GIS <span className="text-lime-600">KOTA BLITAR</span>
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <button onClick={handleOpenMap} className="hover:text-lime-600 transition">Peta Digital</button>
            <Link href="#categories" className="hover:text-lime-600 transition">Kategori</Link>
            <Link href="#about" className="hover:text-lime-600 transition">Tentang</Link>
          </nav>

          <div className="flex gap-4">
            {session ? (
              <Link href="/admin" className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg ring-2 ring-slate-900 ring-offset-2">
                <LayoutDashboard size={16} />
                Halo, {session.user?.name || "Admin"}
              </Link>
            ) : (
              <Link href="/auth/login" className="px-6 py-2.5 text-xs font-bold text-white bg-lime-600 rounded-full hover:bg-lime-700 transition shadow-lg shadow-lime-200 ring-2 ring-lime-500 ring-offset-2">
                Masuk Admin
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        
        {/* HERO SECTION */}
        <section className="relative px-6 py-12 lg:py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
             {/* ... (Bagian teks sama seperti sebelumnya) ... */}
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-50 text-lime-700 text-[10px] font-black uppercase tracking-widest border border-lime-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
              </span>
              Sistem Informasi Geografis v1.0
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.15]">
              Jelajahi Potensi <br />
              <span className="text-lime-600 decoration-4 underline decoration-lime-200 underline-offset-4">Kota Blitar</span> Secara Real-Time.
            </h1>
            
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              Platform pemetaan interaktif untuk memvisualisasikan data Hotel, Kafe, dan Destinasi Wisata di seluruh wilayah Kota Blitar dengan akurat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={handleOpenMap}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white bg-slate-900 rounded-2xl font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200"
              >
                <Maximize2 size={20} /> Mulai Jelajah
              </button>

              {/* <Link 
                href="/admin" 
                className="flex items-center justify-center gap-2 px-8 py-4 text-slate-700 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition"
              >
                Data Management <ArrowRight size={20} />
              </Link> */}
            </div>
          </div>

          {/* MAP SECTION */}
          {/* 3. PERBAIKAN: HAPUS 'transition-all' agar peta snap instant & tidak error render */}
          <div 
            className={`
              ${isFullScreen 
                ? "fixed inset-0 z-[9999] h-screen w-screen bg-slate-100" 
                : "relative group order-1 lg:order-2 h-[450px] lg:h-[600px] w-full" 
              }
            `}
          >
            {!isFullScreen && (
              <div className="absolute -inset-2 bg-gradient-to-tr from-lime-400 to-emerald-400 rounded-[40px] blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            )}
            
            <div className={`relative h-full w-full overflow-hidden bg-slate-100 ${isFullScreen ? '' : 'rounded-[32px] border-[6px] border-white ring-1 ring-slate-100 shadow-2xl'}`}>
              
              <Map />

              {/* Tombol Close Center */}
              {isFullScreen && (
                <button
                  onClick={handleCloseMap}
                  className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white text-slate-800 px-6 py-2 rounded-full shadow-2xl border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                >
                  <Minimize2 size={18} />
                  Keluar Fullscreen
                </button>
              )}

              {/* Tombol Preview Expand */}
              {!isFullScreen && (
                 <button
                 onClick={handleOpenMap}
                 className="absolute top-4 right-4 z-[400] bg-white/80 backdrop-blur text-slate-600 p-2 rounded-xl shadow-sm hover:bg-white hover:text-lime-600 transition-all border border-white/50 opacity-0 group-hover:opacity-100"
                 title="Perbesar Peta"
               >
                 <Maximize2 size={20} />
               </button>
              )}

              {/* Info Badge
              <div className={`absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 transition-all ${isFullScreen ? 'scale-110 left-8 bottom-8' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="bg-lime-100 p-2.5 rounded-xl">
                    <MapPin className="text-lime-600 w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Data</p>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-sm font-black text-slate-800">Live Updated</p>
                    </div>
                  </div>
                </div>
              </div> */}

            </div>
          </div>
        </section>

        {/* ... (Bagian Kategori & Footer Tetap Sama) ... */}
        {/* Pastikan Anda menyalin sisa kodenya dari file sebelumnya jika tidak ada perubahan */}
        <section id="categories" className="py-24 bg-slate-50 border-y border-slate-200/60 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Kategori Data Spasial</h2>
              <p className="text-slate-500 font-medium">Kami mengelompokkan data geografis menjadi tiga kategori utama untuk memudahkan pencarian informasi Anda.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Hotel */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-blue-100 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Building2 size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Hotel & Penginapan</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Data lokasi akomodasi lengkap dengan informasi fasilitas untuk kenyamanan wisatawan.</p>
              </div>

              {/* Cafe */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-orange-100 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Coffee size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">Cafe & Restoran</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Tempat kuliner hits dan tongkrongan populer yang tersebar di seluruh penjuru kota.</p>
              </div>

              {/* Wisata */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-purple-100 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Plane size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Destinasi Wisata</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Objek wisata sejarah, alam, dan edukasi yang wajib dikunjungi saat berada di Blitar.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full"></div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Kelola Data Lebih Mudah</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-medium">
                Sistem ini dirancang untuk membantu pemerintah dan masyarakat mengakses informasi geografis secara transparan dan efisien.
              </p>
              
              {/* <Link href="/admin">
                <button className="bg-lime-500 hover:bg-lime-400 text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg transition shadow-xl shadow-lime-900/20 flex items-center gap-2 mx-auto">
                   <LayoutDashboard size={20}/>
                   Akses Dashboard Admin
                </button>
              </Link> */}
            </div>
        </section>

      </main>

      <footer className="bg-slate-950 text-slate-600 py-8 px-6 text-center text-xs font-bold uppercase tracking-widest border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} GIS Kota Blitar. All Rights Reserved.</p>
      </footer>
    </div>
  );
}