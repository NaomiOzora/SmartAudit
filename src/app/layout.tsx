import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartAudit - Sistem Deteksi Fraud Pengeluaran Kas",
  description:
    "Verifikasi kuitansi dan deteksi anomali pengeluaran kas berbasis AI dan aturan integritas audit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
