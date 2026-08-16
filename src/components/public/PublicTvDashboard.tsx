import React from 'react';
import { SportsHouse, SportsEvent, Athlete, EventResult, HouseStats, TopAthlete, DSSSimulationScenario } from '../../types';
import { AnimatedLeaderboard } from './AnimatedLeaderboard';
import { MedalTallyTable } from './MedalTallyTable';
import { RecentResultsFeed } from './RecentResultsFeed';
import { OlahragawanSection } from './OlahragawanSection';
import { DecisionSupportPanel } from './DecisionSupportPanel';
import { EventScheduleSection } from './EventScheduleSection';
import { Tv, Sparkles, Award, Shield, Activity, RefreshCw } from 'lucide-react';

interface PublicTvDashboardProps {
  houses: SportsHouse[];
  events: SportsEvent[];
  athletes: Athlete[];
  results: EventResult[];
  houseStats: HouseStats[];
  topAthletes: { olahragawan: TopAthlete | null; olahragawati: TopAthlete | null };
  dssScenario: DSSSimulationScenario;
}

export const PublicTvDashboard: React.FC<PublicTvDashboardProps> = ({
  houses,
  events,
  athletes,
  results,
  houseStats,
  topAthletes,
  dssScenario,
}) => {
  const completedCount = results.filter((r) => events.some((e) => e.id === r.eventId)).length;

  return (
    <div id="public-tv-dashboard" className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 space-y-6 transition-colors duration-300">
      {/* Banner / Live Ticker Header */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">
            SIARAN LIVE TV KEJOHANAN
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium hidden sm:inline">
           • Kompleks Sukan Tenom
          </span>
        </div>

        {/* Ticker marquee */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block overflow-hidden whitespace-nowrap bg-slate-100 dark:bg-slate-950/80 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-amber-300 font-bold">
          <div className="animate-marquee inline-block">
            🏆 SJK(C) CHUNG HWA TENOM 2026 • JUARA SEMENTARA: {houseStats[0]?.house.name} ({houseStats[0]?.totalPoints} MATA) • JUMLAH ACARA SELESAI: {completedCount} • TAHNIAH KEPADA SEMUA ATLET!
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
          Paparan TV Projeksi
        </div>
      </div>

      {/* Main Grid: 2 Columns on Large Screens */}
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

      {/* 2-Day Tournament Schedule & Day-wise Status */}
      <EventScheduleSection
        events={events}
        results={results}
        houses={houses}
      />
    </div>
  );
};
