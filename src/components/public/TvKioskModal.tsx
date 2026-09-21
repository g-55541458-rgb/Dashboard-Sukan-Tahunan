import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tv,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Crown,
  Medal,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Flame,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { HouseStats, SportsHouse, SportsEvent, EventResult, TopAthlete } from '../../types';
import { OlympicMedalIcon, OlympicMedalPill, MedalRatioBar } from './OlympicMedalBadge';
import { LiveScoreNumber } from './LiveScoreNumber';

interface TvKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseStats: HouseStats[];
  houses: SportsHouse[];
  events: SportsEvent[];
  results: EventResult[];
  topAthletes: { olahragawan: TopAthlete | null; olahragawati: TopAthlete | null };
}

type KioskSlide = 'leaderboard' | 'medals' | 'results' | 'athletes';

export const TvKioskModal: React.FC<TvKioskModalProps> = ({
  isOpen,
  onClose,
  houseStats,
  houses,
  events,
  results,
  topAthletes,
}) => {
  const [currentSlide, setCurrentSlide] = useState<KioskSlide>('leaderboard');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [slideDuration, setSlideDuration] = useState<number>(15); // seconds
  const [progress, setProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState<string>('');
  const [liveDate, setLiveDate] = useState<string>('');

  const kioskContainerRef = useRef<HTMLDivElement>(null);

  const slides: { id: KioskSlide; label: string; icon: React.ReactNode }[] = [
    { id: 'leaderboard', label: 'Skor Markah', icon: <Trophy className="w-4 h-4" /> },
    { id: 'medals', label: 'Jadual Pingat', icon: <Medal className="w-4 h-4" /> },
    { id: 'results', label: 'Keputusan Acara', icon: <Zap className="w-4 h-4" /> },
    { id: 'athletes', label: 'Olahragawan', icon: <Award className="w-4 h-4" /> },
  ];

  // Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString('ms-MY', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setLiveDate(
        now.toLocaleDateString('ms-MY', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation & ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-cycle timer
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      setProgress(0);
      return;
    }

    const intervalMs = 100;
    const totalSteps = (slideDuration * 1000) / intervalMs;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount += 1;
      const currentPct = Math.min(100, (stepCount / totalSteps) * 100);
      setProgress(currentPct);

      if (stepCount >= totalSteps) {
        stepCount = 0;
        setProgress(0);
        goToNextSlide();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, slideDuration, currentSlide]);

  const goToNextSlide = () => {
    setProgress(0);
    setCurrentSlide((prev) => {
      const idx = slides.findIndex((s) => s.id === prev);
      const nextIdx = (idx + 1) % slides.length;
      return slides[nextIdx].id;
    });
  };

  const goToPrevSlide = () => {
    setProgress(0);
    setCurrentSlide((prev) => {
      const idx = slides.findIndex((s) => s.id === prev);
      const prevIdx = (idx - 1 + slides.length) % slides.length;
      return slides[prevIdx].id;
    });
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (kioskContainerRef.current?.requestFullscreen) {
          await kioskContainerRef.current.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  if (!isOpen) return null;

  const sortedHouseStats = [...houseStats].sort((a, b) => b.totalPoints - a.totalPoints);
  const first = sortedHouseStats[0];
  const second = sortedHouseStats[1];
  const completedEventsCount = results.filter((r) => events.some((e) => e.id === r.eventId)).length;

  // Recent results sorted
  const recentResults = [...results]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  return (
    <div
      ref={kioskContainerRef}
      id="tv-kiosk-fullscreen-modal"
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Background Ambient Glow & Olympic Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-red-600 rounded-full blur-[140px]" />
      </div>

      {/* Top Automated Slide Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden z-20">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(251,191,36,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ================= TOP BROADCAST HEADER ================= */}
      <header className="px-4 sm:px-8 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-20 flex-wrap gap-2">
        {/* Left: School Identity */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-red-600 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/15 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <h1 className="font-black text-sm sm:text-xl tracking-tight text-white uppercase truncate">
                SJK(C) CHUNG HWA TENOM
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs font-black uppercase">
                2026
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase truncate">
              SIARAN TAYANGAN PROJEKTOR & PAPARAN KIOSK TV KEJOHANAN SUKAN TAHUNAN
            </p>
          </div>
        </div>

        {/* Center: Slide Switcher Tabs */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {slides.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setProgress(0);
                setCurrentSlide(s.id);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentSlide === s.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {s.icon}
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Kiosk Playback & Fullscreen Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Jeda Giliran (Pause Loop)' : 'Mainkan Giliran (Resume Loop)'}
            className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-400" />}
            <span className="hidden sm:inline">{isPlaying ? 'Jeda' : 'Auto'}</span>
          </button>

          {/* Speed Selector */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="text-slate-500 px-2 font-mono text-[11px]">KELAJUAN:</span>
            {[10, 15, 20].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setSlideDuration(sec);
                  setProgress(0);
                }}
                className={`px-2 py-0.5 rounded-lg font-mono font-bold text-[11px] transition-all ${
                  slideDuration === sec
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh (F11)'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close / Exit Button */}
          <button
            onClick={onClose}
            title="Tutup Paparan Kiosk (ESC)"
            className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600 hover:text-white transition-all ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= MAIN DYNAMIC STAGE ================= */}
      <main className="flex-1 p-4 sm:p-8 flex flex-col justify-center max-w-7xl mx-auto w-full relative z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ================= SLIDE 1: LEADERBOARD ================= */}
          {currentSlide === 'leaderboard' && (
            <motion.div
              key="slide-leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 my-auto"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>KEDUDUKAN & KUTIPAN MARKAH KESELURUHAN</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  PAPAN PENDAHULU RUMAH SUKAN
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {completedEventsCount} daripada {events.length} acara telah disahkan • Dikemaskini secara langsung
                </p>
              </div>

              {/* 4 Houses Broadcast Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
                {sortedHouseStats.map((stat, idx) => {
                  const isLeader = stat.rank === 1;
                  const ptsDiff = isLeader
                    ? second
                      ? `+${stat.totalPoints - second.totalPoints} MATA`
                      : 'Mendahului'
                    : first
                    ? `-${first.totalPoints - stat.totalPoints} MATA`
                    : '';

                  return (
                    <motion.div
                      key={stat.house.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.08 }}
                      className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                        isLeader
                          ? 'bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 ring-1 ring-amber-400/40 md:scale-105'
                          : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl'
                      }`}
                    >
                      {/* Top Accent Strip */}
                      <div
                        className="absolute top-0 inset-x-0 h-1.5"
                        style={{ backgroundColor: stat.house.color }}
                      />

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shadow-md ${
                              stat.rank === 1
                                ? 'bg-amber-400 text-slate-950'
                                : stat.rank === 2
                                ? 'bg-slate-300 text-slate-950'
                                : stat.rank === 3
                                ? 'bg-amber-800 text-amber-100'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            #{stat.rank}
                          </span>

                          {isLeader && (
                            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-xs">
                              <Crown className="w-3 h-3" />
                              <span>JUARA</span>
                            </span>
                          )}

                          {!isLeader && ptsDiff && (
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                              {ptsDiff}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2.5 mb-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: stat.house.color }}
                          />
                          <h3 className="text-xl sm:text-2xl font-black text-white truncate">
                            {stat.house.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 font-semibold mb-4">
                          {stat.house.mascot}
                        </p>

                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-center mb-4">
                          <div className="text-3xl sm:text-4xl font-black" style={{ color: stat.house.color }}>
                            <LiveScoreNumber value={stat.totalPoints} color={stat.house.color} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                            JUMLAH MATA RASMI
                          </span>
                        </div>
                      </div>

                      {/* Medals Row & Ratio */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <OlympicMedalPill type="gold" count={stat.goldCount} size="xs" />
                          <OlympicMedalPill type="silver" count={stat.silverCount} size="xs" />
                          <OlympicMedalPill type="bronze" count={stat.bronzeCount} size="xs" />
                        </div>
                        <MedalRatioBar
                          gold={stat.goldCount}
                          silver={stat.silverCount}
                          bronze={stat.bronzeCount}
                          showLabels={false}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 2: OLYMPIC MEDALS ================= */}
          {currentSlide === 'medals' && (
            <motion.div
              key="slide-medals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 my-auto"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <Medal className="w-3.5 h-3.5 text-blue-400" />
                  <span>KUTIPAN PINGAT EMAS, PERAK & GANGSA</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  JADUAL PINGAT KEJOHANAN
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Kedudukan diselaraskan mengikut bilangan pingat Emas, diikuti Perak dan Gangsa
                </p>
              </div>

              {/* High-Visibility Table */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-w-5xl mx-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-xs sm:text-sm text-slate-400 font-bold">
                      <th className="py-4 px-4 sm:px-6 text-center w-16">KED.</th>
                      <th className="py-4 px-4 sm:px-6">RUMAH SUKAN</th>
                      <th className="py-4 px-3 sm:px-4 text-center">
                        <div className="inline-flex items-center justify-center space-x-1.5 text-amber-400">
                          <OlympicMedalIcon type="gold" size="sm" />
                          <span>EMAS</span>
                        </div>
                      </th>
                      <th className="py-4 px-3 sm:px-4 text-center">
                        <div className="inline-flex items-center justify-center space-x-1.5 text-slate-300">
                          <OlympicMedalIcon type="silver" size="sm" />
                          <span>PERAK</span>
                        </div>
                      </th>
                      <th className="py-4 px-3 sm:px-4 text-center">
                        <div className="inline-flex items-center justify-center space-x-1.5 text-orange-400">
                          <OlympicMedalIcon type="bronze" size="sm" />
                          <span>GANGSA</span>
                        </div>
                      </th>
                      <th className="py-4 px-4 sm:px-6 text-center">DOMINASI PINGAT</th>
                      <th className="py-4 px-4 sm:px-6 text-right">JUMLAH MATA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-sm sm:text-base">
                    {sortedHouseStats.map((stat) => (
                      <tr key={stat.house.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 sm:px-6 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs sm:text-sm ${
                              stat.rank === 1
                                ? 'bg-amber-400 text-slate-950'
                                : stat.rank === 2
                                ? 'bg-slate-300 text-slate-950'
                                : stat.rank === 3
                                ? 'bg-amber-800 text-amber-100'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {stat.rank}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-black text-white">
                          <div className="flex items-center space-x-3">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: stat.house.color }}
                            />
                            <span className="text-base sm:text-lg">{stat.house.name}</span>
                            <span className="text-xs text-slate-500 font-normal">({stat.house.mascot})</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <span className="font-black text-lg sm:text-xl text-amber-300 bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-500/30">
                            {stat.goldCount}
                          </span>
                        </td>
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <span className="font-black text-lg sm:text-xl text-slate-200 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                            {stat.silverCount}
                          </span>
                        </td>
                        <td className="py-4 px-3 sm:px-4 text-center">
                          <span className="font-black text-lg sm:text-xl text-orange-300 bg-orange-950/40 px-3 py-1 rounded-lg border border-orange-500/30">
                            {stat.bronzeCount}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-center min-w-[160px]">
                          <div className="space-y-1">
                            <span className="text-xs font-black text-slate-300">
                              {stat.totalMedals} Pingat
                            </span>
                            <MedalRatioBar
                              gold={stat.goldCount}
                              silver={stat.silverCount}
                              bronze={stat.bronzeCount}
                              showLabels={false}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right font-black text-lg sm:text-2xl text-amber-400">
                          {stat.totalPoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 3: RECENT RESULTS ================= */}
          {currentSlide === 'results' && (
            <motion.div
              key="slide-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 my-auto"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-400/30 text-red-300 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  <span>KEPUTUSAN RASMI ACARA TERBAHARU</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  PEMENANG PINGAT ACARA SELESAI
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Keputusan yang telah disahkan oleh Ketua Pengadil Kejohanan
                </p>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto w-full">
                {recentResults.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-bold">Belum ada keputusan acara yang direkodkan.</p>
                  </div>
                ) : (
                  recentResults.map((res) => {
                    const event = events.find((e) => e.id === res.eventId);
                    const goldHouse = houses.find((h) => h.id === res.goldHouseId);
                    const silverHouse = houses.find((h) => h.id === res.silverHouseId);
                    const bronzeHouse = houses.find((h) => h.id === res.bronzeHouseId);

                    return (
                      <div
                        key={res.id}
                        className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-xs font-mono font-black border border-amber-400/30">
                              {event?.code || 'ACARA'}
                            </span>
                            <h4 className="font-black text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-xs">
                              {event?.name || 'Acara Sukan'}
                            </h4>
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {event?.category}
                          </span>
                        </div>

                        {/* Winners 1, 2, 3 Rows */}
                        <div className="space-y-2 text-xs sm:text-sm">
                          {/* Gold */}
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-amber-500/30">
                            <div className="flex items-center space-x-2 min-w-0">
                              <OlympicMedalIcon type="gold" size="sm" />
                              <span className="font-black text-amber-300 truncate">
                                {res.goldAthleteName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0 ml-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goldHouse?.color }} />
                              <span className="text-slate-300 font-bold">{goldHouse?.name}</span>
                              {res.goldRecord && (
                                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
                                  {res.goldRecord}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Silver */}
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                            <div className="flex items-center space-x-2 min-w-0">
                              <OlympicMedalIcon type="silver" size="sm" />
                              <span className="font-bold text-slate-200 truncate">
                                {res.silverAthleteName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0 ml-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: silverHouse?.color }} />
                              <span className="text-slate-400 font-bold">{silverHouse?.name}</span>
                              {res.silverRecord && (
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                                  {res.silverRecord}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Bronze */}
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                            <div className="flex items-center space-x-2 min-w-0">
                              <OlympicMedalIcon type="bronze" size="sm" />
                              <span className="font-bold text-orange-300 truncate">
                                {res.bronzeAthleteName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0 ml-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bronzeHouse?.color }} />
                              <span className="text-slate-400 font-bold">{bronzeHouse?.name}</span>
                              {res.bronzeRecord && (
                                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/40 px-1.5 py-0.5 rounded">
                                  {res.bronzeRecord}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* ================= SLIDE 4: OLAHRAGAWAN SPOTLIGHT ================= */}
          {currentSlide === 'athletes' && (
            <motion.div
              key="slide-athletes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 my-auto"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PENARAFAN PRESTASI INDIVIDU TERTINGGI</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  ANUGERAH OLAHRAGAWAN & OLAHRAGAWATI
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Berdasarkan pungutan pingat emas individu terbanyak & catatan rekod kejohanan
                </p>
              </div>

              {/* 2 Big Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full pt-2">
                {/* Olahragawan */}
                <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-blue-950/40 to-slate-950 border-2 border-blue-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                        👑 OLAHRAGAWAN
                      </span>
                      <span className="text-xs font-bold text-blue-300">LELAKI TERBAIK</span>
                    </div>

                    {topAthletes.olahragawan ? (
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">
                          {topAthletes.olahragawan.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: topAthletes.olahragawan.houseColor }}
                          />
                          <span className="font-bold">{topAthletes.olahragawan.houseName}</span>
                          <span className="text-slate-500">•</span>
                          <span>Kelas {topAthletes.olahragawan.class}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-4">
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <OlympicMedalIcon type="gold" size="sm" className="mx-auto mb-1" />
                            <div className="text-xl font-black text-amber-300">
                              {topAthletes.olahragawan.goldCount}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">EMAS</span>
                          </div>
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <OlympicMedalIcon type="silver" size="sm" className="mx-auto mb-1" />
                            <div className="text-xl font-black text-slate-200">
                              {topAthletes.olahragawan.silverCount}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">PERAK</span>
                          </div>
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <OlympicMedalIcon type="bronze" size="sm" className="mx-auto mb-1" />
                            <div className="text-xl font-black text-orange-300">
                              {topAthletes.olahragawan.bronzeCount}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">GANGSA</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm py-8 text-center">
                        Belum ada atlet lelaki yang memenangi pingat individu.
                      </p>
                    )}
                  </div>
                </div>

                {/* Olahragawati */}
                <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-purple-950/40 to-slate-950 border-2 border-purple-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                        👑 OLAHRAGAWATI
                      </span>
                      <span className="text-xs font-bold text-purple-300">PEREMPUAN TERBAIK</span>
                    </div>

                    {topAthletes.olahragawati ? (
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">
                          {topAthletes.olahragawati.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: topAthletes.olahragawati.houseColor }}
                          />
                          <span className="font-bold">{topAthletes.olahragawati.houseName}</span>
                          <span className="text-slate-500">•</span>
                          <span>Kelas {topAthletes.olahragawati.class}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-4">
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <OlympicMedalIcon type="gold" size="sm" className="mx-auto mb-1" />
                            <div className="text-xl font-black text-amber-300">
                              {topAthletes.olahragawati.goldCount}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">EMAS</span>
                          </div>
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <OlympicMedalIcon type="silver" size="sm" className="mx-auto mb-1" />
                            <div className="text-xl font-black text-slate-200">
                              {topAthletes.olahragawati.silverCount}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">PERAK</span>
                          </div>
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <OlympicMedalIcon type="bronze" size="sm" className="mx-auto mb-1" />
                            <div className="text-xl font-black text-orange-300">
                              {topAthletes.olahragawati.bronzeCount}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">GANGSA</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm py-8 text-center">
                        Belum ada atlet perempuan yang memenangi pingat individu.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= BOTTOM BROADCAST TICKER ================= */}
      <footer className="px-4 sm:px-8 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between z-20 flex-wrap gap-2 text-xs">
        {/* Left: Live Digital Clock */}
        <div className="flex items-center space-x-3 text-slate-300 font-mono">
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">{liveTime}</span>
          </div>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">{liveDate}</span>
        </div>

        {/* Center: Live Running Ticker */}
        <div className="flex-1 max-w-xl mx-2 hidden lg:block overflow-hidden whitespace-nowrap bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-slate-300 font-mono">
          <div className="animate-marquee inline-block text-[11px]">
            📢 SIARAN LANGSUNG KIOSK TV: KEDUDUKAN #1 DIKEPUNG OLEH {first?.house.name.toUpperCase()} DENGAN {first?.totalPoints} MATA • JUMLAH PINGAT KESELURUHAN DITAWARKAN: {events.length * 3} PINGAT • MAJULAH SUKAN UNTUK NEGARA!
          </div>
        </div>

        {/* Right: Slide Dots & Nav Arrows */}
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={goToPrevSlide}
            title="Slaid Sebelumnya"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1 px-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setProgress(0);
                  setCurrentSlide(s.id);
                }}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === s.id
                    ? 'w-6 bg-amber-400 shadow-xs'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={s.label}
              />
            ))}
          </div>

          <button
            onClick={goToNextSlide}
            title="Slaid Seterusnya"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
