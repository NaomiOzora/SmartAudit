"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { saveSession } from "@/lib/auth";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertTriangle,
  User,
  KeyRound,
  Building,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Silakan masukkan NIP atau Email kedinasan Anda.");
      return;
    }

    if (!password) {
      setErrorMessage("Silakan masukkan kata sandi Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Gagal masuk ke sistem. Periksa kembali NIP/Email Anda.");
        setIsLoading(false);
        return;
      }

      // Simpan session akun sesuai database
      saveSession(data.user);

      // Parsialisasi rute sesuai peran yang terdaftar di database
      if (data.user.role === "AUDITOR") {
        router.push("/antrean-review");
      } else {
        router.push("/beranda-staf");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setErrorMessage("Terjadi kendala koneksi ke server. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50 pt-20 pb-16 flex items-center justify-center px-4 sm:px-6 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Side: Light, Pleasant & Informative Branding */}
              <div className="md:col-span-5 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/50 p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/80">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    <span>Portal Autentikasi Pegawai</span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 inline-flex items-center justify-center text-white shadow-sm shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xl font-bold tracking-tight block leading-tight text-slate-900">
                        Smart<span className="text-blue-600">Audit</span>
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Enterprise v4.0</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Sistem Otomasi Audit Kas & Deteksi Fraud Dokumen berbasis AI Vision & Perceptual Hashing.
                  </p>

                  <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Satuan Audit Penjamin Keuangan sebagai pengawas independen</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Partisi data pengajuan per 9 departemen operasional</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Inspeksi bukti fisik faktur & integritas kriptografis SHA-256</span>
                    </div>
                  </div>
                </div>

                {/* Informasi Kepatuhan Akses (Manual Input Wajib) */}
                <div className="mt-8 pt-5 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold mb-1">
                    <Building className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Autentikasi Kedinasan</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Akses dibatasi hanya bagi pegawai aktif yang terdaftar di pangkalan data kepegawaian. Silakan masukkan NIP atau Email serta Kata Sandi secara manual.
                  </p>
                </div>
              </div>

              {/* Right Side: Form Login Bersih & Ringan */}
              <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Masuk ke Sistem
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Gunakan NIP atau Email instansi yang terdaftar di database
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* NIP / Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      NIP atau Email Kedinasan
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Contoh: 19840212 atau bambang.h@instansi.go.id"
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50/70 text-slate-900 text-sm border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        Kata Sandi Kedinasan
                      </label>
                      <span className="text-[11px] text-blue-600 font-medium hover:underline cursor-pointer">
                        Lupa sandi?
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50/70 text-slate-900 text-sm border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Masuk ke Ruang Kerja</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    <span>Terverifikasi Database Kepegawaian</span>
                  </div>
                  <span className="text-[11px] font-mono">TLS 1.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
