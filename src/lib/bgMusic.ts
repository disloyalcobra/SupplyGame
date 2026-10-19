// Módulo singleton para la música de fondo del juego.
// Permite controlar el volumen desde cualquier componente (ej. el slider de GameCanvas)
// incluso cuando la música se crea en la página (game/page.tsx o hardcore/page.tsx).

export const DEFAULT_MUSIC_VOLUME = 0.25;
const STORAGE_KEY = "supplygame_music_volume";

let audio: HTMLAudioElement | null = null;
let userVolume = DEFAULT_MUSIC_VOLUME;
let muted = false;

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function applyVolume(): void {
  if (audio) {
    audio.volume = muted ? 0 : userVolume;
  }
}

/** Inicia la música de fondo (solo se crea una vez). */
export function startBgMusic(src: string): void {
  if (typeof window === "undefined" || audio) return;

  // Restaurar volumen guardado por el usuario
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw != null) {
      const parsed = parseFloat(raw);
      if (Number.isFinite(parsed)) userVolume = clamp01(parsed);
    }
  } catch {
    // ignore
  }

  audio = new Audio(src);
  audio.loop = true;
  applyVolume();
  audio.play().catch((e) => {
    if (e?.name !== "AbortError") console.warn("Auto-play prevented", e);
  });
}

/** Detiene y libera la música de fondo. */
export function stopBgMusic(): void {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio = null;
}

/** Volumen actual elegido por el usuario (ignora el mute temporal). */
export function getMusicVolume(): number {
  return userVolume;
}

/** Cambia el volumen de la música y lo persiste en localStorage. */
export function setMusicVolume(v: number): void {
  userVolume = clamp01(v);
  muted = false;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(userVolume));
  } catch {
    // ignore
  }
  applyVolume();
}

/** Silencia/restaura la música temporalmente (ej. durante el tutorial). */
export function muteMusic(m: boolean): void {
  muted = m;
  applyVolume();
}

/** Alterna el mute del usuario. Devuelve el nuevo estado de mute. */
export function toggleMusicMute(): boolean {
  muted = !muted;
  applyVolume();
  return muted;
}

export function isMusicMuted(): boolean {
  return muted;
}
