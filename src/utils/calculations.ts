import { SportsHouse, SportsEvent, Athlete, EventResult, HouseStats, TopAthlete, DSSSimulationScenario } from '../types';

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
): { olahragawan: TopAthlete | null; olahragawati: TopAthlete | null } {
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

  const allAthleteSummaries = Object.values(athleteStats).map((st) => {
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

    const dummyAthlete: Athlete = st.athlete || {
      id: st.name,
      name: st.name,
      className: 'SJK(C) CH',
      gender: 'Lelaki',
      category: 'L12',
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
  });

  // Sort by golds desc -> silvers desc -> bronzes desc -> points desc
  allAthleteSummaries.sort((a, b) => {
    if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
    if (b.silverCount !== a.silverCount) return b.silverCount - a.silverCount;
    if (b.bronzeCount !== a.bronzeCount) return b.bronzeCount - a.bronzeCount;
    return b.totalPoints - a.totalPoints;
  });

  const maleCandidates = allAthleteSummaries.filter(
    (a) => a.athlete.gender === 'Lelaki' || a.athlete.category.startsWith('L')
  );

  const femaleCandidates = allAthleteSummaries.filter(
    (a) => a.athlete.gender === 'Perempuan' || a.athlete.category.startsWith('P')
  );

  return {
    olahragawan: maleCandidates.length > 0 ? maleCandidates[0] : null,
    olahragawati: femaleCandidates.length > 0 ? femaleCandidates[0] : null,
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
    // Avg gold points = 7
    const minGoldsNeededToCatchUp = Math.ceil(gap / 7);
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
      commentary = `🔥 ${leader.house.name} kini mendahului dengan ${leader.totalPoints} mata (${gapToSecond} mata di hadapan ${runnerUp?.house.name}). Terdapat ${remainingEventsCount} acara lagi yang menawarkan ${totalRemainingPoints} mata maksimum. ${runnerUp?.house.name} sekurang-kurangnya memerlukan ${Math.ceil(gapToSecond / 7)} pingat Emas lagi untuk memintas!`;
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
