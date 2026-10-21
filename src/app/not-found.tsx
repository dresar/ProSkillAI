import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="max-w-md space-y-4">
        <div className="font-mono text-3xl font-bold text-foreground">404</div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          Halaman Tidak Ditemukan / Page Not Found
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Halaman yang Anda tuju tidak tersedia, telah diarsipkan, atau tautan yang Anda ikuti salah.
        </p>
        <div className="pt-2">
          <Link
            href="/id"
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
