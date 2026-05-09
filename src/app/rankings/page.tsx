"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Trophy, Medal, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { ALL_LEVELS } from "@/lib/levelData";

interface PlayerRecord {
  nombre: string;
  universidad: string;
  puntuacion: number;
  tiempo_total: number;
  fecha: string;
}

type Rankings = Record<string, PlayerRecord[]>;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
}

function getMedalColor(rank: number) {
  if (rank === 0) return { bg: "#FFD700", text: "#7A5C00", label: "🥇" };
  if (rank === 1) return { bg: "#C0C0C0", text: "#4A4A4A", label: "🥈" };
  if (rank === 2) return { bg: "#CD7F32", text: "#fff", label: "🥉" };
  return { bg: "#f4f4f4", text: "#647687", label: `#${rank + 1}` };
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Rankings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openLevel, setOpenLevel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "date">("score");

  useEffect(() => {
    fetch("/api/rankings")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setRankings(data.rankings);
          const firstKey = Object.keys(data.rankings)[0];
          if (firstKey) setOpenLevel(firstKey);
        }
      })
      .catch(() => setError("No se pudo conectar al servidor"))
      .finally(() => setLoading(false));
  }, []);

  // Build ordered list of level ids from ALL_LEVELS for display order
  const orderedLevels = ALL_LEVELS.map((l) => l.id).filter((id) => rankings[id]);
  // Also include any levels in rankings not in ALL_LEVELS
  Object.keys(rankings).forEach((k) => { if (!orderedLevels.includes(k)) orderedLevels.push(k); });

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#d4d4d4] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-[#747474] bg-white hover:bg-[#d4d4d4] transition-colors">
            <Home size={18} className="text-[#333333]" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#333333] uppercase tracking-tight flex items-center gap-2 justify-center">
              <Trophy size={22} className="text-[#FFD700]" />
              Rankings
            </h1>
            <p className="text-xs font-bold text-[#647687] uppercase tracking-widest">Mejores resultados por nivel</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Sort Filter */}
        {!loading && !error && orderedLevels.length > 0 && (
          <div className="flex items-center justify-center gap-2 bg-white p-1 rounded-2xl border-2 border-[#d4d4d4] w-fit mx-auto shadow-sm">
            <button
              onClick={() => setSortBy("score")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sortBy === "score" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
            >
              Mejor Score
            </button>
            <button
              onClick={() => setSortBy("date")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sortBy === "date" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
            >
              Más Recientes
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={40} className="animate-spin text-[#aa00ff]" />
            <p className="text-[#647687] font-bold uppercase tracking-widest text-sm">Cargando rankings…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-bold">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && orderedLevels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-6xl">🏁</span>
            <p className="text-[#647687] font-bold uppercase tracking-widest text-sm text-center">
              Aún no hay partidas registradas.<br />¡Sé el primero en completar un nivel!
            </p>
          </div>
        )}

        {!loading && orderedLevels.map((levelId) => {
          const level = ALL_LEVELS.find((l) => l.id === levelId);
          let records = rankings[levelId] ?? [];
          
          // Sort records based on current filter
          if (sortBy === "date") {
            records = [...records].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          } else {
            // Default sort: score desc, time asc
            records = [...records].sort((a, b) => {
              if (b.puntuacion !== a.puntuacion) return b.puntuacion - a.puntuacion;
              return a.tiempo_total - b.tiempo_total;
            });
          }

          const isOpen = openLevel === levelId;
          const isHardcore = levelId === "hardcore";
          const diffColor = isHardcore ? "#000000" :
            level?.difficulty?.includes("Básico") ? "#0ba15f" :
              level?.difficulty?.includes("Intermedio") ? "#e3c800" : "#cb0617";

          return (
            <motion.div
              key={levelId}
              layout
              className={`bg-white rounded-3xl border-2 ${isHardcore ? 'border-[#cb0617] shadow-[0_0_15px_rgba(203,6,23,0.1)]' : 'border-[#d4d4d4]'} overflow-hidden shadow-sm`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => setOpenLevel(isOpen ? null : levelId)}
                className={`w-full flex items-center justify-between p-6 text-left hover:bg-[#f4f4f4] transition-colors ${isHardcore ? 'bg-[#fff5f5]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-3 h-10 rounded-full"
                    style={{ backgroundColor: diffColor }}
                  />
                  <div>
                    <h2 className={`text-lg font-black uppercase ${isHardcore ? 'text-[#cb0617]' : 'text-[#333333]'}`}>
                      {isHardcore ? "🔥 Modo Hardcore" : (level?.name ?? levelId)}
                    </h2>
                    <p className="text-xs font-bold text-[#647687] uppercase tracking-widest">
                      {records.length} partida{records.length !== 1 ? "s" : ""}  · {isHardcore ? "Puntaje Acumulado" : level?.difficulty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {records[0] && (
                    <span className="hidden sm:flex items-center gap-1 bg-[#f4f4f4] border border-[#d4d4d4] rounded-xl px-3 py-1 text-sm font-bold text-[#333333]">
                      🏆 {records[0].puntuacion} pts
                    </span>
                  )}
                  {isOpen ? <ChevronUp size={20} className="text-[#647687]" /> : <ChevronDown size={20} className="text-[#647687]" />}
                </div>
              </button>

              {/* Leaderboard rows */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t-2 border-[#d4d4d4] divide-y divide-[#f4f4f4]"
                >
                  {records.length === 0 ? (
                    <p className="text-center text-[#647687] py-8 font-bold text-sm">Sin registros aún</p>
                  ) : (
                    records.slice(0, 10).map((rec, i) => {
                      const medal = getMedalColor(i);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f4] transition-colors"
                        >
                          {/* Rank badge */}
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                            style={{ backgroundColor: medal.bg, color: medal.text }}
                          >
                            {medal.label}
                          </div>

                          {/* Name and University */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#333333] truncate leading-tight">{rec.nombre}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{rec.universidad}</p>
                          </div>

                          {/* Date (hidden on mobile if too crowded) */}
                          <div className="hidden sm:block text-center shrink-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(rec.fecha)}</p>
                          </div>

                          {/* Score and Time */}
                          <div className="text-right shrink-0">
                            <p className="font-black text-[#333333] leading-tight">{rec.puntuacion.toLocaleString()} pts</p>
                            <p className="text-[10px] font-black text-[#647687] flex items-center gap-1 justify-end uppercase tracking-tighter">
                              <Clock size={11} className="text-slate-400" /> {formatTime(rec.tiempo_total)}
                            </p>
                          </div>

                          {/* Podium bar */}
                          {sortBy === "score" && i < 3 && (
                            <Medal size={18} style={{ color: medal.bg }} className="shrink-0" />
                          )}
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </main>
    </div>
  );
}
