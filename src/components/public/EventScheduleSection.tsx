import React, { useState } from 'react';
import { SportsEvent, EventResult, SportsHouse } from '../../types';
import { Calendar, Clock, Trophy, CheckCircle2, PlayCircle, Hourglass, Medal } from 'lucide-react';

interface EventScheduleSectionProps {
  events: SportsEvent[];
  results: EventResult[];
  houses: SportsHouse[];
}

export const EventScheduleSection: React.FC<EventScheduleSectionProps> = ({
  events,
  results,
  houses,
}) => {
  const [activeDay, setActiveDay] = useState<'Hari Pertama' | 'Hari Kedua'>('Hari Pertama');
  const [activeType, setActiveType] = useState<'Semua' | 'Balapan' | 'Padang'>('Semua');

  const houseMap: { [id: string]: SportsHouse } = {};
  houses.forEach((h) => (houseMap[h.id] = h));

  const resultMap: { [eventId: string]: EventResult } = {};
  results.forEach((r) => (resultMap[r.eventId] = r));

  const day1Events = events.filter((e) => (e.day || 'Hari Pertama') === 'Hari Pertama');
  const day2Events = events.filter((e) => e.day === 'Hari Kedua');

  const currentDayEvents = events.filter((e) => {
    const evDay = e.day || 'Hari Pertama';
    if (evDay !== activeDay) return false;
    if (activeType !== 'Semua' && e.type !== activeType) return false;
    return true;
  });

  return (
    <div id="event-schedule-section" className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
      {/* Section Header & Day Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              JADUAL ACARA KEJOHANAN
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Susunan acara Hari Pertama & Hari Kedua Kejohanan</p>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveDay('Hari Pertama')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeDay === 'Hari Pertama'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>HARI PERTAMA</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeDay === 'Hari Pertama' ? 'bg-blue-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
              {day1Events.length}
            </span>
          </button>

          <button
            onClick={() => setActiveDay('Hari Kedua')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeDay === 'Hari Kedua'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>HARI KEDUA</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeDay === 'Hari Kedua' ? 'bg-purple-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
              {day2Events.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Filter: Type */}
      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveType('Semua')}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              activeType === 'Semua' ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveType('Balapan')}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              activeType === 'Balapan' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Balapan
          </button>
          <button
            onClick={() => setActiveType('Padang')}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              activeType === 'Padang' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Padang
          </button>
        </div>

        <span className="text-slate-400 font-medium text-[11px]">
          Menunjukkan acara untuk <strong>{activeDay}</strong>
        </span>
      </div>

      {/* Events Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {currentDayEvents.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-slate-400 text-xs italic">
            Tiada acara ditemui untuk {activeDay}.
          </div>
        ) : (
          currentDayEvents.map((ev) => {
            const result = resultMap[ev.id];
            const goldHouse = result ? houseMap[result.goldHouseId] : null;

            return (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {ev.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.type === 'Balapan' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {ev.type}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{ev.name}</h4>
                  </div>

                  {/* Status Badge */}
                  {ev.status === 'Selesai' || result ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Selesai
                    </span>
                  ) : ev.status === 'Sedang Berlangsung' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 shrink-0 animate-pulse">
                      <PlayCircle className="w-3 h-3" /> Berlangsung
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1 shrink-0">
                      <Hourglass className="w-3 h-3" /> Belum
                    </span>
                  )}
                </div>

                {/* Event Footer: Time & Gold Winner */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.scheduledTime || 'Akan Datang'}</span>
                  </div>

                  {result ? (
                    <div className="flex items-center space-x-1 text-[11px]">
                      <Medal className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-bold text-amber-700 dark:text-amber-300 truncate max-w-[120px]">
                        {result.goldAthleteName} ({goldHouse?.name.replace('Rumah ', '')})
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] italic opacity-75">Keputusan Belum Masuk</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
