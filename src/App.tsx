/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { PublicTvDashboard } from './components/public/PublicTvDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPasswordModal } from './components/admin/AdminPasswordModal';
import { ChangePasswordModal } from './components/admin/ChangePasswordModal';
import { SupabaseModal } from './components/admin/SupabaseModal';
import { RotateCcw, AlertTriangle } from 'lucide-react';

import { SportsHouse, SportsEvent, Athlete, EventResult } from './types';
import {
  loadHouses,
  saveHouses,
  loadEvents,
  saveEvents,
  loadAthletes,
  saveAthletes,
  loadResults,
  saveResults,
  resetToSampleData,
} from './utils/storage';
import { calculateHouseStats, getTopAthletes, generateDSSAnalytics } from './utils/calculations';
import {
  getSupabaseConfig,
  testSupabaseConnection,
  pushTournamentToSupabase,
  pullTournamentFromSupabase,
  subscribeToSupabaseRealtime,
} from './lib/supabase';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'tv' | 'admin'>('tv');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Supabase Integration State
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Auto-verify and connect to Supabase
  const checkSupabaseStatus = useCallback(async () => {
    const cfg = getSupabaseConfig();
    if (cfg.url && cfg.anonKey) {
      const res = await testSupabaseConnection();
      const ready = res.success && res.tableReady !== false;
      setIsSupabaseConnected(ready);
      if (ready && cfg.autoSync) {
        // Pull initial data if available
        const pullRes = await pullTournamentFromSupabase();
        if (pullRes.success && pullRes.data && (pullRes.data.houses.length > 0 || pullRes.data.results.length > 0)) {
          setHouses(pullRes.data.houses);
          setEvents(pullRes.data.events);
          setAthletes(pullRes.data.athletes);
          setResults(pullRes.data.results);
        }
      }
    } else {
      setIsSupabaseConnected(false);
    }
  }, []);

  useEffect(() => {
    checkSupabaseStatus();
  }, [checkSupabaseStatus]);

  // Realtime subscription & resilient polling for live TV and parent links
  useEffect(() => {
    const cfg = getSupabaseConfig();
    if (!cfg.url || !cfg.anonKey || !cfg.autoSync || !isSupabaseConnected) return;

    // 1. Supabase Postgres Changes WebSocket Subscription
    const unsubscribe = subscribeToSupabaseRealtime((payload) => {
      if (payload.houses && payload.events && payload.results) {
        setHouses(payload.houses);
        setEvents(payload.events);
        setAthletes(payload.athletes);
        setResults(payload.results);
      }
    });

    // 2. Resilient Polling Fallback (Every 4 seconds for instant updates on mobile networks)
    const pollInterval = setInterval(async () => {
      try {
        const pullRes = await pullTournamentFromSupabase();
        if (pullRes.success && pullRes.data && (pullRes.data.houses.length > 0 || pullRes.data.results.length > 0)) {
          setHouses(pullRes.data.houses);
          setEvents(pullRes.data.events);
          setAthletes(pullRes.data.athletes);
          setResults(pullRes.data.results);
        }
      } catch (err) {
        // Silent fail on background poll
      }
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [isSupabaseConnected]);

  // Admin Security Password State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('admin_password') || '1234';
  });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showChangePassModal, setShowChangePassModal] = useState<boolean>(false);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('app_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleModeChange = (targetMode: 'tv' | 'admin') => {
    if (targetMode === 'admin') {
      if (isAdminUnlocked) {
        setCurrentMode('admin');
      } else {
        setShowPasswordModal(true);
      }
    } else {
      setCurrentMode('tv');
    }
  };

  const handleUnlockSuccess = () => {
    setIsAdminUnlocked(true);
    setShowPasswordModal(false);
    setCurrentMode('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setCurrentMode('tv');
  };

  const handleSaveNewPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('admin_password', newPass);
  };

  // Core Data State
  const [houses, setHouses] = useState<SportsHouse[]>(() => loadHouses());
  const [events, setEvents] = useState<SportsEvent[]>(() => loadEvents());
  const [athletes, setAthletes] = useState<Athlete[]>(() => loadAthletes());
  const [results, setResults] = useState<EventResult[]>(() => loadResults());

  // Save to LocalStorage on state changes
  useEffect(() => {
    saveHouses(houses);
  }, [houses]);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  useEffect(() => {
    saveAthletes(athletes);
  }, [athletes]);

  useEffect(() => {
    saveResults(results);
  }, [results]);

  // Derived Calculations
  const houseStats = useMemo(() => {
    return calculateHouseStats(houses, events, results);
  }, [houses, events, results]);

  const topAthletes = useMemo(() => {
    return getTopAthletes(athletes, houses, results, events);
  }, [athletes, houses, results, events]);

  const dssScenario = useMemo(() => {
    return generateDSSAnalytics(houseStats, events, results);
  }, [houseStats, events, results]);

  // Background sync helper
  const syncToSupabaseIfEnabled = useCallback(
    (h: SportsHouse[], e: SportsEvent[], a: Athlete[], r: EventResult[]) => {
      const cfg = getSupabaseConfig();
      if (cfg.url && cfg.anonKey && cfg.autoSync && isSupabaseConnected) {
        pushTournamentToSupabase(h, e, a, r).catch((err) => {
          console.error('Background Supabase sync error:', err);
        });
      }
    },
    [isSupabaseConnected]
  );

  // Handlers
  const handleUpdateHouses = (updated: SportsHouse[]) => {
    setHouses(updated);
    const validHouseIds = new Set(updated.map((h) => h.id));
    const filteredAthletes = athletes.filter((a) => validHouseIds.has(a.houseId));
    setAthletes(filteredAthletes);
    syncToSupabaseIfEnabled(updated, events, filteredAthletes, results);
  };

  const handleUpdateEvents = (updated: SportsEvent[]) => {
    setEvents(updated);
    // Purge results belonging to deleted events
    const validEventIds = new Set(updated.map((e) => e.id));
    const filteredResults = results.filter((r) => validEventIds.has(r.eventId));
    setResults(filteredResults);
    syncToSupabaseIfEnabled(houses, updated, athletes, filteredResults);
  };

  const handleUpdateAthletes = (updated: Athlete[]) => {
    setAthletes(updated);
    syncToSupabaseIfEnabled(houses, events, updated, results);
  };

  const handleSaveResult = (newResult: EventResult, updatedEvents: SportsEvent[]) => {
    // Add or update result
    const existingIndex = results.findIndex((r) => r.eventId === newResult.eventId);
    let updatedResultsList: EventResult[];
    if (existingIndex >= 0) {
      updatedResultsList = [...results];
      updatedResultsList[existingIndex] = newResult;
    } else {
      updatedResultsList = [newResult, ...results];
    }

    setResults(updatedResultsList);
    setEvents(updatedEvents);
    syncToSupabaseIfEnabled(houses, updatedEvents, athletes, updatedResultsList);

    // Audio cue
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.log('Audio Context error:', e);
      }
    }
  };

  const handleTriggerResetModal = () => {
    setShowResetModal(true);
  };

  const confirmResetData = () => {
    const reset = resetToSampleData();
    setHouses(reset.houses);
    setEvents(reset.events);
    setAthletes(reset.athletes);
    setResults(reset.results);
    setShowResetModal(false);
  };

  const handleImportDataJSON = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.houses && parsed.events && parsed.results) {
        setHouses(parsed.houses);
        setEvents(parsed.events);
        if (parsed.athletes) setAthletes(parsed.athletes);
        setResults(parsed.results);
      }
    } catch (e) {
      console.error('Invalid JSON file format:', e);
    }
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <Header
        currentMode={currentMode}
        onModeChange={handleModeChange}
        onResetData={handleTriggerResetModal}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isAdminUnlocked={isAdminUnlocked}
        onLockAdmin={handleLockAdmin}
        onChangePasswordModal={() => setShowChangePassModal(true)}
        isSupabaseConnected={isSupabaseConnected}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
      />

      <main>
        {currentMode === 'tv' ? (
          <PublicTvDashboard
            houses={houses}
            events={events}
            athletes={athletes}
            results={results}
            houseStats={houseStats}
            topAthletes={topAthletes}
            dssScenario={dssScenario}
          />
        ) : (
          <AdminDashboard
            houses={houses}
            events={events}
            athletes={athletes}
            results={results}
            houseStats={houseStats}
            topAthletes={topAthletes}
            onUpdateHouses={handleUpdateHouses}
            onUpdateEvents={handleUpdateEvents}
            onUpdateAthletes={handleUpdateAthletes}
            onSaveResult={handleSaveResult}
            onResetData={handleTriggerResetModal}
            onImportDataJSON={handleImportDataJSON}
            soundEnabled={soundEnabled}
            onChangePasswordModal={() => setShowChangePassModal(true)}
            onLockAdmin={handleLockAdmin}
            isSupabaseConnected={isSupabaseConnected}
            onOpenSupabaseModal={() => setShowSupabaseModal(true)}
          />
        )}
      </main>

      {/* Supabase Cloud Database Sync Modal */}
      <SupabaseModal
        isOpen={showSupabaseModal}
        onClose={() => {
          setShowSupabaseModal(false);
          checkSupabaseStatus();
        }}
        houses={houses}
        events={events}
        athletes={athletes}
        results={results}
        onDataSynced={(syncedData) => {
          setHouses(syncedData.houses);
          setEvents(syncedData.events);
          setAthletes(syncedData.athletes);
          setResults(syncedData.results);
          setIsSupabaseConnected(true);
        }}
      />

      {/* Admin Password Unlock Modal */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handleUnlockSuccess}
        adminPassword={adminPassword}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassModal}
        onClose={() => setShowChangePassModal(false)}
        currentPassword={adminPassword}
        onSaveNewPassword={handleSaveNewPassword}
      />

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-xl">
                <RotateCcw className="w-6 h-6 text-red-600 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Reset Data Sampel Baharu</h3>
                <p className="text-xs text-slate-500 font-semibold">SJK(C) Chung Hwa Tenom 2026</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Adakah anda pasti mahu memulihkan dan mereset semula semua data kejohanan kepada preset sampel asal sekolah? Semua data peranti akan digantikan dengan tetapan preset baharu.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmResetData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ya, Reset Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
