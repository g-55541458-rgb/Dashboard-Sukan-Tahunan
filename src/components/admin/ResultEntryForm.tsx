import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SportsEvent, SportsHouse, Athlete, EventResult } from '../../types';
import { Award, Sparkles, CheckCircle2, Save, RotateCcw, Flame, Trophy } from 'lucide-react';

interface ResultEntryFormProps {
  events: SportsEvent[];
  houses: SportsHouse[];
  athletes: Athlete[];
  results: EventResult[];
  onSaveResult: (result: EventResult, updatedEvents: SportsEvent[]) => void;
  soundEnabled: boolean;
}

interface MedalWinnerInputProps {
  title: string;
  points: number;
  bgClass: string;
  borderClass: string;
  textClass: string;
  houseId: string;
  onHouseChange: (id: string) => void;
  athleteName: string;
  onAthleteNameChange: (name: string) => void;
  record: string;
  onRecordChange: (rec: string) => void;
  houses: SportsHouse[];
  athletes: Athlete[];
  selectedEventCategory: string;
  isRequired?: boolean;
}

const MedalWinnerInput: React.FC<MedalWinnerInputProps> = ({
  title,
  points,
  bgClass,
  borderClass,
  textClass,
  houseId,
  onHouseChange,
  athleteName,
  onAthleteNameChange,
  record,
  onRecordChange,
  houses,
  athletes,
  selectedEventCategory,
  isRequired = false,
}) => {
  // Filter athletes by selected house
  const houseAthletes = athletes.filter((a) => a.houseId === houseId);

  // Group 1: Category matches selectedEventCategory (e.g. L12, P10, etc.)
  const categoryMatchAthletes = houseAthletes.filter((a) => a.category === selectedEventCategory);

  // Group 2: Other category athletes in the same house
  const otherCategoryAthletes = houseAthletes.filter((a) => a.category !== selectedEventCategory);

  // Find if current athleteName matches any registered athlete in this house
  const matchedAthlete = houseAthletes.find((a) => a.name.trim().toLowerCase() === athleteName.trim().toLowerCase());
  const selectedDropdownValue = matchedAthlete ? matchedAthlete.id : athleteName ? 'custom' : '';

  const handleDropdownSelect = (val: string) => {
    if (val === '') {
      onAthleteNameChange('');
    } else if (val === 'custom') {
      // keep current text or user types manually
    } else {
      const selected = houseAthletes.find((a) => a.id === val);
      if (selected) {
        onAthleteNameChange(selected.name);
      }
    }
  };

  return (
    <div className={`${bgClass} p-4 rounded-xl border ${borderClass} space-y-3`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className={`text-xs font-black ${textClass} uppercase flex items-center gap-1.5`}>
          {title} - {points} MATA
        </label>
        <span className="text-[10px] text-slate-600 font-bold bg-white/90 px-2 py-0.5 rounded-md border border-slate-200">
          Kategori Acara: <strong className="text-blue-700">{selectedEventCategory}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* 1. Rumah Sukan Dropdown (3 cols) */}
        <div className="sm:col-span-3">
          <label className="block text-[10px] font-bold text-slate-600 mb-1">Rumah Sukan</label>
          <select
            value={houseId}
            onChange={(e) => onHouseChange(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.mascot})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Athlete Selection Dropdown (4 cols) */}
        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center justify-between">
            <span>Pilih Atlet (Drop Down)</span>
            <span className="text-[9px] text-emerald-700 font-bold">
              {categoryMatchAthletes.length} Atlet ({selectedEventCategory})
            </span>
          </label>
          <select
            value={selectedDropdownValue}
            onChange={(e) => handleDropdownSelect(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Pilih Atlet daripada Senarai --</option>
            {categoryMatchAthletes.length > 0 && (
              <optgroup label={`⭐ Atlet Kategori ${selectedEventCategory}`}>
                {categoryMatchAthletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.className} • {a.gender})
                  </option>
                ))}
              </optgroup>
            )}
            {otherCategoryAthletes.length > 0 && (
              <optgroup label={`🏃 Atlet Rumah Sukan Ini (Kategori Lain)`}>
                {otherCategoryAthletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} (Kat: {a.category} • Kelas {a.className})
                  </option>
                ))}
              </optgroup>
            )}
            <option value="custom">✍️ Taip Nama Manual / Pasukan Relay</option>
          </select>
        </div>

        {/* 3. Athlete Name Text Input (3 cols) */}
        <div className="sm:col-span-3">
          <label className="block text-[10px] font-bold text-slate-600 mb-1">
            Nama Atlet / Pasukan
          </label>
          <input
            type="text"
            value={athleteName}
            onChange={(e) => onAthleteNameChange(e.target.value)}
            placeholder="e.g. Lim Jia Hao / Pasukan Relay"
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            required={isRequired}
          />
        </div>

        {/* 4. Record Input (2 cols) */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-slate-600 mb-1">Masa / Jarak</label>
          <input
            type="text"
            value={record}
            onChange={(e) => onRecordChange(e.target.value)}
            placeholder="e.g. 12.18s"
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export const ResultEntryForm: React.FC<ResultEntryFormProps> = ({
  events,
  houses,
  athletes,
  results,
  onSaveResult,
  soundEnabled,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Semua');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  const filteredEventsList = events.filter((ev) => {
    if (selectedDayFilter !== 'Semua' && (ev.day || 'Hari Pertama') !== selectedDayFilter) return false;
    return true;
  });

  const selectedEvent = events.find((e) => e.id === selectedEventId) || filteredEventsList[0] || events[0];
  const existingResult = results.find((r) => r.eventId === selectedEventId);

  // Form State
  const [goldAthleteName, setGoldAthleteName] = useState<string>(existingResult?.goldAthleteName || '');
  const [goldHouseId, setGoldHouseId] = useState<string>(existingResult?.goldHouseId || houses[0]?.id || '');
  const [goldRecord, setGoldRecord] = useState<string>(existingResult?.goldRecord || '');

  const [silverAthleteName, setSilverAthleteName] = useState<string>(existingResult?.silverAthleteName || '');
  const [silverHouseId, setSilverHouseId] = useState<string>(existingResult?.silverHouseId || houses[1]?.id || '');
  const [silverRecord, setSilverRecord] = useState<string>(existingResult?.silverRecord || '');

  const [bronzeAthleteName, setBronzeAthleteName] = useState<string>(existingResult?.bronzeAthleteName || '');
  const [bronzeHouseId, setBronzeHouseId] = useState<string>(existingResult?.bronzeHouseId || houses[2]?.id || '');
  const [bronzeRecord, setBronzeRecord] = useState<string>(existingResult?.bronzeRecord || '');

  const [fourthAthleteName, setFourthAthleteName] = useState<string>(existingResult?.fourthAthleteName || '');
  const [fourthHouseId, setFourthHouseId] = useState<string>(existingResult?.fourthHouseId || houses[3]?.id || '');
  const [fourthRecord, setFourthRecord] = useState<string>(existingResult?.fourthRecord || '');

  const [isNewRecord, setIsNewRecord] = useState<boolean>(existingResult?.isNewRecord || false);
  const [notes, setNotes] = useState<string>(existingResult?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // When selected event changes, sync state
  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    const evRes = results.find((r) => r.eventId === eventId);
    if (evRes) {
      setGoldAthleteName(evRes.goldAthleteName || '');
      setGoldHouseId(evRes.goldHouseId || houses[0]?.id || '');
      setGoldRecord(evRes.goldRecord || '');

      setSilverAthleteName(evRes.silverAthleteName || '');
      setSilverHouseId(evRes.silverHouseId || houses[1]?.id || '');
      setSilverRecord(evRes.silverRecord || '');

      setBronzeAthleteName(evRes.bronzeAthleteName || '');
      setBronzeHouseId(evRes.bronzeHouseId || houses[2]?.id || '');
      setBronzeRecord(evRes.bronzeRecord || '');

      setFourthAthleteName(evRes.fourthAthleteName || '');
      setFourthHouseId(evRes.fourthHouseId || houses[3]?.id || '');
      setFourthRecord(evRes.fourthRecord || '');

      setIsNewRecord(evRes.isNewRecord || false);
      setNotes(evRes.notes || '');
    } else {
      setGoldAthleteName('');
      setGoldHouseId(houses[0]?.id || '');
      setGoldRecord('');

      setSilverAthleteName('');
      setSilverHouseId(houses[1]?.id || '');
      setSilverRecord('');

      setBronzeAthleteName('');
      setBronzeHouseId(houses[2]?.id || '');
      setBronzeRecord('');

      setFourthAthleteName('');
      setFourthHouseId(houses[3]?.id || '');
      setFourthRecord('');

      setIsNewRecord(false);
      setNotes('');
    }
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const newResult: EventResult = {
      id: existingResult?.id || `res-${Date.now()}`,
      eventId: selectedEvent.id,
      completedAt: new Date().toISOString(),
      goldAthleteName,
      goldHouseId,
      goldRecord,
      silverAthleteName,
      silverHouseId,
      silverRecord,
      bronzeAthleteName,
      bronzeHouseId,
      bronzeRecord,
      fourthAthleteName,
      fourthHouseId,
      fourthRecord,
      isNewRecord,
      notes,
    };

    // Update event status to 'Selesai'
    const updatedEvents = events.map((ev) =>
      ev.id === selectedEvent.id ? { ...ev, status: 'Selesai' as const } : ev
    );

    onSaveResult(newResult, updatedEvents);
    setSavedSuccess(true);

    // Trigger confetti
    try {
      confetti({
        particleCount: isNewRecord ? 120 : 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.log('Confetti error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-red-600" />
          Borang Input Keputusan Acara & Auto-Calculate Ranking
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pilih acara dan masukkan pemenang pingat. Sistem mengira mata dan ranking rumah sukan secara automatik!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Select Event List */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Pilih Acara Sukan
            </label>
            <span className="text-[10px] text-slate-400 font-bold">{filteredEventsList.length} Acara</span>
          </div>

          {/* Day Filter Tab */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDayFilter('Semua')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                selectedDayFilter === 'Semua'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Hari
            </button>
            <button
              type="button"
              onClick={() => setSelectedDayFilter('Hari Pertama')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                selectedDayFilter === 'Hari Pertama'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari 1
            </button>
            <button
              type="button"
              onClick={() => setSelectedDayFilter('Hari Kedua')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                selectedDayFilter === 'Hari Kedua'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari 2
            </button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredEventsList.map((ev) => {
              const isCompleted = results.some((r) => r.eventId === ev.id) || ev.status === 'Selesai';
              const isSelected = ev.id === selectedEventId;

              return (
                <button
                  key={ev.id}
                  onClick={() => handleSelectEvent(ev.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 font-bold text-blue-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="pr-2">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        (ev.day || 'Hari Pertama') === 'Hari Pertama'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {ev.day || 'Hari Pertama'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-bold">
                        {ev.category}
                      </span>
                    </div>
                    <div className="font-extrabold text-slate-800 mt-1">{ev.name}</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ev.type} • {ev.scheduledTime}</p>
                  </div>

                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                      ✓ Selesai
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 shrink-0">
                      Belum
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Input Form */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {selectedEvent ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      (selectedEvent.day || 'Hari Pertama') === 'Hari Pertama'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      📅 {selectedEvent.day || 'Hari Pertama'}
                    </span>
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      Kategori {selectedEvent.category} • {selectedEvent.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mt-1">{selectedEvent.name}</h3>
                  {selectedEvent.existingRecord && (
                    <p className="text-xs text-amber-600 font-medium mt-0.5">
                      Rekod Kejohanan Lama: {selectedEvent.existingRecord}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">Agihan Mata:</span>
                  <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    Emas: {selectedEvent.pointScheme?.gold} | Perak: {selectedEvent.pointScheme?.silver} | Gangsa: {selectedEvent.pointScheme?.bronze}
                  </span>
                </div>
              </div>

              {/* 1st Place (Gold) */}
              <MedalWinnerInput
                title="🥇 TEMPAT PERTAMA (PINGAT EMAS)"
                points={selectedEvent.pointScheme?.gold || 7}
                bgClass="bg-amber-50/60"
                borderClass="border-amber-200"
                textClass="text-amber-900"
                houseId={goldHouseId}
                onHouseChange={setGoldHouseId}
                athleteName={goldAthleteName}
                onAthleteNameChange={setGoldAthleteName}
                record={goldRecord}
                onRecordChange={setGoldRecord}
                houses={houses}
                athletes={athletes}
                selectedEventCategory={selectedEvent.category}
                isRequired
              />

              {/* 2nd Place (Silver) */}
              <MedalWinnerInput
                title="🥈 TEMPAT KEDUA (PINGAT PERAK)"
                points={selectedEvent.pointScheme?.silver || 5}
                bgClass="bg-slate-50"
                borderClass="border-slate-200"
                textClass="text-slate-700"
                houseId={silverHouseId}
                onHouseChange={setSilverHouseId}
                athleteName={silverAthleteName}
                onAthleteNameChange={setSilverAthleteName}
                record={silverRecord}
                onRecordChange={setSilverRecord}
                houses={houses}
                athletes={athletes}
                selectedEventCategory={selectedEvent.category}
                isRequired
              />

              {/* 3rd Place (Bronze) */}
              <MedalWinnerInput
                title="🥉 TEMPAT KETIGA (PINGAT GANGSA)"
                points={selectedEvent.pointScheme?.bronze || 3}
                bgClass="bg-amber-900/5"
                borderClass="border-amber-900/20"
                textClass="text-amber-950"
                houseId={bronzeHouseId}
                onHouseChange={setBronzeHouseId}
                athleteName={bronzeAthleteName}
                onAthleteNameChange={setBronzeAthleteName}
                record={bronzeRecord}
                onRecordChange={setBronzeRecord}
                houses={houses}
                athletes={athletes}
                selectedEventCategory={selectedEvent.category}
                isRequired
              />

              {/* 4th Place */}
              <MedalWinnerInput
                title="TEMPAT KE-4"
                points={selectedEvent.pointScheme?.fourth || 1}
                bgClass="bg-slate-50"
                borderClass="border-slate-200"
                textClass="text-slate-600"
                houseId={fourthHouseId}
                onHouseChange={setFourthHouseId}
                athleteName={fourthAthleteName}
                onAthleteNameChange={setFourthAthleteName}
                record={fourthRecord}
                onRecordChange={setFourthRecord}
                houses={houses}
                athletes={athletes}
                selectedEventCategory={selectedEvent.category}
              />

              {/* Record Broken Toggle & Notes */}
              <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="chk-new-record"
                  checked={isNewRecord}
                  onChange={(e) => setIsNewRecord(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="chk-new-record" className="text-xs font-bold text-amber-900 flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  REKOD BAHARU KEJOHANAN! (Tandakan jika pencapaian melepasi rekod sedia ada)
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Catatan Tambahan (Pilihan)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pecah rekod kejohanan lama 12.42s"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                {savedSuccess ? (
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Keputusan berjaya disimpan & dikemaskini pada TV Live!</span>
                  </div>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SIMPAN KEPUTUSAN & KEMASKINI RATING</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Pilih acara di sebelah kiri.</div>
          )}
        </div>
      </div>
    </div>
  );
};
