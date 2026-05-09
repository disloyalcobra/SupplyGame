"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  
  // No mostrar el footer en la pantalla de juego para evitar distracciones y problemas de layout
  const fullScreenPaths = ["/game", "/hardcore", "/quiz"];
  if (fullScreenPaths.includes(pathname)) return null;

  return (
    <footer className="w-full py-12 border-t bg-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-medium text-sm">
        <div className="text-center md:text-left space-y-2">
          <p className="font-black text-slate-700 uppercase tracking-widest text-xs">
            Supply Chain Game &copy; 2026
          </p>
          <p className="text-xs">
            Versión v0.1.0 | Mayo 2025
          </p>
          <p className="text-xs">
            Desarrollado por <span className="text-[#cb0617] font-bold">José Pablo Mateos Gamboa</span>
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-6 uppercase tracking-widest text-[10px] font-black">
            <Link href="/terms" className="hover:text-[#cb0617] transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/privacy" className="hover:text-[#cb0617] transition-colors">
              Aviso de Privacidad
            </Link>
          </div>
          <img 
            src="/imagenes/CC_BY-NC-ND.svg.png" 
            alt="Creative Commons BY-NC-ND" 
            className="h-8 opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </footer>
  );
}
