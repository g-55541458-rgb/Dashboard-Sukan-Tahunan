import React, { useState } from 'react';
import { HouseStats, SportsEvent, EventResult, SportsHouse, TopAthlete } from '../../types';
import { Printer, Download, Upload, FileText, ExternalLink, X, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';

interface ReportsAndExportProps {
  houseStats: HouseStats[];
  events: SportsEvent[];
  results: EventResult[];
  houses: SportsHouse[];
  topAthletes: { olahragawan: TopAthlete | null; olahragawati: TopAthlete | null };
  onResetData: () => void;
  onImportDataJSON: (jsonStr: string) => void;
}

export const ReportsAndExport: React.FC<ReportsAndExportProps> = ({
  houseStats,
  events,
  results,
  houses,
  topAthletes,
  onResetData,
  onImportDataJSON,
}) => {
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const houseMap: { [id: string]: SportsHouse } = {};
  houses.forEach((h) => (houseMap[h.id] = h));

  const eventMap: { [id: string]: SportsEvent } = {};
  events.forEach((e) => (eventMap[e.id] = e));

  // Generate complete self-contained HTML for print / tab / download
  const generateFullReportHTML = () => {
    const dateStr = new Date().toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' });

    const standingsRows = houseStats
      .map(
        (st) => `
      <tr>
        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:bold;">${st.rank}</td>
        <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold; color:${st.house.color};">
          ${st.house.name} (${st.house.mascot})
        </td>
        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:bold; color:#d97706;">${st.goldCount}</td>
        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:bold; color:#475569;">${st.silverCount}</td>
        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-weight:bold; color:#92400e;">${st.bronzeCount}</td>
        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; font-family:monospace;">+${st.baselinePoints} / -${st.penaltyPoints}</td>
        <td style="padding:6px; border:1px solid #cbd5e1; text-align:right; font-weight:900; font-size:13px;">${st.totalPoints}</td>
      </tr>
    `
      )
      .join('');

    const completedResultsRows = results
      .map((res) => {
        const ev = eventMap[res.eventId];
        const goldH = houseMap[res.goldHouseId];
        const silverH = houseMap[res.silverHouseId];
        const bronzeH = houseMap[res.bronzeHouseId];
        return `
        <tr>
          <td style="padding:5px; border:1px solid #cbd5e1; font-weight:bold;">${ev?.day || 'Hari 1'} (${ev?.category || '-'})</td>
          <td style="padding:5px; border:1px solid #cbd5e1; font-weight:bold;">${ev?.name || 'Acara'}</td>
          <td style="padding:5px; border:1px solid #cbd5e1;">
            <strong>${res.goldAthleteName}</strong> <span style="color:#64748b; font-size:10px;">(${goldH?.name.replace('Rumah ', '') || '-'})</span>
            ${res.goldRecord ? `<div style="color:#b45309; font-size:10px; font-family:monospace;">${res.goldRecord}</div>` : ''}
          </td>
          <td style="padding:5px; border:1px solid #cbd5e1;">
            <strong>${res.silverAthleteName}</strong> <span style="color:#64748b; font-size:10px;">(${silverH?.name.replace('Rumah ', '') || '-'})</span>
          </td>
          <td style="padding:5px; border:1px solid #cbd5e1;">
            <strong>${res.bronzeAthleteName}</strong> <span style="color:#64748b; font-size:10px;">(${bronzeH?.name.replace('Rumah ', '') || '-'})</span>
          </td>
          <td style="padding:5px; border:1px solid #cbd5e1; text-align:center; font-size:10px;">
            ${res.isNewRecord ? '<span style="color:#d97706; font-weight:bold;">★ Rekod Baharu</span>' : '-'}
          </td>
        </tr>
      `;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Laporan Rasmi Kejohanan Sukan SJK(C) Chung Hwa Tenom 2026</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 20px;
      font-size: 11px;
      line-height: 1.4;
    }
    .print-bar {
      background: #1e293b;
      color: #ffffff;
      padding: 12px 20px;
      margin: -20px -20px 20px -20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #3b82f6;
    }
    .print-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 18px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .print-btn:hover { background: #1d4ed8; }
    @media print {
      .print-bar { display: none !important; }
      body { padding: 0 !important; }
    }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
    .header h1 { font-size: 20px; margin: 0; font-weight: 900; letter-spacing: 0.5px; }
    .header h2 { font-size: 15px; margin: 4px 0 0 0; font-weight: 800; color: #dc2626; }
    .header p { margin: 4px 0 0 0; color: #64748b; font-family: monospace; font-size: 11px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1e293b; margin: 15px 0 6px 0; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 11px; }
    th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; text-align: left; padding: 6px; border: 1px solid #cbd5e1; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
    .card { border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; background: #fafafa; }
    .signatures { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: center; }
    .sig-line { border-bottom: 1px solid #64748b; width: 180px; margin: 0 auto 6px auto; }
  </style>
</head>
<body onload="setTimeout(function(){ window.print(); }, 500)">
  <div class="print-bar">
    <div>
      <strong>Laporan Rasmi Kejohanan Sukan 2026</strong> — SJK(C) Chung Hwa Tenom
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Cetak Halaman / Simpan PDF</button>
  </div>

  <div class="header">
    <h1>SJK(C) CHUNG HWA TENOM</h1>
    <h2>LAPORAN RASMI KEJOHANAN SUKAN TAHUNAN 2026</h2>
    <p>Tarikh Cetakan: ${dateStr}</p>
  </div>

  <div class="section-title">1. Keputusan Kedudukan Rumah Sukan Keseluruhan</div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px; text-align: center;">Ked.</th>
        <th>Rumah Sukan</th>
        <th style="text-align: center;">🥇 Emas</th>
        <th style="text-align: center;">🥈 Perak</th>
        <th style="text-align: center;">🥉 Gangsa</th>
        <th style="text-align: center;">Pelarasan Mata</th>
        <th style="text-align: right;">JUMLAH MATA</th>
      </tr>
    </thead>
    <tbody>
      ${standingsRows}
    </tbody>
  </table>

  <div class="grid-2">
    <div class="card">
      <div style="color: #2563eb; font-weight: bold; text-transform: uppercase; font-size: 10px;">Olahragawan (Lelaki Terbaik)</div>
      <div style="font-size: 13px; font-weight: 800; margin-top: 2px;">${topAthletes.olahragawan?.athlete.name || 'N/A'}</div>
      <div style="color: #64748b; font-size: 11px;">${topAthletes.olahragawan?.house.name || ''} • ${topAthletes.olahragawan?.goldCount || 0} Emas (${topAthletes.olahragawan?.totalPoints || 0} Mata)</div>
    </div>
    <div class="card">
      <div style="color: #db2777; font-weight: bold; text-transform: uppercase; font-size: 10px;">Olahragawati (Perempuan Terbaik)</div>
      <div style="font-size: 13px; font-weight: 800; margin-top: 2px;">${topAthletes.olahragawati?.athlete.name || 'N/A'}</div>
      <div style="color: #64748b; font-size: 11px;">${topAthletes.olahragawati?.house.name || ''} • ${topAthletes.olahragawati?.goldCount || 0} Emas (${topAthletes.olahragawati?.totalPoints || 0} Mata)</div>
    </div>
  </div>

  ${
    results.length > 0
      ? `
    <div class="section-title" style="margin-top: 20px;">2. Ringkasan Pemenang Acara Kejohanan (${results.length} Acara Selesai)</div>
    <table>
      <thead>
        <tr>
          <th>Hari & Kat.</th>
          <th>Nama Acara</th>
          <th>🥇 Emas</th>
          <th>🥈 Perak</th>
          <th>🥉 Gangsa</th>
          <th style="text-align: center;">Status Rekod</th>
        </tr>
      </thead>
      <tbody>
        ${completedResultsRows}
      </tbody>
    </table>
  `
      : ''
  }

  <div class="signatures">
    <div>
      <div class="sig-line"></div>
      <div style="font-weight: bold;">Setiausaha Sukan SJK(C) Chung Hwa Tenom</div>
    </div>
    <div>
      <div class="sig-line"></div>
      <div style="font-weight: bold;">Guru Besar SJK(C) Chung Hwa Tenom</div>
    </div>
  </div>
</body>
</html>`;
  };

  // Method A: Open in Standalone Tab via Blob URL (100% works for window.print())
  const handleOpenNewTabPrint = () => {
    const htmlStr = generateFullReportHTML();
    const blob = new Blob([htmlStr], { type: 'text/html;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (!win) {
      alert('Sila benarkan pop-up pada pelayar web anda untuk membuka halaman cetakan.');
    }
  };

  // Method B: Download Standalone HTML file
  const handleDownloadHTMLReport = () => {
    const htmlStr = generateFullReportHTML();
    const blob = new Blob([htmlStr], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Sukan_SJKC_Chung_Hwa_Tenom_2026.html`;
    a.click();
  };

  // Method C: In-app direct print attempt
  const handleDirectPrint = () => {
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.warn('Direct print error:', e);
      handleOpenNewTabPrint();
    }
  };

  const handleExportJSON = () => {
    const dataToExport = {
      houses,
      events,
      results,
      exportedAt: new Date().toISOString(),
      school: 'SJK(C) Chung Hwa Tenom 2026',
    };
    const jsonBlob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SJKC_ChungHwa_Sukan_2026_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        try {
          onImportDataJSON(content);
          alert('Data kejohanan berjaya diimport daripada JSON!');
        } catch (err) {
          alert('Ralat semasa membaca fail JSON backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Laporan Berekod Kejohanan & Export Backup Data
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cetak laporan rasmi kejohanan atau eksport data untuk perancangan rekod sekolah.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* Main Print Trigger Button */}
          <button
            onClick={() => {
              setShowPrintModal(true);
              handleOpenNewTabPrint();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-black transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Rasmi</span>
          </button>

          <button
            onClick={handleDownloadHTMLReport}
            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            title="Muat turun fail laporan HTML sedia cetak"
          >
            <FileCode className="w-4 h-4" />
            <span>Muat Turun Laporan (HTML)</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export JSON Backup</span>
          </button>

          <label className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Embedded Printable Report View */}
      <div id="printable-report" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none">
        {/* Printable Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-black text-slate-900">SJK(C) CHUNG HWA TENOM</h1>
          <h2 className="text-lg font-bold text-red-600 mt-0.5">
            LAPORAN RASMI KEJOHANAN SUKAN TAHUNAN 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Tarikh Cetakan:{' '}
            {new Date().toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Final Standings Table */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
            1. Keputusan Kedudukan Rumah Sukan Keseluruhan
          </h3>
          <table className="w-full text-left text-xs text-slate-800 border">
            <thead className="bg-slate-100 font-bold border-b">
              <tr>
                <th className="p-2 border-r">Ked.</th>
                <th className="p-2 border-r">Rumah Sukan</th>
                <th className="p-2 border-r text-center">Emas</th>
                <th className="p-2 border-r text-center">Perak</th>
                <th className="p-2 border-r text-center">Gangsa</th>
                <th className="p-2 border-r text-center">Pelarasan</th>
                <th className="p-2 text-right font-black">JUMLAH MATA</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium">
              {houseStats.map((st) => (
                <tr key={st.house.id}>
                  <td className="p-2 border-r font-bold">{st.rank}</td>
                  <td className="p-2 border-r font-extrabold" style={{ color: st.house.color }}>
                    {st.house.name} ({st.house.mascot})
                  </td>
                  <td className="p-2 border-r text-center font-bold text-amber-600">{st.goldCount}</td>
                  <td className="p-2 border-r text-center font-bold text-slate-600">{st.silverCount}</td>
                  <td className="p-2 border-r text-center font-bold text-amber-800">{st.bronzeCount}</td>
                  <td className="p-2 border-r text-center font-mono">
                    +{st.baselinePoints} / -{st.penaltyPoints}
                  </td>
                  <td className="p-2 text-right font-black text-sm">{st.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Athletes Summary */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="border p-3 rounded-xl">
            <span className="text-xs font-bold text-blue-600 uppercase">Olahragawan (Lelaki Terbaik)</span>
            <p className="font-extrabold text-sm text-slate-900 mt-1">
              {topAthletes.olahragawan?.athlete.name || 'N/A'}
            </p>
            <p className="text-xs text-slate-500">
              {topAthletes.olahragawan?.house.name} • {topAthletes.olahragawan?.goldCount} Emas (
              {topAthletes.olahragawan?.totalPoints} Mata)
            </p>
          </div>

          <div className="border p-3 rounded-xl">
            <span className="text-xs font-bold text-pink-600 uppercase">
              Olahragawati (Perempuan Terbaik)
            </span>
            <p className="font-extrabold text-sm text-slate-900 mt-1">
              {topAthletes.olahragawati?.athlete.name || 'N/A'}
            </p>
            <p className="text-xs text-slate-500">
              {topAthletes.olahragawati?.house.name} • {topAthletes.olahragawati?.goldCount} Emas (
              {topAthletes.olahragawati?.totalPoints} Mata)
            </p>
          </div>
        </div>

        {/* Completed Events Breakdown */}
        {results.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
              2. Ringkasan Pemenang Acara Kejohanan ({results.length} Acara Selesai)
            </h3>
            <table className="w-full text-left text-[11px] text-slate-800 border">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-1.5 border-r">Hari & Kat.</th>
                  <th className="p-1.5 border-r">Nama Acara</th>
                  <th className="p-1.5 border-r">🥇 Emas</th>
                  <th className="p-1.5 border-r">🥈 Perak</th>
                  <th className="p-1.5 border-r">🥉 Gangsa</th>
                  <th className="p-1.5 text-center">Rekod</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium">
                {results.map((res) => {
                  const ev = eventMap[res.eventId];
                  const goldH = houseMap[res.goldHouseId];
                  const silverH = houseMap[res.silverHouseId];
                  const bronzeH = houseMap[res.bronzeHouseId];

                  return (
                    <tr key={res.id}>
                      <td className="p-1.5 border-r font-bold">
                        {ev?.day || 'Hari 1'} ({ev?.category || '-'})
                      </td>
                      <td className="p-1.5 border-r font-extrabold">{ev?.name || 'Acara'}</td>
                      <td className="p-1.5 border-r">
                        <span className="font-bold text-slate-900">{res.goldAthleteName}</span>{' '}
                        <span className="text-[10px] text-slate-500">
                          ({goldH?.name.replace('Rumah ', '')})
                        </span>
                        {res.goldRecord ? (
                          <span className="block text-[10px] text-amber-700 font-mono">
                            {res.goldRecord}
                          </span>
                        ) : null}
                      </td>
                      <td className="p-1.5 border-r">
                        <span className="font-bold text-slate-800">{res.silverAthleteName}</span>{' '}
                        <span className="text-[10px] text-slate-500">
                          ({silverH?.name.replace('Rumah ', '')})
                        </span>
                      </td>
                      <td className="p-1.5 border-r">
                        <span className="font-bold text-slate-800">{res.bronzeAthleteName}</span>{' '}
                        <span className="text-[10px] text-slate-500">
                          ({bronzeH?.name.replace('Rumah ', '')})
                        </span>
                      </td>
                      <td className="p-1.5 text-center font-bold text-[10px]">
                        {res.isNewRecord ? (
                          <span className="text-amber-600 font-black">★ Rekod Baharu</span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures Footer */}
        <div className="pt-12 grid grid-cols-2 gap-8 text-xs text-slate-600 text-center">
          <div>
            <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
            <p className="font-bold">Setiausaha Sukan SJK(C) Chung Hwa Tenom</p>
          </div>
          <div>
            <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
            <p className="font-bold">Guru Besar SJK(C) Chung Hwa Tenom</p>
          </div>
        </div>
      </div>

      {/* Print Options & Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Tetingkap Cetakan Laporan Rasmi</h3>
                  <p className="text-xs text-slate-500">Pilih kaedah cetakan atau muat turun laporan</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hint alert for iframe sandboxing */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Petua Cetakan (Paparan iFrame Pratonton):
              </div>
              <p className="leading-relaxed">
                Sesetengah pelayar web menyekat dialog cetakan secara langsung di dalam paparan pratonton iFrame.
                Sila gunakan butang <strong>"Buka Dalam Tab Baharu"</strong> atau <strong>"Muat Turun Fail HTML"</strong> untuk mencetak dengan sempurna tanpa sebarang sekatan.
              </p>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleOpenNewTabPrint}
                className="p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-between shadow-md transition-all group"
              >
                <div className="text-left">
                  <span className="block text-sm">🚀 Buka Dalam Tab Baharu</span>
                  <span className="font-normal text-[10px] text-indigo-200 block mt-0.5">Sangat disyorkan untuk cetakan terus A4 / PDF</span>
                </div>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleDownloadHTMLReport}
                className="p-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-between shadow-md transition-all group"
              >
                <div className="text-left">
                  <span className="block text-sm">📄 Muat Turun Fail HTML</span>
                  <span className="font-normal text-[10px] text-emerald-200 block mt-0.5">Boleh dibuka & dicetak bila-bila masa di komputer</span>
                </div>
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="border-t pt-3 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={handleDirectPrint}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-bold flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                Cuba Cetak Terus (Direct Print)
              </button>

              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

