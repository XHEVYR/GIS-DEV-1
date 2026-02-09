"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Coffee,
  Plane,
  Globe,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Layers,
  Users,
  Database,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
} from "lucide-react";

// --- MAP COMPONENT (DYNAMIC IMPORT) ---
const Map = dynamic(() => import("@/components/maps/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2 rounded-[32px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
      <p className="text-sm font-semibold animate-pulse">Memuat Peta...</p>
    </div>
  ),
});

export default function LandingPage() {
  const { data: session } = useSession();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk menu mobile

  // Fix Leaflet Resize Bug saat Fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
    return () => clearTimeout(timer);
  }, [isFullScreen]);

  const handleOpenMap = () => {
    setIsFullScreen(true);
    setIsMobileMenuOpen(false); // Tutup menu jika map dibuka dari mobile
  };
  
  const handleCloseMap = () => setIsFullScreen(false);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Tutup menu mobile saat link diklik
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-lime-200 selection:text-lime-900 font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <header
        className={`fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 transition-transform duration-300 ${isFullScreen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-2 rounded-xl shadow-lg shadow-lime-500/20 text-white">
              <Globe size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight text-black">
              GIS<span className="text-lime-500">App</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <button
              onClick={handleOpenMap}
              className="hover:text-lime-600 transition duration-200"
            >
              Peta Digital
            </button>
            <Link
              href="#about"
              onClick={(e) => handleScrollTo(e, "about")}
              className="hover:text-lime-600 transition duration-200"
            >
              Tentang
            </Link>
            <Link
              href="#categories"
              onClick={(e) => handleScrollTo(e, "categories")}
              className="hover:text-lime-600 transition duration-200"
            >
              Kategori
            </Link>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex gap-4">
            {session ? (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg ring-2 ring-slate-900 ring-offset-2"
              >
                <LayoutDashboard size={16} />
                Halo, {session.user?.name || "Admin"}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="px-6 py-2.5 text-xs font-bold text-white bg-lime-600 rounded-full hover:bg-lime-700 transition shadow-lg shadow-lime-200 ring-2 ring-lime-500 ring-offset-2"
              >
                Masuk Admin
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 py-12 lg:py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1 animate-in slide-in-from-left duration-700 fade-in text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-lime-200 text-lime-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
              </span>
              GIS App
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Satu Peta <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600 decoration-4 underline decoration-lime-200 underline-offset-4">
                Terintegrasi.
              </span>
            </h1>

            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
              Eksplorasi potensi <strong>Kota & Kabupaten Blitar</strong>. Temukan lokasi Hotel, Kafe, dan Wisata dengan data yang akurat dan real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
              <button
                onClick={handleOpenMap}
                className="flex items-center justify-center gap-3 px-8 py-4 text-white bg-slate-900 rounded-2xl font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200 group w-full sm:w-auto"
              >
                <Maximize2 size={20} className="group-hover:rotate-45 transition-transform duration-300"/> 
                Mulai Jelajah
              </button>
            </div>
          </div>

          {/* MAP WIDGET */}
          <div
            className={`
              ${
                isFullScreen
                  ? "fixed inset-0 z-[9999] h-screen w-screen bg-slate-100"
                  : "relative group order-1 lg:order-2 h-[450px] lg:h-[600px] w-full"
              }
            `}
          >
            {!isFullScreen && (
              <div className="absolute -inset-3 bg-gradient-to-tr from-lime-300 to-emerald-300 rounded-[40px] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700"></div>
            )}

            <div
              className={`relative h-full w-full overflow-hidden bg-slate-100 ${isFullScreen ? "" : "rounded-[32px] border-[6px] border-white ring-1 ring-slate-100 shadow-2xl"}`}
            >
              <Map />

              {isFullScreen && (
                <button
                  onClick={handleCloseMap}
                  className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white text-slate-800 px-6 py-2 rounded-full shadow-2xl border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 font-bold text-sm"
                >
                  <Minimize2 size={18} />
                  Keluar Fullscreen
                </button>
              )}

              {!isFullScreen && (
                <button
                  onClick={handleOpenMap}
                  className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur text-slate-600 p-2.5 rounded-xl shadow-sm hover:bg-white hover:text-lime-600 transition-all border border-white/50 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                  title="Perbesar Peta"
                >
                  <Maximize2 size={20} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* --- SECTION TENTANG (WHITE BG) --- */}
        <section
          id="about"
          className="py-24 px-6 bg-white relative overflow-hidden scroll-mt-20 border-y border-slate-100"
        >
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            
            <h2 className="text-3xl md:text-4xl font-black leading-tight text-slate-900">
              Kenapa Menggunakan <br />
              <span className="text-lime-600">GIS App?</span>
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Sistem ini dirancang untuk memudahkan masyarakat dan wisatawan. Tidak perlu bingung mencari lokasi, semua ada dalam satu genggaman.
            </p>

            <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">30+</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Titik Lokasi Terdata
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">3</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Kategori Utama
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-lime-200 transition-colors group">
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">24/7</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Akses Real-Time
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION KATEGORI (SLATE BG) --- */}
        <section
          id="categories"
          className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-20"
        >
          {/* Pattern Dot Halus */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <div className="inline-block mb-3 px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Explore
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">
                Kategori Destinasi
              </h2>
              <p className="text-slate-500 font-medium">
                Pilih kategori di bawah ini untuk melihat persebaran lokasi pada peta.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Hotel */}
              <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Building2 size={28} className="md:w-8 md:h-8" strokeWidth={2} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                  Hotel & Penginapan
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Temukan tempat istirahat terbaik yang nyaman dan strategis.
                </p>
              </div>

              {/* Cafe */}
              <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Coffee size={28} className="md:w-8 md:h-8" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Cafe & Restoran
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Tempat nongkrong hits dan kuliner lezat khas Blitar.
                </p>
              </div>

              {/* Wisata */}
              <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition duration-300 border border-slate-100 group cursor-default">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Plane size={28} className="md:w-8 md:h-8" strokeWidth={2} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                  Destinasi Wisata
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Jelajahi keindahan alam dan situs sejarah yang memukau.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION TENTANG / ABOUT */}
        <section 
          id="about" 
          className="py-16 md:py-24 px-6 bg-slate-900 text-white relative overflow-hidden scroll-mt-24"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-lime-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-500/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            
            {/* Kolom Kiri: Teks & Narasi */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-lime-400 text-xs font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></span>
                Tentang Platform
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Membangun Ekosistem <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">Digital Blitar</span>
              </h2>

              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                Sistem Informasi Geografis (SIG) ini hadir sebagai jembatan informasi antara pemerintah dan masyarakat luas. Kami mengintegrasikan data spasial lokasi wisata, kuliner, dan akomodasi untuk mendukung pertumbuhan ekonomi daerah.
              </p>

              {/* List Keunggulan */}
              <div className="space-y-4 pt-2 inline-block text-left">
                {[
                  "Validasi Data Lapangan Terverifikasi",
                  "Pembaruan Informasi Secara Real-Time",
                  "Antarmuka Responsif & Mudah Digunakan"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="bg-lime-500/10 p-1.5 rounded-full group-hover:bg-lime-500 group-hover:text-slate-900 transition-colors duration-300">
                      <CheckCircle2 size={18} className="text-lime-500 group-hover:text-slate-900" />
                    </div>
                    <span className="font-medium text-slate-300 group-hover:text-white transition-colors text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: Statistik / Visual Dashboard */}
            <div className="relative">
              {/* Decorative Border Box */}
              <div className="absolute -inset-2 bg-gradient-to-r from-lime-500 to-blue-500 rounded-3xl opacity-20 blur-lg"></div>
              
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  
                  {/* Stat 1 */}
                  <div className="bg-slate-900/80 p-4 md:p-6 rounded-2xl border border-slate-700 hover:border-lime-500/50 transition duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                      <Database size={18} className="md:w-5 md:h-5" />
                    </div>
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-1">30+</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-wider">Total Data Titik</p>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-slate-900/80 p-4 md:p-6 rounded-2xl border border-slate-700 hover:border-lime-500/50 transition duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-lime-500/20 rounded-lg flex items-center justify-center text-lime-400 mb-4">
                      <Users size={18} className="md:w-5 md:h-5" />
                    </div>
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-1">1K</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-wider">Pengunjung Bulanan</p>
                  </div>

                  {/* Stat 3 (Full Width) */}
                  <div className="col-span-2 bg-slate-900/80 p-4 md:p-6 rounded-2xl border border-slate-700 hover:border-lime-500/50 transition duration-300 flex items-center justify-between">
                    <div>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                        <Layers size={18} className="md:w-5 md:h-5" />
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white">3 Kategori</h4>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1">Wisata, Hotel, & Kuliner</p>
                    </div>
                    {/* Simple Graph Visual */}
                    <div className="flex items-end gap-1 h-8 md:h-12">
                       <div className="w-1.5 md:w-2 bg-slate-700 h-4 md:h-6 rounded-t-sm"></div>
                       <div className="w-1.5 md:w-2 bg-slate-600 h-6 md:h-8 rounded-t-sm"></div>
                       <div className="w-1.5 md:w-2 bg-lime-500 h-8 md:h-12 rounded-t-sm animate-pulse"></div>
                       <div className="w-1.5 md:w-2 bg-slate-600 h-6 md:h-10 rounded-t-sm"></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* --- PROFESSIONAL FOOTER (DARK THEME) --- */}
      <footer className="bg-black text-zinc-400 pt-10 pb-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Kolom 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-1.5 rounded-lg text-white">
                  <Globe size={18} strokeWidth={3} />
                </div>
                <span className="font-black text-lg tracking-tight">
                  GIS <span className="text-lime-500">BLITAR</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                Platform pemetaan digital resmi untuk pariwisata dan ekonomi kreatif di Blitar Raya.
              </p>
            </div>

            {/* Kolom 2: Tautan */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
                Menu Utama
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={handleOpenMap}
                    className="hover:text-lime-500 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span> Peta Digital
                  </button>
                </li>
                <li>
                  <Link
                    href="#categories"
                    onClick={(e) => handleScrollTo(e, "categories")}
                    className="hover:text-lime-500 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span> Kategori Data
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-lime-500 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span> Login Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Kontak */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
                Kantor Pusat
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-lime-600 shrink-0" />
                  <span className="leading-relaxed">
                    Jl. Merdeka No. 105,<br />
                    Kepanjen Kidul, Kota Blitar
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-lime-600 shrink-0" />
                  <span>info@blitarkota.go.id</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-lime-600 shrink-0" />
                  <span>(0342) 801xxx</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
                Sosial Media
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-lime-500 hover:text-white hover:border-lime-500 transition-all text-zinc-400"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-zinc-400"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all text-zinc-400"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-zinc-900/50 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-medium text-zinc-600">
              &copy; {new Date().getFullYear()} GIS BLITAR.
            </p>
            <p className="text-xs font-medium text-zinc-600 flex items-center gap-1">
               Developed by <span className="text-zinc-500">Adalah Pokoknya Mah</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}