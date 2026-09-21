import React from 'react';

export type MedalType = 'gold' | 'silver' | 'bronze';

interface OlympicMedalIconProps {
  type: MedalType | 1 | 2 | 3;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const OlympicMedalIcon: React.FC<OlympicMedalIconProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const normalizedType: MedalType =
    type === 1 || type === 'gold'
      ? 'gold'
      : type === 2 || type === 'silver'
      ? 'silver'
      : 'bronze';

  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const dim = sizeMap[size];

  if (normalizedType === 'gold') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${dim} shrink-0 drop-shadow-[0_2px_4px_rgba(234,179,8,0.45)] ${className}`}
        aria-label="Pingat Emas"
      >
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="35%" stopColor="#FBC02D" />
            <stop offset="70%" stopColor="#F57F17" />
            <stop offset="100%" stopColor="#FFE082" />
          </linearGradient>
          <linearGradient id="gold-ribbon-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="gold-ribbon-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <radialGradient id="gold-shine" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Ribbon */}
        <path d="M7 2L10 11L12 9L7 2Z" fill="url(#gold-ribbon-l)" />
        <path d="M17 2L14 11L12 9L17 2Z" fill="url(#gold-ribbon-r)" />
        {/* Outer Ring */}
        <circle cx="12" cy="14" r="7.5" fill="url(#gold-gradient)" stroke="#D97706" strokeWidth="0.75" />
        {/* Inner Ring Bevel */}
        <circle cx="12" cy="14" r="5.8" stroke="#FEF3C7" strokeWidth="0.7" strokeDasharray="1.5 1" opacity="0.9" />
        {/* Specular Highlight */}
        <circle cx="12" cy="14" r="5.5" fill="url(#gold-shine)" />
        {/* Center Star / Laurel Emboss */}
        <path
          d="M12 10.5L12.9 12.3L15 12.6L13.5 14L13.8 16.1L12 15.1L10.2 16.1L10.5 14L9 12.6L11.1 12.3L12 10.5Z"
          fill="#78350F"
          opacity="0.95"
        />
      </svg>
    );
  }

  if (normalizedType === 'silver') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${dim} shrink-0 drop-shadow-[0_2px_4px_rgba(148,163,184,0.45)] ${className}`}
        aria-label="Pingat Perak"
      >
        <defs>
          <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E2E8F0" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="silver-ribbon-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="silver-ribbon-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <radialGradient id="silver-shine" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Ribbon */}
        <path d="M7 2L10 11L12 9L7 2Z" fill="url(#silver-ribbon-l)" />
        <path d="M17 2L14 11L12 9L17 2Z" fill="url(#silver-ribbon-r)" />
        {/* Outer Ring */}
        <circle cx="12" cy="14" r="7.5" fill="url(#silver-gradient)" stroke="#64748B" strokeWidth="0.75" />
        {/* Inner Ring Bevel */}
        <circle cx="12" cy="14" r="5.8" stroke="#F8FAFC" strokeWidth="0.7" strokeDasharray="1.5 1" opacity="0.95" />
        {/* Specular Highlight */}
        <circle cx="12" cy="14" r="5.5" fill="url(#silver-shine)" />
        {/* Center Numeral 2 / Star */}
        <path
          d="M12 10.5L12.9 12.3L15 12.6L13.5 14L13.8 16.1L12 15.1L10.2 16.1L10.5 14L9 12.6L11.1 12.3L12 10.5Z"
          fill="#1E293B"
          opacity="0.9"
        />
      </svg>
    );
  }

  // Bronze
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${dim} shrink-0 drop-shadow-[0_2px_4px_rgba(180,83,9,0.4)] ${className}`}
      aria-label="Pingat Gangsa"
    >
      <defs>
        <linearGradient id="bronze-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="35%" stopColor="#EA580C" />
          <stop offset="70%" stopColor="#9A3412" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
        <linearGradient id="bronze-ribbon-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="bronze-ribbon-r" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <radialGradient id="bronze-shine" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#FED7AA" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Ribbon */}
      <path d="M7 2L10 11L12 9L7 2Z" fill="url(#bronze-ribbon-l)" />
      <path d="M17 2L14 11L12 9L17 2Z" fill="url(#bronze-ribbon-r)" />
      {/* Outer Ring */}
      <circle cx="12" cy="14" r="7.5" fill="url(#bronze-gradient)" stroke="#7C2D12" strokeWidth="0.75" />
      {/* Inner Ring Bevel */}
      <circle cx="12" cy="14" r="5.8" stroke="#FFEDD5" strokeWidth="0.7" strokeDasharray="1.5 1" opacity="0.85" />
      {/* Specular Highlight */}
      <circle cx="12" cy="14" r="5.5" fill="url(#bronze-shine)" />
      {/* Center Star */}
      <path
        d="M12 10.5L12.9 12.3L15 12.6L13.5 14L13.8 16.1L12 15.1L10.2 16.1L10.5 14L9 12.6L11.1 12.3L12 10.5Z"
        fill="#431407"
        opacity="0.9"
      />
    </svg>
  );
};

interface OlympicMedalPillProps {
  type: MedalType | 1 | 2 | 3;
  count: number;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const OlympicMedalPill: React.FC<OlympicMedalPillProps> = ({
  type,
  count,
  label,
  size = 'sm',
}) => {
  const normalizedType: MedalType =
    type === 1 || type === 'gold'
      ? 'gold'
      : type === 2 || type === 'silver'
      ? 'silver'
      : 'bronze';

  const styles = {
    gold: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-300/70 dark:border-amber-500/30',
      text: 'text-amber-950 dark:text-amber-200',
      num: 'text-amber-700 dark:text-amber-300 font-black',
    },
    silver: {
      bg: 'bg-slate-100 dark:bg-slate-800/60',
      border: 'border-slate-300 dark:border-slate-700',
      text: 'text-slate-800 dark:text-slate-200',
      num: 'text-slate-900 dark:text-slate-100 font-black',
    },
    bronze: {
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      border: 'border-orange-300/70 dark:border-orange-500/30',
      text: 'text-orange-950 dark:text-orange-200',
      num: 'text-orange-800 dark:text-orange-300 font-black',
    },
  }[normalizedType];

  const padding =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[10px] space-x-1'
      : size === 'sm'
      ? 'px-2 py-0.5 text-xs space-x-1.5'
      : 'px-2.5 py-1 text-sm space-x-2';

  return (
    <div
      className={`inline-flex items-center rounded-lg border shadow-2xs font-semibold ${styles.bg} ${styles.border} ${styles.text} ${padding} transition-all`}
    >
      <OlympicMedalIcon type={normalizedType} size={size} />
      {label && <span className="text-[10px] uppercase font-bold opacity-75">{label}</span>}
      <span className={styles.num}>{count}</span>
    </div>
  );
};

interface MedalRatioBarProps {
  gold: number;
  silver: number;
  bronze: number;
  className?: string;
  showLabels?: boolean;
}

export const MedalRatioBar: React.FC<MedalRatioBarProps> = ({
  gold,
  silver,
  bronze,
  className = '',
  showLabels = false,
}) => {
  const total = gold + silver + bronze;

  if (total === 0) {
    return (
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden ${className}`}>
        <div className="w-full h-full bg-slate-300 dark:bg-slate-700 opacity-40" />
      </div>
    );
  }

  const goldPct = (gold / total) * 100;
  const silverPct = (silver / total) * 100;
  const bronzePct = (bronze / total) * 100;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 flex overflow-hidden p-0.5 gap-0.5 shadow-inner">
        {gold > 0 && (
          <div
            style={{ width: `${goldPct}%` }}
            className="h-full bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 rounded-xs shadow-xs transition-all duration-500"
            title={`Emas: ${gold} (${Math.round(goldPct)}%)`}
          />
        )}
        {silver > 0 && (
          <div
            style={{ width: `${silverPct}%` }}
            className="h-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 rounded-xs shadow-xs transition-all duration-500"
            title={`Perak: ${silver} (${Math.round(silverPct)}%)`}
          />
        )}
        {bronze > 0 && (
          <div
            style={{ width: `${bronzePct}%` }}
            className="h-full bg-gradient-to-r from-orange-400 via-amber-700 to-orange-800 rounded-xs shadow-xs transition-all duration-500"
            title={`Gangsa: ${bronze} (${Math.round(bronzePct)}%)`}
          />
        )}
      </div>

      {showLabels && (
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium px-0.5">
          <span>{total} Pingat Keseluruhan</span>
          <span className="font-mono">
            {Math.round(goldPct)}% E • {Math.round(silverPct)}% P • {Math.round(bronzePct)}% G
          </span>
        </div>
      )}
    </div>
  );
};
