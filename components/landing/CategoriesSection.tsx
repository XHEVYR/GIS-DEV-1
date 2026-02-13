import { Building2, Coffee, Plane } from "lucide-react";

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-20"
    >
      {/* Pattern Dot Halus */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] bg-size:[[20px_20px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block mb-3 px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Explore
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Kategori Destinasi
          </h2>
          <p className="text-slate-500 font-medium">
            Pilih kategori di bawah ini untuk melihat persebaran lokasi pada
            peta.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Hotel */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition duration-300 border border-slate-100 group cursor-default">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Building2 size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Hotel & Penginapan
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Temukan tempat istirahat terbaik yang nyaman dan strategis.
            </p>
          </div>

          {/* Cafe */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition duration-300 border border-slate-100 group cursor-default">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              <Coffee size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Cafe & Resto
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Tempat nongkrong hits dan kuliner lezat khas Blitar.
            </p>
          </div>

          {/* Wisata */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition duration-300 border border-slate-100 group cursor-default">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Plane size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Destinasi Wisata
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Jelajahi keindahan alam dan situs sejarah yang memukau.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
