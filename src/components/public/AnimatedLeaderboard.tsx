import React from 'react';
import { motion } from 'motion/react';
import { HouseStats } from '../../types';
import { Flame, Waves, Zap, Crown, Trophy, TrendingUp, Sparkles } from 'lucide-react';

interface AnimatedLeaderboardProps {
  houseStats: HouseStats[];
}

export const AnimatedLeaderboard: React.FC<AnimatedLeaderboardProps> = ({ houseStats }) => {
  const maxPoints = Math.max(...houseStats.map((s) => s.totalPoints), 0);

  const getHouseIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-6 h-6 text-red-500 animate-pulse" />;
      case 'Waves':
        return <Waves className="w-6 h-6 text-blue-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-emerald-400" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-400" />;
      default:
        return <Trophy className="w-6 h-6 text-amber-400" />;
    }
  };

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-300';
      case 2:
        return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-950 font-bold shadow-md';
      case 3:
        return 'bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-bold';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const getRankTitle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'JUARA SEMENTARA';
      case 2:
        return 'NAIB JUARA';
      case 3:
        return 'TEMPAT KE-3';
      default:
        return 'TEMPAT KE-4';
    }
  };

  return (
    <div id="live-leaderboard-card" className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-wide text-slate-900 dark:text-white uppercase flex items-center flex-wrap gap-1.5 sm:gap-2">
              <span>KEDUDUKAN MATA RUMAH SUKAN</span>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30">
                <Sparkles className="w-3 h-3" /> LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Kedudukan semasa berasaskan jumlah mata kumpul & pingat kejohanan
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Mata Terkumpul</span>
        </div>
      </div>

      {/* House Animated Bar Cards */}
      <div className="space-y-4">
        {houseStats.map((stat, index) => {
          const house = stat.house;
          const topLeaderPoints = houseStats[0]?.totalPoints || 0;
          const percentage = topLeaderPoints > 0
            ? Math.min(Math.round((stat.totalPoints / topLeaderPoints) * 100), 100)
            : 0;
          const isLeader = stat.rank === 1;

          return (
            <motion.div
              key={house.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isLeader
                  ? 'bg-amber-50/70 dark:bg-slate-950/80 border-amber-400 dark:border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400 dark:ring-amber-500/20'
                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* House Identity Bar Overlay */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2 z-10 relative">
                <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                  {/* Rank Badge */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm shrink-0 ${getRankBadgeClass(stat.rank)}`}>
                    #{stat.rank}
                  </div>

                  {/* House Icon & Name */}
                  <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                      {getHouseIcon(house.iconName, house.color)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
                        <span className="font-extrabold text-base sm:text-lg truncate" style={{ color: house.color }}>
                          {house.name}
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shrink-0">
                          {house.mascot}
                        </span>
                        {isLeader && (
                          <span className="hidden sm:inline-flex items-center text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 animate-pulse">
                            {getRankTitle(stat.rank)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                        Ketua: <span className="text-slate-700 dark:text-slate-300 font-medium">{house.leaderName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score & Medals Summary */}
                <div className="text-right ml-auto shrink-0">
                  <div className="text-xl sm:text-3xl font-black tracking-tight flex items-baseline justify-end gap-1">
                    <span style={{ color: house.color }}>{stat.totalPoints}</span>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">MATA</span>
                  </div>

                  <div className="flex items-center justify-end space-x-1.5 sm:space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    <span className="flex items-center text-amber-600 dark:text-amber-400 font-bold text-[11px] sm:text-xs" title="Pingat Emas">
                      🥇 {stat.goldCount}
                    </span>
                    <span className="flex items-center text-slate-700 dark:text-slate-300 font-bold text-[11px] sm:text-xs" title="Pingat Perak">
                      🥈 {stat.silverCount}
                    </span>
                    <span className="flex items-center text-amber-800 dark:text-amber-600 font-bold text-[11px] sm:text-xs" title="Pingat Gangsa">
                      🥉 {stat.bronzeCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Horizontal Progress Bar */}
              <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800 relative mt-3">
                <motion.div
                  className="h-full rounded-full transition-all duration-1000 relative"
                  style={{
                    backgroundColor: house.color,
                    boxShadow: `0 0 12px ${house.color}80`,
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${stat.totalPoints > 0 ? Math.max(percentage, 5) : 0}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
              </div>

              {/* Gap to Leader Indicator */}
              {stat.rank > 1 && houseStats[0] && (
                <div className="mt-2 text-right">
                  <span className="text-[11px] font-mono text-slate-400">
                    Jurang ke Juara: <span className="text-red-400 font-bold">-{houseStats[0].totalPoints - stat.totalPoints} Mata</span>
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
