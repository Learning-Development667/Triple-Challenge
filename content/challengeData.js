// 30 Day Triple Challenge — Full Programme Data
// Start date: 24 May 2026 — Day 8 is 31 May 2026, Day 9 is 1 June 2026

const CHALLENGE_START = new Date('2026-05-24');

// ============================================================
//  FORM GUIDES
// ============================================================

const FORM_GUIDES = {
  plank: {
    title: 'Plank',
    cues: [
      'Keep your body in a straight line from head to heels',
      'Brace your core as if bracing for a punch',
      'Keep hips level — do not let them sag or rise',
      'Look down at the floor, keeping your neck neutral'
    ],
    steps: [
      'Place forearms flat on the floor, elbows directly under shoulders',
      'Step feet back so your body forms a straight line',
      'Squeeze glutes and brace your core',
      'Hold the position, breathing steadily throughout',
      'If form breaks, stop and rest — quality over time'
    ]
  },
  pushups: {
    title: 'Push-Ups',
    cues: [
      'Keep your body rigid — no sagging hips or raised backside',
      'Hands slightly wider than shoulder-width',
      'Lower until chest nearly touches the floor',
      'Keep elbows at roughly 45 degrees — not flared wide'
    ],
    steps: [
      'Start in a high plank — hands under shoulders, body straight',
      'Engage your core and squeeze your glutes',
      'Lower your chest to just above the floor in a controlled movement',
      'Push back up to the start position, fully extending your arms',
      'Reset and repeat — do not rush the reps'
    ]
  },
  situps: {
    title: 'Sit-Ups',
    cues: [
      'Drive up using your core, not momentum',
      'Keep feet flat on the floor or anchored',
      'Hands lightly behind your head — do not pull on your neck',
      'Lower back down in a controlled movement'
    ],
    steps: [
      'Lie flat on your back, knees bent, feet flat on the floor',
      'Place hands lightly behind your head or cross them on your chest',
      'Engage your core and curl your torso up toward your knees',
      'Pause briefly at the top',
      'Lower slowly back to the floor and repeat'
    ]
  }
};

// ============================================================
//  WARM UP ROUTINES — varied by exercises active that day
// ============================================================

function getWarmUp(dayData) {
  const hasPlank   = dayData.plank !== null;
  const hasPushups = dayData.pushups !== null;
  const hasSitups  = dayData.situps !== null;

  const routine = [];

  // Always include general warm up
  routine.push(
    { name: 'March on the spot', duration: '60 seconds', desc: 'Lift knees to hip height, swinging arms naturally to raise heart rate.' },
    { name: 'Arm circles', duration: '30 seconds each direction', desc: 'Extend arms out to the sides and make large slow circles, loosening the shoulders.' }
  );

  if (hasPlank || hasPushups) {
    routine.push(
      { name: 'Shoulder rolls', duration: '10 reps forward, 10 back', desc: 'Roll shoulders forward and back to mobilise the shoulder joint.' },
      { name: 'Cat-cow stretch', duration: '10 slow reps', desc: 'On all fours, alternate between arching your back upward and dipping it down. Warms the spine and core.' }
    );
  }

  if (hasPushups) {
    routine.push(
      { name: 'Wall push-up', duration: '10 reps', desc: 'Hands on wall at chest height, perform slow push-ups to warm up chest and triceps before floor work.' }
    );
  }

  if (hasPlank) {
    routine.push(
      { name: 'Glute bridge hold', duration: '20 seconds', desc: 'Lie on your back, feet flat, lift hips and hold. Activates glutes and core — key stabilisers for plank.' }
    );
  }

  if (hasSitups) {
    routine.push(
      { name: 'Pelvic tilt', duration: '10 reps', desc: 'Lie on your back, knees bent. Gently flatten your lower back into the floor and release. Warms the lower back and abdominals.' },
      { name: 'Knee to chest pull', duration: '30 seconds each side', desc: 'Lying on your back, pull one knee to your chest and hold. Loosens the hip flexors used during sit-ups.' }
    );
  }

  return routine;
}

// ============================================================
//  COOL DOWN STRETCHES — varied by exercises active that day
// ============================================================

