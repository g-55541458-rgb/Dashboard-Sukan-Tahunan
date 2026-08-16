import React from 'react';
import {
  SportsHouse,
  SportsEvent,
  Athlete,
  EventResult,
  HouseStats,
  TopAthlete,
  DSSSimulationScenario,
} from '../../types';
import { AnimatedLeaderboard } from './AnimatedLeaderboard';
import { MedalTallyTable } from './MedalTallyTable';
import { RecentResultsFeed } from './RecentResultsFeed';
import { OlahragawanSection } from './OlahragawanSection';
import { DecisionSupportPanel } from './DecisionSupportPanel';
import { EventScheduleSection } from './EventScheduleSection';
import {
  Tv,
  Sparkles,
  Award,
  Shield,
  Activity,
  RefreshCw,
  Monitor,
  Smartphone,
  Trophy,
  Medal,
  Zap,
  Calendar,
  BarChart3,
  Flame,
} from 'lucide-react';

interface PublicTvDashboardProps {
  houses: SportsHouse[];
  events: SportsEvent[];
  athletes: Athlete[];
  results: EventResult[];
  houseStats: HouseStats[];
  topAthletes: { olahragawan: TopAthlete | null; olahragawati: TopAthlete | null };
  dssScenario: DSSSimulationScenario;
  layoutMode?: 'desktop' | 'mobile';
  onToggleLayoutMode?: () => void;
}

export const PublicTvDashboard: React.FC<PublicTvDashboardProps> = ({
  houses,
  events,
  athletes,
  results,
  houseStats,
  topAthletes,
  dssScenario,
  layoutMode = 'desktop',
  onToggleLayoutMode,
}) => {
  const completedCount = results.filter((r) => events.some((e) => e.id === r.eventId)).length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="public-tv-dashboard"
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-6 space-y-5 sm:space-y-6 transition-colors duration-300"
    >
      {/* Top Banner / Ticker Header */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 shrink-0">
            LIVE TV KEJOHANAN
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline truncate">
            Kompleks Sukan Tenom
          </span>
        </div>

        {/* Ticker marquee (Desktop & Wide Screen) */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block overflow-hidden whitespace-nowrap bg-slate-100 dark:bg-slate-950/80 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-amber-300 font-bold">
          <div className="animate-marquee inline-block">
            🏆 SJK(C) CHUNG HWA TENOM 2026 • JUARA SEMENTARA: {houseStats[0]?.house.name} ({houseStats[0]?.totalPoints} MATA) • JUMLAH ACARA SELESAI: {completedCount} • TAHNIAH KEPADA SEMUA ATLET!
          </div>
        </div>

        {/* Layout Switcher & Status Badge */}
        <div className="flex items-center space-x-2 shrink-0 ml-auto">
          {onToggleLayoutMode && (
            <button
              id="btn-dashboard-toggle-view"
              onClick={onToggleLayoutMode}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                layoutMode === 'mobile'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25'
              }`}
            >
              {layoutMode === 'mobile' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Mod Mobile</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Mod Desktop</span>
                </>
              )}
            </button>
          )}

          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hidden xs:block">
            {layoutMode === 'mobile' ? 'Paparan Telefon' : 'Paparan Projeksi'}
          </div>
        </div>
      </div>

      {/* RENDER MODE: MOBILE VIEW vs DESKTOP VIEW */}
      {layoutMode === 'mobile' ? (
        /* ==================== MOBILE VIEW LAYOUT ==================== */
        <div className="space-y-5">
          {/* Quick Jump Navigation Bar for Mobile */}
          <div className="sticky top-16 z-40 -mx-3 px-3 py-2 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => scrollToSection('mobile-leaderboard')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0 active:scale-95 transition-all"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Skor Mata</span>
              </button>

              <button
                onClick={() => scrollToSection('mobile-medals')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 shrink-0 active:scale-95 transition-all"
              >
                <Medal className="w-3.5 h-3.5 text-blue-500" />
                <span>Jadual Pingat</span>
              </button>

              <button
                onClick={() => scrollToSection('mobile-results')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30 shrink-0 active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-red-500" />
                <span>Keputusan</span>
              </button>

              <button
                onClick={() => scrollToSection('mobile-athletes')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0 active:scale-95 transition-all"
              >
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Olahragawan</span>
              </button>

              <button
                onClick={() => scrollToSection('mobile-dss')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shrink-0 active:scale-95 transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                <span>Analisis DSS</span>
              </button>

              <button
                onClick={() => scrollToSection('mobile-schedule')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shrink-0 active:scale-95 transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Jadual Acara</span>
              </button>
            </div>
          </div>

          {/* 1. Animated Leaderboard (Kedudukan Mata) */}
          <div id="mobile-leaderboard" className="scroll-mt-32">
            <AnimatedLeaderboard houseStats={houseStats} />
          </div>

          {/* 2. Medal Tally Table (Jadual Pingat) */}
          <div id="mobile-medals" className="scroll-mt-32">
            <MedalTallyTable houseStats={houseStats} />
          </div>

          {/* 3. Recent Results Feed (Keputusan Terkini) */}
          <div id="mobile-results" className="scroll-mt-32">
            <RecentResultsFeed
              results={results}
              events={events}
              houses={houses}
            />
          </div>

          {/* 4. Olahragawan & Olahragawati (Anugerah Terbaik) */}
          <div id="mobile-athletes" className="scroll-mt-32">
            <OlahragawanSection
              olahragawan={topAthletes.olahragawan}
              olahragawati={topAthletes.olahragawati}
            />
          </div>

          {/* 5. Decision Support System (DSS Analytics & Scenario Prediction) */}
          <div id="mobile-dss" className="scroll-mt-32">
            <DecisionSupportPanel
              dssScenario={dssScenario}
              houseStats={houseStats}
              houses={houses}
              events={events}
            />
          </div>

          {/* 6. Event Schedule (Jadual 2 Hari Kejohanan) */}
          <div id="mobile-schedule" className="scroll-mt-32">
            <EventScheduleSection
              events={events}
              results={results}
              houses={houses}
            />
          </div>
        </div>
      ) : (
        /* ==================== DESKTOP VIEW LAYOUT ==================== */
        <div className="space-y-6">
          {/* Main 2-Column Desktop Grid: 7 cols left, 5 cols right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Animated Leaderboard & Decision Support */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatedLeaderboard houseStats={houseStats} />
              <DecisionSupportPanel
                dssScenario={dssScenario}
                houseStats={houseStats}
                houses={houses}
                events={events}
              />
              <OlahragawanSection
                olahragawan={topAthletes.olahragawan}
                olahragawati={topAthletes.olahragawati}
              />
            </div>

            {/* Right Column (5 cols): Medal Tally & Recent Results Feed */}
            <div className="lg:col-span-5 space-y-6">
              <MedalTallyTable houseStats={houseStats} />
              <RecentResultsFeed
                results={results}
                events={events}
                houses={houses}
              />
            </div>
          </div>

          {/* Full Width Bottom: 2-Day Tournament Schedule */}
          <EventScheduleSection
            events={events}
            results={results}
            houses={houses}
          />
        </div>
      )}
    </div>
  );
};

