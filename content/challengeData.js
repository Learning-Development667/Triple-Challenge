// 30 Day Triple Challenge — Full Programme Data
// Start date: 22 May 2026 — Day 9 is 1 June 2026

const CHALLENGE_START = new Date('2026-05-23');

const CHALLENGE_DATA = {
  month1: {
    label: 'Month 1 — The Starting Challenge',
    days: [
      { day: 1,  plank: '20s',    pushups: 5,    situps: 20  },
      { day: 2,  plank: '20s',    pushups: 5,    situps: 25  },
      { day: 3,  plank: '30s',    pushups: null, situps: 30  },
      { day: 4,  plank: '30s',    pushups: 5,    situps: null },
      { day: 5,  plank: '40s',    pushups: null, situps: 40  },
      { day: 6,  plank: null,     pushups: 10,   situps: 45  },
      { day: 7,  plank: '45s',    pushups: null, situps: 50  },
      { day: 8,  plank: '45s',    pushups: 10,   situps: null },
      { day: 9,  plank: '1m',     pushups: 12,   situps: 60  },
      { day: 10, plank: '1m',     pushups: 12,   situps: 65  },
      { day: 11, plank: '1m',     pushups: null, situps: 70  },
      { day: 12, plank: '1m 30s', pushups: 15,   situps: null },
      { day: 13, plank: null,     pushups: 15,   situps: 80  },
      { day: 14, plank: '1m 30s', pushups: null, situps: 85  },
      { day: 15, plank: '1m 30s', pushups: 20,   situps: 90  },
      { day: 16, plank: '2m',     pushups: 24,   situps: null },
      { day: 17, plank: '2m',     pushups: null, situps: 100 },
      { day: 18, plank: '2m 30s', pushups: 25,   situps: 105 },
      { day: 19, plank: null,     pushups: 30,   situps: 110 },
      { day: 20, plank: '2m 30s', pushups: 32,   situps: null },
      { day: 21, plank: '2m 30s', pushups: null, situps: 115 },
      { day: 22, plank: '3m',     pushups: 35,   situps: 120 },
      { day: 23, plank: '3m',     pushups: null, situps: 125 },
      { day: 24, plank: '3m 30s', pushups: 35,   situps: null },
      { day: 25, plank: '3m 30s', pushups: 38,   situps: 130 },
      { day: 26, plank: null,     pushups: 40,   situps: 135 },
      { day: 27, plank: '4m',     pushups: null, situps: 140 },
      { day: 28, plank: '4m',     pushups: 42,   situps: null },
      { day: 29, plank: '4m 30s', pushups: 45,   situps: 145 },
      { day: 30, plank: '5m',     pushups: 50,   situps: 150 },
    ]
  },
  month2: {
    label: 'Month 2 — Continuation +20%',
    days: [
      { day: 1,  plank: '2m 30s', pushups: 32,   situps: 115 },
      { day: 2,  plank: '2m 40s', pushups: 33,   situps: 120 },
      { day: 3,  plank: '2m 45s', pushups: null, situps: 120 },
      { day: 4,  plank: '2m 55s', pushups: 35,   situps: null },
      { day: 5,  plank: '3m 5s',  pushups: null, situps: 125 },
      { day: 6,  plank: null,     pushups: 36,   situps: 125 },
      { day: 7,  plank: '3m 10s', pushups: null, situps: 130 },
      { day: 8,  plank: '3m 20s', pushups: 38,   situps: null },
      { day: 9,  plank: '3m 30s', pushups: 39,   situps: 135 },
      { day: 10, plank: '3m 35s', pushups: 40,   situps: 135 },
      { day: 11, plank: '3m 45s', pushups: null, situps: 140 },
      { day: 12, plank: '3m 55s', pushups: 42,   situps: null },
      { day: 13, plank: null,     pushups: 43,   situps: 140 },
      { day: 14, plank: '4m',     pushups: null, situps: 145 },
      { day: 15, plank: '4m 10s', pushups: 45,   situps: 150 },
      { day: 16, plank: '4m 20s', pushups: 46,   situps: null },
      { day: 17, plank: '4m 30s', pushups: null, situps: 150 },
      { day: 18, plank: '4m 35s', pushups: 47,   situps: 155 },
      { day: 19, plank: null,     pushups: 49,   situps: 155 },
      { day: 20, plank: '4m 45s', pushups: 50,   situps: null },
      { day: 21, plank: '4m 55s', pushups: null, situps: 160 },
      { day: 22, plank: '5m',     pushups: 52,   situps: 160 },
      { day: 23, plank: '5m 10s', pushups: null, situps: 165 },
      { day: 24, plank: '5m 20s', pushups: 53,   situps: null },
      { day: 25, plank: '5m 25s', pushups: 54,   situps: 170 },
      { day: 26, plank: null,     pushups: 56,   situps: 170 },
      { day: 27, plank: '5m 35s', pushups: null, situps: 175 },
      { day: 28, plank: '5m 45s', pushups: 57,   situps: null },
      { day: 29, plank: '5m 50s', pushups: 59,   situps: 175 },
      { day: 30, plank: '6m',     pushups: 60,   situps: 180 },
    ]
  },
  month3: {
    label: 'Month 3 — Continuation +40%',
    days: [
      { day: 1,  plank: '4m 50s', pushups: 45,   situps: 140 },
      { day: 2,  plank: '4m 55s', pushups: 46,   situps: 145 },
      { day: 3,  plank: '5m',     pushups: null, situps: 145 },
      { day: 4,  plank: '5m 5s',  pushups: 48,   situps: null },
      { day: 5,  plank: '5m 10s', pushups: null, situps: 150 },
      { day: 6,  plank: null,     pushups: 49,   situps: 155 },
      { day: 7,  plank: '5m 15s', pushups: null, situps: 155 },
      { day: 8,  plank: '5m 20s', pushups: 50,   situps: null },
      { day: 9,  plank: '5m 25s', pushups: 51,   situps: 160 },
      { day: 10, plank: '5m 30s', pushups: 53,   situps: 160 },
      { day: 11, plank: '5m 35s', pushups: null, situps: 165 },
      { day: 12, plank: '5m 40s', pushups: 54,   situps: null },
      { day: 13, plank: null,     pushups: 55,   situps: 170 },
      { day: 14, plank: '5m 45s', pushups: null, situps: 170 },
      { day: 15, plank: '5m 50s', pushups: 56,   situps: 175 },
      { day: 16, plank: '6m',     pushups: 58,   situps: null },
      { day: 17, plank: '6m 5s',  pushups: null, situps: 180 },
      { day: 18, plank: '6m 10s', pushups: 59,   situps: 180 },
      { day: 19, plank: null,     pushups: 60,   situps: 185 },
      { day: 20, plank: '6m 15s', pushups: 61,   situps: null },
      { day: 21, plank: '6m 20s', pushups: null, situps: 190 },
      { day: 22, plank: '6m 25s', pushups: 63,   situps: 190 },
      { day: 23, plank: '6m 30s', pushups: null, situps: 195 },
      { day: 24, plank: '6m 35s', pushups: 64,   situps: null },
      { day: 25, plank: '6m 40s', pushups: 65,   situps: 195 },
      { day: 26, plank: null,     pushups: 66,   situps: 200 },
      { day: 27, plank: '6m 45s', pushups: null, situps: 205 },
      { day: 28, plank: '6m 50s', pushups: 68,   situps: null },
      { day: 29, plank: '6m 55s', pushups: 69,   situps: 205 },
      { day: 30, plank: '7m',     pushups: 70,   situps: 210 },
    ]
  }
};

// Returns { month: 1|2|3, day: 1-30 } for today, or null if outside range
function getTodayProgress() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(CHALLENGE_START);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff >= 90) return null;
  const month = Math.floor(diff / 30) + 1;
  const day = (diff % 30) + 1;
  return { month, day };
}

function getDayData(month, day) {
  const key = `month${month}`;
  return CHALLENGE_DATA[key]?.days[day - 1] || null;
}

// Convert plank string to seconds for display logic
function plankToSeconds(str) {
  if (!str) return 0;
  let total = 0;
  const minMatch = str.match(/(\d+)m/);
  const secMatch = str.match(/(\d+)s/);
  if (minMatch) total += parseInt(minMatch[1]) * 60;
  if (secMatch) total += parseInt(secMatch[1]);
  return total;
}
