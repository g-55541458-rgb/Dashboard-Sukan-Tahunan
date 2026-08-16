import React from 'react';
import { TopAthlete } from '../../types';
import { Award, Star, Flame, Crown, Medal } from 'lucide-react';

interface OlahragawanSectionProps {
  olahragawan: TopAthlete | null;
  olahragawati: TopAthlete | null;
}

export const OlahragawanSection: React.FC<OlahragawanSectionProps> = ({
  olahragawan,
  olahragawati,
}) => {
  return (
    <div id="olahragawan-card" className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center space-x-3 mb-5">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold shadow-md">
          <Crown className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
            ANUGERAH ATLET TERBAIK KEJOHANAN
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Olahragawan & Olahragawati berdasarkan jumlah pingat dan mata terbanyak
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Olahragawan (Male) */}
        <div className="bg-blue-50/50 dark:bg-slate-950/80 p-4 rounded-xl border border-blue-200 dark:border-blue-500/30 relative overflow-hidden group hover:border-blue-500/60 transition-all">
          <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-blue-600 to-blue-800 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-md">
            OLAHRAGAWAN
          </div>

          {olahragawan ? (
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-slate-900 p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-2xl text-blue-600 dark:text-blue-400">
                  {olahragawan.athlete.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {olahragawan.athlete.name}
                </h4>
                <div className="flex items-center space-x-2 mt-0.5 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Kelas {olahragawan.athlete.className}</span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="font-bold" style={{ color: olahragawan.house.color }}>
                    {olahragawan.house.name}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2 mt-3 text-xs bg-white dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px] sm:text-xs">🥇 {olahragawan.goldCount} Emas</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-[11px] sm:text-xs">🥈 {olahragawan.silverCount} Perak</span>
                  <span className="text-amber-800 dark:text-amber-600 font-bold text-[11px] sm:text-xs">🥉 {olahragawan.bronzeCount} Gangsa</span>
                  <span className="text-amber-600 dark:text-amber-300 font-black ml-auto text-[11px] sm:text-xs">{olahragawan.totalPoints} MATA</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-xs">
              Belum ada keputusan terkumpul untuk Olahragawan.
            </div>
          )}
        </div>

        {/* Olahragawati (Female) */}
        <div className="bg-pink-50/50 dark:bg-slate-950/80 p-4 rounded-xl border border-pink-200 dark:border-pink-500/30 relative overflow-hidden group hover:border-pink-500/60 transition-all">
          <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-pink-600 to-rose-800 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-md">
            OLAHRAGAWATI
          </div>

          {olahragawati ? (
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-slate-900 p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-2xl text-pink-600 dark:text-pink-400">
                  {olahragawati.athlete.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {olahragawati.athlete.name}
                </h4>
                <div className="flex items-center space-x-2 mt-0.5 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Kelas {olahragawati.athlete.className}</span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="font-bold" style={{ color: olahragawati.house.color }}>
                    {olahragawati.house.name}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2 mt-3 text-xs bg-white dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px] sm:text-xs">🥇 {olahragawati.goldCount} Emas</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-[11px] sm:text-xs">🥈 {olahragawati.silverCount} Perak</span>
                  <span className="text-amber-800 dark:text-amber-600 font-bold text-[11px] sm:text-xs">🥉 {olahragawati.bronzeCount} Gangsa</span>
                  <span className="text-amber-600 dark:text-amber-300 font-black ml-auto text-[11px] sm:text-xs">{olahragawati.totalPoints} MATA</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-xs">
              Belum ada keputusan terkumpul untuk Olahragawati.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
