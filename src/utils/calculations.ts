import { SportsHouse, SportsEvent, Athlete, EventResult, HouseStats, TopAthlete, BestAthletesResult, DSSSimulationScenario } from '../types';

export function calculateHouseStats(
  houses: SportsHouse[],
  events: SportsEvent[],
  results: EventResult[]
): HouseStats[] {
  // Initialize house mapping
  const statsMap: { [houseId: string]: HouseStats } = {};

  houses.forEach((h) => {
    statsMap[h.id] = {
      house: h,
      goldCount: 0,
      silverCount: 0,
      bronzeCount: 0,
      fourthCount: 0,
      totalMedals: 0,
      eventPoints: 0,
      baselinePoints: h.baselinePoints || 0,
      penaltyPoints: h.penaltyPoints || 0,
      totalPoints: 0,
      rank: 1,
    };
  });

  // Event lookup
  const eventMap: { [eventId: string]: SportsEvent } = {};
  events.forEach((e) => {
    eventMap[e.id] = e;
  });

  // Process all completed results
  results.forEach((res) => {
    const event = eventMap[res.eventId];
    if (!event) return; // Ignore results for deleted events

    const scheme = event.pointScheme || { gold: 7, silver: 5, bronze: 3, fourth: 1 };

    if (res.goldHouseId && statsMap[res.goldHouseId]) {
      statsMap[res.goldHouseId].goldCount += 1;
      statsMap[res.goldHouseId].totalMedals += 1;
      statsMap[res.goldHouseId].eventPoints += scheme.gold;
    }
    if (res.silverHouseId && statsMap[res.silverHouseId]) {
      statsMap[res.silverHouseId].silverCount += 1;
      statsMap[res.silverHouseId].totalMedals += 1;
      statsMap[res.silverHouseId].eventPoints += scheme.silver;
    }
    if (res.bronzeHouseId && statsMap[res.bronzeHouseId]) {
      statsMap[res.bronzeHouseId].bronzeCount += 1;
      statsMap[res.bronzeHouseId].totalMedals += 1;
      statsMap[res.bronzeHouseId].eventPoints += scheme.bronze;
    }
    if (res.fourthHouseId && statsMap[res.fourthHouseId]) {
      statsMap[res.fourthHouseId].fourthCount += 1;
      statsMap[res.fourthHouseId].eventPoints += scheme.fourth;
    }
  });

  // Calculate total points
  const statsList = Object.values(statsMap).map((s) => {
    s.totalPoints = s.eventPoints + s.baselinePoints - s.penaltyPoints;
    return s;
  });

  // Sort by totalPoints desc -> goldCount desc -> silverCount desc -> bronzeCount desc
  statsList.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
    if (b.silverCount !== a.silverCount) return b.silverCount - a.silverCount;
    return b.bronzeCount - a.bronzeCount;
  });

  // Assign ranks
  statsList.forEach((item, index) => {
    item.rank = index + 1;
  });

  return statsList;
}

