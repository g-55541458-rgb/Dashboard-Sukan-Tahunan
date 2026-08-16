import React, { useState } from 'react';
import { SportsHouse, SportsEvent, Athlete, EventResult, HouseStats, TopAthlete } from '../../types';
import { HouseManagement } from './HouseManagement';
import { EventManagement } from './EventManagement';
import { BulkAthleteImport } from './BulkAthleteImport';
import { ResultEntryForm } from './ResultEntryForm';
import { ReportsAndExport } from './ReportsAndExport';
import { Shield, Trophy, Users, Award, FileText, Settings2, KeyRound, Lock, Database } from 'lucide-react';

interface AdminDashboardProps {
  houses: SportsHouse[];
  events: SportsEvent[];
  athletes: Athlete[];
  results: EventResult[];
  houseStats: HouseStats[];
  topAthletes: { olahragawan: TopAthlete | null; olahragawati: TopAthlete | null };
  onUpdateHouses: (houses: SportsHouse[]) => void;
  onUpdateEvents: (events: SportsEvent[]) => void;
  onUpdateAthletes: (athletes: Athlete[]) => void;
  onSaveResult: (result: EventResult, updatedEvents: SportsEvent[]) => void;
  onResetData: () => void;
  onImportDataJSON: (jsonStr: string) => void;
  soundEnabled: boolean;
  onChangePasswordModal?: () => void;
  onLockAdmin?: () => void;
  isSupabaseConnected?: boolean;
  onOpenSupabaseModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  houses,
  events,
  athletes,
  results,
  houseStats,
  topAthletes,
  onUpdateHouses,
  onUpdateEvents,
  onUpdateAthletes,
  onSaveResult,
  onResetData,
  onImportDataJSON,
  soundEnabled,
  onChangePasswordModal,
  onLockAdmin,
  isSupabaseConnected,
  onOpenSupabaseModal,
}) => {
  const [activeTab, setActiveTab] = useState<'houses' | 'events' | 'athletes' | 'results' | 'reports'>('results');

  return (
    <div id="admin-control-panel" className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 sm:p-6 space-y-6 transition-colors duration-300">
      {/* Admin Panel Header & Sub-Navigation */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              PANEL KAWALAN PENTADBIR (ADMIN CONTROL PANEL)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Sistem Pengurusan & Keputusan Sukan Tahunan SJK(C) Chung Hwa Tenom 2026
            </p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'results'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Input Keputusan</span>
          </button>

          <button
            onClick={() => setActiveTab('athletes')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'athletes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Atlet & Bulk CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Acara & Kategori</span>
          </button>

          <button
            onClick={() => setActiveTab('houses')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'houses'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Rumah Sukan</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laporan & Export</span>
          </button>

          {onOpenSupabaseModal && (
            <button
              id="btn-admin-supabase-sync"
              onClick={onOpenSupabaseModal}
              title="Tetapan & Penyegerakan Pangkalan Data Supabase"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Supabase Cloud</span>
              {isSupabaseConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {onChangePasswordModal && (
            <button
              onClick={onChangePasswordModal}
              title="Tukar Katalaluan Admin"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700/60 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span className="hidden md:inline">Tukar Katalaluan</span>
            </button>
          )}

          {onLockAdmin && (
            <button
              onClick={onLockAdmin}
              title="Kunci Panel Admin"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden md:inline">Kunci Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'results' && (
          <ResultEntryForm
            events={events}
            houses={houses}
            athletes={athletes}
            results={results}
            onSaveResult={onSaveResult}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'athletes' && (
          <BulkAthleteImport
            athletes={athletes}
            houses={houses}
            events={events}
            onUpdateAthletes={onUpdateAthletes}
          />
        )}

        {activeTab === 'events' && (
          <EventManagement events={events} onUpdateEvents={onUpdateEvents} />
        )}

        {activeTab === 'houses' && (
          <HouseManagement houses={houses} onUpdateHouses={onUpdateHouses} />
        )}

        {activeTab === 'reports' && (
          <ReportsAndExport
            houseStats={houseStats}
            events={events}
            results={results}
            houses={houses}
            topAthletes={topAthletes}
            onResetData={onResetData}
            onImportDataJSON={onImportDataJSON}
          />
        )}
      </div>
    </div>
  );
};
