import React from 'react';
import { HouseStats } from '../../types';
import { Award, ShieldAlert, Sparkles } from 'lucide-react';
import { LiveScoreNumber } from './LiveScoreNumber';
import { OlympicMedalIcon, MedalRatioBar } from './OlympicMedalBadge';

interface MedalTallyTableProps {
  houseStats: HouseStats[];
}

export const MedalTallyTable: React.FC<MedalTallyTableProps> = ({ houseStats }) => {
  return (
    <div id="medal-tally-card" className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              JADUAL PINGAT KEJOHANAN
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kutipan Pingat Emas, Perak, Gangsa & Penalti/Pelarasan Mata
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-1">
            <OlympicMedalIcon type="gold" size="xs" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Emas</span>
          </div>
          <div className="flex items-center space-x-1">
            <OlympicMedalIcon type="silver" size="xs" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Perak</span>
          </div>
          <div className="flex items-center space-x-1">
            <OlympicMedalIcon type="bronze" size="xs" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Gangsa</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3">Ked.</th>
              <th className="py-3 px-4">Rumah Sukan</th>
              <th className="py-3 px-3 text-center font-bold">
                <div className="inline-flex items-center justify-center space-x-1 text-amber-700 dark:text-amber-400">
                  <OlympicMedalIcon type="gold" size="sm" />
                  <span>Emas</span>
                </div>
              </th>
              <th className="py-3 px-3 text-center font-bold">
                <div className="inline-flex items-center justify-center space-x-1 text-slate-700 dark:text-slate-300">
                  <OlympicMedalIcon type="silver" size="sm" />
                  <span>Perak</span>
                </div>
              </th>
              <th className="py-3 px-3 text-center font-bold">
                <div className="inline-flex items-center justify-center space-x-1 text-amber-800 dark:text-orange-400">
                  <OlympicMedalIcon type="bronze" size="sm" />
                  <span>Gangsa</span>
                </div>
              </th>
              <th className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">Dominasi Pingat</th>
              <th className="py-3 px-3 text-center font-bold text-amber-600 dark:text-amber-300">Mata Acara</th>
              <th className="py-3 px-3 text-center font-bold text-slate-500 dark:text-slate-400">Bonus/Penalti</th>
              <th className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">JUMLAH MATA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
            {houseStats.map((stat) => (
              <tr
                key={stat.house.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${
                      stat.rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : stat.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : stat.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {stat.rank}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: stat.house.color }} />
                    <span className="truncate">{stat.house.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({stat.house.mascot})</span>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="font-black text-base text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-500/20">
                    {stat.goldCount}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="font-bold text-base text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-0.5 rounded-md border border-slate-300 dark:border-slate-700">
                    {stat.silverCount}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="font-bold text-base text-orange-900 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-md border border-orange-300/60 dark:border-orange-500/20">
                    {stat.bronzeCount}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center min-w-[140px]">
                  <div className="space-y-1">
                    <span className="font-black text-slate-800 dark:text-slate-200 text-xs">
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
                <td className="py-3.5 px-3 text-center font-bold text-amber-600 dark:text-amber-300">
                  {stat.eventPoints}
                </td>
                <td className="py-3.5 px-3 text-center text-xs font-mono">
                  {stat.baselinePoints - stat.penaltyPoints >= 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{stat.baselinePoints - stat.penaltyPoints}</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-bold">-{stat.penaltyPoints - stat.baselinePoints}</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right font-black text-lg">
                  <LiveScoreNumber value={stat.totalPoints} color={stat.house.color} showDiff={false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
