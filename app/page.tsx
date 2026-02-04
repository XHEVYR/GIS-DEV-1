"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { 
  Building2, 
  Coffee, 
  Plane, 
  Globe, 
  LayoutDashboard,
  Maximize2,
  Minimize2,
  MapPin,
  CheckCircle2,
  Mail,       
  Phone,      
  Instagram,  
  Facebook,   
  Twitter     
} from "lucide-react";

// --- DYNAMIC MAP IMPORT ---
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

  // FIX: Resize Map saat Fullscreen
  useEffect(() => {
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
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
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
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 py-12 lg:py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* KOLOM KIRI: TEKS DETAIL */}
            <div className="space-y-8 order-2 lg:order-1 animate-in slide-in-from-left duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-50 text-lime-700 text-[10px] font-black uppercase tracking-widest border border-lime-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                  </span>
                  Sistem Informasi Geografis Terpadu
                </div>

                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.15]">
                  Jelajahi Potensi <br />
                  <span className="text-lime-600 decoration-4 underline decoration-lime-200 underline-offset-4">Kota Blitar</span> Dalam Satu Peta.
                </h1>

                <div className="space-y-4 text-slate-500 text-lg leading-relaxed font-medium">
                    <p>
                        Selamat datang di portal GIS resmi Kota Blitar. Platform ini dirancang khusus untuk memetakan titik-titik strategis di kota kami, memudahkan warga dan wisatawan menemukan lokasi yang mereka butuhkan.
                    </p>
                    <p className="text-base border-l-4 border-lime-500 pl-4 bg-slate-50 p-4 rounded-r-xl">
                        <strong className="text-slate-700 mb-2 flex items-center gap-2"><CheckCircle2 size={18} className="text-lime-600"/> Akurat & Real-Time</strong>
                        Data kami diverifikasi secara berkala untuk memastikan Anda mendapatkan informasi lokasi, alamat, dan kategori yang paling mutakhir.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={handleOpenMap}
                    className="flex items-center justify-center gap-3 px-8 py-4 text-white bg-slate-900 rounded-2xl font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200 group"
                  >
                    <Maximize2 size={20} className="group-hover:rotate-90 transition-transform"/> Mulai Menjelajah
                  </button>
                </div>
            </div>

            {/* KOLOM KANAN: MAP WIDGET */}
            <div 
                className={`
                order-1 lg:order-2 transition-all duration-0 ease-in-out
                ${isFullScreen 
                    ? "fixed inset-0 z-9999 h-screen w-screen bg-slate-100" 
                    : "relative h-125 lg:h-162.5 w-full group" 
                }
                `}
            >
                {!isFullScreen && (
                <div className="absolute -inset-3 bg-linear-to-tr from-lime-300 via-emerald-300 to-teal-300 rounded-[40px] blur-2xl opacity-30 group-hover:opacity-50 transition duration-700 animate-pulse-slow"></div>
                )}
                
                <div className={`relative h-full w-full overflow-hidden bg-slate-100 ${isFullScreen ? '' : 'rounded-[32px] border-[6px] border-white ring-1 ring-slate-100 shadow-2xl'}`}>
                  <Map />
                  
                  {isFullScreen ? (
                      <button
                      onClick={handleCloseMap}
                      className="absolute top-6 left-1/2 -translate-x-1/2 z-1000 bg-white text-slate-800 px-6 py-2 rounded-full shadow-2xl border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm flex items-center gap-2"
                      >
                      <Minimize2 size={18} /> Keluar Fullscreen
                      </button>
                  ) : (
                      <button
                      onClick={handleOpenMap}
                      className="absolute top-4 right-4 z-400 bg-white/80 backdrop-blur text-slate-600 p-2.5 rounded-xl shadow-sm hover:bg-white hover:text-lime-600 transition-all border border-white/50 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                      title="Zoom Peta"
                      >
                      <Maximize2 size={20} />
                      </button>
                  )}

                  <div className={`absolute bottom-6 left-6 z-400 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 transition-all ${isFullScreen ? 'scale-110 left-8 bottom-8' : ''}`}>
                      <div className="flex items-center gap-3">
                      <div className="bg-lime-100 p-2.5 rounded-xl">
                          <MapPin className="text-lime-600 w-5 h-5 fill-current" />
                      </div>
                      <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Database</p>
                          <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              <p className="text-sm font-black text-slate-800">Live Updated</p>
                          </div>
                      </div>
                      </div>
                  </div>
                </div>
            </div>
        </section>

        {/* --- SECTION KATEGORI --- */}
        <section id="categories" className="py-24 bg-slate-50/50 border-y border-slate-200/60 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] bg-size:[24px_24px]"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Kategori Data Spasial</h2>
              <p className="text-slate-500 font-medium text-lg">Data geografis dikelompokkan menjadi tiga kategori utama untuk memudahkan eksplorasi Anda.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Hotel */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-blue-100 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Building2 size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Hotel & Penginapan</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">Lokasi akomodasi nyaman untuk istirahat Anda selama di Blitar.</p>
              </div>

              {/* Cafe */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-orange-100 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Coffee size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">Cafe & Restoran</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">Tempat kuliner hits dan tongkrongan populer di berbagai sudut kota.</p>
              </div>

              {/* Wisata */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-purple-100 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Plane size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Destinasi Wisata</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">Objek wisata sejarah, alam, dan edukasi yang wajib dikunjungi.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- PROFESSIONAL FOOTER (BARU) --- */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
               
               {/* Kolom 1: Brand */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-white">
                    <div className="bg-lime-500 p-1.5 rounded-lg text-white">
                      <Globe size={18} strokeWidth={3} />
                    </div>
                    <span className="font-black text-lg tracking-tight">
                      GIS <span className="text-lime-500">BLITAR</span>
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">
                    Sistem Informasi Geografis berbasis web untuk pemetaan potensi pariwisata dan ekonomi kreatif di Kota Blitar.
                  </p>
               </div>

               {/* Kolom 2: Tautan */}
               <div>
                  <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Tautan Cepat</h4>
                  <ul className="space-y-2 text-sm">
                    <li><button onClick={handleOpenMap} className="hover:text-lime-500 transition">Peta Digital</button></li>
                    <li><Link href="#categories" className="hover:text-lime-500 transition">Kategori Data</Link></li>
                    <li><Link href="/auth/login" className="hover:text-lime-500 transition">Login Admin</Link></li>
                  </ul>
               </div>

               {/* Kolom 3: Kontak */}
               <div>
                  <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Hubungi Kami</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                       <MapPin size={16} className="mt-0.5 text-lime-500 shrink-0"/>
                       <span>Jl. Merdeka No. 105,<br/>Kota Blitar, Jawa Timur</span>
                    </li>
                    <li className="flex items-center gap-3">
                       <Mail size={16} className="text-lime-500 shrink-0"/>
                       <span>info@blitarkota.go.id</span>
                    </li>
                    <li className="flex items-center gap-3">
                       <Phone size={16} className="text-lime-500 shrink-0"/>
                       <span>(0342) 801xxx</span>
                    </li>
                  </ul>
               </div>

               {/* Social Media */}
               <div>
                  <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Ikuti Kami</h4>
                  <div className="flex gap-4">
                     <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-lime-500 hover:text-white transition-all text-slate-400">
                        <Instagram size={18} />
                     </a>
                     <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                        <Facebook size={18} />
                     </a>
                     <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all text-slate-400">
                        <Twitter size={18} />
                     </a>
                  </div>
               </div>

            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-slate-900 text-center flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs font-medium text-slate-600">
                &copy; {new Date().getFullYear()} Pemerintah Kota Blitar. All Rights Reserved.
              </p>
              <p className="text-xs font-medium text-slate-600">
                 Dibuat dengan Next.js & Leaflet
              </p>
            </div>
         </div>
      </footer>
    </div>
  );
}