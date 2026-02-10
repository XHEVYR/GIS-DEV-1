"use client";

import { signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Rocket, Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // LOGIKA AUTH
  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Username atau Password Salah!");
        setLoading(false);
      } else if (res?.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Gagal menghubungi server.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error Catch:", err);
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/*  BAGIAN KIRI  */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center text-white p-12 overflow-hidden">
        {/* Background Gradient & Partikel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-lime-900/40 via-slate-900 to-slate-900"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-lime-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl"></div>

        {/* Konten Branding */}
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          {/* Roket */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 bg-lime-400/20 rounded-full blur-3xl animate-pulse"></div>
            <Globe
              className="w-32 h-32 text-slate-700 absolute bottom-0 left-1/2 -translate-x-1/2 opacity-50"
              strokeWidth={1}
            />
            <Rocket
              className="w-40 h-40 text-lime-400 absolute bottom-4 left-1/2 -translate-x-1/2 -rotate-12 drop-shadow-[0_10px_10px_rgba(163,230,53,0.3)] animate-in slide-in-from-bottom-10 duration-1000"
              strokeWidth={1.5}
              fill="currentColor"
            />
            <MapPin
              className="w-12 h-12 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce"
              fill="#84cc16"
            />
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            GIS Kawa<span className="text-lime-400">san Blitar</span>
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Selamat datang di portal administrasi. Kelola data spasial dan
            pemetaan digital kawasan Blitar dengan mudah dan cepat.
          </p>
        </div>

        {/* Gelombang Awan */}
        <svg
          className="absolute top-0 right-0 h-full w-full text-white fill-current md:h-full lg:h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C30,20 50,50 70,100 L100,100 L100,0 Z"
            fill="white"
          ></path>
          <path
            d="M0,0 C30,20 50,50 68,100 L70,100 C50,50 30,20 0,0 Z"
            fill="#f1f5f9"
            opacity="0.5"
          ></path>{" "}
          {/* Layer bayangan halus */}
        </svg>
      </div>

      {/*  BAGIAN KANAN  */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Header Form */}
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden inline-flex items-center justify-center p-3 bg-lime-100 rounded-2xl mb-4">
              <MapPin className="text-lime-600 w-8 h-8" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              USER LOGIN
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Silakan masuk untuk mengakses dashboard.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 text-sm font-medium animate-shake">
              <div className="flex items-center gap-2">
                ⚠️ <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="Username"
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="Password"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-lime-600 focus:ring-lime-500 cursor-pointer" />
                    <span className="text-slate-500 font-medium group-hover:text-slate-700 transition">Ingat Saya</span>
                </label>
                <a href="#" className="font-bold text-lime-600 hover:text-lime-700 transition">Lupa Password?</a>
            </div> */}

            <button
              disabled={loading}
              className="w-full bg-lime-500 text-white py-4 rounded-2xl font-extrabold text-lg hover:bg-lime-600 active:scale-[0.98] transition-all shadow-xl shadow-lime-500/30 hover:shadow-lime-500/50 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Memproses...
                </>
              ) : (
                "MASUK SEKARANG"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-slate-500 hover:text-lime-600 font-bold transition group py-2"
            >
              <ArrowLeft
                size={18}
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              />
              Kembali ke Peta Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