function getCoolDown(dayData) {
  const hasPlank   = dayData.plank !== null;
  const hasPushups = dayData.pushups !== null;
  const hasSitups  = dayData.situps !== null;

  const routine = [];

  // Always include
  routine.push(
    { name: 'Child\'s pose', duration: '45 seconds', desc: 'Kneel and reach arms forward on the floor, letting your chest drop. Stretches the spine, shoulders, and hips.' },
    { name: 'Deep breathing', duration: '1 minute', desc: 'Breathe in for 4 counts, hold for 2, out for 6. Brings heart rate down and helps recovery.' }
  );

  if (hasPlank || hasPushups) {
    routine.push(
      { name: 'Chest opener', duration: '30 seconds', desc: 'Clasp hands behind your back, squeeze shoulder blades together and lift slightly. Stretches chest and front of shoulders.' },
      { name: 'Tricep stretch', duration: '30 seconds each side', desc: 'Raise one arm overhead, bend at elbow. Use other hand to gently press elbow back. Targets triceps used in push-ups and plank.' },
      { name: 'Cobra stretch', duration: '30 seconds', desc: 'Lie face down, place hands under shoulders and gently press up, lifting your chest. Stretches the core and lower back.' }
    );
  }

  if (hasPlank) {
    routine.push(
      { name: 'Hip flexor stretch', duration: '30 seconds each side', desc: 'Lunge forward with one foot, drop the back knee to the floor. Press hips gently forward. Releases hip flexors held under tension during plank.' }
    );
  }

  if (hasSitups) {
    routine.push(
      { name: 'Seated forward fold', duration: '45 seconds', desc: 'Sit with legs straight, reach forward toward your feet. Stretches the lower back and hamstrings worked during sit-ups.' },
      { name: 'Lying twist', duration: '30 seconds each side', desc: 'Lie on your back, bring one knee across your body to the floor. Arms out wide. Releases the lower back and obliques.' }
    );
  }

  return routine;
}

// ============================================================
//  CHALLENGE PROGRAMME DATA
// ============================================================

