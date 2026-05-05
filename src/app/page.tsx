"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RegistrationModal } from "@/components/RegistrationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, GraduationCap, PlayCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link"

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegister = (data: { user_id: number }) => {
    console.log("Registrado con ID:", data.user_id);
    localStorage.setItem("user_id", data.user_id.toString());
    setIsModalOpen(false);
    // Redirigir al selector de niveles
    window.location.href = "/levels";
  };

  return (
    <main className="flex flex-col items-center">
      {/* 1. Hero Section */}
      <section className="w-full max-w-5xl px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-6 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-black text-[#cb0617] tracking-tight">
            SUPPLY CHAIN <br /> GAME
          </h1>
          <p className="text-xl md:text-2xl text-[#647687] font-medium max-w-lg">
            Aprende, compite y domina la cadena de suministro con el simulador más divertido.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button onClick={() => setIsModalOpen(true)} className="btn-duo btn-duo-primary h-14 px-8 text-lg">
              Jugar Ahora
            </Button>
            <Link href="/rankings">
              <Button variant="outline" className="btn-duo h-14 px-8 text-lg border-2 border-slate-200 text-slate-500">
                Ranking
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative w-full flex items-center justify-center">
            <img
              src="/imagenes/HomeImage.jpg"
              alt="Ilustración Supply Chain"
              className="w-full max-w-lg h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. ¿Qué es la cadena de suministro? */}
      <section className="w-full bg-[#d4d4d4] py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">¿Qué es la cadena de suministro?</h2>
            <p className="text-xl text-[#647687]">Imagina que quieres vender limonada...</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Origen", desc: "Consigues los limones y el azúcar de la granja.", icon: "🍋" },
              { title: "Transporte", desc: "Llevas los limones a tu puesto de limonada.", icon: "🚚" },
              { title: "Destino", desc: "Vendes la limonada fresca a tus clientes.", icon: "🥤" },
            ].map((item, i) => (
              <Card key={i} className="border-b-4 border-[#747474] rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-transform">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="text-xl font-bold uppercase tracking-wide">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ¿Qué vas a aprender? */}
      <section className="w-full py-20 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#aa00ff]/20 text-[#aa00ff] rounded-full font-bold uppercase text-xs tracking-widest">
              <GraduationCap size={16} /> Objetivos Académicos
            </div>
            <h2 className="text-4xl font-bold">Domina la logística como un profesional</h2>
            <ul className="space-y-6">
              {[
                "Optimización de rutas y tiempos.",
                "Gestión de inventarios y capacidades.",
                "Toma de decisiones bajo presión.",
                "Identificación de cuellos de botella."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4 text-lg text-[#647687]">
                  <div className="mt-1 text-[#cb0617]"><CheckCircle2 size={24} /></div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-slate-50 rounded-3xl p-8 border-2 border-slate-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-bold text-slate-400 uppercase text-xs">
                <span>Progreso de aprendizaje</span>
                <span>75%</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl border-b-4 border-slate-200 text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-slate-400 uppercase font-bold">Lecciones</div>
                </div>
                <div className="bg-white p-4 rounded-xl border-b-4 border-slate-200 text-center">
                  <div className="text-2xl font-bold">850</div>
                  <div className="text-xs text-slate-400 uppercase font-bold">XP Puntos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mini Tutorial Interactivo Demo */}
      <section className="w-full bg-slate-900 text-white py-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">¿Cómo se juega?</h2>
            <p className="text-slate-400 text-lg">Es simple: conecta los nodos y evita los errores.</p>
          </div>

          <div className="relative w-full aspect-[16/9] max-w-5xl bg-white/5 rounded-3xl border border-white/10 p-4 flex items-center justify-center">
            <video
              src="/Video/SupplyChain.mp4"
              controls        // agrega los controles de play/pausa, volumen, barra de progreso
              playsInline
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>



          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 max-w-lg text-center">
            <p className="text-slate-300 italic">"Aprendes en tiempo real. Si te equivocas, el sistema te guía."</p>
          </div>
        </div>
      </section>

      {/* 5. CTA Final - Botón Jugar */}
      <section className="w-full py-32 px-6 flex flex-col items-center gap-8">
        <h2 className="text-4xl md:text-5xl font-black text-center max-w-2xl">
          ¿Estás listo para el desafío?
        </h2>
        <Button onClick={() => setIsModalOpen(true)} className="btn-duo btn-duo-primary h-20 px-12 text-2xl">
          ¡Empezar a Jugar!
        </Button>
      </section>

      <footer className="w-full py-12 border-t text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
        Supply Chain Game &copy; 2026 | Proyecto Educativo
      </footer>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegister={handleRegister}
      />
    </main>
  );
}
