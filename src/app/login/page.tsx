"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"staff" | "auditor">("staff");
  const [identifier, setIdentifier] = useState("siti.rahma@instansi.go.id");
  const [password, setPassword] = useState("forensicPass2025");
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

    setTimeout(() => {
      setIsLoading(false);
      if (role === "auditor") {
        router.push("/antrean-review");
      } else {
        router.push("/beranda-staf");
      }
    }, 400);
  };

  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-slate-50/70 pt-20 pb-12 flex items-center justify-center px-4">
        <div className="relative w-full max-w-3xl flex flex-col items-center">
          {/* Main Card */}
          <div className="relative w-full bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Side Rail */}
              <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                    <span className="material-symbols-outlined text-[14px]">security</span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold">
                      Akses Portal Terpadu
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div>
                      <span className="text-[15px] font-bold text-slate-900 tracking-tight block">
                        Smart<span className="text-blue-600">Audit</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-data-mono">
                        v4.0 Enterprise
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-[12px] text-slate-600 leading-relaxed">
                    Sistem otomasi audit forensik pengeluaran kas dengan perlindungan jejak digital SHA-256 yang kebal manipulasi data.
                  </p>
                </div>

                {/* Instant Demo Switchers */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2 font-semibold">
                    Akses Instan Demo (1-Klik):
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectRole("staff")}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between text-[12px] border ${
                        role === "staff"
                          ? "bg-white border-blue-600 text-blue-900 font-semibold shadow-xs"
                          : "bg-white/80 hover:bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-blue-600 text-[16px]">
                          account_balance_wallet
                        </span>
                        <span>Akun Demo Bendahara (Staf)</span>
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole("auditor")}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between text-[12px] border ${
                        role === "auditor"
                          ? "bg-white border-rose-600 text-rose-900 font-semibold shadow-xs"
                          : "bg-white/80 hover:bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-rose-600 text-[16px]">
                          policy
                        </span>
                        <span>Akun Demo Auditor Forensik</span>
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="md:col-span-7 p-6 flex flex-col justify-between bg-white">
                <div>
                  <h1 className="text-[18px] font-bold text-slate-900">
                    Masuk ke Sistem SmartAudit
                  </h1>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    Pilih peran otorisasi untuk memulai proses verifikasi
                  </p>

                  {/* Role Selector Segmented Cards */}
                  <div className="mt-4">
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1.5 font-semibold">
                      Otorisasi Pengguna:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectRole("staff")}
                        className={`text-left p-3 rounded-lg transition-all flex flex-col justify-between border ${
                          role === "staff"
                            ? "bg-blue-50/60 border-blue-600 ring-1 ring-blue-600"
                            : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="material-symbols-outlined text-[18px] text-blue-600">
                            account_balance_wallet
                          </span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                              role === "staff" ? "border-blue-600 bg-blue-600" : "border-slate-300"
                            }`}
                          >
                            {role === "staff" && <span className="w-1 h-1 rounded-full bg-white"></span>}
                          </span>
                        </div>
                        <div className="mt-2 text-[13px] font-semibold text-slate-900">Staf Keuangan</div>
                        <div className="text-[11px] text-slate-500">Bendahara Pengeluaran</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectRole("auditor")}
                        className={`text-left p-3 rounded-lg transition-all flex flex-col justify-between border ${
                          role === "auditor"
                            ? "bg-rose-50/60 border-rose-600 ring-1 ring-rose-600"
                            : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="material-symbols-outlined text-[18px] text-rose-600">
                            policy
                          </span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                              role === "auditor" ? "border-rose-600 bg-rose-600" : "border-slate-300"
                            }`}
                          >
                            {role === "auditor" && <span className="w-1 h-1 rounded-full bg-white"></span>}
                          </span>
                        </div>
                        <div className="mt-2 text-[13px] font-semibold text-slate-900">Auditor Forensik</div>
                        <div className="text-[11px] text-slate-500">Inspektorat & Verifikasi</div>
                      </button>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                    <div>
                      <label className="block text-[12px] font-medium text-slate-700 mb-1">
                        Email Kedinasan / NIP
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-2.5 text-[17px] text-slate-400 pointer-events-none">
                          badge
                        </span>
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full h-9 pl-8 pr-3 rounded-lg bg-slate-50/60 text-slate-900 placeholder:text-slate-400 text-[13px] border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:outline-none transition-all"
                          placeholder="nama@instansi.go.id"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[12px] font-medium text-slate-700">
                          Kata Sandi
                        </label>
                        <a href="#" className="text-[11px] text-blue-600 hover:underline">
                          Lupa sandi?
                        </a>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-2.5 text-[17px] text-slate-400 pointer-events-none">
                          key
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-9 pl-8 pr-8 rounded-lg bg-slate-50/60 text-slate-900 placeholder:text-slate-400 text-[13px] border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:outline-none transition-all font-data-mono"
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 text-slate-400 hover:text-slate-600 flex items-center"
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[12px]">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-600 accent-blue-600"
                        />
                        <span className="text-slate-600 text-[12px]">Ingat sesi selama 30 hari</span>
                      </label>
                      <span className="font-data-mono text-[11px] text-slate-400">
                        IP: 180.252.12.98
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full h-9 mt-1 rounded-lg text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        role === "auditor"
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined text-[17px] animate-spin">
                            sync
                          </span>
                          <span>Memverifikasi Sesi...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[17px]">lock_open</span>
                          <span>
                            Masuk Sebagai {role === "auditor" ? "Auditor Forensik" : "Staf Keuangan"}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] border-t border-slate-100">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                  <span>Dilindungi Enkripsi TLS 1.3 & Audit Jejak Kriptografis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
