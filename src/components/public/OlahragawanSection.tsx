import React, { useState } from 'react';
import { TopAthlete, BestAthletesResult } from '../../types';
import { Crown, Sparkles, Star, Trophy, Award, Flame } from 'lucide-react';

interface OlahragawanSectionProps {
  topAthletes?: BestAthletesResult;
  olahragawan?: TopAthlete | null;
  olahragawati?: TopAthlete | null;
  olahragawanL12?: TopAthlete | null;
  olahragawatiP12?: TopAthlete | null;
  olahragawanL10?: TopAthlete | null;
  olahragawatiP10?: TopAthlete | null;
}

export const OlahragawanSection: React.FC<OlahragawanSectionProps> = ({
  topAthletes,
  olahragawan,
  olahragawati,
  olahragawanL12: propL12,
  olahragawatiP12: propP12,
  olahragawanL10: propL10,
  olahragawatiP10: propP10,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'senior' | 'junior'>('all');

  const l12 = topAthletes?.olahragawanL12 ?? propL12 ?? null;
  const p12 = topAthletes?.olahragawatiP12 ?? propP12 ?? null;
  const l10 = topAthletes?.olahragawanL10 ?? propL10 ?? null;
  const p10 = topAthletes?.olahragawatiP10 ?? propP10 ?? null;

  const renderAthleteCard = (
    athleteData: TopAthlete | null,
    title: string,
    categoryBadge: string,
    theme: {
      border: string;
      badgeBg: string;
      avatarRing: string;
      avatarText: string;
      hoverBorder: string;
      accentColor: string;
      icon: 'crown' | 'star';
    }
  ) => {
    return (
      <div
        className={`bg-white/70 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border ${theme.border} ${theme.hoverBorder} shadow-lg relative overflow-hidden group transition-all flex flex-col justify-between`}
      >
        <div
          className={`absolute top-0 right-0 px-3 py-1 bg-gradient-to-l ${theme.badgeBg} text-white text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-md flex items-center space-x-1`}
        >
          {theme.icon === 'crown' ? (
            <Crown className="w-3 h-3 text-amber-300" />
          ) : (
            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
          )}
          <span>{categoryBadge}</span>
        </div>

        {athleteData ? (
          <div>
            <div className="flex items-start space-x-3.5 sm:space-x-4">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${theme.avatarRing} p-0.5 shadow-md flex-shrink-0`}
              >
                <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-2xl text-slate-800 dark:text-white">
                  {athleteData.athlete.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-16 sm:pr-20">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                  {title}
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                  {athleteData.athlete.name}
                </h4>
                <div className="flex items-center space-x-2 mt-0.5 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Kelas {athleteData.athlete.className}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span
                    className="font-black px-2 py-0.5 rounded-md text-[11px] shadow-2xs"
                    style={{
                      backgroundColor: `${athleteData.house.color}20`,
                      color: athleteData.house.color,
                      border: `1px solid ${athleteData.house.color}40`,
                    }}
                  >
                    {athleteData.house.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Medal & Score Pills */}
            <div className="grid grid-cols-4 gap-1.5 mt-3 text-center bg-slate-100/80 dark:bg-slate-900/90 p-2 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <div className="bg-amber-500/15 p-1 rounded-lg border border-amber-500/30">
                <span className="text-[10px] text-amber-700 dark:text-amber-300 block font-bold">🥇 Emas</span>
                <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                  {athleteData.goldCount}
                </span>
              </div>
              <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-300 dark:border-slate-700">
                <span className="text-[10px] text-slate-700 dark:text-slate-300 block font-bold">🥈 Perak</span>
                <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">
                  {athleteData.silverCount}
                </span>
              </div>
              <div className="bg-amber-900/15 p-1 rounded-lg border border-amber-900/30">
                <span className="text-[10px] text-amber-900 dark:text-amber-500 block font-bold">🥉 Gangsa</span>
                <span className="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-500">
                  {athleteData.bronzeCount}
                </span>
              </div>
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-1 rounded-lg border border-amber-500/40 flex flex-col justify-center">
                <span className="text-[9px] text-amber-700 dark:text-amber-300 font-bold uppercase">Mata</span>
                <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-300">
                  {athleteData.totalPoints}
                </span>
              </div>
            </div>

            {/* Events Won Tags */}
            {athleteData.eventsWon.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {athleteData.eventsWon.slice(0, 2).map((ev, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 truncate max-w-[180px]"
                  >
                    🏆 {ev}
                  </span>
                ))}
                {athleteData.eventsWon.length > 2 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    +{athleteData.eventsWon.length - 2} lagi
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 dark:text-slate-600 text-xs">
            <Trophy className="w-7 h-7 mx-auto mb-1.5 opacity-40 text-slate-400" />
            <p className="font-bold text-slate-500">Belum ada keputusan terkumpul untuk {title}.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id="olahragawan-card"
      className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-300"
    >
      {/* Top Header with Badge & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold shadow-md">
            <Crown className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                ANUGERAH ATLET TERBAIK KEJOHANAN
              </h3>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase">
                4 Kategori Rasmi
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Senior (L12/P12 - Thn 5 & 6) & Tunas Harapan (L10/P10 - Thn 3 & 4) • Eksklusif acara rasmi (L8, P8 & Pra-Sekolah dikecualikan)
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Semua (4)
          </button>
          <button
            onClick={() => setFilterMode('senior')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'senior'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Senior (L12/P12)
          </button>
          <button
            onClick={() => setFilterMode('junior')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'junior'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Harapan (L10/P10)
          </button>
        </div>
      </div>

      {/* Grid of 4 Cards (or 2 if filtered) */}
      <div
        className={`grid gap-4 ${
          filterMode === 'all'
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {/* 1. OLAHRAGAWAN SENIOR (L12) */}
        {(filterMode === 'all' || filterMode === 'senior') &&
          renderAthleteCard(l12, 'Olahragawan Senior', 'L12 (Bawah 12)', {
            border: 'border-blue-200 dark:border-blue-500/30',
            badgeBg: 'from-blue-600 to-indigo-800',
            avatarRing: 'from-blue-500 to-indigo-900',
            avatarText: 'text-blue-600 dark:text-blue-400',
            hoverBorder: 'hover:border-blue-500/60',
            accentColor: '#3b82f6',
            icon: 'crown',
          })}

        {/* 2. OLAHRAGAWATI SENIOR (P12) */}
        {(filterMode === 'all' || filterMode === 'senior') &&
          renderAthleteCard(p12, 'Olahragawati Senior', 'P12 (Bawah 12)', {
            border: 'border-pink-200 dark:border-pink-500/30',
            badgeBg: 'from-pink-600 to-rose-800',
            avatarRing: 'from-pink-500 to-rose-900',
            avatarText: 'text-pink-600 dark:text-pink-400',
            hoverBorder: 'hover:border-pink-500/60',
            accentColor: '#ec4899',
            icon: 'crown',
          })}

        {/* 3. OLAHRAGAWAN HARAPAN (L10) */}
        {(filterMode === 'all' || filterMode === 'junior') &&
          renderAthleteCard(l10, 'Olahragawan Harapan', 'L10 (Bawah 10)', {
            border: 'border-emerald-200 dark:border-emerald-500/30',
            badgeBg: 'from-emerald-600 to-teal-800',
            avatarRing: 'from-emerald-500 to-teal-900',
            avatarText: 'text-emerald-600 dark:text-emerald-400',
            hoverBorder: 'hover:border-emerald-500/60',
            accentColor: '#10b981',
            icon: 'star',
          })}

        {/* 4. OLAHRAGAWATI HARAPAN (P10) */}
        {(filterMode === 'all' || filterMode === 'junior') &&
          renderAthleteCard(p10, 'Olahragawati Harapan', 'P10 (Bawah 10)', {
            border: 'border-amber-200 dark:border-amber-500/30',
            badgeBg: 'from-amber-600 to-orange-800',
            avatarRing: 'from-amber-500 to-orange-900',
            avatarText: 'text-amber-600 dark:text-amber-400',
            hoverBorder: 'hover:border-amber-500/60',
            accentColor: '#f59e0b',
            icon: 'star',
          })}
      </div>
    </div>
  );
};

