import Link from "next/link";
import Image from "next/image"; // Pastikan kamu punya gambar peta di folder public
import { MapPin, Building2, Coffee, Plane, ArrowRight, ShieldCheck, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* --- NAVBAR --- */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Globe className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              GIS <span className="text-indigo-600">Kota Blitar</span>
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition">Fitur</Link>
            <Link href="#categories" className="hover:text-indigo-600 transition">Kategori</Link>
            <Link href="#about" className="hover:text-indigo-600 transition">Tentang</Link>
          </nav>

          <div className="flex gap-4">
            {/* Tombol Login Admin */}
            <Link 
              href="/admin" // Ganti url ini sesuai route dashboard kamu
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Masuk Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Sistem Informasi Geografis v1.0
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Jelajahi Potensi <br />
              <span className="text-indigo-600">Kota Blitar</span> Lewat Peta Digital.
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Platform pemetaan interaktif untuk memvisualisasikan persebaran Hotel, Kafe, dan Destinasi Wisata di seluruh wilayah Kota Blitar secara real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/map" // Asumsi kamu punya halaman khusus peta full screen
                className="flex items-center justify-center gap-2 px-8 py-4 text-white bg-slate-900 rounded-xl font-bold hover:bg-slate-800 transition"
              >
                <MapPin size={20} /> Buka Peta
              </Link>
              <Link 
                href="/admin" 
                className="flex items-center justify-center gap-2 px-8 py-4 text-slate-700 bg-slate-100 rounded-xl font-bold hover:bg-slate-200 transition"
              >
                Login Admin <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Visual Hook (Gambar Peta) */}
          <div className="relative group animate-in slide-in-from-right duration-700 delay-200">
            {/* Decorative BG Blur */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 aspect-[4/3]">
              {/* --- PENTING: Ganti src gambar ini dengan screenshot peta kamu --- */}
              {/* Simpan screenshot peta (image_a80c7d.png) ke folder 'public' dengan nama 'map-preview.png' */}
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                 {/* Jika sudah ada gambar, uncomment baris di bawah ini */}
                 {/* <Image src="/map-preview.png" alt="Preview Peta Blitar" fill className="object-cover" /> */}
                 
                 {/* Placeholder jika gambar belum diset */}
                 <div className="text-center">
                    <Globe className="w-16 h-16 mx-auto mb-2 opacity-50"/>
                    <p className="text-sm">Letakkan screenshot peta di sini</p>
                 </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Lokasi Terdata</p>
                    <p className="text-xl font-extrabold text-slate-900">100+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- KATEGORI SECTION --- */}
        <section id="categories" className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Kategori Data</h2>
              <p className="text-slate-600 mt-2">Data spasial dikelompokkan untuk memudahkan pencarian Anda.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card Hotel */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition">
                  <Building2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Hotel & Penginapan</h3>
                <p className="text-slate-500">Data lokasi akomodasi lengkap dengan informasi fasilitas untuk wisatawan.</p>
              </div>

              {/* Card Cafe */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group">
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition">
                  <Coffee size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cafe & Restoran</h3>
                <p className="text-slate-500">Tempat kuliner dan nongkrong populer yang tersebar di Kota Blitar.</p>
              </div>

              {/* Card Wisata */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group">
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition">
                  <Plane size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Destinasi Wisata</h3>
                <p className="text-slate-500">Objek wisata sejarah, alam, dan edukasi yang wajib dikunjungi.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA FOOTER --- */}
        <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
            {/* Pattern Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Kelola Data Spasial Lebih Mudah</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Sistem ini dirancang untuk membantu pemerintah dan masyarakat mengakses informasi geografis Kota Blitar secara transparan.
              </p>
              <Link href="/admin">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-indigo-900/50">
                  Akses Dashboard Admin
                </button>
              </Link>
            </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-6 text-center text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} GIS Kota Blitar. Dibuat dengan Next.js & Leaflet.</p>
      </footer>
    </div>
  );
}