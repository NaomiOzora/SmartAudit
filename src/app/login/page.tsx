"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { DEFAULT_USERS, saveSession } from "@/lib/auth";

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

      <main className="w-full flex-1 bg-slate-50 pt-20 pb-12 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Side: Brief Info & Fast Demo Access */}
              <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-medium">
                    <span className="material-symbols-outlined text-[14px]">security</span>
                    <span>Portal Audit Kas</span>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 inline-flex items-center justify-center text-white shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block leading-tight">
                        Smart<span className="text-blue-600">Audit</span>
                      </span>
                      <span className="text-xs text-slate-500 font-mono">v4.0 Enterprise</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    Sistem verifikasi kuitansi dan deteksi anomali pengeluaran kas berbasis AI dan integritas kriptografis.
                  </p>
                </div>

                {/* Instant Role Selector */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block mb-2 font-medium">
                    Pilih Akun Demo:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectRole("staff")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors inline-flex items-center justify-between text-xs border ${
                        role === "staff"
                          ? "bg-white border-blue-600 text-blue-900 font-semibold shadow-xs"
                          : "bg-white/80 hover:bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-[16px] shrink-0">
                          account_balance_wallet
                        </span>
                        <span>Staf Keuangan (Siti Rahma)</span>
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400 shrink-0">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole("auditor")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors inline-flex items-center justify-between text-xs border ${
                        role === "auditor"
                          ? "bg-white border-rose-600 text-rose-900 font-semibold shadow-xs"
                          : "bg-white/80 hover:bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-600 text-[16px] shrink-0">
                          policy
                        </span>
                        <span>Auditor Forensik (Bambang H.)</span>
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400 shrink-0">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="md:col-span-7 p-6 flex flex-col justify-between bg-white">
                <div>
                  <h1 className="text-base font-bold text-slate-900">
                    Masuk ke Sistem
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gunakan kredensial kedinasan untuk mengakses akun Anda
                  </p>

                  {/* Form Inputs */}
                  <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email Kedinasan
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-slate-400 pointer-events-none shrink-0">
                          badge
                        </span>
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full h-8.5 pl-8 pr-3 rounded-lg bg-slate-50/70 text-slate-900 placeholder:text-slate-400 text-xs border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:outline-none transition-all"
                          placeholder="nama@instansi.go.id"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-700">
                          Kata Sandi
                        </label>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-slate-400 pointer-events-none shrink-0">
                          key
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-8.5 pl-8 pr-8 rounded-lg bg-slate-50/70 text-slate-900 placeholder:text-slate-400 text-xs border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:outline-none transition-all font-mono"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 text-slate-400 hover:text-slate-600 inline-flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-600 accent-blue-600"
                        />
                        <span className="text-slate-600 text-xs">Ingat sesi saya</span>
                      </label>
                      <span className="text-xs text-slate-400 font-mono">
                        Peran: {role === "auditor" ? "Auditor" : "Staf"}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full h-8.5 mt-2 rounded-lg text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                        role === "auditor"
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] animate-spin shrink-0">
                            sync
                          </span>
                          <span>Memverifikasi...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px] shrink-0">
                            lock_open
                          </span>
                          <span>
                            Masuk sebagai {role === "auditor" ? "Auditor Forensik" : "Staf Keuangan"}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-5 pt-3 inline-flex items-center justify-center gap-1.5 text-slate-400 text-[11px] border-t border-slate-100">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600 shrink-0">
                    verified
                  </span>
                  <span>Jejak log diaudit secara aman & otomatis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
