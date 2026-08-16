import React from 'react';
import { HouseStats } from '../../types';
import { Award, ShieldAlert, Sparkles } from 'lucide-react';

interface MedalTallyTableProps {
  houseStats: HouseStats[];
}

export const MedalTallyTable: React.FC<MedalTallyTableProps> = ({ houseStats }) => {
  return (
    <div id="medal-tally-card" className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold shadow-md">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              JADUAL PINGAT KEJOHANAN
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kutipan Pingat Emas, Perak, Gangsa & Penalti/Pelarasan Mata
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3">Ked.</th>
              <th className="py-3 px-4">Rumah Sukan</th>
              <th className="py-3 px-3 text-center text-amber-600 dark:text-amber-400 font-bold">🥇 Emas</th>
              <th className="py-3 px-3 text-center text-slate-700 dark:text-slate-300 font-bold">🥈 Perak</th>
              <th className="py-3 px-3 text-center text-amber-800 dark:text-amber-600 font-bold">🥉 Gangsa</th>
              <th className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">Jumlah Pingat</th>
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
                        ? 'bg-amber-400 text-slate-950'
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
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.house.color }} />
                  <span>{stat.house.name}</span>
                </td>
                <td className="py-3.5 px-3 text-center text-amber-600 dark:text-amber-400 font-black text-base">
                  {stat.goldCount}
                </td>
                <td className="py-3.5 px-3 text-center text-slate-800 dark:text-slate-200 font-bold text-base">
                  {stat.silverCount}
                </td>
                <td className="py-3.5 px-3 text-center text-amber-800 dark:text-amber-600 font-bold text-base">
                  {stat.bronzeCount}
                </td>
                <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300 text-base">
                  {stat.totalMedals}
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
                <td className="py-3.5 px-4 text-right font-black text-lg" style={{ color: stat.house.color }}>
                  {stat.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
