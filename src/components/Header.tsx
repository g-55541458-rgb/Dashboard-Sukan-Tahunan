import React, { useState, useEffect } from 'react';
import { Tv, Settings, Maximize2, RotateCcw, Award, Volume2, VolumeX, Sparkles, Trophy, Sun, Moon, Lock, KeyRound, Unlock, Database, Cloud } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: School Identity & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-blue-600 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none">
                SJK(C) CHUNG HWA TENOM
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Kejohanan Sukan Tahunan & Decision Support System
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
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Supabase Cloud Sync Button */}
          {onOpenSupabaseModal && (
            <button
              id="btn-open-supabase-modal"
              onClick={onOpenSupabaseModal}
              title={isSupabaseConnected ? 'Pangkalan Data Supabase Aktif & Disegerakkan' : 'Sambung ke Pangkalan Data Supabase'}
              className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                isSupabaseConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700/50'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline text-[11px]">
                {isSupabaseConnected ? 'Supabase Live' : 'Supabase'}
              </span>
              {isSupabaseConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          )}

          {/* Theme Toggle (Dark/Light Mode) */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Tukar ke Mod Terang (Light Mode)' : 'Tukar ke Mod Gelap (Dark Mode)'}
            className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all border ${
              theme === 'dark'
                ? 'bg-slate-800/80 text-amber-300 border-amber-500/30 hover:bg-slate-700'
                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
            }`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline text-[11px]">Mod Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-700" />
                <span className="hidden lg:inline text-[11px]">Mod Gelap</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            title={soundEnabled ? 'Matikan Bunyi' : 'Aktifkan Bunyi FX'}
            className={`p-2 rounded-lg transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            id="btn-toggle-fullscreen"
            onClick={toggleFullScreen}
            title="Skrin Penuh (Projector Mode)"
            className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-all hidden sm:block"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Mode Switcher Group */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 items-center">
            <button
              id="mode-switch-tv"
              onClick={() => onModeChange('tv')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMode === 'tv'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Paparan Awam (TV)</span>
            </button>

            <button
              id="mode-switch-admin"
              onClick={() => onModeChange('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMode === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Panel Admin</span>
              {isAdminUnlocked ? (
                <Unlock className="w-3 h-3 text-emerald-400 ml-0.5" title="Panel Terbuka" />
              ) : (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Panel Terkunci (Perlu Katalaluan)" />
              )}
            </button>
          </div>

          {/* Admin Security Quick Actions when in Admin mode */}
          {currentMode === 'admin' && (
            <div className="hidden lg:flex items-center space-x-1">
              <button
                id="btn-change-admin-password"
                onClick={onChangePasswordModal}
                title="Tukar Katalaluan Admin"
                className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-all border border-slate-700/50"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              {isAdminUnlocked && onLockAdmin && (
                <button
                  id="btn-lock-admin"
                  onClick={onLockAdmin}
                  title="Kunci Panel Admin Sekarang"
                  className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all border border-amber-500/30"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Reset Data Button */}
          <button
            id="btn-reset-sample-data"
            onClick={onResetData}
            title="Sembuh / Reset Data Sample SJK(C) Chung Hwa 2026"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
