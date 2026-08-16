import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SportsHouse, SportsEvent, Athlete, EventResult } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  autoSync: boolean;
}

const STORAGE_KEYS = {
  URL: 'supabase_project_url',
  ANON_KEY: 'supabase_anon_key',
  AUTO_SYNC: 'supabase_auto_sync',
  LAST_SYNC: 'supabase_last_sync_time',
};

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- SKRIP SETUP PANGKALAN DATA SUPABASE BAGI KEJOHANAN SUKAN
-- Salin dan tampal skrip ini ke dalam Supabase SQL Editor:
-- ========================================================

-- 1. Cipta Jadual Utama Penyegerakan Kejohanan jika belum ada
CREATE TABLE IF NOT EXISTS public.tournament_sync (
  id TEXT PRIMARY KEY DEFAULT 'current_tournament',
  houses JSONB NOT NULL DEFAULT '[]'::jsonb,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  athletes JSONB NOT NULL DEFAULT '[]'::jsonb,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pastikan kolum serasi jika jadual lama sudah wujud
ALTER TABLE public.tournament_sync ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Membolehkan Row Level Security (RLS)
ALTER TABLE public.tournament_sync ENABLE ROW LEVEL SECURITY;

-- 3. Polisi Akses Awam (Membolehkan Baca & Kemas Kini Markah)
DROP POLICY IF EXISTS "Akses Penuh Baca Awam" ON public.tournament_sync;
CREATE POLICY "Akses Penuh Baca Awam"
  ON public.tournament_sync
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Akses Penuh Tulis/Kemaskini Awam" ON public.tournament_sync;
CREATE POLICY "Akses Penuh Tulis/Kemaskini Awam"
  ON public.tournament_sync
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 4. Masukkan rekod permulaan jika belum wujud
INSERT INTO public.tournament_sync (id, houses, events, athletes, results, updated_at)
VALUES ('current_tournament', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, now())
ON CONFLICT (id) DO NOTHING;

-- 5. Aktifkan Realtime secara selamat (tanpa ralat jika sudah wujud)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_sync;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL; -- abaikan jika sudah wujud
    WHEN OTHERS THEN
      NULL;
  END;
END $$;
`;

let clientInstance: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  // Check URL query parameters (e.g. for parents opening WhatsApp link)
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSb = urlParams.get('sb');
      const urlSbUrl = urlParams.get('sb_url');
      const urlSbKey = urlParams.get('sb_key');

      if (urlSb) {
        const decoded = JSON.parse(atob(decodeURIComponent(urlSb)));
        if (decoded.u && decoded.k) {
          saveSupabaseConfig(decoded.u, decoded.k, true);
          // Clean URL without refresh
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          return { url: decoded.u.trim(), anonKey: decoded.k.trim(), autoSync: true };
        }
      } else if (urlSbUrl && urlSbKey) {
        saveSupabaseConfig(urlSbUrl, urlSbKey, true);
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        return { url: urlSbUrl.trim(), anonKey: urlSbKey.trim(), autoSync: true };
      }
    } catch (e) {
      console.warn('Could not parse Supabase URL params:', e);
    }
  }

  const storedUrl = localStorage.getItem(STORAGE_KEYS.URL) || '';
  const storedKey = localStorage.getItem(STORAGE_KEYS.ANON_KEY) || '';
  const autoSync = localStorage.getItem(STORAGE_KEYS.AUTO_SYNC) !== 'false'; // default true

  return {
    url: (storedUrl || envUrl).trim(),
    anonKey: (storedKey || envKey).trim(),
    autoSync,
  };
}

export function generateParentShareUrl(customBaseUrl?: string): string {
  const cfg = getSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return '';
  const base = customBaseUrl || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '');
  const payload = btoa(JSON.stringify({ u: cfg.url, k: cfg.anonKey }));
  return `${base}?sb=${encodeURIComponent(payload)}`;
}

export function saveSupabaseConfig(url: string, anonKey: string, autoSync: boolean = true): void {
  localStorage.setItem(STORAGE_KEYS.URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
  localStorage.setItem(STORAGE_KEYS.AUTO_SYNC, autoSync ? 'true' : 'false');
  clientInstance = null; // force recreate
  currentConfigKey = '';
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEYS.URL);
  localStorage.removeItem(STORAGE_KEYS.ANON_KEY);
  localStorage.removeItem(STORAGE_KEYS.AUTO_SYNC);
  localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  clientInstance = null;
  currentConfigKey = '';
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  const configKey = `${config.url}___${config.anonKey}`;
  if (clientInstance && currentConfigKey === configKey) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
      },
    });
    currentConfigKey = configKey;
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; tableReady?: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'URL atau Anon Key Supabase belum dikonfigurasikan.' };
  }

  try {
    // Check if tournament_sync table exists and is accessible
    const { data, error } = await client
      .from('tournament_sync')
      .select('id, updated_at')
      .eq('id', 'current_tournament')
      .maybeSingle();

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.tournament_sync" does not exist') || error.message.includes('does not exist')) {
        return {
          success: true,
          tableReady: false,
          message: 'Sambungan ke Supabase berjaya! Sila jalankan skrip SQL dalam Supabase SQL Editor untuk mencipta jadual.',
        };
      }
      return {
        success: false,
        message: `Ralat Supabase: ${error.message} (${error.code || 'UNKNOWN'})`,
      };
    }

    return {
      success: true,
      tableReady: true,
      message: 'Sambungan ke Supabase & Jadual Data Aktif Berjaya!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menyambung ke Supabase: ${err.message || 'Sila semak Project URL dan Anon Key anda.'}`,
    };
  }
}

