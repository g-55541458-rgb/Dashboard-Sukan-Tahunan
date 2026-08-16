export type CategoryType = 'L12' | 'P12' | 'L10' | 'P10' | 'L8' | 'P8' | 'L11' | 'P11' | 'Pra-Sekolah' | 'Terbuka';

export type EventType = 'Balapan' | 'Padang';

export type EventStatus = 'Belum Mula' | 'Sedang Berlangsung' | 'Selesai';

export type EventDay = 'Hari Pertama' | 'Hari Kedua';

export interface SportsHouse {
  id: string;
  name: string; // e.g. "Rumah Merah"
  mascot: string; // e.g. "Naga Merah"
  color: string; // hex string e.g. "#ef4444"
  secondaryColor?: string;
  iconName: string; // Lucide icon name or emoji/symbol
  leaderName: string; // Ketua Rumah Sukan
  baselinePoints: number; // Baseline / penalti
  penaltyPoints: number;
}

export interface Athlete {
  id: string;
  name: string;
  className: string; // e.g. "6A", "5B", "4A"
  gender: 'Lelaki' | 'Perempuan';
  category: CategoryType;
  houseId: string;
  events: string[]; // List of event IDs or names assigned
}

export interface PointScheme {
  gold: number; // Default 7
  silver: number; // Default 5
  bronze: number; // Default 3
  fourth: number; // Default 1
}

export interface SportsEvent {
  id: string;
  name: string; // e.g. "100m", "Lompat Jauh", "4x100m"
  category: CategoryType;
  type: EventType;
  day?: EventDay; // 'Hari Pertama' | 'Hari Kedua'
  status: EventStatus;
  scheduledTime?: string;
  pointScheme: PointScheme;
  existingRecord?: string; // e.g. "12.80s oleh Lee Ah Beng (2019)"
  isRelay?: boolean;
}

export interface EventResult {
  id: string;
  eventId: string;
  completedAt: string; // ISO date string
  goldAthleteId?: string;
  goldAthleteName: string;
  goldHouseId: string;
  goldRecord?: string; // e.g. "12.45s"

  silverAthleteId?: string;
  silverAthleteName: string;
  silverHouseId: string;
  silverRecord?: string;

  bronzeAthleteId?: string;
  bronzeAthleteName: string;
  bronzeHouseId: string;
  bronzeRecord?: string;

  fourthAthleteId?: string;
  fourthAthleteName: string;
  fourthHouseId: string;
  fourthRecord?: string;

  isNewRecord?: boolean;
  notes?: string;
}

export interface HouseStats {
  house: SportsHouse;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  fourthCount: number;
  totalMedals: number;
  eventPoints: number;
  baselinePoints: number;
  penaltyPoints: number;
  totalPoints: number;
  rank: number;
}

export interface TopAthlete {
  athlete: Athlete;
  house: SportsHouse;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  totalPoints: number;
  eventsWon: string[];
}

export interface DSSSimulationScenario {
  remainingEventsCount: number;
  totalRemainingPoints: number;
  maxPossiblePointsPerHouse: { [houseId: string]: number };
  leaderHouseId: string;
  leadMargin: number;
  chaserGaps: { houseId: string; gap: number; minGoldsNeededToCatchUp: number }[];
  summaryCommentary: string;
}
