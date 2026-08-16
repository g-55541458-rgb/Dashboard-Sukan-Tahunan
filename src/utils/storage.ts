import { SportsHouse, SportsEvent, Athlete, EventResult } from '../types';
import { INITIAL_HOUSES, INITIAL_EVENTS, INITIAL_ATHLETES, INITIAL_RESULTS } from '../data/initialData';

const STORAGE_KEYS = {
  HOUSES: 'sjkc_sukan_houses_2026',
  EVENTS: 'sjkc_sukan_events_2026',
  ATHLETES: 'sjkc_sukan_athletes_2026',
  RESULTS: 'sjkc_sukan_results_2026',
};

export function loadHouses(): SportsHouse[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOUSES);
    return data ? JSON.parse(data) : INITIAL_HOUSES;
  } catch (e) {
    console.error('Failed to load houses:', e);
    return INITIAL_HOUSES;
  }
}

export function saveHouses(houses: SportsHouse[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HOUSES, JSON.stringify(houses));
  } catch (e) {
    console.error('Failed to save houses:', e);
  }
}

export function loadEvents(): SportsEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : INITIAL_EVENTS;
  } catch (e) {
    console.error('Failed to load events:', e);
    return INITIAL_EVENTS;
  }
}

export function saveEvents(events: SportsEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events:', e);
  }
}

export function loadAthletes(): Athlete[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ATHLETES);
    return data ? JSON.parse(data) : INITIAL_ATHLETES;
  } catch (e) {
    console.error('Failed to load athletes:', e);
    return INITIAL_ATHLETES;
  }
}

export function saveAthletes(athletes: Athlete[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATHLETES, JSON.stringify(athletes));
  } catch (e) {
    console.error('Failed to save athletes:', e);
  }
}

export function loadResults(): EventResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return data ? JSON.parse(data) : INITIAL_RESULTS;
  } catch (e) {
    console.error('Failed to load results:', e);
    return INITIAL_RESULTS;
  }
}

export function saveResults(results: EventResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (e) {
    console.error('Failed to save results:', e);
  }
}

export function resetToSampleData(): {
  houses: SportsHouse[];
  events: SportsEvent[];
  athletes: Athlete[];
  results: EventResult[];
} {
  saveHouses(INITIAL_HOUSES);
  saveEvents(INITIAL_EVENTS);
  saveAthletes(INITIAL_ATHLETES);
  saveResults(INITIAL_RESULTS);
  return {
    houses: INITIAL_HOUSES,
    events: INITIAL_EVENTS,
    athletes: INITIAL_ATHLETES,
    results: INITIAL_RESULTS,
  };
}
