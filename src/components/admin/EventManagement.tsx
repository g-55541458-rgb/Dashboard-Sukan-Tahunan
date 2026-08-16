import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { SportsEvent, CategoryType, EventType, EventStatus, EventDay } from '../../types';
import { Trophy, Plus, Edit2, Trash2, Save, X, Filter, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface EventManagementProps {
  events: SportsEvent[];
  onUpdateEvents: (events: SportsEvent[]) => void;
}

export const EventManagement: React.FC<EventManagementProps> = ({ events, onUpdateEvents }) => {
  const [editingEvent, setEditingEvent] = useState<SportsEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<SportsEvent | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('Semua');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Semua');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Semua');

  const [importLog, setImportLog] = useState<{ successCount: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Partial<SportsEvent>>({
    name: '',
    category: 'L12',
    type: 'Balapan',
    day: 'Hari Pertama',
    status: 'Belum Mula',
    scheduledTime: '10:00 AM',
    isRelay: false,
    pointScheme: { gold: 7, silver: 5, bronze: 3, fourth: 1 },
    existingRecord: '',
  });

  // Download CSV Template for Events
  const downloadCsvTemplate = () => {
    const csvHeader = 'Nama Acara,Kategori,Jenis,Hari Kejohanan,Masa,Mata Emas,Mata Perak,Mata Gangsa,Mata Ke-4,Berpasukan,Rekod Sedia Ada\n';
    const sampleRows = [
      '100m (Lelaki Bawah 12),L12,Balapan,Hari Pertama,08:30 AM,7,5,3,1,Tidak,12.42s - Tan Jia Wei (2022)',
      '200m (Lelaki Bawah 12),L12,Balapan,Hari Pertama,09:15 AM,7,5,3,1,Tidak,',
      '4x100m (Lelaki Bawah 12),L12,Balapan,Hari Pertama,10:30 AM,7,5,3,1,Ya,52.10s - Rumah Merah (2023)',
      'Lontar Peluru (Lelaki Bawah 12),L12,Padang,Hari Kedua,08:30 AM,7,5,3,1,Tidak,10.25m - Brandon Lee (2024)',
      '80m (Lelaki Bawah 8),L8,Balapan,Hari Pertama,08:00 AM,7,5,3,1,Tidak,',
      '80m (Perempuan Bawah 8),P8,Balapan,Hari Kedua,08:15 AM,7,5,3,1,Tidak,',
    ].join('\n');

    const blob = new Blob([csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `template_acara_kejohanan_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to guess category from string/event name
  const parseCategory = (rawCat: string, eventName: string): CategoryType => {
    const clean = rawCat.trim().toUpperCase();
    if (['L12', 'P12', 'L10', 'P10', 'L8', 'P8', 'PRA-SEKOLAH', 'TERBUKA'].includes(clean)) {
      if (clean === 'PRA-SEKOLAH') return 'Pra-Sekolah';
      if (clean === 'TERBUKA') return 'Terbuka';
      return clean as CategoryType;
    }
    const nameUpper = eventName.toUpperCase();
    if (nameUpper.includes('L12') || nameUpper.includes('BAWAH 12 LELAKI') || nameUpper.includes('LELAKI BAWAH 12')) return 'L12';
    if (nameUpper.includes('P12') || nameUpper.includes('BAWAH 12 PEREMPUAN') || nameUpper.includes('PEREMPUAN BAWAH 12')) return 'P12';
    if (nameUpper.includes('L10') || nameUpper.includes('BAWAH 10 LELAKI') || nameUpper.includes('LELAKI BAWAH 10')) return 'L10';
    if (nameUpper.includes('P10') || nameUpper.includes('BAWAH 10 PEREMPUAN') || nameUpper.includes('PEREMPUAN BAWAH 10')) return 'P10';
    if (nameUpper.includes('L8') || nameUpper.includes('BAWAH 8 LELAKI') || nameUpper.includes('LELAKI BAWAH 8')) return 'L8';
    if (nameUpper.includes('P8') || nameUpper.includes('BAWAH 8 PEREMPUAN') || nameUpper.includes('PEREMPUAN BAWAH 8')) return 'P8';
    if (nameUpper.includes('PRA') || nameUpper.includes('TABIKA') || nameUpper.includes('KEMAS')) return 'Pra-Sekolah';
    return 'L12';
  };

  // Process uploaded CSV / Excel file for Events
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        if (!data) return;

        let jsonRows: any[][] = [];

        if (file.name.toLowerCase().endsWith('.csv')) {
          const workbook = XLSX.read(data, { type: 'string' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        } else {
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        }

        if (!jsonRows || jsonRows.length <= 1) {
          setImportLog({ successCount: 0, errors: ['Fail CSV/Excel kosong atau tidak sah.'] });
          return;
        }

        const newParsedEvents: SportsEvent[] = [];
        const errors: string[] = [];

        // Header detection for flexible column positions
        const headerRow = (jsonRows[0] || []).map((h: any) => String(h || '').trim().toLowerCase());

        let nameIdx = headerRow.findIndex((h) => h.includes('nama') || h.includes('acara'));
        let catIdx = headerRow.findIndex((h) => h.includes('kategori') || h.includes('umur'));
        let typeIdx = headerRow.findIndex((h) => h.includes('jenis') || h.includes('tipe'));
        let dayIdx = headerRow.findIndex((h) => h.includes('hari') || h.includes('day'));
        let timeIdx = headerRow.findIndex((h) => h.includes('masa') || h.includes('jadual') || h.includes('time'));
        let goldIdx = headerRow.findIndex((h) => h.includes('emas') || h.includes('gold') || h.includes('1st'));
        let silverIdx = headerRow.findIndex((h) => h.includes('perak') || h.includes('silver') || h.includes('2nd'));
        let bronzeIdx = headerRow.findIndex((h) => h.includes('gangsa') || h.includes('bronze') || h.includes('3rd'));
        let fourthIdx = headerRow.findIndex((h) => h.includes('4th') || h.includes('ke-4') || h.includes('ke4'));
        let relayIdx = headerRow.findIndex((h) => h.includes('pasukan') || h.includes('relay') || h.includes('kumpulan'));
        let recordIdx = headerRow.findIndex((h) => h.includes('rekod') || h.includes('record'));

        // Fallbacks if not detected by header text
        if (nameIdx === -1) nameIdx = 0;
        if (catIdx === -1) catIdx = 1;
        if (typeIdx === -1) typeIdx = 2;
        if (dayIdx === -1) dayIdx = 3;
        if (timeIdx === -1) timeIdx = 4;
        if (goldIdx === -1) goldIdx = 5;
        if (silverIdx === -1) silverIdx = 6;
        if (bronzeIdx === -1) bronzeIdx = 7;
        if (fourthIdx === -1) fourthIdx = 8;
        if (relayIdx === -1) relayIdx = 9;
        if (recordIdx === -1) recordIdx = 10;

        for (let i = 1; i < jsonRows.length; i++) {
          const row = jsonRows[i];
          if (!row || row.length === 0) continue;

          const name = String(row[nameIdx] || '').trim();
          if (!name) continue;

          const catRaw = String(row[catIdx] || '').trim();
          const category = parseCategory(catRaw, name);

          const typeRaw = String(row[typeIdx] || '').trim().toLowerCase();
          let eventType: EventType = 'Balapan';
          if (typeRaw.startsWith('p') || typeRaw.includes('padang')) {
            eventType = 'Padang';
          } else if (typeRaw.startsWith('b') || typeRaw.includes('balapan')) {
            eventType = 'Balapan';
          } else {
            const fieldKeywords = ['lompat', 'lontar', 'lembing', 'peluru', 'cakera', 'tinggi', 'jauh'];
            if (fieldKeywords.some((kw) => name.toLowerCase().includes(kw))) {
              eventType = 'Padang';
            }
          }

          const dayRaw = String(row[dayIdx] || '').trim().toLowerCase();
          let eventDay: EventDay = 'Hari Pertama';
          if (dayRaw.includes('kedua') || dayRaw.includes('2') || dayRaw.includes('day 2')) {
            eventDay = 'Hari Kedua';
          }

          const scheduledTime = String(row[timeIdx] || '').trim() || '09:00 AM';

          const gold = Number(row[goldIdx]) || 7;
          const silver = Number(row[silverIdx]) || 5;
          const bronze = Number(row[bronzeIdx]) || 3;
          const fourth = Number(row[fourthIdx]) || 1;

          const relayRaw = String(row[relayIdx] || '').trim().toLowerCase();
          const isRelay =
            relayRaw.startsWith('y') ||
            relayRaw.startsWith('j') ||
            relayRaw === '1' ||
            relayRaw === 'true' ||
            name.toLowerCase().includes('4x') ||
            name.toLowerCase().includes('relay');

          const existingRecord = String(row[recordIdx] || '').trim();

          const eventObj: SportsEvent = {
            id: `event-csv-${Date.now()}-${i}`,
            name: name,
            category: category,
            type: eventType,
            day: eventDay,
            status: 'Belum Mula',
            scheduledTime: scheduledTime,
            isRelay: isRelay,
            pointScheme: { gold, silver, bronze, fourth },
            existingRecord: existingRecord,
          };

          newParsedEvents.push(eventObj);
        }

        // Merge with existing avoiding duplicates by event name
        const existingNames = new Set(events.map((e) => e.name.toLowerCase()));
        const uniqueNew = newParsedEvents.filter((e) => !existingNames.has(e.name.toLowerCase()));

        const updatedAll = [...events, ...uniqueNew];
        onUpdateEvents(updatedAll);

        setImportLog({
          successCount: uniqueNew.length,
          errors: errors.concat(
            uniqueNew.length < newParsedEvents.length
              ? [`${newParsedEvents.length - uniqueNew.length} acara bertindih/sedia ada diabaikan.`]
              : []
          ),
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setImportLog({ successCount: 0, errors: [`Ralat membaca fail acara: ${err.message || 'Format tidak sah'}`] });
      }
    };

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleEdit = (event: SportsEvent) => {
    setEditingEvent(event);
    setFormData(event);
    setIsNew(false);
  };

  const handleAddNew = () => {
    const newEv: SportsEvent = {
      id: `event-${Date.now()}`,
      name: '100m (Lelaki Bawah 8)',
      category: 'L8',
      type: 'Balapan',
      day: 'Hari Pertama',
      status: 'Belum Mula',
      scheduledTime: '11:00 AM',
      isRelay: false,
      pointScheme: { gold: 7, silver: 5, bronze: 3, fourth: 1 },
      existingRecord: '',
    };
    setEditingEvent(newEv);
    setFormData(newEv);
    setIsNew(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (isNew) {
      const updated = [...events, formData as SportsEvent];
      onUpdateEvents(updated);
    } else {
      const updated = events.map((e) => (e.id === editingEvent?.id ? ({ ...e, ...formData } as SportsEvent) : e));
      onUpdateEvents(updated);
    }

    setEditingEvent(null);
  };

  const confirmDelete = () => {
    if (!deletingEvent) return;
    const targetId = deletingEvent.id;
    const updated = events.filter((e) => e.id !== targetId);
    onUpdateEvents(updated);
    setDeletingEvent(null);
  };

  const filteredEvents = events.filter((ev) => {
    if (selectedTypeFilter !== 'Semua' && ev.type !== selectedTypeFilter) return false;
    if (selectedCategoryFilter !== 'Semua' && ev.category !== selectedCategoryFilter) return false;
    if (selectedDayFilter !== 'Semua' && (ev.day || 'Hari Pertama') !== selectedDayFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Pengurusan Acara & Kategori
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cipta, kemaskini acara Balapan/Padang, tetapan Hari Kejohanan (Hari 1 / Hari 2), jadual masa, agihan mata, atau muat naik pukal melalui fail CSV/Excel.
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={downloadCsvTemplate}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Template CSV Acara</span>
            </button>

            <label className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md">
              <Upload className="w-4 h-4" />
              <span>Muat Naik CSV / Excel Acara</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              id="btn-add-event"
              onClick={handleAddNew}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Acara Baharu</span>
            </button>
          </div>
        </div>

        {/* Format Explanation */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
          <span className="font-bold text-slate-800 block mb-1">📋 Format Lajur Template CSV / Excel Acara:</span>
          <code className="bg-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-800 block overflow-x-auto">
            [Nama Acara] | [Kategori] | [Jenis] | [Hari Kejohanan] | [Masa] | [Mata Emas] | [Mata Perak] | [Mata Gangsa] | [Mata Ke-4] | [Berpasukan] | [Rekod Sedia Ada]
          </code>
        </div>

        {/* Import Log Feedback */}
        {importLog && (
          <div
            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              importLog.errors.length > 0 && importLog.successCount === 0
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center space-x-2">
                {importLog.successCount > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span>
                  Berjaya menambah {importLog.successCount} acara baharu daripada fail.
                </span>
              </div>
              <button
                onClick={() => setImportLog(null)}
                className="text-[11px] underline opacity-75 hover:opacity-100"
              >
                Tutup
              </button>
            </div>

            {importLog.errors.length > 0 && (
              <ul className="list-disc list-inside text-[11px] space-y-0.5 opacity-90 pl-1">
                {importLog.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 text-xs flex-wrap gap-y-2">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-600">Tapis:</span>
        </div>

        <select
          value={selectedDayFilter}
          onChange={(e) => setSelectedDayFilter(e.target.value)}
          className="p-2 rounded-lg border border-slate-300 font-semibold bg-amber-50 text-amber-900 border-amber-300"
        >
          <option value="Semua">🗓️ Semua Hari Kejohanan</option>
          <option value="Hari Pertama">📅 Hari Pertama</option>
          <option value="Hari Kedua">📅 Hari Kedua</option>
        </select>

        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="p-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
        >
          <option value="Semua">Semua Jenis (Balapan & Padang)</option>
          <option value="Balapan">Acara Balapan sahaja</option>
          <option value="Padang">Acara Padang sahaja</option>
        </select>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="p-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
        >
          <option value="Semua">Semua Kategori Umur</option>
          <option value="L12">L12 (Lelaki Bawah 12)</option>
          <option value="P12">P12 (Perempuan Bawah 12)</option>
          <option value="L10">L10 (Lelaki Bawah 10)</option>
          <option value="P10">P10 (Perempuan Bawah 10)</option>
          <option value="L8">L8 (Lelaki Bawah 8)</option>
          <option value="P8">P8 (Perempuan Bawah 8)</option>
          <option value="Pra-Sekolah">Pra-Sekolah</option>
        </select>

        <span className="text-slate-400 text-xs ml-auto font-medium">
          Menunjukkan {filteredEvents.length} / {events.length} Acara
        </span>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Hari & Masa</th>
              <th className="py-3 px-3">Kategori</th>
              <th className="py-3 px-4">Nama Acara</th>
              <th className="py-3 px-3">Jenis</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Agihan Mata (1/2/3/4)</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold w-max ${
                      (ev.day || 'Hari Pertama') === 'Hari Pertama'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      <Calendar className="w-2.5 h-2.5" />
                      {ev.day || 'Hari Pertama'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 mt-1">{ev.scheduledTime || '-'}</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-bold text-blue-600">{ev.category}</td>
                <td className="py-3 px-4 font-extrabold text-slate-800">
                  {ev.name}
                  {ev.isRelay && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Berpasukan / Relay
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 font-semibold">
                  <span
                    className={`px-2 py-0.5 rounded-md ${
                      ev.type === 'Balapan' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {ev.type}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${
                      ev.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-700'
                        : ev.status === 'Sedang Berlangsung'
                        ? 'bg-amber-100 text-amber-700 animate-pulse'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ev.status}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-700">
                  {ev.pointScheme?.gold}/{ev.pointScheme?.silver}/{ev.pointScheme?.bronze}/{ev.pointScheme?.fourth}
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => handleEdit(ev)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingEvent(ev)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-800 text-base">
                {isNew ? 'Tambah Acara Baharu' : `Kemaskini ${editingEvent.name}`}
              </h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nama Acara</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. 100m (Lelaki Bawah 12)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Kategori Umur</label>
                  <select
                    value={formData.category || 'L12'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="L12">L12 (Lelaki Bawah 12)</option>
                    <option value="P12">P12 (Perempuan Bawah 12)</option>
                    <option value="L10">L10 (Lelaki Bawah 10)</option>
                    <option value="P10">P10 (Perempuan Bawah 10)</option>
                    <option value="L8">L8 (Lelaki Bawah 8)</option>
                    <option value="P8">P8 (Perempuan Bawah 8)</option>
                    <option value="Pra-Sekolah">Pra-Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Jenis Acara</label>
                  <select
                    value={formData.type || 'Balapan'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Balapan">Balapan</option>
                    <option value="Padang">Padang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-900 font-extrabold mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" /> Hari Kejohanan
                  </label>
                  <select
                    value={formData.day || 'Hari Pertama'}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as EventDay })}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50 font-bold text-amber-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Hari Pertama">Hari Pertama</option>
                    <option value="Hari Kedua">Hari Kedua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Status Acara</label>
                  <select
                    value={formData.status || 'Belum Mula'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Belum Mula">Belum Mula</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Masa Dijadualkan</label>
                <input
                  type="text"
                  value={formData.scheduledTime || ''}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. 09:30 AM"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Rekod Sedia Ada Kejohanan</label>
                <input
                  type="text"
                  value={formData.existingRecord || ''}
                  onChange={(e) => setFormData({ ...formData, existingRecord: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. 12.42s - Tan Jia Wei (2022)"
                />
              </div>

              {/* Point Scheme Customization */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                <span className="block font-bold text-slate-700 mb-2">Skim Mata Tempat (Gold/Silver/Bronze/4th)</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-amber-700 font-bold">1st (Emas)</label>
                    <input
                      type="number"
                      value={formData.pointScheme?.gold ?? 7}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pointScheme: { ...formData.pointScheme!, gold: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold">2nd (Perak)</label>
                    <input
                      type="number"
                      value={formData.pointScheme?.silver ?? 5}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pointScheme: { ...formData.pointScheme!, silver: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-900 font-bold">3rd (Gangsa)</label>
                    <input
                      type="number"
                      value={formData.pointScheme?.bronze ?? 3}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pointScheme: { ...formData.pointScheme!, bronze: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold">4th Place</label>
                    <input
                      type="number"
                      value={formData.pointScheme?.fourth ?? 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pointScheme: { ...formData.pointScheme!, fourth: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Acara</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Padam Acara</h3>
                <p className="text-xs text-slate-500 font-semibold">{deletingEvent.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Adakah anda pasti mahu memadam acara <strong>{deletingEvent.name}</strong>? Tindakan ini tidak boleh diundur.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Padam Acara</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
