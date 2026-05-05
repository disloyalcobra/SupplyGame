"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Button } from "@/components/ui/button";
import {
  Timer,
  Trophy,
  AlertCircle,
  Flame,
  Zap,
  ChevronRight,
  Home,
  SkipForward,
} from "lucide-react";
import Link from "next/link";
import { type GameEdge } from "@/lib/levelData";
import { calculateScore } from "@/lib/gameLogic";
import { generateHardcoreLevel, type GeneratedLevel } from "@/lib/hardcoreGenerator";
import { useAuth } from "@/hooks/useAuth";

const TOTAL_TIME = 10 * 60; // 10 minutos en segundos

export default function HardcorePage() {
  const isAuth = useAuth();

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<GeneratedLevel | null>(null);
  const [levelNumber, setLevelNumber] = useState(1);

  // Tiempo y puntaje
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [totalScore, setTotalScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);

  // Estado del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [finalEdges, setFinalEdges] = useState<GameEdge[]>([]);

  // Racha (streak)
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);
  const levelStartTimeRef = useRef(0);

  // Generar primer nivel al montar
  useEffect(() => {
    const firstLevel = generateHardcoreLevel(1);
    setCurrentLevel(firstLevel);
    setIsLoaded(true);

    // Reproducir música de fondo para Hardcore
    if (typeof window !== "undefined") {
      const bgMusic = new Audio("/sonidos/bensound-erf.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.25; // Volumen de fondo
      bgMusic.play().catch(e => console.warn("Auto-play preventeds para bgMusic", e));

      return () => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      };
    }
  }, []);

  // Cuenta regresiva
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, timeLeft]);

  // Guardar en ranking al terminar
  useEffect(() => {
    if (!gameOver) return;
    const userIdStr = localStorage.getItem("user_id");
    if (!userIdStr) return;
    fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: parseInt(userIdStr, 10),
        nivel: "hardcore",
        puntuacion: totalScore,
        tiempo_total: TOTAL_TIME - timeLeft,
      }),
    }).catch(console.error);
  }, [gameOver]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timePercent = (timeLeft / TOTAL_TIME) * 100;
  const timeColor =
    timePercent > 50 ? "#0ba15f" : timePercent > 25 ? "#e3c800" : "#cb0617";

  const handleLevelComplete = useCallback(
    (edges: GameEdge[]) => {
      if (!currentLevel || levelComplete) return;
      setLevelComplete(true);
      setFinalEdges(edges);

      const timeSpent = Math.round(
        (Date.now() - levelStartTimeRef.current) / 1000
      );
      const score = calculateScore(currentLevel.nodes, edges, timeSpent, errors);
      const streakBonus = streakRef.current * 100;
      const finalLevelScore = score + streakBonus;

      setLevelScore(finalLevelScore);
      setTotalScore((s) => s + finalLevelScore);
      setLevelsCompleted((c) => c + 1);
      streakRef.current += 1;
      setStreak(streakRef.current);
    },
    [currentLevel, levelComplete, errors]
  );

  if (isAuth === null) return null;

  const handleNextLevel = () => {
    const nextNum = levelNumber + 1;
    const nextLevel = generateHardcoreLevel(nextNum, Date.now());
    setCurrentLevel(nextLevel);
    setLevelNumber(nextNum);
    setLevelScore(0);
    setErrors(0);
    setLevelComplete(false);
    setFinalEdges([]);
    levelStartTimeRef.current = Date.now();
  };

  const handleStart = () => {
    setGameStarted(true);
    levelStartTimeRef.current = Date.now();
  };

  if (!isLoaded || !currentLevel) return null;

  // ─── Pantalla de inicio ───
  if (!gameStarted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="text-center max-w-lg space-y-8"
        >
          <div className="text-8xl animate-pulse">🔥</div>
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-[#cb0617]">MODO HARDCORE</h1>
            <p className="text-xl text-slate-400">
              Niveles generados al azar. 10 minutos. Sin piedad.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: "⏱️", label: "10 Minutos" },
              { icon: "🔁", label: "Niveles ∞" },
              { icon: "🏆", label: "Score Máx" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm font-bold text-slate-300">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#cb0617]/10 border border-[#cb0617]/30 rounded-2xl p-4 text-left space-y-2">
            <p className="text-sm font-black text-[#cb0617] uppercase tracking-widest">Reglas</p>
            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
              <li>Cada nivel tiene fábricas, CEDIS y tiendas generados aleatoriamente.</li>
              <li>Completa niveles rápido para obtener más puntos y racha.</li>
              <li>+100 por racha acumulada al completar niveles seguidos.</li>
              <li>−50 por cada error de conexión.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleStart}
              className="h-16 text-xl font-black bg-[#cb0617] hover:bg-[#a00010] border-b-4 border-[#6b0009] text-white rounded-2xl"
            >
              <Flame size={24} className="mr-2" /> ¡Comenzar Hardcore!
            </Button>
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full text-slate-500 hover:text-white"
              >
                <Home size={16} className="mr-2" /> Volver al inicio
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Game Over ───
  if (gameOver) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="text-center max-w-md space-y-8"
        >
          <div className="text-7xl">💀</div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#cb0617]">TIEMPO AGOTADO</h1>
            <p className="text-slate-400">Aquí termina tu carrera logística.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Score Total", value: totalScore, icon: "🏆", color: "text-[#e3c800]" },
              { label: "Niveles", value: levelsCompleted, icon: "🔁", color: "text-[#0ba15f]" },
              { label: "Errores", value: totalErrors, icon: "❌", color: "text-[#cb0617]" },
              { label: "Racha Máx", value: streak, icon: "🔥", color: "text-orange-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl">{stat.icon}</div>
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="h-14 text-lg font-black bg-[#cb0617] hover:bg-[#a00010] border-b-4 border-[#6b0009] text-white rounded-2xl"
            >
              <Flame size={20} className="mr-2" /> Intentar de Nuevo
            </Button>
            <Link href="/rankings">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-white/20 text-slate-400 hover:text-white"
              >
                <Trophy size={16} className="mr-2" /> Ver Rankings
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full text-slate-600 hover:text-white"
              >
                <Home size={16} className="mr-2" /> Inicio
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Juego activo ───
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#0a0a0a]">
      {/* HUD Hardcore */}
      <header className="shrink-0 bg-[#111111] border-b-2 border-[#cb0617]/40 px-4 py-2 flex items-center justify-between z-10">
        {/* Izquierda: info nivel */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl">
              <Home size={18} />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setGameOver(true)}
            className="border-[#cb0617]/50 text-[#cb0617] hover:bg-[#cb0617] hover:text-white hidden sm:flex h-9 rounded-xl"
          >
            Terminar y Guardar
          </Button>
          <div>
            <div className="flex items-center gap-1">
              <Flame size={14} className="text-[#cb0617]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#cb0617]">
                Hardcore
              </span>
            </div>
            <p className="text-sm font-black text-white leading-tight">
              Nivel #{levelNumber}{" "}
              <span className="text-slate-500 font-medium">— Generado</span>
            </p>
          </div>
        </div>

        {/* Centro: Cronómetro regresivo */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="text-3xl font-black tabular-nums transition-colors"
            style={{ color: timeColor }}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timePercent}%`, background: timeColor }}
            />
          </div>
        </div>

        {/* Derecha: Score y stats */}
        <div className="flex items-center gap-4">
          {/* Racha */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 rounded-xl border border-orange-500/30">
              <Flame size={14} className="text-orange-400" />
              <span className="font-black text-orange-400 text-sm">×{streak}</span>
            </div>
          )}
          {/* Niveles completados */}
          <div className="flex items-center gap-1.5 text-[#0ba15f]">
            <Zap size={16} />
            <span className="font-black tabular-nums">{levelsCompleted}</span>
          </div>
          {/* Score total */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e3c800]/20 rounded-xl border border-[#e3c800]/30">
            <Trophy size={16} className="text-[#e3c800]" />
            <span className="font-black text-[#e3c800] text-xl tabular-nums">{totalScore}</span>
          </div>
          {/* Errores */}
          <div className="flex items-center gap-1.5 text-red-400">
            <AlertCircle size={16} />
            <span className="font-black">{errors}</span>
          </div>
        </div>
      </header>

      {/* Objetivo */}
      <div className="shrink-0 bg-[#1a0a0a] border-b border-[#cb0617]/20 px-6 py-2">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="font-black text-[#cb0617]">Objetivo: </span>
          {currentLevel.objective}
        </p>
      </div>

      {/* Canvas — key fuerza remount completo al cambiar nivel */}
      <main className="flex-1 relative overflow-hidden">
        <GameCanvas
          key={currentLevel.id}
          nodes={currentLevel.nodes}
          onScoreChange={(delta) => setLevelScore((s) => Math.max(0, s + delta))}
          onError={() => {
            setErrors((e) => e + 1);
            setTotalErrors((e) => e + 1);
          }}
          onLevelComplete={handleLevelComplete}
        />
      </main>

      {/* Modal nivel completado */}
      <AnimatePresence>
        {levelComplete && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-[#111] border-2 border-[#cb0617]/40 rounded-3xl p-10 text-center max-w-sm shadow-2xl"
            >
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-3xl font-black text-white mb-1">
                ¡Nivel Completado!
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Nivel #{levelNumber} resuelto. ¡Sigue adelante!
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <div className="text-2xl font-black text-[#e3c800]">+{levelScore}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Puntos</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <div className="text-2xl font-black text-orange-400">🔥 ×{streak}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Racha</div>
                </div>
              </div>

              <div className="space-y-2 mb-2">
                <div className="text-xs text-slate-400">Score total acumulado</div>
                <div className="text-5xl font-black text-[#e3c800]">{totalScore}</div>
              </div>

              <div className="text-xs text-slate-600 mb-6">
                ⏱️ {formatTime(timeLeft)} restantes
              </div>

              <Button
                onClick={handleNextLevel}
                className="w-full h-14 text-lg font-black bg-[#cb0617] hover:bg-[#a00010] border-b-4 border-[#6b0009] text-white rounded-2xl"
              >
                Siguiente Nivel <ChevronRight size={20} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
