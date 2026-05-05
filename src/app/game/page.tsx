"use client";

import { useState, useEffect } from "react";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Button } from "@/components/ui/button";
import { Timer, Trophy, AlertCircle, Home, ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { BASIC_1, type Level, type GameEdge, getLevelById, ALL_LEVELS } from "@/lib/levelData";
import { calculateScore } from "@/lib/gameLogic";
import { motion, AnimatePresence } from "framer-motion";

export default function GamePage() {
  const [level, setLevel] = useState<Level>(BASIC_1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    // Read level ID from URL on client side to avoid hydration mismatch
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setLevel(getLevelById(id));
    }
    setIsLoaded(true);

    // Reproducir música de fondo para niveles normales
    if (typeof window !== "undefined") {
      const bgMusic = new Audio("/sonidos/Inspired.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.25; // Volumen de fondo
      bgMusic.play().catch(e => {
        if (e.name !== "AbortError") console.warn("Auto-play prevented", e);
      });

      return () => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      };
    }
  }, []);

  useEffect(() => {
    if (isComplete || !isLoaded) return;
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete, isLoaded]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLevelComplete = async (finalEdges: GameEdge[]) => {
    const computed = calculateScore(level.nodes, finalEdges, time, errors);
    setFinalScore(computed);
    setIsComplete(true);

    const userIdStr = localStorage.getItem("user_id");
    if (userIdStr) {
      try {
        await fetch("/api/game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(userIdStr, 10),
            nivel: level.id,
            puntuacion: computed,
            tiempo_total: time,
          }),
        });
        console.log("Partida guardada");
      } catch (error) {
        console.error("Error guardando partida:", error);
      }
    } else {
      console.warn("No user_id found in localStorage. Match not saved.");
    }
  };

  if (!isLoaded) return null;

  const currentLevelIndex = ALL_LEVELS.findIndex(l => l.id === level.id);
  const nextLevel = ALL_LEVELS[currentLevelIndex + 1];

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      {/* HUD */}
      <header className="bg-white border-b-4 border-slate-100 px-6 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/levels">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
              <List className="text-slate-400" />
            </Button>
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{level.difficulty}</p>
            <p className="text-sm font-black text-slate-700">{level.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Score */}
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border-2 border-primary/20">
            <Trophy className="text-primary" size={18} />
            <span className="font-black text-primary text-xl tabular-nums">{score}</span>
          </div>
          {/* Tiempo */}
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <Timer size={18} />
            <span className="tabular-nums">{formatTime(time)}</span>
          </div>
          {/* Errores */}
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertCircle size={18} />
            <span>{errors}</span>
          </div>
        </div>

        <div />
      </header>

      {/* Objetivo del nivel */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 shrink-0">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-700">Objetivo: </span>
          {level.objective}
        </p>
      </div>

      {/* Canvas */}
      <main className="flex-1 relative overflow-hidden">
        <GameCanvas
          nodes={level.nodes}
          onScoreChange={(delta) => setScore((s) => Math.max(0, s + delta))}
          onError={() => setErrors((e) => e + 1)}
          onLevelComplete={handleLevelComplete}
        />
      </main>

      {/* Modal de victoria */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl border-b-8 border-primary/60"
            >
              <div className="text-7xl mb-4">🏆</div>
              <h2 className="text-4xl font-black text-primary mb-2">¡Nivel Completado!</h2>
              <p className="text-slate-500 mb-6">Toda la demanda fue satisfecha exitosamente.</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4 border-b-4 border-slate-200">
                  <div className="text-2xl font-black text-primary">{finalScore}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border-b-4 border-slate-200">
                  <div className="text-2xl font-black text-secondary">{formatTime(time)}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border-b-4 border-slate-200">
                  <div className="text-2xl font-black text-red-400">{errors}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Errores</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {nextLevel ? (
                  <Button 
                    className="btn-duo btn-duo-primary w-full h-14 text-lg"
                    onClick={() => {
                      window.location.href = `/game?id=${nextLevel.id}`;
                    }}
                  >
                    Siguiente Nivel <ChevronRight size={20} />
                  </Button>
                ) : (
                  <Button 
                    className="btn-duo btn-duo-primary w-full h-14 text-lg"
                    onClick={() => {
                      window.location.href = `/levels`;
                    }}
                  >
                    Volver a Misiones
                  </Button>
                )}
                <Link href="/levels">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 text-slate-500">
                    Elegir otro nivel
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
