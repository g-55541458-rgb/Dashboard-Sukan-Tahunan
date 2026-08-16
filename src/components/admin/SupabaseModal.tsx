import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Trash2,
  X,
  Code2,
  Share2,
  Smartphone,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  pushTournamentToSupabase,
  pullTournamentFromSupabase,
  generateParentShareUrl,
  SUPABASE_SQL_SCHEMA,
} from '../../lib/supabase';
import { SportsHouse, SportsEvent, Athlete, EventResult } from '../../types';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  houses: SportsHouse[];
  events: SportsEvent[];
  athletes: Athlete[];
  results: EventResult[];
  onDataSynced: (data: {
    houses: SportsHouse[];
    events: SportsEvent[];
    athletes: Athlete[];
    results: EventResult[];
  }) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  houses,
  events,
  athletes,
  results,
  onDataSynced,
}) => {
  const [url, setUrl] = useState<string>('');
  const [anonKey, setAnonKey] = useState<string>('');
  const [autoSync, setAutoSync] = useState<boolean>(true);

  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableReady?: boolean;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState<'push' | 'pull' | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState<boolean>(false);
  const [showSql, setShowSql] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setAutoSync(cfg.autoSync);
      setTestResult(null);
      setActionFeedback(null);

      // Auto test if credentials exist
      if (cfg.url && cfg.anonKey) {
        handleTest(cfg.url, cfg.anonKey);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    saveSupabaseConfig(url, anonKey, autoSync);
    setActionFeedback({
      type: 'success',
      message: 'Tetapan Supabase telah disimpan.',
    });
    await handleTest(url, anonKey);
  };

  const handleTest = async (testUrl = url, testKey = anonKey) => {
    setTesting(true);
    setTestResult(null);
    try {
      saveSupabaseConfig(testUrl, testKey, autoSync);
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e.message || 'Gagal menghubungi pelayan Supabase.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handlePush = async () => {
    setActionLoading('push');
    setActionFeedback(null);
    try {
      const res = await pushTournamentToSupabase(houses, events, athletes, results);
      if (res.success) {
        setActionFeedback({ type: 'success', message: res.message });
      } else {
        setActionFeedback({ type: 'error', message: res.message });
      }
    } catch (e: any) {
      setActionFeedback({ type: 'error', message: e.message || 'Ralat semasa tolak data.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePull = async () => {
    setActionLoading('pull');
    setActionFeedback(null);
    try {
      const res = await pullTournamentFromSupabase();
      if (res.success && res.data) {
        onDataSynced(res.data);
        setActionFeedback({
          type: 'success',
          message: `Berjaya! Ditarik: ${res.data.houses.length} Rumah Sukan, ${res.data.events.length} Acara, ${res.data.results.length} Keputusan.`,
        });
      } else {
        setActionFeedback({ type: 'error', message: res.message });
      }
    } catch (e: any) {
      setActionFeedback({ type: 'error', message: e.message || 'Ralat semasa tarik data.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyParentLink = () => {
    const link = generateParentShareUrl();
    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedShareUrl(true);
      setTimeout(() => setCopiedShareUrl(false), 3000);
    }
  };

  const handleClear = () => {
    if (window.confirm('Adakah anda pasti ingin memutuskan sambungan Supabase?')) {
      clearSupabaseConfig();
      setUrl('');
      setAnonKey('');
      setTestResult(null);
      setActionFeedback({
        type: 'success',
        message: 'Sambungan Supabase telah dipadamkan dari pelayar ini.',
      });
    }
  };

  return (
    <div
      id="supabase-config-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Penyegerakan Pangkalan Data Supabase
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  PostgreSQL Realtime
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sambungkan pangkalan data awan Supabase untuk perkongsian data masa nyata merentasi peranti & TV.
              </p>
            </div>
          </div>

          <button
            id="btn-close-supabase-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Status Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
                testResult.success
                  ? testResult.tableReady !== false
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {testResult.success ? (
                testResult.tableReady !== false ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold">{testResult.message}</p>
                {testResult.tableReady === false && (
                  <p className="mt-1 text-[11px] opacity-90">
                    Klik butang &quot;Salin Skrip SQL&quot; di bawah dan tampal ke dalam{' '}
                    <strong>Supabase &gt; SQL Editor</strong> untuk memulakan jadual dalam 1 saat.
                  </p>
                )}
              </div>
            </div>
          )}

          {actionFeedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
              }`}
            >
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{actionFeedback.message}</span>
            </div>
          )}

          {/* Connection Settings Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Supabase Project URL
              </label>
              <input
                id="input-supabase-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Dapatkan dari Supabase Dashboard &gt; <strong>Project Settings &gt; API &gt; Project URL</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Supabase Anon / Public API Key
              </label>
              <input
                id="input-supabase-anon-key"
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Dapatkan dari Supabase Dashboard &gt; <strong>Project Settings &gt; API &gt; anon public key</strong>.
              </p>
            </div>

            {/* Auto-Sync Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Penyegerakan Automatik (Realtime Auto-Sync)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kemas kini skor secara langsung ke semua skrin TV apabila keputusan disimpan.
                  </div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-supabase-autosync"
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Action Buttons for Form */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                id="btn-save-supabase-config"
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Simpan & Sambung</span>
              </button>

              <button
                id="btn-test-supabase-connection"
                onClick={() => handleTest()}
                disabled={testing || !url || !anonKey}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Menguji Sambungan...' : 'Uji Sambungan'}</span>
              </button>

              {url && (
                <button
                  id="btn-clear-supabase-config"
                  onClick={handleClear}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Padam Konfigurasi</span>
                </button>
              )}
            </div>
          </div>

          {/* Parent & Spectator Live Share Link */}
          {url && anonKey && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Pautan Paparan Langsung Ibu Bapa (WhatsApp / Telegram)</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Auto-Sync Live
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                        Kongsi pautan khas ini kepada ibu bapa dan penonton. Apabila mereka membuka pautan ini, telefon mereka akan <strong>secara automatik berhubung terus ke Supabase</strong> dan menerima skor langsung dalam masa nyata tanpa perlu sebarang tetapan manual!
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-copy-parent-live-link"
                    onClick={handleCopyParentLink}
                    className={`shrink-0 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      copiedShareUrl
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {copiedShareUrl ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Pautan Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Salin Pautan Ibu Bapa</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Push & Pull Actions (Only active if connected) */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Operasi Segerak Segera (Manual Sync)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="btn-push-to-supabase"
                onClick={handlePush}
                disabled={actionLoading !== null || !url || !anonKey}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 transition-all disabled:opacity-50"
              >
                <UploadCloud className={`w-4 h-4 ${actionLoading === 'push' ? 'animate-bounce' : ''}`} />
                <div className="text-left">
                  <div className="text-xs font-bold">Tolak Data Ke Supabase (Upload)</div>
                  <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80">
                    Hantar data tempatan ({results.length} keputusan) ke Supabase
                  </div>
                </div>
              </button>

              <button
                id="btn-pull-from-supabase"
                onClick={handlePull}
                disabled={actionLoading !== null || !url || !anonKey}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/60 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 transition-all disabled:opacity-50"
              >
                <DownloadCloud className={`w-4 h-4 ${actionLoading === 'pull' ? 'animate-bounce' : ''}`} />
                <div className="text-left">
                  <div className="text-xs font-bold">Tarik Data Dari Supabase (Download)</div>
                  <div className="text-[10px] text-purple-600/80 dark:text-purple-400/80">
                    Muat turun data terkini dari awan ke pelayar ini
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* One-Click SQL Schema Setup */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowSql(!showSql)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5 hover:underline"
              >
                <Code2 className="w-4 h-4" />
                <span>{showSql ? 'Sembunyikan Skrip SQL Supabase' : 'Lihat Skrip SQL Setup (Untuk Supabase SQL Editor)'}</span>
              </button>

              <button
                id="btn-copy-supabase-sql"
                onClick={handleCopySql}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Skrip SQL</span>
                  </>
                )}
              </button>
            </div>

            {showSql && (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <span>Buka Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            id="btn-finish-supabase-modal"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
