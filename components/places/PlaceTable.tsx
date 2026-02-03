"use client";

import { Info } from "lucide-react";
import { Place } from "@/types";
import ActionButtons from "./ActionButtons";

interface PlaceTableProps {
  data: Place[];
  onEdit: (place: Place) => void;
  onDelete: (id: string, name: string) => void;
}

export default function PlaceTable({
  data,
  onEdit,
  onDelete,
}: PlaceTableProps) {
  if (data.length === 0) {
    return (
      <div className="p-20 text-center text-slate-500 bg-white rounded-[32px] border border-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-slate-50 rounded-full">
            <Info size={32} className="text-slate-300" />
          </div>
          <p className="font-bold text-lg text-slate-400">Data tidak ditemukan.</p>
          <p className="text-sm text-slate-400">Coba gunakan kata kunci pencarian lain.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* PENTING: 
        1. 'table-fixed' memastikan lebar kolom terkunci.
        2. 'min-w-[1000px]' mencegah tabel gepeng di layar kecil.
      */}
      <table className="w-full text-left table-fixed min-w-[1000px] border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-100">
            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[25%]">
              Nama Tempat
            </th>
            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">
              Kategori
            </th>
            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">
              Koordinat
            </th>
            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[30%]">
              Alamat
            </th>
            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%] text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((place) => (
            <tr key={place.id} className="group hover:bg-indigo-50/30 transition-colors duration-200">
              <td className="p-5">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 truncate group-hover:text-indigo-900 transition-colors">
                    {place.name}
                  </span>
                  {place.image && (
                    <span className="w-fit mt-1.5 text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black tracking-tighter border border-emerald-200">
                      DENGAN FOTO
                    </span>
                  )}
                </div>
              </td>
              
              <td className="p-5">
                <span
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg border tracking-wide inline-block ${
                    place.category === "wisata"
                      ? "bg-purple-50 text-purple-700 border-purple-100"
                      : place.category === "hotel"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-orange-50 text-orange-700 border-orange-100"
                  }`}
                >
                  {place.category.toUpperCase()}
                </span>
              </td>

              <td className="p-5 font-mono text-[11px] text-slate-400 leading-relaxed">
                <span className="block">{Number(place.lat).toFixed(6)}</span>
                <span className="block">{Number(place.lon).toFixed(6)}</span>
              </td>

              <td className="p-5 text-slate-500 text-sm italic">
                {/* line-clamp-2 menjaga alamat tetap rapi maksimal 2 baris */}
                <p className="line-clamp-2 leading-relaxed">
                  {place.address || "-"}
                </p>
              </td>

              <td className="p-5 text-center">
                <ActionButtons
                  name={place.name}
                  onEdit={() => onEdit(place)}
                  onDelete={() => onDelete(place.id, place.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}