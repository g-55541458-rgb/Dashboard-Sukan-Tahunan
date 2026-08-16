import React from 'react';
import { EventResult, SportsEvent, SportsHouse } from '../../types';
import { Activity, Flame, Trophy, Sparkles, CheckCircle2, Calendar } from 'lucide-react';

interface RecentResultsFeedProps {
  results: EventResult[];
  events: SportsEvent[];
  houses: SportsHouse[];
}

export const RecentResultsFeed: React.FC<RecentResultsFeedProps> = ({
  results,
  events,
  houses,
}) => {
  const houseMap: { [id: string]: SportsHouse } = {};
  houses.forEach((h) => (houseMap[h.id] = h));

  const eventMap: { [id: string]: SportsEvent } = {};
  events.forEach((e) => (eventMap[e.id] = e));

  // Sort by most recent completed and filter only existing events
  const validSortedResults = [...results]
    .filter((r) => !!eventMap[r.eventId])
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return (
    <div id="recent-results-card" className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              KEPUTUSAN TERKINI
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Penyampai acara & sorotan rekod baharu</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
          {validSortedResults.length} Acara
        </span>
      </div>

      {/* Live Stream List - Fixed height 450px with scrollbar */}
      <div className="space-y-2.5 overflow-y-auto h-[450px] min-h-[450px] max-h-[450px] pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {validSortedResults.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs italic">
            Belum ada keputusan acara direkodkan lagi.
          </div>
        ) : (
          validSortedResults.map((res) => {
            const ev = eventMap[res.eventId];
            const goldHouse = houseMap[res.goldHouseId];
            const silverHouse = houseMap[res.silverHouseId];
            const bronzeHouse = houseMap[res.bronzeHouseId];

            return (
              <div
                key={res.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  res.isNewRecord
                    ? 'bg-amber-50/80 dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-slate-950 dark:to-slate-950 border-amber-300 dark:border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      (ev?.day || 'Hari Pertama') === 'Hari Pertama'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    }`}>
                      <Calendar className="w-2.5 h-2.5" />
                      {ev?.day || 'Hari Pertama'}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-amber-400 border border-slate-300 dark:border-slate-700">
                      {ev ? ev.category : 'ACARA'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {ev ? ev.name : 'Keputusan Acara'}
                    </h4>
                  </div>

                  {res.isNewRecord && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 animate-bounce">
                      <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" /> REKOD BAHARU!
                    </span>
                  )}
                </div>

                {/* Winners Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Gold Winner */}
                  <div className="flex items-center space-x-2 bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-amber-300 dark:border-amber-500/20 shadow-2xs">
                    <span className="text-base">🥇</span>
                    <div className="overflow-hidden">
                      <p className="font-bold text-amber-700 dark:text-amber-300 truncate">{res.goldAthleteName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: goldHouse?.color }} />
                        {goldHouse ? goldHouse.name : ''} {res.goldRecord ? `(${res.goldRecord})` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Silver Winner */}
                  <div className="flex items-center space-x-2 bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-base">🥈</span>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{res.silverAthleteName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: silverHouse?.color }} />
                        {silverHouse ? silverHouse.name : ''} {res.silverRecord ? `(${res.silverRecord})` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Bronze Winner */}
                  <div className="flex items-center space-x-2 bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="text-base">🥉</span>
                    <div className="overflow-hidden">
                      <p className="font-bold text-amber-800 dark:text-amber-600 truncate">{res.bronzeAthleteName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: bronzeHouse?.color }} />
                        {bronzeHouse ? bronzeHouse.name : ''} {res.bronzeRecord ? `(${res.bronzeRecord})` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {res.notes && (
                  <p className="mt-2 text-[11px] text-amber-800 dark:text-amber-300/80 italic font-mono bg-amber-50 dark:bg-slate-900/40 p-1.5 rounded border border-amber-200 dark:border-slate-800">
                    📌 {res.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
