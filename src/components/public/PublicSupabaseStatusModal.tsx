import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import {
  getSupabaseConfig,
  testSupabaseConnection,
} from '../../lib/supabase';

interface PublicSupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: () => void;
}

export const PublicSupabaseStatusModal: React.FC<PublicSupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAdmin,
}) => {
  const [checking, setChecking] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    success: boolean;
    tableReady?: boolean;
    error?: string;
  } | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  const cfg = getSupabaseConfig();
  const hasConfig = Boolean(cfg.url && cfg.anonKey);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await testSupabaseConnection();
      setStatus(res);
      const now = new Date();
      setLastCheckTime(
        now.toLocaleTimeString('ms-MY', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    } catch (e: any) {
      setStatus({ success: false, error: e.message || 'Gagal menyemak status.' });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = hasConfig && status?.success && status.tableReady !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Status Siaran Langsung (Supabase Live)</span>
                {isConnected && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pemantauan masa nyata pelayan awam & penyegerakan skrin TV
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          {/* Realtime Status Indicator Card */}
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3.5 transition-all ${
              isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100'
            }`}
          >
            {isConnected ? (
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">
                  {isConnected
                    ? 'Pangkalan Data Berhubung (Live Realtime Aktif)'
                    : hasConfig
                    ? 'Menyambung / Menunggu Penyegerakan'
                    : 'Pangkalan Data Belum Dikonfigurasi'}
                </h3>
                {lastCheckTime && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Semakan: {lastCheckTime}
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {isConnected
                  ? 'Skor dan keputusan sukan akan dikemas kini serta-merta pada skrin ini secara masa nyata (WebSockets & Live Polling) tanpa perlu memuat semula halaman.'
                  : hasConfig
                  ? 'Sedang mengesahkan status pelayan Supabase. Sila tekan butang Muat Semula di bawah.'
                  : 'Pelayan awan belum disambungkan oleh pentadbir. Keputusan sukan dipaparkan daripada simpanan data semasa.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                Protokol Siaran
              </span>
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>WebSocket + Polling (4s)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                Status Sambungan
              </span>
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                  }`}
                />
                <span>{isConnected ? 'Aktif & Segerak' : 'Bersedia'}</span>
              </div>
            </div>
          </div>

          {/* Admin Lock Notice */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Kawalan Keselamatan Konfigurasi
              </p>
              <p className="mt-0.5">
                Tetapan kunci API, URL pangkalan data, dan skrip SQL hanya boleh diubah suai melalui{' '}
                <strong className="text-slate-800 dark:text-slate-200">Panel Admin</strong> dengan memasukkan kata laluan pentadbir.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <button
            id="btn-public-refresh-status"
            onClick={checkStatus}
            disabled={checking}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Menyemak...' : 'Semak Semula Status'}</span>
          </button>

          <div className="flex items-center space-x-2">
            {onNavigateToAdmin && (
              <button
                id="btn-public-goto-admin"
                onClick={() => {
                  onClose();
                  onNavigateToAdmin();
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all"
              >
                Log Masuk Admin
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
