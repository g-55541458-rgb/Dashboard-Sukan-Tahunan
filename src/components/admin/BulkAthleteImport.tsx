import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Athlete, SportsHouse, SportsEvent } from '../../types';
import { Upload, Download, Search, Filter, UserPlus, CheckCircle2, AlertCircle, Trash2, Edit3, Save, FileSpreadsheet } from 'lucide-react';

interface BulkAthleteImportProps {
  athletes: Athlete[];
  houses: SportsHouse[];
  events: SportsEvent[];
  onUpdateAthletes: (athletes: Athlete[]) => void;
}

export const BulkAthleteImport: React.FC<BulkAthleteImportProps> = ({
  athletes,
  houses,
  events,
  onUpdateAthletes,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');
  const [selectedHouseFilter, setSelectedHouseFilter] = useState<string>('Semua');

  const [importLog, setImportLog] = useState<{ successCount: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Add state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newAthlete, setNewAthlete] = useState<Partial<Athlete>>({
    name: '',
    className: '6A',
    gender: 'Lelaki',
    category: 'L12',
    houseId: houses[0]?.id || 'house-merah',
    events: [],
  });
  const [manualEvents, setManualEvents] = useState<string[]>(['', '', '', '']);

  // Extract unique classes for filter
  const classList = Array.from(new Set(athletes.map((a) => a.className))).sort();

  // Download CSV Template function
  const downloadCsvTemplate = () => {
    const csvHeader = 'Nama Atlet,Kelas,Jantina,Kategori Umur,Rumah Sukan,Acara 1,Acara 2,Acara 3,Acara 4\n';
    const sampleRows = [
      'Wong Jia Hao,6A,Lelaki,L12,Rumah Merah,100m (Lelaki Bawah 12),200m (Lelaki Bawah 12),4x100m (Lelaki Bawah 12),Lompat Jauh (Lelaki Bawah 12)',
      'Siti Nurhaliza,5B,Perempuan,P12,Rumah Biru,Lompat Jauh (Perempuan Bawah 12),200m (Perempuan Bawah 12),4x100m (Perempuan Bawah 12),',
      'Tan Kok Seng,4A,Lelaki,L10,Rumah Hijau,80m (Lelaki Bawah 10),,,',
      'Chong Mei Ling,6A,Perempuan,P12,Rumah Kuning,Lontar Peluru (Perempuan Bawah 12),Lompat Tinggi (Perempuan Bawah 12),,',
    ].join('\n');

    const blob = new Blob([csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Template_Pendaftaran_Atlet_SJKC_ChungHwa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to map house name from string to ID
  const mapHouseNameToId = (houseStr: string): string => {
    const cleanStr = houseStr.toLowerCase().trim();
    if (cleanStr.includes('merah') || cleanStr.includes('red')) return 'house-merah';
    if (cleanStr.includes('biru') || cleanStr.includes('blue')) return 'house-biru';
    if (cleanStr.includes('hijau') || cleanStr.includes('green')) return 'house-hijau';
    if (cleanStr.includes('kuning') || cleanStr.includes('yellow')) return 'house-kuning';
    return houses[0]?.id || 'house-merah';
  };

  // Process uploaded CSV/Excel file using SheetJS
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

        const newParsedAthletes: Athlete[] = [];
        const errors: string[] = [];

        // Header detection for flexible column positions
        const headerRow = (jsonRows[0] || []).map((h: any) => String(h || '').trim().toLowerCase());

        let nameIdx = headerRow.findIndex((h) => h.includes('nama'));
        let classIdx = headerRow.findIndex((h) => h.includes('kelas'));
        let genderIdx = headerRow.findIndex((h) => h.includes('jantina'));
        let catIdx = headerRow.findIndex((h) => h.includes('kategori') || h.includes('umur'));
        let houseIdx = headerRow.findIndex((h) => h.includes('rumah'));

        let event1Idx = headerRow.findIndex((h) => h.includes('acara 1') || h === 'acara1');
        let event2Idx = headerRow.findIndex((h) => h.includes('acara 2') || h === 'acara2');
        let event3Idx = headerRow.findIndex((h) => h.includes('acara 3') || h === 'acara3');
        let event4Idx = headerRow.findIndex((h) => h.includes('acara 4') || h === 'acara4');

        // Fallback default column indices if header matches aren't found
        if (nameIdx === -1) nameIdx = 0;
        if (classIdx === -1) classIdx = 1;
        if (genderIdx === -1) genderIdx = 2;
        if (catIdx === -1) catIdx = 3;
        if (houseIdx === -1) houseIdx = 4;
        if (event1Idx === -1) event1Idx = 5;
        if (event2Idx === -1) event2Idx = 6;
        if (event3Idx === -1) event3Idx = 7;
        if (event4Idx === -1) event4Idx = 8;

        for (let i = 1; i < jsonRows.length; i++) {
          const row = jsonRows[i];
          if (!row || row.length === 0) continue;

          const name = String(row[nameIdx] || '').trim();
          if (!name) continue;

          const className = String(row[classIdx] || '').trim();
          const genderRaw = String(row[genderIdx] || '').trim();
          const categoryRaw = String(row[catIdx] || '').trim();
          const houseRaw = String(row[houseIdx] || '').trim();

          const event1 = String(row[event1Idx] || '').trim();
          const event2 = String(row[event2Idx] || '').trim();
          const event3 = String(row[event3Idx] || '').trim();
          const event4 = String(row[event4Idx] || '').trim();

          const houseId = mapHouseNameToId(houseRaw);
          const gender = genderRaw.toLowerCase().startsWith('p') ? 'Perempuan' : 'Lelaki';

          const assignedEvents: string[] = [];
          if (event1) assignedEvents.push(event1);
          if (event2) assignedEvents.push(event2);
          if (event3) assignedEvents.push(event3);
          if (event4) assignedEvents.push(event4);

          const athleteObj: Athlete = {
            id: `ath-csv-${Date.now()}-${i}`,
            name: name,
            className: className || 'Unassigned',
            gender: gender,
            category: (categoryRaw as any) || (gender === 'Lelaki' ? 'L12' : 'P12'),
            houseId: houseId,
            events: assignedEvents,
          };

          newParsedAthletes.push(athleteObj);
        }

        // Merge with existing avoiding duplicates
        const existingNames = new Set(athletes.map((a) => a.name.toLowerCase()));
        const uniqueNew = newParsedAthletes.filter((a) => !existingNames.has(a.name.toLowerCase()));

        const updatedAll = [...athletes, ...uniqueNew];
        onUpdateAthletes(updatedAll);

        setImportLog({
          successCount: uniqueNew.length,
          errors: errors.concat(
            uniqueNew.length < newParsedAthletes.length
              ? [`${newParsedAthletes.length - uniqueNew.length} atlet bertindih diabaikan.`]
              : []
          ),
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setImportLog({ successCount: 0, errors: [`Ralat membaca fail: ${err.message || 'Format tidak sah'}`] });
      }
    };

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleManualAdd = () => {
    if (!newAthlete.name) return;
    const filteredEvents = manualEvents.map((e) => e.trim()).filter(Boolean);

    const added: Athlete = {
      id: `ath-${Date.now()}`,
      name: newAthlete.name,
      className: newAthlete.className || '6A',
      gender: newAthlete.gender || 'Lelaki',
      category: newAthlete.category || 'L12',
      houseId: newAthlete.houseId || houses[0]?.id || 'house-merah',
      events: filteredEvents,
    };
    onUpdateAthletes([...athletes, added]);
    setShowAddModal(false);
    setManualEvents(['', '', '', '']);
  };

  const [deletingAthlete, setDeletingAthlete] = useState<Athlete | null>(null);

  const confirmDeleteAthlete = () => {
    if (!deletingAthlete) return;
    onUpdateAthletes(athletes.filter((a) => a.id !== deletingAthlete.id));
    setDeletingAthlete(null);
  };

  // Filtered Athletes list
  const filteredAthletes = athletes.filter((ath) => {
    if (searchTerm && !ath.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedClassFilter !== 'Semua' && ath.className !== selectedClassFilter) return false;
    if (selectedHouseFilter !== 'Semua' && ath.houseId !== selectedHouseFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: CSV/Excel Bulk Import */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Pendaftaran & Pengurusan Atlet (Bulk Import CSV / Excel)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Muat naik senarai atlet melalui CSV atau Excel (.xlsx) sehingga 4 acara bagi setiap atlet.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={downloadCsvTemplate}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Muat Turun Template CSV</span>
            </button>

            <label className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md">
              <Upload className="w-4 h-4" />
              <span>Muat Naik CSV / Excel</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                setShowAddModal(true);
                setManualEvents(['', '', '', '']);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Manual</span>
            </button>
          </div>
        </div>

        {/* Format Explanation */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
          <span className="font-bold text-slate-800 block mb-1">📋 Format Lajur Template CSV / Excel (Hingga 4 Acara):</span>
          <code className="bg-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-800 block overflow-x-auto">
            [Nama Atlet] | [Kelas] | [Jantina] | [Kategori Umur] | [Rumah Sukan] | [Acara 1] | [Acara 2] | [Acara 3] | [Acara 4]
          </code>
        </div>

        {/* Import Feedback Log */}
        {importLog && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center space-x-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Berjaya mendaftar {importLog.successCount} atlet baharu!</span>
            </div>
            {importLog.errors.map((err, idx) => (
              <p key={idx} className="text-red-600 text-[11px]">
                • {err}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Search & Class Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atlet..."
            className="w-full p-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-600">Kelas:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 font-semibold bg-slate-50"
          >
            <option value="Semua">Semua Kelas ({classList.length})</option>
            {classList.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>

          <span className="font-bold text-slate-600 ml-2">Rumah:</span>
          <select
            value={selectedHouseFilter}
            onChange={(e) => setSelectedHouseFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 font-semibold bg-slate-50"
          >
            <option value="Semua">Semua Rumah Sukan</option>
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Athletes List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs overflow-x-auto">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Menunjukkan {filteredAthletes.length} / {athletes.length} Atlet Berdaftar</span>
        </div>

        <table className="w-full text-left text-xs text-slate-700 min-w-[900px]">
          <thead className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">Nama Atlet</th>
              <th className="py-3 px-2">Kelas</th>
              <th className="py-3 px-2">Jantina</th>
              <th className="py-3 px-2">Kategori</th>
              <th className="py-3 px-2">Rumah Sukan</th>
              <th className="py-3 px-2">Acara 1</th>
              <th className="py-3 px-2">Acara 2</th>
              <th className="py-3 px-2">Acara 3</th>
              <th className="py-3 px-2">Acara 4</th>
              <th className="py-3 px-2 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredAthletes.map((ath) => {
              const house = houses.find((h) => h.id === ath.houseId);
              return (
                <tr key={ath.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-slate-800 whitespace-nowrap">{ath.name}</td>
                  <td className="py-3 px-2 font-bold text-blue-600">{ath.className}</td>
                  <td className="py-3 px-2 text-slate-600">{ath.gender}</td>
                  <td className="py-3 px-2 font-mono font-bold text-slate-700">{ath.category}</td>
                  <td className="py-3 px-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs whitespace-nowrap"
                      style={{ backgroundColor: house?.color || '#3b82f6' }}
                    >
                      {house ? house.name : 'Rumah'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {ath.events && ath.events[0] ? (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-medium text-slate-700 block truncate max-w-[120px]" title={ath.events[0]}>
                        {ath.events[0]}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {ath.events && ath.events[1] ? (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-medium text-slate-700 block truncate max-w-[120px]" title={ath.events[1]}>
                        {ath.events[1]}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {ath.events && ath.events[2] ? (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-medium text-slate-700 block truncate max-w-[120px]" title={ath.events[2]}>
                        {ath.events[2]}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {ath.events && ath.events[3] ? (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-medium text-slate-700 block truncate max-w-[120px]" title={ath.events[3]}>
                        {ath.events[3]}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => setDeletingAthlete(ath)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Padam Atlet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Manual Add Athlete Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-800 text-base mb-4 border-b pb-2">
              Tambah Atlet Manual
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nama Penuh Atlet</label>
                <input
                  type="text"
                  value={newAthlete.name || ''}
                  onChange={(e) => setNewAthlete({ ...newAthlete, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Lim Jia Hao"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Kelas</label>
                  <input
                    type="text"
                    value={newAthlete.className || '6A'}
                    onChange={(e) => setNewAthlete({ ...newAthlete, className: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 6A"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Jantina</label>
                  <select
                    value={newAthlete.gender || 'Lelaki'}
                    onChange={(e) => setNewAthlete({ ...newAthlete, gender: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Lelaki">Lelaki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Kategori Umur</label>
                  <select
                    value={newAthlete.category || 'L12'}
                    onChange={(e) => setNewAthlete({ ...newAthlete, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="L12">L12</option>
                    <option value="P12">P12</option>
                    <option value="L10">L10</option>
                    <option value="P10">P10</option>
                    <option value="L8">L8</option>
                    <option value="P8">P8</option>
                    <option value="Pra-Sekolah">Pra-Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Rumah Sukan</label>
                  <select
                    value={newAthlete.houseId || houses[0]?.id}
                    onChange={(e) => setNewAthlete({ ...newAthlete, houseId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  >
                    {houses.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Acara Didaftarkan (Hingga 4 Acara) */}
              <div className="space-y-2 mt-4 pt-3 border-t border-slate-200">
                <label className="block text-slate-700 font-bold text-xs">Acara Didaftarkan (Maksimum 4 Acara)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx}>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Acara {idx + 1}</label>
                      <select
                        value={manualEvents[idx]}
                        onChange={(e) => {
                          const copy = [...manualEvents];
                          copy[idx] = e.target.value;
                          setManualEvents(copy);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
                      >
                        <option value="">-- Tiada Acara --</option>
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.name}>
                            {ev.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleManualAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
              >
                Simpan Atlet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Athlete Modal */}
      {deletingAthlete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Padam Atlet</h3>
                <p className="text-xs text-slate-500 font-semibold">{deletingAthlete.name} ({deletingAthlete.className})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Adakah anda pasti mahu memadam atlet <strong>{deletingAthlete.name}</strong> daripada senarai?
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingAthlete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteAthlete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Padam Atlet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

