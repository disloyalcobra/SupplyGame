"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Trophy, AlertCircle, List, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getQuizById, type Quiz, type QuizOption } from "@/lib/quizData";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // Read level ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setQuiz(getQuizById(id) || null);
    }
    setIsLoaded(true);

    if (typeof window !== "undefined") {
      const bgMusic = new Audio("/sonidos/Inspired.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.25;
      bgMusic.play().catch(e => console.warn("Auto-play prevented", e));

      return () => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      };
    }
  }, []);

  // Timer
  useEffect(() => {
    if (isComplete || !isLoaded || !quiz) return;
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete, isLoaded, quiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOptionClick = (option: QuizOption) => {
    if (hasAnswered) return;
    
    setSelectedOption(option.id);
    setHasAnswered(true);

    if (option.isCorrect) {
      setScore((s) => s + 100);
      const winAudio = new Audio("/sonidos/popup.mp3");
      winAudio.volume = 0.5;
      winAudio.play().catch(() => {});
    } else {
      setScore((s) => Math.max(0, s - 50));
      setErrors((e) => e + 1);
      const errorAudio = new Audio("/sonidos/error.mp3");
      errorAudio.volume = 0.5;
      errorAudio.play().catch(() => {});
    }

    setTimeout(() => {
      if (!quiz) return;
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setHasAnswered(false);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = async () => {
    setIsComplete(true);
    const winAudio = new Audio("/sonidos/win.mp3");
    winAudio.volume = 0.5;
    winAudio.play().catch(() => {});

    if (!quiz) return;
    const userIdStr = localStorage.getItem("user_id");
    if (userIdStr) {
      try {
        await fetch("/api/game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: parseInt(userIdStr, 10),
            nivel: quiz.id,
            puntuacion: score, // The score calculated during the quiz
            tiempo_total: time,
          }),
        });
        console.log("Quiz guardado");
      } catch (error) {
        console.error("Error guardando quiz:", error);
      }
    }
  };

  if (!isLoaded) return null;
  
  if (!quiz) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz no encontrado</h2>
          <Link href="/levels">
            <Button>Volver a Misiones</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;

  const [shuffledOptions, setShuffledOptions] = useState<QuizOption[]>([]);

  useEffect(() => {
    if (!quiz || !currentQuestion) return;
    // Create a copy of the options
    const optionsCopy = [...currentQuestion.options];
    
    // Fisher-Yates shuffle
    for (let i = optionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
    }

    // Re-assign A, B, C, D based on the new random order
    const letteredOptions = optionsCopy.map((opt, index) => ({
      ...opt,
      id: String.fromCharCode(65 + index) // 65 is 'A'
    }));

    setShuffledOptions(letteredOptions);
  }, [quiz, currentQuestionIndex]);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-slate-50">
      {/* HUD */}
      <header className="bg-white border-b-4 border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/levels">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
              <List className="text-slate-400" />
            </Button>
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Quiz Teórico</p>
            <p className="text-sm font-black text-slate-700">{quiz.icon} {quiz.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border-2 border-primary/20">
            <Trophy className="text-primary" size={18} />
            <span className="font-black text-primary text-xl tabular-nums">{score}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <Timer size={18} />
            <span className="tabular-nums">{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertCircle size={18} />
            <span>{errors}</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {!isComplete && shuffledOptions.length > 0 && (
            <motion.div
              key={currentQuestion.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm"
            >
              <div className="text-sm font-bold text-primary mb-2">Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}</div>
              <h2 className="text-2xl font-black text-slate-800 mb-8 leading-tight">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {shuffledOptions.map((option) => {
                  let btnState = "idle";
                  if (hasAnswered) {
                    if (option.isCorrect) btnState = "correct";
                    else if (selectedOption === option.id) btnState = "incorrect";
                  }

                  let bgClass = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700";
                  if (btnState === "correct") bgClass = "bg-[#0ba15f]/10 border-[#0ba15f] text-[#0ba15f]";
                  if (btnState === "incorrect") bgClass = "bg-red-50 border-red-400 text-red-500";

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all ${bgClass} ${hasAnswered ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 ${btnState === "correct" ? "border-[#0ba15f] bg-[#0ba15f] text-white" : btnState === "incorrect" ? "border-red-400 bg-red-400 text-white" : "border-slate-300 text-slate-500 bg-white"}`}>
                          {option.id}
                        </div>
                        <span className="text-lg">{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Victoria Modal */}
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
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-4xl font-black text-primary mb-2">¡Quiz Completado!</h2>
              <p className="text-slate-500 mb-6">Has demostrado tus conocimientos teóricos.</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4 border-b-4 border-slate-200">
                  <div className="text-2xl font-black text-primary">{score}</div>
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
                <Link href="/levels" className="w-full">
                  <Button className="btn-duo btn-duo-primary w-full h-14 text-lg">
                    Volver a Misiones
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
