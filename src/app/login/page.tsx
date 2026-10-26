"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    }, 600);
  };

  return (
    <>
      <Navbar currentRole="GUEST" />

      <main className="w-full flex-1 bg-surface pt-20 pb-12 flex items-center justify-center px-4">
        <div className="relative w-full max-w-4xl flex flex-col items-center">
          {/* Ambient backdrops */}
          <div className="absolute -top-12 -left-12 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Main Container Card */}
          <div className="relative w-full bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-outline-variant/30">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Branding & Forensic Security Rail */}
              <div className="lg:col-span-5 bg-surface-container-low p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-outline-variant/30">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[16px]">security</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                      Akses Portal Terpadu
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">verified_user</span>
                    </div>
                    <div>
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight block">
                        Smart<span className="text-primary">Audit</span>
                      </span>
                      <span className="font-data-mono text-data-mono text-on-surface-variant text-[11px]">
                        v4.0 Enterprise Core
                      </span>
                    </div>
                  </div>

                  {/* Forensic Context Snippet */}
                  <div className="mt-6 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                        Status Validasi
                      </span>
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                        Siaga Aktif
                      </span>
                    </div>

                    <div className="mt-3">
                      <svg className="w-full h-12 text-primary" fill="none" viewBox="0 0 200 40">
                        <path
                          d="M0 30L35 28L65 14L95 24L125 8L155 18L185 6L200 12"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                        <path
                          d="M0 30L35 28L65 14L95 24L125 8L155 18L185 6L200 12V40H0Z"
                          fill="currentColor"
                          fillOpacity="0.08"
                        ></path>
                        <circle cx="125" cy="8" fill="#2563eb" r="3.5"></circle>
                        <circle cx="185" cy="6" fill="#004ac6" r="3.5"></circle>
                      </svg>
                    </div>

                    <p className="mt-2 font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                      Setiap aktivitas login terekam dalam hash audit log terenkripsi SHA-256 yang kebal modifikasi data.
                    </p>
                  </div>
                </div>

                {/* Quick Demo Switchers */}
                <div className="mt-8 pt-4 border-t border-outline-variant/30">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-2 font-semibold">
                    Akses Instan Demo (1-Klik)
                  </span>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectRole("staff")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between text-on-surface font-label-md text-label-md border ${
                        role === "staff"
                          ? "bg-surface-container-lowest border-primary shadow-sm font-semibold"
                          : "bg-surface-container-lowest hover:bg-surface-container border-outline-variant/30"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          account_balance_wallet
                        </span>
                        <span>Akun Demo Bendahara (Staf)</span>
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRole("auditor")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between text-on-surface font-label-md text-label-md border ${
                        role === "auditor"
                          ? "bg-surface-container-lowest border-tertiary shadow-sm font-semibold"
                          : "bg-surface-container-lowest hover:bg-surface-container border-outline-variant/30"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">
                          policy
                        </span>
                        <span>Akun Demo Auditor Forensik</span>
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Main Interactive Form Panel */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-surface-container-lowest">
                <div>
                  {/* Header Titles */}
                  <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface text-[24px] font-bold">
                      Selamat Datang di SmartAudit
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Pilih peran otorisasi Anda untuk melanjutkan verifikasi sistem
                    </p>
                  </div>

                  {/* Role Selector Segmented Cards */}
                  <div className="mt-6">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-2 font-semibold">
                      Pilih Otorisasi Pengguna
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Role Card 1: Staf Keuangan */}
                      <button
                        type="button"
                        onClick={() => handleSelectRole("staff")}
                        className={`text-left p-4 rounded-xl transition-all flex flex-col justify-between border ${
                          role === "staff"
                            ? "bg-surface-container-high border-primary ring-2 ring-primary/20 shadow-sm"
                            : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                role === "staff"
                                  ? "bg-primary text-on-primary"
                                  : "bg-surface-container text-on-surface"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                account_balance_wallet
                              </span>
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                role === "staff"
                                  ? "border-primary bg-primary"
                                  : "border-outline-variant bg-transparent"
                              }`}
                            >
                              {role === "staff" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-on-primary"></span>
                              )}
                            </span>
                          </div>
                          <div className="mt-3 font-headline-sm text-headline-sm text-on-surface font-semibold">
                            Staf Keuangan
                          </div>
                          <span className="font-label-sm text-label-sm text-secondary font-medium">
                            Bendahara Pengeluaran
                          </span>
                        </div>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-2 leading-relaxed">
                          Input rincian pengeluaran, unggah bukti nota & pantau status pencairan.
                        </p>
                      </button>

                      {/* Role Card 2: Auditor Forensik */}
                      <button
                        type="button"
                        onClick={() => handleSelectRole("auditor")}
                        className={`text-left p-4 rounded-xl transition-all flex flex-col justify-between border ${
                          role === "auditor"
                            ? "bg-surface-container-high border-tertiary ring-2 ring-tertiary/20 shadow-sm"
                            : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                role === "auditor"
                                  ? "bg-tertiary text-on-tertiary"
                                  : "bg-surface-container text-on-surface"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[18px]">policy</span>
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                role === "auditor"
                                  ? "border-tertiary bg-tertiary"
                                  : "border-outline-variant bg-transparent"
                              }`}
                            >
                              {role === "auditor" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary"></span>
                              )}
                            </span>
                          </div>
                          <div className="mt-3 font-headline-sm text-headline-sm text-on-surface font-semibold">
                            Auditor Forensik
                          </div>
                          <span className="font-label-sm text-label-sm text-tertiary font-medium">
                            Inspektorat & Verifikator
                          </span>
                        </div>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-2 leading-relaxed">
                          Investigasi anomali berisiko, verifikasi forensik OCR & putusan persetujuan.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    {/* Identifier */}
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
                        Email Kedinasan / NIP
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-on-surface-variant pointer-events-none flex items-center">
                          <span className="material-symbols-outlined text-[20px]">badge</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all border border-outline-variant/30"
                          placeholder="contoh: siti.rahma@instansi.go.id"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-label-md text-label-md text-on-surface font-semibold">
                          Kata Sandi
                        </label>
                        <a href="#" className="font-label-sm text-label-sm text-primary hover:underline font-semibold">
                          Lupa sandi?
                        </a>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-on-surface-variant pointer-events-none flex items-center">
                          <span className="material-symbols-outlined text-[20px]">key</span>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-10 pl-10 pr-10 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-data-mono text-data-mono focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all border border-outline-variant/30"
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-on-surface-variant hover:text-on-surface flex items-center"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Remember me & IP */}
                    <div className="flex items-center justify-between text-body-sm">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="text-on-surface-variant text-[13px]">
                          Ingat sesi saya selama 30 hari
                        </span>
                      </label>
                      <span className="font-data-mono text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                        IP: 180.252.12.98
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full h-11 mt-2 rounded-xl text-on-primary font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                        role === "auditor"
                          ? "bg-tertiary hover:bg-tertiary-container"
                          : "bg-primary hover:bg-primary-container"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined text-[20px] animate-spin">
                            sync
                          </span>
                          <span>Memverifikasi Otorisasi...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">lock_open</span>
                          <span>
                            Masuk Sebagai {role === "auditor" ? "Auditor Forensik" : "Staf Keuangan"}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Footer TLS Notice */}
                <div className="mt-6 pt-4 flex items-center justify-center gap-2 text-on-surface-variant border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                  <span className="font-label-sm text-label-sm text-center">
                    Dilindungi Enkripsi TLS 1.3 & Verifikasi Dua Langkah (2FA)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