export async function pushTournamentToSupabase(
  houses: SportsHouse[],
  events: SportsEvent[],
  athletes: Athlete[],
  results: EventResult[]
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase tidak disambungkan.' };
  }

  try {
    const payload = {
      id: 'current_tournament',
      houses,
      events,
      athletes,
      results,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client
      .from('tournament_sync')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return { success: false, message: error.message };
    }

    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toLocaleTimeString());
    return { success: true, message: 'Data kejohanan berjaya disegerakkan ke pangkalan data Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal memuat naik data ke Supabase.' };
  }
}

export async function pullTournamentFromSupabase(): Promise<{
  success: boolean;
  message: string;
  data?: {
    houses: SportsHouse[];
    events: SportsEvent[];
    athletes: Athlete[];
    results: EventResult[];
    updated_at?: string;
  };
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase tidak disambungkan.' };
  }

  try {
    const { data, error } = await client
      .from('tournament_sync')
      .select('*')
      .eq('id', 'current_tournament')
      .maybeSingle();

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data) {
      return {
        success: false,
        message: 'Tiada rekod kejohanan ditemui di Supabase. Sila tolak data awal dari panel admin.',
      };
    }

    return {
      success: true,
      message: 'Data kejohanan berjaya ditarik dari Supabase!',
      data: {
        houses: Array.isArray(data.houses) ? data.houses : [],
        events: Array.isArray(data.events) ? data.events : [],
        athletes: Array.isArray(data.athletes) ? data.athletes : [],
        results: Array.isArray(data.results) ? data.results : [],
        updated_at: data.updated_at,
      },
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal memuat turun data dari Supabase.' };
  }
}

export function subscribeToSupabaseRealtime(
  onDataChange: (payload: {
    houses: SportsHouse[];
    events: SportsEvent[];
    athletes: Athlete[];
    results: EventResult[];
    updated_at: string;
  }) => void
): () => void {
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  try {
    const channel = client
      .channel('public:tournament_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournament_sync', filter: 'id=eq.current_tournament' },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const row = payload.new as any;
            if (row.houses && row.events && row.results) {
              onDataChange({
                houses: row.houses,
                events: row.events,
                athletes: row.athletes || [],
                results: row.results,
                updated_at: row.updated_at || new Date().toISOString(),
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.error('Error subscribing to Supabase realtime:', err);
    return () => {};
  }
}