export function getTopAthletes(
  athletes: Athlete[],
  houses: SportsHouse[],
  results: EventResult[],
  events: SportsEvent[]
): BestAthletesResult {
  const houseMap: { [id: string]: SportsHouse } = {};
  houses.forEach((h) => (houseMap[h.id] = h));

  const eventMap: { [id: string]: SportsEvent } = {};
  events.forEach((e) => (eventMap[e.id] = e));

  const athleteMap: { [id: string]: Athlete } = {};
  athletes.forEach((a) => (athleteMap[a.id] = a));

  const athleteStats: {
    [nameOrId: string]: {
      name: string;
      athlete: Athlete | null;
      houseId: string;
      goldCount: number;
      silverCount: number;
      bronzeCount: number;
      totalPoints: number;
      eventsWon: string[];
    };
  } = {};

  const getOrCreateStats = (name: string, houseId: string, athleteObj?: Athlete) => {
    const key = athleteObj ? athleteObj.id : name.trim();
    if (!athleteStats[key]) {
      athleteStats[key] = {
        name: name,
        athlete: athleteObj || null,
        houseId: houseId,
        goldCount: 0,
        silverCount: 0,
        bronzeCount: 0,
        totalPoints: 0,
        eventsWon: [],
      };
    }
    return athleteStats[key];
  };

  results.forEach((res) => {
    const ev = eventMap[res.eventId];
    if (!ev) return; // Skip deleted events

    // Exclude L8, P8, and Pra-Sekolah events from individual athlete award calculations
    const isExcludedAwardEvent =
      /l8|p8|pra[- ]?sekolah|pra\b/i.test(ev.category || '') ||
      /\bl8\b|\bp8\b|bawah 8|pra[- ]?sekolah|prasekolah/i.test(ev.name);
    if (isExcludedAwardEvent) return;

    const evName = ev.name;
    const scheme = ev.pointScheme || { gold: 7, silver: 5, bronze: 3, fourth: 1 };

    if (res.goldAthleteName && res.goldHouseId) {
      const foundAth = athletes.find((a) => a.name.toLowerCase() === res.goldAthleteName.toLowerCase());
      const st = getOrCreateStats(res.goldAthleteName, res.goldHouseId, foundAth);
      st.goldCount += 1;
      st.totalPoints += scheme.gold;
      st.eventsWon.push(`${evName} (Emas)`);
    }

    if (res.silverAthleteName && res.silverHouseId) {
      const foundAth = athletes.find((a) => a.name.toLowerCase() === res.silverAthleteName.toLowerCase());
      const st = getOrCreateStats(res.silverAthleteName, res.silverHouseId, foundAth);
      st.silverCount += 1;
      st.totalPoints += scheme.silver;
      st.eventsWon.push(`${evName} (Perak)`);
    }

    if (res.bronzeAthleteName && res.bronzeHouseId) {
      const foundAth = athletes.find((a) => a.name.toLowerCase() === res.bronzeAthleteName.toLowerCase());
      const st = getOrCreateStats(res.bronzeAthleteName, res.bronzeHouseId, foundAth);
      st.bronzeCount += 1;
      st.totalPoints += scheme.bronze;
      st.eventsWon.push(`${evName} (Gangsa)`);
    }
  });

  const allAthleteSummaries = Object.values(athleteStats)
    .map((st) => {
      const house = houseMap[st.houseId] || {
        id: st.houseId,
        name: 'Rumah Sukan',
        mascot: '',
        color: '#3b82f6',
        iconName: 'Award',
        leaderName: '',
        baselinePoints: 0,
        penaltyPoints: 0,
      };

      // Determine gender
      let gender: 'Lelaki' | 'Perempuan' = 'Lelaki';
      if (st.athlete?.gender) {
        gender = st.athlete.gender;
      } else if (st.eventsWon.some((ev) => /perempuan|p12|p10|p8/i.test(ev))) {
        gender = 'Perempuan';
      }

      // Determine category strictly
      let category: 'L12' | 'P12' | 'L10' | 'P10' | 'L8' | 'P8' | 'Pra-Sekolah' = 'L12';
      if (st.athlete?.category) {
        category = st.athlete.category as any;
      } else {
        const hasL10orP10 = st.eventsWon.some((ev) => /\bl10\b|\bp10\b|bawah 10|80m/i.test(ev));
        const hasL8orP8 = st.eventsWon.some((ev) => /\bl8\b|\bp8\b|bawah 8|pra/i.test(ev));
        if (hasL8orP8) {
          category = gender === 'Perempuan' ? 'P8' : 'L8';
        } else if (hasL10orP10) {
          category = gender === 'Perempuan' ? 'P10' : 'L10';
        } else {
          category = gender === 'Perempuan' ? 'P12' : 'L12';
        }
      }

      const dummyAthlete: Athlete = st.athlete || {
        id: st.name,
        name: st.name,
        className: category.includes('10') ? '4A' : '6A',
        gender: gender,
        category: category,
        houseId: st.houseId,
        events: st.eventsWon,
      };

      return {
        athlete: dummyAthlete,
        house,
        goldCount: st.goldCount,
        silverCount: st.silverCount,
        bronzeCount: st.bronzeCount,
        totalPoints: st.totalPoints,
        eventsWon: st.eventsWon,
      };
    })
    // Filter out athletes registered under L8, P8, or Pra-Sekolah
    .filter((summary) => {
      const cat = (summary.athlete.category || '').toUpperCase().trim();
      const cls = (summary.athlete.className || '').toUpperCase().trim();
      const isExcluded =
        cat === 'L8' ||
        cat === 'P8' ||
        cat === 'PRA-SEKOLAH' ||
        cat === 'PRASEKOLAH' ||
        cat === 'PRA' ||
        /^PRA/i.test(cls);
      return !isExcluded;
    });

  // Sort by golds desc -> silvers desc -> bronzes desc -> points desc
  allAthleteSummaries.sort((a, b) => {
    if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
    if (b.silverCount !== a.silverCount) return b.silverCount - a.silverCount;
    if (b.bronzeCount !== a.bronzeCount) return b.bronzeCount - a.bronzeCount;
    return b.totalPoints - a.totalPoints;
  });

  // Strict Senior Checker (L12 & P12 ONLY)
  const isSeniorAthlete = (ath: Athlete, eventsWon: string[]) => {
    const cat = (ath.category || '').toUpperCase().trim();
    const cls = (ath.className || '').toUpperCase().trim();

    // If explicitly L10, P10, L8, P8, or Pra -> definitely NOT Senior
    if (cat === 'L10' || cat === 'P10' || cat === 'L8' || cat === 'P8' || cat === 'PRA-SEKOLAH' || cat === 'PRASEKOLAH') {
      return false;
    }
    // If class is Year 1, 2, 3, 4 -> definitely NOT Senior
    if (/^[1-4]/.test(cls)) {
      return false;
    }
    // If category is L12 or P12 or L11 or P11
    if (cat === 'L12' || cat === 'P12' || cat === 'L11' || cat === 'P11') {
      return true;
    }
    // If class is Year 5 or 6
    if (/^[56]/.test(cls)) {
      return true;
    }
    // Otherwise check events won (must have senior events and NO junior events)
    const hasSeniorEvent = eventsWon.some((ev) => /\bl12\b|\bp12\b|bawah 12|100m|200m|peluru|tinggi|jauh/i.test(ev));
    const hasJuniorEvent = eventsWon.some((ev) => /\bl10\b|\bp10\b|bawah 10|80m/i.test(ev));
    return hasSeniorEvent && !hasJuniorEvent;
  };

  // Strict Tunas Harapan Checker (L10 & P10 ONLY)
  const isHarapanAthlete = (ath: Athlete, eventsWon: string[]) => {
    const cat = (ath.category || '').toUpperCase().trim();
    const cls = (ath.className || '').toUpperCase().trim();

    // If explicitly L12, P12, L8, P8, or Pra -> definitely NOT Harapan
    if (cat === 'L12' || cat === 'P12' || cat === 'L11' || cat === 'P11' || cat === 'L8' || cat === 'P8' || cat === 'PRA-SEKOLAH') {
      return false;
    }
    // If class is Year 5, 6, 1, 2 -> definitely NOT Harapan
    if (/^[5612]/.test(cls)) {
      return false;
    }
    // If category is L10 or P10
    if (cat === 'L10' || cat === 'P10') {
      return true;
    }
    // If class is Year 3 or 4
    if (/^[34]/.test(cls)) {
      return true;
    }
    // Otherwise check events won
    return eventsWon.some((ev) => /\bl10\b|\bp10\b|bawah 10|80m/i.test(ev));
  };

  const isMale = (ath: Athlete, eventsWon: string[]) => {
    if (ath.gender === 'Lelaki') return true;
    if (ath.gender === 'Perempuan') return false;
    const cat = (ath.category || '').toUpperCase().trim();
    if (cat.startsWith('L')) return true;
    if (cat.startsWith('P')) return false;
    if (eventsWon.some((ev) => /lelaki|l12|l10/i.test(ev))) return true;
    if (eventsWon.some((ev) => /perempuan|p12|p10/i.test(ev))) return false;
    return true;
  };

  const maleAthletes = allAthleteSummaries.filter((a) => isMale(a.athlete, a.eventsWon));
  const femaleAthletes = allAthleteSummaries.filter((a) => !isMale(a.athlete, a.eventsWon));

  // 1. Male Senior Candidates (L12) - STRICT
  const maleSeniorCandidates = maleAthletes.filter((a) => isSeniorAthlete(a.athlete, a.eventsWon));
  // 2. Female Senior Candidates (P12) - STRICT
  const femaleSeniorCandidates = femaleAthletes.filter((a) => isSeniorAthlete(a.athlete, a.eventsWon));
  // 3. Male Harapan Candidates (L10) - STRICT
  const maleHarapanCandidates = maleAthletes.filter((a) => isHarapanAthlete(a.athlete, a.eventsWon));
  // 4. Female Harapan Candidates (P10) - STRICT
  const femaleHarapanCandidates = femaleAthletes.filter((a) => isHarapanAthlete(a.athlete, a.eventsWon));

  const olahragawanL12 = maleSeniorCandidates.length > 0 ? maleSeniorCandidates[0] : null;
  const olahragawatiP12 = femaleSeniorCandidates.length > 0 ? femaleSeniorCandidates[0] : null;
  const olahragawanL10 = maleHarapanCandidates.length > 0 ? maleHarapanCandidates[0] : null;
  const olahragawatiP10 = femaleHarapanCandidates.length > 0 ? femaleHarapanCandidates[0] : null;

  return {
    olahragawanL12,
    olahragawatiP12,
    olahragawanL10,
    olahragawatiP10,
    olahragawan: olahragawanL12,
    olahragawati: olahragawatiP12,
  };
}

