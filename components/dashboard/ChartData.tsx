"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ChartDataProps {
  data: {
    hotel: number;
    cafe: number;
    wisata: number;
  };
}

export default function ChartData({ data }: ChartDataProps) {
  // Format data untuk Bar Chart
  const barData = [
    { name: "Hotel", total: data.hotel, color: "#65a30d" },
    { name: "Cafe", total: data.cafe, color: "#16a34a" },
    { name: "Wisata", total: data.wisata, color: "#0d9488" },
  ];

  // Format data untuk Pie Chart
  const pieData = [
    { name: "Hotel", value: data.hotel },
    { name: "Cafe", value: data.cafe },
    { name: "Wisata", value: data.wisata },
  ];

  const COLORS = ["#65a30d", "#16a34a", "#0d9488"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 w-full">
      {/* 1. BAR CHART - PERBANDINGAN JUMLAH */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Perbandingan Kategori
        </h3>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={50}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. PIE CHART - DISTRIBUSI PERSENTASE */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Penyebaran Lokasi (%)
        </h3>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
