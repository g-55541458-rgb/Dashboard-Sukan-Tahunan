import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Medal,
  Crown,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  PartyPopper,
  Printer,
  Users,
  Flame,
  Waves,
  Zap,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { HouseStats, TopAthlete, SportsHouse, BestAthletesResult } from '../../types';

interface VictoryPodiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseStats: HouseStats[];
  topAthletes: BestAthletesResult;
  completedEventsCount: number;
  totalEventsCount: number;
}

export const VictoryPodiumModal: React.FC<VictoryPodiumModalProps> = ({
  isOpen,
  onClose,
  houseStats,
  topAthletes,
  completedEventsCount,
  totalEventsCount,
}) => {
  const [activeTab, setActiveTab] = useState<'houses' | 'athletes' | 'certificate'>('houses');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sound fanfare using Web Audio API
  const playVictoryFanfare = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Celebratory Triumphant Chords: Bb Major / F Major fanfare
      const notes = [
        { f: 466.16, t: 0, d: 0.18 }, // Bb4
        { f: 587.33, t: 0.16, d: 0.18 }, // D5
        { f: 698.46, t: 0.32, d: 0.22 }, // F5
        { f: 932.33, t: 0.52, d: 0.75 }, // Bb5
        { f: 698.46, t: 0.52, d: 0.75 }, // F5 harmony
        { f: 587.33, t: 0.52, d: 0.75 }, // D5 harmony
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.linearRampToValueAtTime(0.22, now + t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch (e) {
      console.error('Audio fanfare error:', e);
    }
  };

  // Grand Confetti Blast
  const triggerGrandConfetti = () => {
    try {
      // Center fireworks
      confetti({
        particleCount: 75,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ffffff'],
      });

      // Left Cannon
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.65 },
        colors: ['#fbbf24', '#ef4444', '#f59e0b'],
      });

      // Right Cannon
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.65 },
        colors: ['#fbbf24', '#3b82f6', '#10b981'],
      });

      playVictoryFanfare();
    } catch (e) {
      console.error('Confetti error:', e);
    }
  };

  // Fire confetti automatically when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        triggerGrandConfetti();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard shortcut ESC to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      }
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  // Ranks
  const first = houseStats[0];
  const second = houseStats[1];
  const third = houseStats[2];
  const fourth = houseStats[3];

  const getHouseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-blue-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      default:
        return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div
      ref={containerRef}
      id="modal-victory-podium"
      className="fixed inset-0 z-50 bg-slate-950/95 text-white backdrop-blur-2xl flex flex-col overflow-y-auto print:bg-white print:text-black"
    >
      {/* Dynamic Background Stage Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/15 via-red-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Controls Bar (Hidden on Print) */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md shrink-0 print:hidden">
        {/* Left branding */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm sm:text-base tracking-tight text-white uppercase">
                PENTAS PODIUM KEMENANGAN RASMI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              SJK(C) CHUNG HWA TENOM • MAJLIS PENUTUPAN & PENYAMPAIAN PIALA
            </p>
          </div>
        </div>

        {/* Center: Tabs Switcher */}
        <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'houses'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Podium Rumah Sukan</span>
          </button>

          <button
            onClick={() => setActiveTab('athletes')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'athletes'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Olahragawan & Wati</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'certificate'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Slip Rasmi</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Trigger Confetti Button */}
          <button
            onClick={triggerGrandConfetti}
            title="Letupkan Confetti & Mainkan Fanfare"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CONFETTI</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Matikan Bunyi Fanfare' : 'Aktifkan Bunyi Fanfare'}
            className={`p-2 rounded-xl text-xs transition-colors border ${
              soundEnabled
                ? 'bg-slate-800 text-amber-400 border-amber-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleBrowserFullscreen}
            title="Skrin Penuh Projeksi / Skrin TV"
            className="p-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit / Close */}
          <button
            onClick={onClose}
            title="Tutup Pentas Podium (Esc)"
            className="p-2 rounded-xl text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 hover:border-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden px-4 py-2 bg-slate-900/90 border-b border-slate-800 gap-1 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('houses')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center shrink-0 ${
            activeTab === 'houses' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 bg-slate-800/50'
          }`}
        >
          Podium Rumah
        </button>
        <button
          onClick={() => setActiveTab('athletes')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center shrink-0 ${
            activeTab === 'athletes' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 bg-slate-800/50'
          }`}
        >
          Olahragawan/wati
        </button>
        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center shrink-0 ${
            activeTab === 'certificate' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 bg-slate-800/50'
          }`}
        >
          Slip Rasmi
        </button>
      </div>

      {/* Main Presentation Stage */}
      <div className="flex-1 p-4 sm:p-8 flex flex-col justify-center max-w-7xl mx-auto w-full relative z-10">
        {/* ================= TAB 1: OLYMPIC PODIUM ================= */}
        {activeTab === 'houses' && (
          <div className="space-y-8 my-auto">
            {/* Stage Title Banner */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>KEPUTUSAN KESELURUHAN & JUARA PIALA KEJOHANAN</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
                PENTAS KEMENANGAN RUMAH SUKAN
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Status Acara: {completedEventsCount} daripada {totalEventsCount} acara telah selesai
              </p>
            </div>

            {/* Stepped 3D Podium Layout */}
            <div className="pt-8 sm:pt-14 pb-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-4xl mx-auto">
                {/* 2ND PLACE (SILVER - LEFT) */}
                {second && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    {/* Floating Avatar & Trophy */}
                    <div className="mb-3 sm:mb-4 flex flex-col items-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-400 p-1 shadow-xl shadow-slate-300/20 flex items-center justify-center">
                        <Medal className="w-7 h-7 sm:w-10 sm:h-10 text-slate-800" />
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-slate-300 text-slate-900">
                          NAIB JUARA
                        </span>
                        <h3 className="text-xs sm:text-lg font-black text-white mt-1 truncate max-w-[110px] sm:max-w-none">
                          {second.house.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                          {second.house.mascot}
                        </p>
                      </div>
                    </div>

                    {/* Step Block (Medium Height) */}
                    <div className="w-full bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700/80 rounded-t-2xl sm:rounded-t-3xl border-t-4 border-slate-300 p-3 sm:p-5 flex flex-col items-center justify-between h-44 sm:h-64 shadow-2xl relative overflow-hidden">
                      <div className="text-3xl sm:text-6xl font-black text-slate-300/80 drop-shadow-lg">
                        2
                      </div>
                      <div className="text-center w-full bg-slate-950/60 rounded-xl p-2 border border-slate-700/50">
                        <div className="text-base sm:text-2xl font-black text-slate-200">
                          {second.totalPoints}{' '}
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400">MATA</span>
                        </div>
                        <div className="flex justify-center gap-1 sm:gap-2 mt-1 text-[9px] sm:text-xs text-slate-300">
                          <span>🥇 {second.goldCount}</span>
                          <span>🥈 {second.silverCount}</span>
                          <span>🥉 {second.bronzeCount}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 1ST PLACE (GOLD - CENTER & TALLEST) */}
                {first && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 60 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col items-center -mt-6 sm:-mt-10 relative z-10"
                  >
                    {/* Crown & Grand Trophy */}
                    <div className="mb-3 sm:mb-5 flex flex-col items-center relative">
                      {/* Radiating Halo Glow */}
                      <div className="absolute -inset-4 bg-amber-500/25 rounded-full blur-xl animate-pulse" />
                      
                      <div className="relative">
                        <Crown className="w-7 h-7 sm:w-10 sm:h-10 text-amber-300 mx-auto -mb-2 animate-bounce" />
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1.5 shadow-2xl shadow-amber-500/40 flex items-center justify-center ring-4 ring-amber-400/40">
                          <Trophy className="w-9 h-9 sm:w-14 sm:h-14 text-slate-950 animate-pulse" />
                        </div>
                      </div>

                      <div className="mt-2.5 text-center relative z-10">
                        <span className="text-[10px] sm:text-sm font-black uppercase px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md">
                          🏆 JUARA KESELURUHAN
                        </span>
                        <h3 className="text-sm sm:text-2xl font-black text-white mt-1.5 tracking-tight truncate max-w-[130px] sm:max-w-none">
                          {first.house.name}
                        </h3>
                      </div>
                    </div>

                    {/* Step Block (Tallest Height) */}
                    <div className="w-full bg-gradient-to-t from-slate-900 via-amber-950/60 to-amber-600/70 rounded-t-2xl sm:rounded-t-3xl border-t-4 border-amber-400 p-3.5 sm:p-6 flex flex-col items-center justify-between h-56 sm:h-80 shadow-2xl shadow-amber-500/20 relative overflow-hidden ring-1 ring-amber-500/40">
                      <div className="text-4xl sm:text-7xl font-black text-amber-300 drop-shadow-2xl">
                        1
                      </div>
                      <div className="text-center w-full bg-slate-950/80 rounded-xl p-2.5 sm:p-3 border border-amber-500/40 shadow-inner">
                        <div className="text-lg sm:text-3xl font-black text-amber-400">
                          {first.totalPoints}{' '}
                          <span className="text-[10px] sm:text-sm font-bold text-amber-300/80">MATA</span>
                        </div>
                        <div className="flex justify-center gap-1.5 sm:gap-3 mt-1 text-[10px] sm:text-sm font-semibold text-slate-200">
                          <span className="text-amber-300">🥇 {first.goldCount}</span>
                          <span className="text-slate-300">🥈 {first.silverCount}</span>
                          <span className="text-amber-500">🥉 {first.bronzeCount}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3RD PLACE (BRONZE - RIGHT) */}
                {third && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    {/* Floating Avatar & Trophy */}
                    <div className="mb-3 sm:mb-4 flex flex-col items-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-amber-700 to-amber-900 p-1 shadow-xl shadow-amber-800/20 flex items-center justify-center">
                        <Medal className="w-7 h-7 sm:w-10 sm:h-10 text-amber-200" />
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-amber-800 text-amber-100">
                          TEMPAT KE-3
                        </span>
                        <h3 className="text-xs sm:text-lg font-black text-white mt-1 truncate max-w-[110px] sm:max-w-none">
                          {third.house.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                          {third.house.mascot}
                        </p>
                      </div>
                    </div>

                    {/* Step Block (Lowest Height) */}
                    <div className="w-full bg-gradient-to-t from-slate-900 via-slate-800 to-amber-950/60 rounded-t-2xl sm:rounded-t-3xl border-t-4 border-amber-700 p-3 sm:p-5 flex flex-col items-center justify-between h-36 sm:h-52 shadow-2xl relative overflow-hidden">
                      <div className="text-3xl sm:text-6xl font-black text-amber-600/80 drop-shadow-lg">
                        3
                      </div>
                      <div className="text-center w-full bg-slate-950/60 rounded-xl p-2 border border-slate-700/50">
                        <div className="text-base sm:text-2xl font-black text-amber-200">
                          {third.totalPoints}{' '}
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400">MATA</span>
                        </div>
                        <div className="flex justify-center gap-1 sm:gap-2 mt-1 text-[9px] sm:text-xs text-slate-300">
                          <span>🥇 {third.goldCount}</span>
                          <span>🥈 {third.silverCount}</span>
                          <span>🥉 {third.bronzeCount}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 4TH PLACE HONORABLE MENTION CARD */}
              {fourth && (
                <div className="max-w-md mx-auto mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs">
                      4
                    </span>
                    <div>
                      <span className="font-bold text-white">{fourth.house.name}</span>
                      <span className="text-slate-500 ml-1.5">({fourth.house.mascot})</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 font-semibold">
                    <span>{fourth.totalPoints} Mata</span>
                    <span className="text-[10px] text-slate-400">
                      🥇{fourth.goldCount} 🥈{fourth.silverCount} 🥉{fourth.bronzeCount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: OLAHRAGAWAN & WATI SPOTLIGHT (4 KATEGORI) ================= */}
        {activeTab === 'athletes' && (
          <div className="space-y-6 my-auto max-w-6xl mx-auto w-full">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
                <Award className="w-4 h-4 text-amber-400" />
                <span>ANUGERAH BINTANG KEJOHANAN 2026 (4 KATEGORI RASMI)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md">
                OLAHRAGAWAN & OLAHRAGAWATI TERBAIK
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Kategori Senior (L12 & P12) serta Kategori Tunas Harapan (L10 & P10) • Kategori L8, P8 & Pra-Sekolah dikecualikan daripada anugerah ini
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Olahragawan Senior (L12) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/50 to-slate-900 border-2 border-blue-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      👑 L12 SENIOR
                    </span>
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>

                  {topAthletes.olahragawanL12 ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                          Olahragawan Senior
                        </span>
                        <h3 className="text-lg font-black text-white truncate">
                          {topAthletes.olahragawanL12.athlete.name}
                        </h3>
                        <p className="text-[11px] text-blue-300 font-semibold mt-0.5">
                          Kelas {topAthletes.olahragawanL12.athlete.className}
                        </p>
                        <div
                          className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: `${topAthletes.olahragawanL12.house.color}20`,
                            borderColor: `${topAthletes.olahragawanL12.house.color}50`,
                            color: topAthletes.olahragawanL12.house.color,
                          }}
                        >
                          {topAthletes.olahragawanL12.house.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-center">
                        <div>
                          <div className="text-base font-black text-amber-400">
                            {topAthletes.olahragawanL12.goldCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥇 Emas</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-300">
                            {topAthletes.olahragawanL12.silverCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥈 Perak</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-amber-500">
                            {topAthletes.olahragawanL12.totalPoints}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Mata</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs italic">
                      Belum ada pemenang L12.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Olahragawati Senior (P12) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-pink-950/50 to-slate-900 border-2 border-pink-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      👑 P12 SENIOR
                    </span>
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>

                  {topAthletes.olahragawatiP12 ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                          Olahragawati Senior
                        </span>
                        <h3 className="text-lg font-black text-white truncate">
                          {topAthletes.olahragawatiP12.athlete.name}
                        </h3>
                        <p className="text-[11px] text-pink-300 font-semibold mt-0.5">
                          Kelas {topAthletes.olahragawatiP12.athlete.className}
                        </p>
                        <div
                          className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: `${topAthletes.olahragawatiP12.house.color}20`,
                            borderColor: `${topAthletes.olahragawatiP12.house.color}50`,
                            color: topAthletes.olahragawatiP12.house.color,
                          }}
                        >
                          {topAthletes.olahragawatiP12.house.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-center">
                        <div>
                          <div className="text-base font-black text-amber-400">
                            {topAthletes.olahragawatiP12.goldCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥇 Emas</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-300">
                            {topAthletes.olahragawatiP12.silverCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥈 Perak</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-amber-500">
                            {topAthletes.olahragawatiP12.totalPoints}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Mata</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs italic">
                      Belum ada pemenang P12.
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Olahragawan Harapan (L10) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/50 to-slate-900 border-2 border-emerald-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ⭐ L10 HARAPAN
                    </span>
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>

                  {topAthletes.olahragawanL10 ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                          Olahragawan Harapan
                        </span>
                        <h3 className="text-lg font-black text-white truncate">
                          {topAthletes.olahragawanL10.athlete.name}
                        </h3>
                        <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">
                          Kelas {topAthletes.olahragawanL10.athlete.className}
                        </p>
                        <div
                          className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: `${topAthletes.olahragawanL10.house.color}20`,
                            borderColor: `${topAthletes.olahragawanL10.house.color}50`,
                            color: topAthletes.olahragawanL10.house.color,
                          }}
                        >
                          {topAthletes.olahragawanL10.house.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-center">
                        <div>
                          <div className="text-base font-black text-amber-400">
                            {topAthletes.olahragawanL10.goldCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥇 Emas</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-300">
                            {topAthletes.olahragawanL10.silverCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥈 Perak</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-amber-500">
                            {topAthletes.olahragawanL10.totalPoints}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Mata</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs italic">
                      Belum ada pemenang L10.
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Olahragawati Harapan (P10) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/50 to-slate-900 border-2 border-amber-500/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ⭐ P10 HARAPAN
                    </span>
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>

                  {topAthletes.olahragawatiP10 ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                          Olahragawati Harapan
                        </span>
                        <h3 className="text-lg font-black text-white truncate">
                          {topAthletes.olahragawatiP10.athlete.name}
                        </h3>
                        <p className="text-[11px] text-amber-300 font-semibold mt-0.5">
                          Kelas {topAthletes.olahragawatiP10.athlete.className}
                        </p>
                        <div
                          className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: `${topAthletes.olahragawatiP10.house.color}20`,
                            borderColor: `${topAthletes.olahragawatiP10.house.color}50`,
                            color: topAthletes.olahragawatiP10.house.color,
                          }}
                        >
                          {topAthletes.olahragawatiP10.house.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-center">
                        <div>
                          <div className="text-base font-black text-amber-400">
                            {topAthletes.olahragawatiP10.goldCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥇 Emas</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-300">
                            {topAthletes.olahragawatiP10.silverCount}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">🥈 Perak</div>
                        </div>
                        <div>
                          <div className="text-base font-black text-amber-500">
                            {topAthletes.olahragawatiP10.totalPoints}
                          </div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Mata</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs italic">
                      Belum ada pemenang P10.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: OFFICIAL PRINTABLE SUMMARY CERTIFICATE ================= */}
        {activeTab === 'certificate' && (
          <div className="my-auto max-w-3xl mx-auto w-full">
            <div className="flex justify-end mb-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>CETAK SLIP KEPUTUSAN RASMI (A4)</span>
              </button>
            </div>

            {/* Certificate Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 border-4 border-amber-600/40 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-200 pb-5">
                <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  SJK(C) CHUNG HWA TENOM, SABAH
                </h3>
                <h4 className="text-sm sm:text-base font-bold text-amber-700 uppercase mt-0.5">
                  KEJOHANAN SUKAN TAHUNAN KALI KE-45 (2026)
                </h4>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  PENGESAHAN KEPUTUSAN KESELURUHAN & PENYERAHAN PIALA KEJOHANAN
                </p>
              </div>

              {/* Champion Statement */}
              {first && (
                <div className="p-4 sm:p-6 rounded-xl bg-amber-50 border-2 border-amber-400 text-center space-y-1.5">
                  <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                    DENGAN INI DIPERKUKUHKAN BAHAWA
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    {first.house.name.toUpperCase()}
                  </h2>
                  <p className="text-sm font-bold text-amber-900">
                    DINOBATKAN SEBAGAI JUARA KESELURUHAN DENGAN {first.totalPoints} MATA
                  </p>
                  <p className="text-xs text-slate-600">
                    Kutipan Pingat: {first.goldCount} Emas, {first.silverCount} Perak, {first.bronzeCount}{' '}
                    Gangsa (Jumlah: {first.totalMedals} Pingat)
                  </p>
                </div>
              )}

              {/* All Houses Standing Table */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">
                  KEDUDUKAN RASMI SEMUA RUMAH SUKAN:
                </h5>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                      <th className="py-2 px-3 text-left">Kedudukan</th>
                      <th className="py-2 px-3 text-left">Rumah Sukan</th>
                      <th className="py-2 px-3 text-center">Emas</th>
                      <th className="py-2 px-3 text-center">Perak</th>
                      <th className="py-2 px-3 text-center">Gangsa</th>
                      <th className="py-2 px-3 text-right">Jumlah Mata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {houseStats.map((st) => (
                      <tr key={st.house.id} className="border-b border-slate-200">
                        <td className="py-2.5 px-3 font-bold">#{st.rank}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{st.house.name}</td>
                        <td className="py-2.5 px-3 text-center">{st.goldCount}</td>
                        <td className="py-2.5 px-3 text-center">{st.silverCount}</td>
                        <td className="py-2.5 px-3 text-center">{st.bronzeCount}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-950">
                          {st.totalPoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official Athlete Awards Section */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">
                  ANUGERAH OLAHRAGAWAN & OLAHRAGAWATI TERBAIK (4 KATEGORI):
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* L12 Senior */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-blue-700 uppercase block">
                      Olahragawan Senior (L12)
                    </span>
                    {topAthletes.olahragawanL12 ? (
                      <div>
                        <div className="font-black text-slate-900">
                          {topAthletes.olahragawanL12.athlete.name} ({topAthletes.olahragawanL12.athlete.className})
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {topAthletes.olahragawanL12.house.name} • 🥇 {topAthletes.olahragawanL12.goldCount} Emas ({topAthletes.olahragawanL12.totalPoints} Mata)
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">Tiada pemenang</div>
                    )}
                  </div>

                  {/* P12 Senior */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-pink-700 uppercase block">
                      Olahragawati Senior (P12)
                    </span>
                    {topAthletes.olahragawatiP12 ? (
                      <div>
                        <div className="font-black text-slate-900">
                          {topAthletes.olahragawatiP12.athlete.name} ({topAthletes.olahragawatiP12.athlete.className})
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {topAthletes.olahragawatiP12.house.name} • 🥇 {topAthletes.olahragawatiP12.goldCount} Emas ({topAthletes.olahragawatiP12.totalPoints} Mata)
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">Tiada pemenang</div>
                    )}
                  </div>

                  {/* L10 Harapan */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                      Olahragawan Tunas Harapan (L10)
                    </span>
                    {topAthletes.olahragawanL10 ? (
                      <div>
                        <div className="font-black text-slate-900">
                          {topAthletes.olahragawanL10.athlete.name} ({topAthletes.olahragawanL10.athlete.className})
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {topAthletes.olahragawanL10.house.name} • 🥇 {topAthletes.olahragawanL10.goldCount} Emas ({topAthletes.olahragawanL10.totalPoints} Mata)
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">Tiada pemenang</div>
                    )}
                  </div>

                  {/* P10 Harapan */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">
                      Olahragawati Tunas Harapan (P10)
                    </span>
                    {topAthletes.olahragawatiP10 ? (
                      <div>
                        <div className="font-black text-slate-900">
                          {topAthletes.olahragawatiP10.athlete.name} ({topAthletes.olahragawatiP10.athlete.className})
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {topAthletes.olahragawatiP10.house.name} • 🥇 {topAthletes.olahragawatiP10.goldCount} Emas ({topAthletes.olahragawatiP10.totalPoints} Mata)
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">Tiada pemenang</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Signature section */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-slate-800">
                <div className="border-t border-slate-400 pt-2 text-center">
                  <p className="font-bold">Disediakan Oleh:</p>
                  <p className="text-slate-500 mt-6">(Ketua Pengadil / Pencatat Rasmi)</p>
                </div>
                <div className="border-t border-slate-400 pt-2 text-center">
                  <p className="font-bold">Disahkan Oleh:</p>
                  <p className="text-slate-500 mt-6">(Guru Besar / PK Kokurikulum)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stage Footer Banner */}
      <div className="px-4 sm:px-8 py-3 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between text-xs text-slate-400 shrink-0 print:hidden">
        <span className="hidden sm:inline">
          Sistem Pengurusan Kejohanan Sukan • SJK(C) Chung Hwa Tenom
        </span>
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={triggerGrandConfetti}
            className="px-3 py-1 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 font-bold transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Raikan Juara</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};
