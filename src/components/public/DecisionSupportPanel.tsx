import React, { useState } from 'react';
import { HouseStats, SportsEvent, SportsHouse, DSSSimulationScenario } from '../../types';
import { Brain, Sparkles, TrendingUp, HelpCircle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface DecisionSupportPanelProps {
  dssScenario: DSSSimulationScenario;
  houseStats: HouseStats[];
  houses: SportsHouse[];
  events: SportsEvent[];
}

export const DecisionSupportPanel: React.FC<DecisionSupportPanelProps> = ({
  dssScenario,
  houseStats,
  houses,
  events,
}) => {
  const [simHouseId, setSimHouseId] = useState<string>(houses[1]?.id || houses[0]?.id || '');
  const [simGolds, setSimGolds] = useState<number>(2);

  const selectedHouse = houses.find((h) => h.id === simHouseId) || houses[0];
  const selectedStat = houseStats.find((s) => s.house.id === simHouseId) || houseStats[0];
  const leaderStat = houseStats[0];

  // Simulated score
  const simulatedPoints = (selectedStat?.totalPoints || 0) + simGolds * 7;
  const isOvertaking = simulatedPoints > (leaderStat?.totalPoints || 0);
  const simGap = Math.abs((leaderStat?.totalPoints || 0) - simulatedPoints);

  return (
    <div id="decision-support-card" className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              DECISION SUPPORT SYSTEM (DSS) & SIMULASI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analisis automatik peluang kemenangan & simulasi senario mata
            </p>
          </div>
        </div>
      </div>

      {/* Automated Commentary Banner */}
      <div className="bg-indigo-50/70 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 mb-5 relative overflow-hidden">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5 animate-spin-slow" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
              ULASAN TAKTIKAL PINTAR
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {dssScenario.summaryCommentary}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of DSS Metrics & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Metric 1: Remaining Events */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Acara Belum Selesai</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">LIVE</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {dssScenario.remainingEventsCount} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">ACARA</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Menawarkan maksimum <span className="text-amber-600 dark:text-amber-400 font-bold">{dssScenario.totalRemainingPoints} mata</span> pusingan.
          </p>
        </div>

        {/* Metric 2: Leader Gap */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Kedudukan Pendahului (#1)</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{leaderStat?.house.name}</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {leaderStat?.totalPoints} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">MATA</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Kelebihan mendahului naib juara: <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{dssScenario.leadMargin} Mata</span>
          </p>
        </div>

        {/* Interactive Simulator */}
        <div className="bg-purple-50/50 dark:bg-slate-950/80 p-4 rounded-xl border border-purple-200 dark:border-purple-500/30">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 dark:text-purple-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>SIMULASI SENARIO SOKONGAN</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Jika</span>
              <select
                value={simHouseId}
                onChange={(e) => setSimHouseId(e.target.value)}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs flex-1"
              >
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Memenangi</span>
              <select
                value={simGolds}
                onChange={(e) => setSimGolds(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs w-24"
              >
                <option value={1}>1 Emas (+7)</option>
                <option value={2}>2 Emas (+14)</option>
                <option value={3}>3 Emas (+21)</option>
                <option value={4}>4 Emas (+28)</option>
              </select>
            </div>

            {/* Simulation Result */}
            <div className="mt-3 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Mata Baharu:</span>
                <span className="font-bold text-amber-600 dark:text-amber-300">{simulatedPoints} Mata</span>
              </div>
              <div className="mt-1 font-bold">
                {isOvertaking ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    🎉 Berjaya memintas ke kedudukan #1! (+{simGap} mata daripada {leaderStat?.house.name})
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    Ketinggalan {simGap} mata di belakang {leaderStat?.house.name}.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