const CHALLENGE_DATA = {
  month1: {
    label: 'Month 1 — The Starting Challenge',
    days: [
      { day: 1,  plank: '1m',      pushups: 5,     situps: 20 },
      { day: 2,  plank: '1m',      pushups: 5,     situps: 25 },
      { day: 3,  plank: '1m 5s',   pushups: null,  situps: 30 },
      { day: 4,  plank: '1m 5s',   pushups: 5,     situps: null },
      { day: 5,  plank: '1m 10s',  pushups: null,  situps: 40 },
      { day: 6,  plank: null,      pushups: 10,    situps: 45 },
      { day: 7,  plank: '1m 10s',  pushups: null,  situps: 50 },
      { day: 8,  plank: '1m 15s',  pushups: 10,    situps: null },
      { day: 9,  plank: '1m 15s',  pushups: 12,    situps: 60 },
      { day: 10, plank: '1m 20s',  pushups: 12,    situps: 65 },
      { day: 11, plank: '1m 20s',  pushups: null,  situps: 70 },
      { day: 12, plank: '1m 25s',  pushups: 15,    situps: null },
      { day: 13, plank: null,      pushups: 15,    situps: 80 },
      { day: 14, plank: '1m 25s',  pushups: null,  situps: 85 },
      { day: 15, plank: '1m 30s',  pushups: 20,    situps: 90 },
      { day: 16, plank: '1m 30s',  pushups: 24,    situps: null },
      { day: 17, plank: '1m 35s',  pushups: null,  situps: 100 },
      { day: 18, plank: '1m 35s',  pushups: 25,    situps: 100 },
      { day: 19, plank: null,      pushups: 30,    situps: 100 },
      { day: 20, plank: '1m 40s',  pushups: 32,    situps: null },
      { day: 21, plank: '1m 40s',  pushups: null,  situps: 100 },
      { day: 22, plank: '1m 45s',  pushups: 35,    situps: 100 },
      { day: 23, plank: '1m 45s',  pushups: null,  situps: 100 },
      { day: 24, plank: '1m 50s',  pushups: 35,    situps: null },
      { day: 25, plank: '1m 50s',  pushups: 38,    situps: 100 },
      { day: 26, plank: null,      pushups: 40,    situps: 100 },
      { day: 27, plank: '1m 55s',  pushups: null,  situps: 100 },
      { day: 28, plank: '1m 55s',  pushups: 42,    situps: null },
      { day: 29, plank: '2m',      pushups: 45,    situps: 100 },
      { day: 30, plank: '2m',      pushups: 50,    situps: 100 },
    ]
  },
  month2: {
    label: 'Month 2 — Continuation +20%',
    days: [
      { day: 1,  plank: '2m 5s',   pushups: 32,    situps: 100 },
      { day: 2,  plank: '2m 5s',   pushups: 33,    situps: 100 },
      { day: 3,  plank: '2m 10s',  pushups: null,  situps: 100 },
      { day: 4,  plank: '2m 10s',  pushups: 35,    situps: null },
      { day: 5,  plank: '2m 15s',  pushups: null,  situps: 100 },
      { day: 6,  plank: null,      pushups: 36,    situps: 100 },
      { day: 7,  plank: '2m 15s',  pushups: null,  situps: 100 },
      { day: 8,  plank: '2m 20s',  pushups: 38,    situps: null },
      { day: 9,  plank: '2m 20s',  pushups: 39,    situps: 100 },
      { day: 10, plank: '2m 25s',  pushups: 40,    situps: 100 },
      { day: 11, plank: '2m 25s',  pushups: null,  situps: 100 },
      { day: 12, plank: '2m 25s',  pushups: 42,    situps: null },
      { day: 13, plank: null,      pushups: 43,    situps: 100 },
      { day: 14, plank: '2m 30s',  pushups: null,  situps: 100 },
      { day: 15, plank: '2m 30s',  pushups: 45,    situps: 100 },
      { day: 16, plank: '2m 35s',  pushups: 46,    situps: null },
      { day: 17, plank: '2m 35s',  pushups: null,  situps: 100 },
      { day: 18, plank: '2m 40s',  pushups: 47,    situps: 100 },
      { day: 19, plank: null,      pushups: 49,    situps: 100 },
      { day: 20, plank: '2m 40s',  pushups: 50,    situps: null },
      { day: 21, plank: '2m 40s',  pushups: null,  situps: 100 },
      { day: 22, plank: '2m 45s',  pushups: 52,    situps: 100 },
      { day: 23, plank: '2m 45s',  pushups: null,  situps: 100 },
      { day: 24, plank: '2m 50s',  pushups: 53,    situps: null },
      { day: 25, plank: '2m 50s',  pushups: 54,    situps: 100 },
      { day: 26, plank: null,      pushups: 56,    situps: 100 },
      { day: 27, plank: '2m 55s',  pushups: null,  situps: 100 },
      { day: 28, plank: '2m 55s',  pushups: 57,    situps: null },
      { day: 29, plank: '3m',      pushups: 59,    situps: 100 },
      { day: 30, plank: '3m',      pushups: 60,    situps: 100 },
    ]
  },
  month3: {
    label: 'Month 3 — Continuation +40%',
    days: [
      { day: 1,  plank: '3m 5s',   pushups: 45,    situps: 100 },
      { day: 2,  plank: '3m 5s',   pushups: 46,    situps: 100 },
      { day: 3,  plank: '3m 10s',  pushups: null,  situps: 100 },
      { day: 4,  plank: '3m 10s',  pushups: 48,    situps: null },
      { day: 5,  plank: '3m 15s',  pushups: null,  situps: 100 },
      { day: 6,  plank: null,      pushups: 49,    situps: 100 },
      { day: 7,  plank: '3m 15s',  pushups: null,  situps: 100 },
      { day: 8,  plank: '3m 20s',  pushups: 50,    situps: null },
      { day: 9,  plank: '3m 20s',  pushups: 51,    situps: 100 },
      { day: 10, plank: '3m 25s',  pushups: 53,    situps: 100 },
      { day: 11, plank: '3m 25s',  pushups: null,  situps: 100 },
      { day: 12, plank: '3m 25s',  pushups: 54,    situps: null },
      { day: 13, plank: null,      pushups: 55,    situps: 100 },
      { day: 14, plank: '3m 30s',  pushups: null,  situps: 100 },
      { day: 15, plank: '3m 30s',  pushups: 56,    situps: 100 },
      { day: 16, plank: '3m 35s',  pushups: 58,    situps: null },
      { day: 17, plank: '3m 35s',  pushups: null,  situps: 100 },
      { day: 18, plank: '3m 40s',  pushups: 59,    situps: 100 },
      { day: 19, plank: null,      pushups: 60,    situps: 100 },
      { day: 20, plank: '3m 40s',  pushups: 61,    situps: null },
      { day: 21, plank: '3m 40s',  pushups: null,  situps: 100 },
      { day: 22, plank: '3m 45s',  pushups: 63,    situps: 100 },
      { day: 23, plank: '3m 45s',  pushups: null,  situps: 100 },
      { day: 24, plank: '3m 50s',  pushups: 64,    situps: null },
      { day: 25, plank: '3m 50s',  pushups: 65,    situps: 100 },
      { day: 26, plank: null,      pushups: 66,    situps: 100 },
      { day: 27, plank: '3m 55s',  pushups: null,  situps: 100 },
      { day: 28, plank: '3m 55s',  pushups: 68,    situps: null },
      { day: 29, plank: '4m',      pushups: 69,    situps: 100 },
      { day: 30, plank: '4m',      pushups: 70,    situps: 100 },
    ]
  }
};

// Returns { month, day } for today or null if outside range
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

function plankToSeconds(str) {
  if (!str) return 0;
  let total = 0;
  const minMatch = str.match(/(\d+)m/);
  const secMatch = str.match(/(\d+)s/);
  if (minMatch) total += parseInt(minMatch[1]) * 60;
  if (secMatch) total += parseInt(secMatch[1]);
  return total;
}
