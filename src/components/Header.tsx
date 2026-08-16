import React, { useState, useEffect } from 'react';
import {
  Tv,
  Settings,
  Maximize2,
  RotateCcw,
  Award,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Sun,
  Moon,
  Lock,
  KeyRound,
  Unlock,
  Database,
  Cloud,
  Monitor,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  currentMode: 'tv' | 'admin';
  onModeChange: (mode: 'tv' | 'admin') => void;
  onResetData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isAdminUnlocked?: boolean;
  onLockAdmin?: () => void;
  onChangePasswordModal?: () => void;
  isSupabaseConnected?: boolean;
  onOpenSupabaseModal?: () => void;
  layoutMode?: 'desktop' | 'mobile';
  onToggleLayoutMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  onResetData,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  isAdminUnlocked,
  onLockAdmin,
  onChangePasswordModal,
  isSupabaseConnected,
  onOpenSupabaseModal,
  layoutMode = 'desktop',
  onToggleLayoutMode,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ms-MY', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header
      id="main-app-header"
      className={`border-b transition-colors duration-300 ${
        currentMode === 'tv'
          ? 'bg-slate-950/90 text-white border-slate-800 backdrop-blur-md sticky top-0 z-50'
          : 'bg-white text-slate-800 border-slate-200 shadow-xs sticky top-0 z-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 sm:py-0 flex items-center justify-between flex-wrap gap-2">
        {/* Left: School Identity & Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-blue-600 p-0.5 flex items-center justify-center shadow-md shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="font-black text-xs sm:text-base sm:tracking-tight leading-tight truncate">
                SJK(C) CHUNG HWA TENOM
              </h1>
              <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 shrink-0">
                2026
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-400 font-semibold tracking-wide truncate">
              Kejohanan Sukan Tahunan
            </p>
          </div>
        </div>

        {/* Center: Live Time Display */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/50 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-slate-300">LIVE TIME:</span>
          <span className="font-bold text-amber-400">{currentTime || '08:00 AM'}</span>
        </div>

        {/* Right: Mode Switches & Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Supabase Cloud Sync Button */}
          {onOpenSupabaseModal && (
            <button
              id="btn-open-supabase-modal"
              onClick={onOpenSupabaseModal}
              title={
                currentMode === 'admin' && isAdminUnlocked
                  ? 'Konfigurasi Pangkalan Data Supabase (Panel Admin)'
                  : isSupabaseConnected
                  ? 'Status Siaran Langsung (Supabase Live Realtime)'
                  : 'Status Pangkalan Data Supabase'
              }
              className={`flex items-center space-x-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                isSupabaseConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700/50'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline text-[11px]">
                {isSupabaseConnected ? 'Live' : 'DB'}
              </span>
              {isSupabaseConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          )}

          {/* View Layout Mode Switcher (Desktop View vs Mobile View) */}
          {onToggleLayoutMode && (
            <button
              id="btn-toggle-layout-mode"
              onClick={onToggleLayoutMode}
              title={
                layoutMode === 'desktop'
                  ? 'Paparan Desktop Aktif - Klik untuk tukar ke Paparan Telefon (Mobile View)'
                  : 'Paparan Telefon Aktif - Klik untuk tukar ke Paparan Desktop (Desktop View)'
              }
              className={`flex items-center space-x-1.5 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                layoutMode === 'mobile'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/40 hover:bg-indigo-500/30'
              }`}
            >
              {layoutMode === 'mobile' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-[11px] font-bold">
                    <span className="hidden md:inline">Paparan </span>Mobile
                  </span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-[11px] font-bold">
                    <span className="hidden md:inline">Paparan </span>Desktop
                  </span>
                </>
              )}
            </button>
          )}

          {/* Theme Toggle (Dark/Light Mode) */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Tukar ke Mod Terang (Light Mode)' : 'Tukar ke Mod Gelap (Dark Mode)'}
            className={`p-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all border shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-800/80 text-amber-300 border-amber-500/30 hover:bg-slate-700'
                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-700" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            title={soundEnabled ? 'Matikan Bunyi' : 'Aktifkan Bunyi FX'}
            className={`p-1.5 sm:p-2 rounded-lg transition-all shrink-0 ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Mode Switcher Group */}
          <div className="flex bg-slate-900/80 p-0.5 sm:p-1 rounded-xl border border-slate-800 items-center shrink-0">
            <button
              id="mode-switch-tv"
              onClick={() => onModeChange('tv')}
              className={`flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentMode === 'tv'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paparan Awam</span>
              <span className="sm:hidden">TV</span>
            </button>

            <button
              id="mode-switch-admin"
              onClick={() => onModeChange('admin')}
              className={`flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentMode === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panel Admin</span>
              <span className="sm:hidden">Admin</span>
              {isAdminUnlocked ? (
                <Unlock className="w-3 h-3 text-emerald-400 ml-0.5" title="Panel Terbuka" />
              ) : (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Panel Terkunci (Perlu Katalaluan)" />
              )}
            </button>
          </div>

          {/* Fullscreen Button (Active on Public / All Views) */}
          <button
            id="btn-toggle-fullscreen"
            onClick={toggleFullScreen}
            title="Skrin Penuh (Fullscreen - Mod TV & Projeksi)"
            className="p-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all border border-slate-700/50 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 shrink-0 flex items-center space-x-1"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
            <span className="hidden lg:inline text-[11px]">Fullscreen</span>
          </button>

          {/* Admin Security Quick Actions & Reset Button when in Admin mode */}
          {currentMode === 'admin' && (
            <div className="flex items-center space-x-1">
              <button
                id="btn-change-admin-password"
                onClick={onChangePasswordModal}
                title="Tukar Katalaluan Admin"
                className="p-1.5 sm:p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-all border border-slate-700/50 hidden sm:block"
              >
                <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {isAdminUnlocked && onLockAdmin && (
                <button
                  id="btn-lock-admin"
                  onClick={onLockAdmin}
                  title="Kunci Panel Admin Sekarang"
                  className="p-1.5 sm:p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all border border-amber-500/30 hidden sm:block"
                >
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Reset Data Button (Admin Only) */}
              <button
                id="btn-reset-sample-data"
                onClick={onResetData}
                title="Sembuh / Reset Data Sample SJK(C) Chung Hwa 2026 (Admin Sahaja)"
                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
