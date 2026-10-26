"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { DEFAULT_USERS, saveSession } from "@/lib/auth";
import {
  ShieldCheck,
  Wallet,
  FileCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"staff" | "auditor">("staff");
  const [identifier, setIdentifier] = useState("siti.rahma@instansi.go.id");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (selectedRole: "staff" | "auditor") => {
    setRole(selectedRole);
    if (selectedRole === "staff") {
      setIdentifier("siti.rahma@instansi.go.id");
    } else {
      setIdentifier("bambang.h@instansi.go.id");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userSession = role === "auditor" ? DEFAULT_USERS.AUDITOR : DEFAULT_USERS.STAFF;
    saveSession(userSession);

    setTimeout(() => {
      setIsLoading(false);
      if (role === "auditor") {
        router.push("/antrean-review");
      } else {
        router.push("/beranda-staf");
      }
    }, 150);
  };

  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-slate-50 pt-24 pb-16 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Side: Brief Info & Fast Demo Access */}
              <div className="md:col-span-5 bg-slate-50/80 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Portal Audit Pengeluaran Kas</span>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 inline-flex items-center justify-center text-white shadow-xs shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-slate-900 block leading-tight">
                        Smart<span className="text-blue-600">Audit</span>
                      </span>
                      <span className="text-xs text-slate-500 font-mono">v4.0 Enterprise</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    Sistem otomasi audit forensik pengeluaran kas dengan perlindungan jejak digital SHA-256 yang kebal manipulasi data.
                  </p>
                </div>

                {/* Instant Role Selector */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block mb-3 font-semibold">
                    Akses Instan Demo (1-Klik):
                  </span>
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSelectRole("staff")}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all inline-flex items-center justify-between text-sm border ${
                        role === "staff"
                          ? "bg-white border-blue-600 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-600"
                          : "bg-white/80 hover:bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Staf Keuangan (Siti Rahma)</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole("auditor")}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all inline-flex items-center justify-between text-sm border ${
                        role === "auditor"
                          ? "bg-white border-rose-600 text-rose-900 font-semibold shadow-xs ring-1 ring-rose-600"
                          : "bg-white/80 hover:bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <FileCheck className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Auditor Forensik (Bambang H.)</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="md:col-span-7 p-8 flex flex-col justify-between bg-white">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Masuk ke Sistem
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Gunakan kredensial kedinasan untuk mengakses akun Anda
                  </p>

                  {/* Form Inputs */}
                  <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email Kedinasan
                      </label>
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                        placeholder="nama@instansi.go.id"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">
                          Kata Sandi
                        </label>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all font-mono"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 inline-flex items-center justify-center"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-600 accent-blue-600"
                        />
                        <span className="text-slate-600 text-sm">Ingat sesi saya</span>
                      </label>
                      <span className="text-xs text-slate-500 font-mono">
                        Peran: <strong>{role === "auditor" ? "Auditor Forensik" : "Staf Keuangan"}</strong>
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full h-11 mt-3 rounded-lg text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-xs ${
                        role === "auditor"
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isLoading ? (
                        <span>Memverifikasi...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            Masuk sebagai {role === "auditor" ? "Auditor Forensik" : "Staf Keuangan"}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-8 pt-4 inline-flex items-center justify-center gap-2 text-slate-400 text-xs border-t border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Jejak log diaudit secara aman & otomatis sesuai standar ISO 27001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
