"use client";

import Link from "next/link";
import { ALL_LEVELS } from "@/lib/levelData";
import { QUIZZES } from "@/lib/quizData";
import { Button } from "@/components/ui/button";
import { Home, PlayCircle, Star, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function LevelsPage() {
  const groupedLevels = {
    Básico: ALL_LEVELS.filter(l => l.difficulty === "🟢 Básico"),
    Intermedio: ALL_LEVELS.filter(l => l.difficulty === "🟡 Intermedio"),
    Avanzado: ALL_LEVELS.filter(l => l.difficulty === "🔴 Avanzado"),
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6 pb-20">
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-[#d4d4d4] bg-white shadow-sm border-2 border-[#747474]">
            <Home className="text-[#333333]" />
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#333333] tracking-tight uppercase">Misiones</h1>
          <p className="text-sm font-bold text-[#647687] uppercase tracking-widest">Selecciona tu desafío</p>
        </div>
        <Link href="/rankings">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#747474] hover:bg-[#d4d4d4] transition-colors shadow-sm cursor-pointer">
            <BarChart3 size={16} className="text-[#aa00ff]" />
            <span className="text-sm font-bold text-[#333333] hidden sm:block">Rankings</span>
          </div>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto space-y-16">
        {Object.entries(groupedLevels).map(([groupName, levels], index) => (
          <section key={groupName} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-sm border-b-4 ${
                groupName === "Básico" ? "bg-[#0ba15f] border-[#09804b]" :
                groupName === "Intermedio" ? "bg-[#e3c800] border-[#b5a000]" :
                "bg-[#cb0617] border-[#a20025]"
              }`}>
                {index + 1}
              </div>
              <h2 className="text-2xl font-black text-[#333333] uppercase tracking-wide">{groupName}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 pl-16">
              {levels.map((level) => (
                <Link href={`/game?id=${level.id}`} key={level.id}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-3xl p-6 border-2 border-[#d4d4d4] border-b-[6px] hover:border-[#aa00ff] cursor-pointer transition-colors group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#647687] bg-[#f4f4f4] px-2 py-1 rounded-md">
                          <Star size={12} className="text-[#e3c800]" /> Nivel {level.id.split("_")[1]}
                        </div>
                        <h3 className="text-xl font-bold text-[#333333] group-hover:text-[#aa00ff] transition-colors">
                          {level.name.split("—")[1]?.trim() || level.name}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#f4f4f4] flex items-center justify-center text-[#d4d4d4] group-hover:bg-[#aa00ff]/10 group-hover:text-[#aa00ff] transition-colors">
                        <PlayCircle size={24} />
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#647687] line-clamp-2 mb-4">
                      {level.objective}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {level.nodes.map(n => n.icon).filter((v, i, a) => a.indexOf(v) === i).map((icon, i) => (
                         <div key={i} className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-xs">
                           {icon}
                         </div>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Sección Modo Hardcore */}
        <section className="space-y-6 pt-8 border-t-4 border-dashed border-[#d4d4d4]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-sm border-b-4 bg-[#cb0617] border-[#6b0009]">
              🔥
            </div>
            <h2 className="text-2xl font-black text-[#333333] uppercase tracking-wide">Modo Especial</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 pl-16">
            <Link href="/hardcore">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-slate-900 rounded-3xl p-6 border-2 border-slate-800 border-b-[6px] hover:border-[#cb0617] cursor-pointer transition-colors group relative overflow-hidden text-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#cb0617] bg-[#cb0617]/10 px-2 py-1 rounded-md">
                      <Star size={12} className="text-[#cb0617]" /> 10 Minutos
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#cb0617] transition-colors">
                      Modo Hardcore (Procedural)
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-[#cb0617]/20 group-hover:text-[#cb0617] transition-colors">
                    <PlayCircle size={24} />
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  Niveles generados aleatoriamente. Resuelve la mayor cantidad posible antes de que se acabe el tiempo.
                </p>
                
                <div className="flex flex-wrap gap-2 text-2xl">
                  🏭 🚛 🛒 🏗️ 🙋
                </div>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Sección Quizzes Teóricos */}
        <section className="space-y-6 pt-8 border-t-4 border-dashed border-[#d4d4d4]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-sm border-b-4 bg-[#aa00ff] border-[#660099]">
              🧠
            </div>
            <h2 className="text-2xl font-black text-[#333333] uppercase tracking-wide">Quizzes Teóricos</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 pl-16">
            {QUIZZES.map((quiz, index) => (
              <Link href={`/quiz?id=${quiz.id}`} key={quiz.id}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-3xl p-6 border-2 border-[#d4d4d4] border-b-[6px] hover:border-[#aa00ff] cursor-pointer transition-colors group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#647687] bg-[#f4f4f4] px-2 py-1 rounded-md">
                        <Star size={12} className="text-[#aa00ff]" /> Quiz {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-[#333333] group-hover:text-[#aa00ff] transition-colors pr-2">
                        {quiz.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#f4f4f4] flex items-center justify-center text-[#d4d4d4] group-hover:bg-[#aa00ff]/10 group-hover:text-[#aa00ff] transition-colors">
                      <PlayCircle size={24} />
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#647687] line-clamp-2 mb-4">
                    Demuestra tus conocimientos en este quiz de {quiz.questions.length} preguntas. ¡Cada acierto suma puntos al ranking!
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-2xl">
                    {quiz.icon}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