export function generateDSSAnalytics(
  houseStats: HouseStats[],
  events: SportsEvent[],
  results: EventResult[]
): DSSSimulationScenario {
  const validEventIds = new Set(events.map((e) => e.id));
  const validResults = results.filter((r) => validEventIds.has(r.eventId));
  const completedEventIds = new Set(validResults.map((r) => r.eventId));
  const remainingEvents = events.filter((e) => !completedEventIds.has(e.id) && e.status !== 'Selesai');
  const remainingEventsCount = remainingEvents.length;

  let totalRemainingPoints = 0;
  remainingEvents.forEach((ev) => {
    const goldPts = ev.pointScheme?.gold || (ev.isRelay ? 14 : 7);
    totalRemainingPoints += goldPts;
  });

  const leader = houseStats[0] || { house: { id: 'none', name: 'N/A' }, totalPoints: 0 };
  const leaderId = leader.house.id;

  const chaserGaps = houseStats.slice(1).map((stat) => {
    const gap = leader.totalPoints - stat.totalPoints;
    // Avg gold points = 16
    const minGoldsNeededToCatchUp = Math.ceil(gap / 16);
    return {
      houseId: stat.house.id,
      gap,
      minGoldsNeededToCatchUp,
    };
  });

  const maxPossiblePointsPerHouse: { [houseId: string]: number } = {};
  houseStats.forEach((st) => {
    maxPossiblePointsPerHouse[st.house.id] = st.totalPoints + totalRemainingPoints;
  });

  // Generate intelligent commentary in Malay
  let commentary = '';
  if (remainingEventsCount === 0) {
    commentary = `🏆 Kejohanan telah tamat! Tahniah kepada ${leader.house.name} yang muncul Juara Keseluruhan Kejohanan Sukan Tahunan SJK(C) Chung Hwa Tenom 2026 dengan jumlah ${leader.totalPoints} mata!`;
  } else {
    const runnerUp = houseStats[1];
    const gapToSecond = runnerUp ? leader.totalPoints - runnerUp.totalPoints : 0;
    if (gapToSecond === 0) {
      commentary = `⚡ Persaingan sengit! ${leader.house.name} dan ${runnerUp.house.name} terikat pada kedudukan pertama dengan ${leader.totalPoints} mata. Dengan ${remainingEventsCount} acara berbaki (${totalRemainingPoints} mata maksimum), piala pusingan masih terbuka luas!`;
    } else if (gapToSecond > totalRemainingPoints) {
      commentary = `🔒 ${leader.house.name} mempunyai kelebihan mata tidak terjejas (${gapToSecond} mata jurang melebihi ${totalRemainingPoints} mata berbaki). ${leader.house.name} secara matematik disahkan memenangi Kejohanan Sukan 2026!`;
    } else {
      commentary = `🔥 ${leader.house.name} kini mendahului dengan ${leader.totalPoints} mata (${gapToSecond} mata di hadapan ${runnerUp?.house.name}). Terdapat ${remainingEventsCount} acara lagi yang menawarkan ${totalRemainingPoints} mata maksimum. ${runnerUp?.house.name} sekurang-kurangnya memerlukan ${Math.ceil(gapToSecond / 16)} pingat Emas lagi (+16 mata/emas) untuk memintas!`;
    }
  }

  return {
    remainingEventsCount,
    totalRemainingPoints,
    maxPossiblePointsPerHouse,
    leaderHouseId: leaderId,
    leadMargin: chaserGaps.length > 0 ? chaserGaps[0].gap : 0,
    chaserGaps,
    summaryCommentary: commentary,
  };
}
