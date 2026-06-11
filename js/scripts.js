// ============================================================
//  Triple Challenge — scripts.js
//  Credentials are in config.js — do not add them here.
// ============================================================

// App version — bump the patch number on every change merged to main.
const APP_VERSION = 'v1.8.0';

const EFFORTS = [
  { key: 'easy',    label: 'Easy' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'hard',    label: 'Hard' }
];

const SETS_OPTIONS = [
  { key: 'single', label: 'One Sitting' },
  { key: 'sets',   label: 'Broken into Sets' }
];

let currentUser = null;
let appData = null;
let notifEnabled = localStorage.getItem('notifEnabled') === 'true';
let pendingLog = null;
let pendingEffort = null;

// ============================================================
//  SVG ICONS
// ============================================================

function getSVGIcon(name, size = 28) {
  const icons = {
    easy: `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2"/><circle cx="11" cy="13" r="1.8" fill="currentColor"/><circle cx="21" cy="13" r="1.8" fill="currentColor"/><path d="M10 20 Q16 25 22 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
    neutral: `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2"/><circle cx="11" cy="13" r="1.8" fill="currentColor"/><circle cx="21" cy="13" r="1.8" fill="currentColor"/><line x1="10" y1="21" x2="22" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    hard: `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2"/><circle cx="11" cy="13" r="1.8" fill="currentColor"/><circle cx="21" cy="13" r="1.8" fill="currentColor"/><path d="M10 22 Q16 17 22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
    single: `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="14" width="24" height="4" rx="2" fill="currentColor"/><circle cx="16" cy="8" r="3" fill="currentColor"/><circle cx="16" cy="24" r="3" fill="currentColor"/></svg>`,
    sets: `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="7" width="24" height="3.5" rx="1.5" fill="currentColor"/><rect x="4" y="14" width="24" height="3.5" rx="1.5" fill="currentColor" opacity="0.6"/><rect x="4" y="21" width="24" height="3.5" rx="1.5" fill="currentColor" opacity="0.35"/></svg>`,
    plank: `<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="8" r="3" fill="currentColor"/><line x1="4" y1="18" x2="28" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="4" y1="18" x2="4" y2="24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="18" y1="15.5" x2="20" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    pushups: `<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="7" r="3" fill="currentColor"/><line x1="4" y1="22" x2="28" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="14" y1="19" x2="22" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="4" y1="22" x2="4" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="16" x2="28" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    situps: `<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="6" r="3" fill="currentColor"/><path d="M8 24 L14 16 L20 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/><line x1="4" y1="24" x2="18" y2="24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="8" y1="24" x2="6" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="24" x2="14" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    rest: `<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 20 Q16 8 24 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/><line x1="10" y1="13" x2="14" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/><line x1="18" y1="11" x2="22" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/></svg>`,
    chart: `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="18" width="5" height="10" rx="1" fill="currentColor"/><rect x="13" y="10" width="5" height="18" rx="1" fill="currentColor"/><rect x="22" y="4" width="5" height="24" rx="1" fill="currentColor"/></svg>`,
    settings: `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="4" stroke="currentColor" stroke-width="2"/><path d="M16 4 L16 8 M16 24 L16 28 M4 16 L8 16 M24 16 L28 16 M7.5 7.5 L10.3 10.3 M21.7 21.7 L24.5 24.5 M24.5 7.5 L21.7 10.3 M10.3 21.7 L7.5 24.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    tick: `<svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="6,17 13,24 26,9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    warmup: `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 C16 4 10 10 10 16 C10 19.3 12.7 22 16 22 C19.3 22 22 19.3 22 16 C22 10 16 4 16 4Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 22 L16 28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="28" x2="20" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    cooldown: `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6 L16 26 M8 10 L16 6 L24 10 M8 22 L16 26 L24 22 M6 16 L26 16 M6 16 L10 12 M6 16 L10 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    dumbbell: `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="11" y1="16" x2="21" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="4" y="11" width="4" height="10" rx="1.5" fill="currentColor"/><rect x="24" y="11" width="4" height="10" rx="1.5" fill="currentColor"/><rect x="9" y="13" width="2.5" height="6" rx="1" fill="currentColor"/><rect x="20.5" y="13" width="2.5" height="6" rx="1" fill="currentColor"/></svg>`,
    formguide: `<svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2"/><line x1="16" y1="14" x2="16" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/></svg>`,
    chevron: `<svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="8,12 16,20 24,12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    back: `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="19,7 11,16 19,25" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lock: `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="14" width="16" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M11 14 v-3 a5 5 0 0 1 10 0 v3" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
  };
  return icons[name] || '';
}

// ============================================================
//  INIT
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  registerSW();
  // Load data once up front so the landing screen can show per-user stats.
  showLoading();
  await loadData();
  renderUserSelect();
});

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// Force a fresh copy of the app: unregister the service worker, clear every
// cache, then reload.
async function checkForUpdates() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if (window.caches && caches.keys) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch (e) {}
  location.reload();
}

// ============================================================
//  DATA — JSONBin
// ============================================================

async function loadData() {
  try {
    const res = await fetch(BIN_URL + '/latest', {
      headers: { 'X-Access-Key': ACCESS_KEY }
    });
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    appData = json.record;
    if (!appData.mark) appData.mark = { logs: {} };
    if (!appData.shelley) appData.shelley = { logs: {} };
    return true;
  } catch (e) {
    const local = localStorage.getItem('tripleChallengeFallback');
    appData = local ? JSON.parse(local) : { mark: { logs: {} }, shelley: { logs: {} } };
    return false;
  }
}

async function saveData() {
  localStorage.setItem('tripleChallengeFallback', JSON.stringify(appData));
  try {
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Access-Key': ACCESS_KEY },
      body: JSON.stringify(appData)
    });
  } catch (e) {}
}

// ============================================================
//  VIEWS
// ============================================================

function setView(html) {
  document.getElementById('app').innerHTML = html;
}

// ---- USER SELECT ----

// Short motivational quotes for the landing screen (no API call needed).
const HOME_QUOTES = [
  "The only bad workout is the one you didn't do.",
  "Discipline is choosing between what you want now and what you want most.",
  "You don't have to be extreme, just consistent.",
  "Push yourself — no one else is going to do it for you.",
  "Strength grows in the moments you think you can't go on but keep going.",
  "The body achieves what the mind believes.",
  "Little by little, a little becomes a lot.",
  "Don't wish for it, work for it.",
  "Your only limit is you.",
  "Fall in love with taking care of yourself.",
  "Earn it. One rep at a time.",
  "Showing up is half the battle.",
  "Sweat now, shine later.",
  "Consistency beats intensity.",
];

// Today's 0-based day index from the calendar (<0 before start, can exceed 89).
function currentDayIndex() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(CHALLENGE_START); start.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / 86400000);
}

// Did `user` train on challenge-day index `gi` (logged at least one exercise)?
// Streak and last-active both use this single signal so they stay consistent.
function dayActive(user, gi) {
  const month = Math.floor(gi / 30) + 1, day = (gi % 30) + 1;
  const log = (appData[user] && appData[user].logs[`m${month}d${day}`]) || {};
  return ['plank', 'pushups', 'situps'].some(k => log[k] !== undefined);
}

// Current streak: consecutive trained days ending at today. Today not logged
// yet is allowed (the streak then runs up to yesterday); a fully missed day
// breaks it.
function getUserStreak(user) {
  const todayIdx = currentDayIndex();
  if (todayIdx < 0) return 0;
  let gi = Math.min(todayIdx, 89);
  if (!dayActive(user, gi)) gi--; // grace: today may not be logged yet
  let streak = 0;
  while (gi >= 0 && dayActive(user, gi)) { streak++; gi--; }
  return streak;
}

// Most recent day the user trained -> "today" / "yesterday" / "N days ago".
function getLastActive(user) {
  const todayIdx = currentDayIndex();
  const logs = (appData[user] && appData[user].logs) || {};
  let latest = -1;
  for (const key in logs) {
    const m = key.match(/^m(\d+)d(\d+)$/);
    if (!m) continue;
    const gi = (parseInt(m[1], 10) - 1) * 30 + (parseInt(m[2], 10) - 1);
    if (gi > latest && dayActive(user, gi)) latest = gi;
  }
  if (latest < 0) return null;
  const days = todayIdx - latest;
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

// Per-user completion across the whole 90-day programme (exercises logged vs
// total active exercises) — matches the Progress screen's stats exactly.
function getUserCompletion(user) {
  const logs = (appData[user] && appData[user].logs) || {};
  let total = 0, done = 0;
  for (let m = 1; m <= 3; m++) {
    CHALLENGE_DATA[`month${m}`].days.forEach(d => {
      ['plank', 'pushups', 'situps'].forEach(ex => {
        if (d[ex] !== null) {
          total++;
          if (logs[`m${m}d${d.day}`] && logs[`m${m}d${d.day}`][ex] !== undefined) done++;
        }
      });
    });
  }
  const frac = total > 0 ? done / total : 0;
  return { done, total, pct: Math.round(frac * 100), dayX: Math.round(frac * 90) };
}

function renderUserSelect() {
  // Rotate the quote on each visit.
  let qi = parseInt(localStorage.getItem('homeQuoteIdx') || '0', 10);
  if (isNaN(qi) || qi < 0) qi = 0;
  const quote = HOME_QUOTES[qi % HOME_QUOTES.length];
  localStorage.setItem('homeQuoteIdx', String((qi + 1) % HOME_QUOTES.length));

  const userCard = (user, name) => {
    const streak = getUserStreak(user);
    const lastActive = getLastActive(user);
    const comp = getUserCompletion(user);
    return `
        <button class="user-card photo-card" onclick="selectUser('${user}')">
          <div class="photo-wrap">
            <img src="./images/${user}.png" alt="${name}" class="user-photo">
            <span class="day-badge-overlay">Day ${comp.dayX} of 90</span>
          </div>
          <div class="user-card-body">
            <span class="user-name">${name.toUpperCase()}</span>
            ${lastActive ? `<span class="user-last-active">Last active: ${lastActive}</span>` : ''}
            <span class="user-streak">🔥 ${streak} day streak</span>
            <div class="user-progress">
              <div class="user-progress-bar">
                <div class="user-progress-fill${comp.pct >= 100 ? ' complete' : ''}" style="width:${comp.pct}%"></div>
              </div>
              <span class="user-progress-pct">${comp.pct}%</span>
            </div>
          </div>
        </button>`;
  };

  setView(`
    <div class="user-select-screen has-bg">
      <div class="logo-block">
        <h1 class="app-title">TRIPLE<br>CHALLENGE</h1>
        <p class="app-sub">30 DAYS · 3 EXERCISES · 2 LEGENDS</p>
      </div>
      <div class="home-quote">“${quote}”</div>
      <div class="user-cards">
        ${userCard('mark', 'Mark')}
        ${userCard('shelley', 'Shelley')}
      </div>
      <div class="home-footer">
        <img src="./images/mark_one_log.png" alt="Mark One Apps" class="mark-one-logo">
        <div class="app-version">&copy; 2026 Mark 1 Apps &middot; ${APP_VERSION}</div>
        <button class="check-updates" onclick="checkForUpdates()">Check for updates</button>
      </div>
    </div>
  `);
}

async function selectUser(user) {
  currentUser = user;
  // Data is already loaded on startup; only fetch if that somehow failed.
  if (!appData) { showLoading(); await loadData(); }
  renderToday();
}

function showLoading() {
  setView(`<div class="loading-screen"><div class="spinner"></div><p>Loading...</p></div>`);
}

// ============================================================
//  TODAY VIEW
// ============================================================

// ---- SECTION BUILDERS (shared by full render and in-place updates) ----

function buildProgressRing(doneCount, totalCount, allDone) {
  // Visual only: segmented ring — electric blue for completed segments, red for
  // incomplete; when all segments are done the whole ring turns gold (+ glow).
  const C = 113.097; // circumference for r=18 (2 * PI * 18)
  const complete = doneCount >= totalCount;
  const BLUE = '#00A3FF', RED = '#FF5C6C', GOLD = '#F5A623';

  let ring;
  if (complete) {
    ring = `<circle cx="22" cy="22" r="18" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>`;
  } else {
    const gap = 9;
    const seg = (C / totalCount) - gap;
    ring = '';
    for (let i = 0; i < totalCount; i++) {
      const color = i < doneCount ? BLUE : RED;
      const offset = -((i * (C / totalCount)) + (gap / 2));
      ring += `<circle cx="22" cy="22" r="18" fill="none" stroke="${color}" stroke-width="4"
              stroke-linecap="round" transform="rotate(-90 22 22)"
              stroke-dasharray="${seg.toFixed(2)} ${(C - seg).toFixed(2)}"
              stroke-dashoffset="${offset.toFixed(2)}"/>`;
    }
  }

  return `
        <div class="day-progress-ring${complete ? ' ring-complete' : ''}" id="today-ring">
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
            ${ring}
          </svg>
          <span class="ring-text" style="color:${complete ? GOLD : '#FFFFFF'}">${doneCount}/${totalCount}</span>
        </div>`;
}

function buildWarmupSection(warmUp, warmupDone) {
  const warmupItems = warmUp.map(item => `
      <div class="routine-item">
        <div class="routine-item-header">
          <span class="routine-item-name">${item.name}</span>
          <span class="routine-item-duration">${item.duration}</span>
        </div>
        <p class="routine-item-desc">${item.desc}</p>
      </div>
    `).join('');

  return `
      <div class="routine-section ${warmupDone ? 'routine-done' : ''}" id="warmup-section">
        <div class="routine-header" onclick="toggleSection(this)">
          <div class="routine-title-row">
            <span class="routine-icon">${getSVGIcon('warmup')}</span>
            <span class="routine-title">WARM UP</span>
            <span class="section-chevron">${getSVGIcon('chevron')}</span>
          </div>
          ${warmupDone
            ? `<div class="routine-tick">${getSVGIcon('tick', 16)}</div>`
            : `<button class="routine-log-btn" id="warmup-log-btn" onclick="event.stopPropagation(); logWarmup()">DONE</button>`
          }
        </div>
        <div class="routine-items" style="display:none">${warmupItems}</div>
      </div>
    `;
}

// Exercises section — locked (no toggle, dimmed, "Warm up first") until the
// warm up is marked done, then it unlocks.
function buildExercisesSection(exerciseCards, warmupDone) {
  const locked = !warmupDone;
  return `
      <div class="routine-section ${locked ? 'routine-locked section-locked' : ''}" id="exercises-section">
        <div class="routine-header" ${locked ? '' : 'onclick="toggleSection(this)"'}>
          <div class="routine-title-row">
            <span class="routine-icon">${getSVGIcon('dumbbell')}</span>
            <span class="routine-title">EXERCISES</span>
            ${locked ? '' : `<span class="section-chevron">${getSVGIcon('chevron')}</span>`}
          </div>
          ${locked ? `<span class="routine-locked-label">${getSVGIcon('lock', 13)} Warm up first</span>` : ''}
        </div>
        <div class="routine-items exercises-list" style="display:none">${exerciseCards}</div>
      </div>`;
}

// Unlock the exercises section in place (keeps the already-rendered cards).
function unlockExercises() {
  const sec = document.getElementById('exercises-section');
  if (!sec) return;
  sec.classList.remove('routine-locked', 'section-locked');
  const header = sec.querySelector('.routine-header');
  if (!header) return;
  header.setAttribute('onclick', 'toggleSection(this)');
  const lockedLabel = header.querySelector('.routine-locked-label');
  if (lockedLabel) lockedLabel.remove();
  const titleRow = header.querySelector('.routine-title-row');
  if (titleRow && !titleRow.querySelector('.section-chevron')) {
    titleRow.insertAdjacentHTML('beforeend', `<span class="section-chevron">${getSVGIcon('chevron')}</span>`);
  }
}

function buildCooldownSection(coolDown, todayLog, canLogCooldown) {
  const cooldownDone = todayLog._cooldown === true;
  const cooldownLog = todayLog._cooldownStretches || {};

  const cooldownItems = coolDown.map((item, idx) => {
    const stretchKey = `stretch_${idx}`;
    const stretchDone = cooldownLog[stretchKey] === true;
    return `
        <div class="routine-item ${stretchDone ? 'routine-item-done' : ''}">
          <div class="routine-item-header">
            <span class="routine-item-name">${item.name}</span>
            <span class="routine-item-duration">${item.duration}</span>
          </div>
          <p class="routine-item-desc">${item.desc}</p>
          <div class="stretch-log-row">
            ${stretchDone
              ? `<span class="stretch-done-tag">${getSVGIcon('tick', 13)} Done</span>`
              : canLogCooldown
                ? `<button class="stretch-log-btn" data-stretch="${idx}" onclick="logStretch(${idx})">DONE</button>`
                : `<span class="stretch-locked"></span>`
            }
          </div>
        </div>`;
  }).join('');

  const stretchCount = coolDown.length;
  const stretchesDone = Object.keys(cooldownLog).length >= stretchCount;
  const cooldownAllDone = cooldownDone || stretchesDone;

  return `
      <div class="routine-section ${cooldownAllDone ? 'routine-done' : ''} ${!canLogCooldown && !cooldownAllDone ? 'routine-locked' : ''}" id="cooldown-section">
        <div class="routine-header" onclick="toggleSection(this)">
          <div class="routine-title-row">
            <span class="routine-icon">${getSVGIcon('cooldown')}</span>
            <span class="routine-title">COOL DOWN</span>
            <span class="section-chevron">${getSVGIcon('chevron')}</span>
          </div>
          ${cooldownAllDone
            ? `<div class="routine-tick">${getSVGIcon('tick', 16)}</div>`
            : canLogCooldown
              ? `<span class="routine-locked-label" id="cd-counter">${Object.keys(cooldownLog).length}/${stretchCount} done</span>`
              : `<span class="routine-locked-label">Complete exercises first</span>`
          }
        </div>
        <div class="routine-items" style="display:none">${cooldownItems}</div>
      </div>
    `;
}

// Recompute the progress ring + completion banner in place (no scroll jump)
function refreshTodayProgress(progress) {
  if (!progress) return;
  const { month, day } = progress;
  const dayData = getDayData(month, day);
  const logKey = `m${month}d${day}`;
  const todayLog = appData[currentUser].logs[logKey] || {};

  const exercises = [
    { key: 'plank',   target: dayData.plank },
    { key: 'pushups', target: dayData.pushups },
    { key: 'situps',  target: dayData.situps },
  ];
  const activeExercises = exercises.filter(e => e.target !== null);
  const restCount = exercises.filter(e => e.target === null).length;
  const doneCount = activeExercises.filter(e => todayLog[e.key] !== undefined).length + restCount;
  const totalCount = 3;
  const exercisesDone = activeExercises.every(e => todayLog[e.key] !== undefined);
  const warmupDone = todayLog._warmup === true;
  const cooldownLog = todayLog._cooldownStretches || {};
  const stretchesDone = Object.keys(cooldownLog).length >= getCoolDown(dayData).length;
  const allDone = warmupDone && exercisesDone && (todayLog._cooldown === true || stretchesDone);

  const ringEl = document.getElementById('today-ring');
  if (ringEl) ringEl.outerHTML = buildProgressRing(doneCount, totalCount, allDone);

  const bannerEl = document.getElementById('today-banner');
  if (bannerEl) bannerEl.innerHTML = allDone ? `<div class="all-done-banner">Day ${day} complete — well done!</div>` : '';
}

function renderToday() {
  const progress = getTodayProgress();
  const userData = appData[currentUser];

  let bodyHtml;

  if (!progress) {
    bodyHtml = `<div class="complete-banner">All 90 days complete. Legend.</div>`;
  } else {
    const { month, day } = progress;
    const dayData = getDayData(month, day);
    const logKey = `m${month}d${day}`;
    const todayLog = userData.logs[logKey] || {};

    const warmUp = getWarmUp(dayData);
    const coolDown = getCoolDown(dayData);

    const exercises = [
      { key: 'plank',   label: 'PLANK',    icon: 'plank',   target: dayData.plank,   unit: '' },
      { key: 'pushups', label: 'PUSH-UPS', icon: 'pushups', target: dayData.pushups, unit: ' reps' },
      { key: 'situps',  label: 'SIT-UPS',  icon: 'situps',  target: dayData.situps,  unit: ' reps' },
    ];

    const activeExercises = exercises.filter(e => e.target !== null);
    const warmupDone = todayLog._warmup === true;
    const cooldownDone = todayLog._cooldown === true;
    const exercisesDone = activeExercises.every(e => todayLog[e.key] !== undefined);
    const canLogCooldown = exercisesDone;

    // ---- WARM UP SECTION ----
    const warmupSection = buildWarmupSection(warmUp, warmupDone);

    // ---- EXERCISE CARDS ----
    const exerciseCards = exercises.map(ex => {
      const isRest = ex.target === null;
      const logged = todayLog[ex.key];
      const done = logged !== undefined;
      const guide = FORM_GUIDES[ex.key];

      if (isRest) {
        return `
          <div class="exercise-card rest">
            <div class="ex-icon">${getSVGIcon('rest')}</div>
            <div class="ex-info">
              <div class="ex-label">${ex.label}</div>
              <div class="ex-target rest-label">REST DAY</div>
            </div>
          </div>`;
      }

      const targetDisplay = ex.target + ex.unit;
      let loggedDetails = '';
      if (done) {
        const effortLabel = EFFORTS.find(e => e.key === logged.effort)?.label || '';
        const setsLabel = logged.sets === 'single' ? 'One sitting' : 'Sets';
        const breakdownTag = logged.breakdown
          ? `<span class="logged-tag breakdown-tag">${logged.breakdown}</span>`
          : '';
        loggedDetails = `
          <div class="ex-logged-row">
            <span class="logged-tag effort-${logged.effort}">${getSVGIcon(logged.effort, 14)} ${effortLabel}</span>
            <span class="logged-tag">${getSVGIcon(logged.sets, 14)} ${setsLabel}</span>
            ${breakdownTag}
          </div>`;
      }

      const formGuideHtml = `
        <div class="form-guide" id="fg-${ex.key}">
          <button class="form-guide-toggle" onclick="toggleFormGuide('${ex.key}')">
            ${getSVGIcon('formguide')} Form Guide <span class="fg-chevron" id="fgc-${ex.key}">${getSVGIcon('chevron')}</span>
          </button>
          <div class="form-guide-body" id="fgb-${ex.key}" style="display:none">
            <div class="fg-cues">
              <div class="fg-section-label">KEY CUES</div>
              ${guide.cues.map(c => `<div class="fg-cue">${c}</div>`).join('')}
            </div>
            <div class="fg-steps">
              <div class="fg-section-label">STEPS</div>
              ${guide.steps.map((s, i) => `<div class="fg-step"><span class="fg-step-num">${i + 1}</span>${s}</div>`).join('')}
            </div>
          </div>
        </div>`;

      return `
        <div class="exercise-card ${done ? 'done' : ''}">
          <div class="ex-main">
            <div class="ex-icon">${getSVGIcon(ex.icon)}</div>
            <div class="ex-info">
              <div class="ex-label">${ex.label}</div>
              <div class="ex-target">TARGET: <strong>${targetDisplay}</strong></div>
              ${loggedDetails}
            </div>
            <div class="ex-action">
              ${done
                ? `<div class="done-tick">${getSVGIcon('tick')}</div>`
                : `<button class="log-btn" data-ex="${ex.key}" onclick="openEffortPicker(${month}, ${day}, '${ex.key}')">LOG</button>`
              }
            </div>
          </div>
          ${formGuideHtml}
        </div>`;
    }).join('');

    // ---- COOL DOWN SECTION ----
    const cooldownLog = todayLog._cooldownStretches || {};
    const stretchesDone = Object.keys(cooldownLog).length >= coolDown.length;
    const cooldownSection = buildCooldownSection(coolDown, todayLog, canLogCooldown);

    // ---- COMPLETION GATE ----
    const allDone = warmupDone && exercisesDone && (cooldownDone || stretchesDone);
    const restCount = exercises.filter(e => e.target === null).length;
    const doneCount = activeExercises.filter(e => todayLog[e.key] !== undefined).length + restCount;
    const totalCount = 3;
    const allDoneBanner = allDone ? `<div class="all-done-banner">Day ${day} complete — well done!</div>` : '';

    bodyHtml = `
      <div class="day-header">
        <div class="day-badge">
          <span class="day-num">DAY ${day}</span>
          <span class="month-label">MONTH ${month}</span>
        </div>
        ${buildProgressRing(doneCount, totalCount, allDone)}
      </div>
      <div id="today-banner">${allDoneBanner}</div>
      ${warmupSection}
      ${buildExercisesSection(exerciseCards, warmupDone)}
      ${cooldownSection}
    `;
  }

  // Scroll to top after DOM updates
  requestAnimationFrame(() => {
    const mc = document.querySelector('.main-content');
    if (mc) mc.scrollTop = 0;
  });

  const partner = currentUser === 'mark' ? 'shelley' : 'mark';
  const partnerLabel = partner === 'mark' ? 'MARK' : 'SHELLEY';
  const partnerSummary = getPartnerSummary(partner);

  setView(`
    <div class="main-screen screen-daily">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderUserSelect()">${getSVGIcon('back', 18)}</button>
          <div class="header-title">
            <span class="header-user">${currentUser.toUpperCase()}</span>
            <span class="header-sub">TRIPLE CHALLENGE</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" onclick="renderProgress()">${getSVGIcon('chart')}</button>
          <button class="icon-btn" onclick="renderSettings()">${getSVGIcon('settings')}</button>
        </div>
      </header>
      <main class="main-content">
        ${bodyHtml}
        <div class="partner-strip">
          <div class="partner-label">${partnerLabel}</div>
          <div class="partner-info">${partnerSummary}</div>
        </div>
        <div class="app-version">${APP_VERSION}</div>
      </main>
    </div>
    ${renderEffortModal()}
    ${renderSetsModal()}
    ${renderSetsBreakdownModal()}
  `);
}

// ---- WARM UP / COOL DOWN LOGGING ----

function logWarmup() {
  const progress = getTodayProgress();
  if (!progress) return;
  const { month, day } = progress;
  const logKey = `m${month}d${day}`;
  if (!appData[currentUser].logs[logKey]) appData[currentUser].logs[logKey] = {};
  appData[currentUser].logs[logKey]._warmup = true;
  saveData(); // fire and forget — don't await so UI updates instantly

  // Update just the warm up section in place — no full re-render, no scroll jump
  const warmupEl = document.getElementById('warmup-section');
  if (warmupEl) warmupEl.outerHTML = buildWarmupSection(getWarmUp(getDayData(month, day)), true);

  // Warm up done -> unlock the Exercises section.
  unlockExercises();

  // Completing the warm up may finish the day — refresh ring + banner
  refreshTodayProgress(progress);
}

async function logCooldown() {
  const progress = getTodayProgress();
  if (!progress) return;
  const { month, day } = progress;
  const logKey = `m${month}d${day}`;
  if (!appData[currentUser].logs[logKey]) appData[currentUser].logs[logKey] = {};
  appData[currentUser].logs[logKey]._cooldown = true;
  await saveData();
  renderToday();
}

async function logStretch(idx) {
  const progress = getTodayProgress();
  if (!progress) return;
  const { month, day } = progress;
  const logKey = `m${month}d${day}`;
  if (!appData[currentUser].logs[logKey]) appData[currentUser].logs[logKey] = {};
  if (!appData[currentUser].logs[logKey]._cooldownStretches) appData[currentUser].logs[logKey]._cooldownStretches = {};
  appData[currentUser].logs[logKey]._cooldownStretches[`stretch_${idx}`] = true;
  const dayData = getDayData(month, day);
  const cd = getCoolDown(dayData);
  const doneKeys = Object.keys(appData[currentUser].logs[logKey]._cooldownStretches);
  const allStretchesDone = doneKeys.length >= cd.length;
  if (allStretchesDone) {
    appData[currentUser].logs[logKey]._cooldown = true;
  }
  saveData(); // fire and forget — don't await so UI updates instantly

  // Update just the button in place — no full re-render, no scroll jump
  const btn = document.querySelector(`[data-stretch="${idx}"]`);
  if (btn) {
    const row = btn.closest('.stretch-log-row');
    if (row) {
      row.innerHTML = `<span class="stretch-done-tag">${getSVGIcon('tick', 13)} Done</span>`;
      btn.closest('.routine-item').classList.add('routine-item-done');
    }
  }

  // Update the counter in cool down header
  const counter = document.getElementById('cd-counter');
  if (counter) {
    const total = cd.length;
    const done = doneKeys.length;
    if (allStretchesDone) {
      counter.outerHTML = `<div class="routine-tick">${getSVGIcon('tick', 16)}</div>`;
    } else {
      counter.textContent = `${done}/${total} done`;
    }
  }
}

// ---- SECTION TOGGLE (warm up / exercises / cool down) ----

// Expand/collapse a daily-screen section. Driven by inline styles so it works
// even if the stylesheet is served stale from cache.
function toggleSection(headerEl) {
  const section = headerEl.closest('.routine-section');
  if (!section) return;
  const items = section.querySelector('.routine-items');
  if (!items) return;
  const collapsed = items.style.display === 'none';
  items.style.display = collapsed ? '' : 'none';
  const chevron = section.querySelector('.section-chevron');
  if (chevron) chevron.style.transform = collapsed ? 'rotate(180deg)' : '';
}

// ---- FORM GUIDE TOGGLE ----

function toggleFormGuide(key) {
  const body = document.getElementById(`fgb-${key}`);
  const chevron = document.getElementById(`fgc-${key}`);
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function getPartnerSummary(partner) {
  const progress = getTodayProgress();
  if (!progress) return 'Challenge complete!';
  const { month, day } = progress;
  const logKey = `m${month}d${day}`;
  const log = appData[partner]?.logs[logKey] || {};
  const keys = Object.keys(log).filter(k => !k.startsWith('_'));
  const warmup = log._warmup ? 'Warmed up' : null;
  const cooldown = log._cooldown ? 'Cooled down' : null;
  const parts = [warmup, keys.length ? `${keys.length} exercise${keys.length > 1 ? 's' : ''} logged` : null, cooldown].filter(Boolean);
  if (parts.length === 0) return 'Nothing logged yet today';
  return parts.join(' · ');
}

// ---- EFFORT / SETS PICKERS ----

function renderEffortModal() {
  const buttons = EFFORTS.map(e => `
    <button class="pick-btn" onclick="selectEffort('${e.key}')">
      <span class="pick-icon">${getSVGIcon(e.key, 32)}</span>
      <span class="pick-label">${e.label}</span>
    </button>
  `).join('');
  return `
    <div class="modal-overlay" id="effortModal" style="display:none">
      <div class="modal-card">
        <h2 class="modal-title">HOW WAS IT?</h2>
        <div class="pick-grid three">${buttons}</div>
        <button class="cancel-btn" onclick="closeAllModals()">CANCEL</button>
      </div>
    </div>`;
}

function renderSetsModal() {
  const buttons = SETS_OPTIONS.map(s => `
    <button class="pick-btn" onclick="selectSets('${s.key}')">
      <span class="pick-icon">${getSVGIcon(s.key, 32)}</span>
      <span class="pick-label">${s.label}</span>
    </button>
  `).join('');
  return `
    <div class="modal-overlay" id="setsModal" style="display:none">
      <div class="modal-card">
        <h2 class="modal-title">HOW DID YOU DO IT?</h2>
        <div class="pick-grid two">${buttons}</div>
        <button class="cancel-btn" onclick="closeAllModals()">CANCEL</button>
      </div>
    </div>`;
}

function renderSetsBreakdownModal() {
  return `
    <div class="modal-overlay" id="setsBreakdownModal" style="display:none">
      <div class="modal-card">
        <h2 class="modal-title">SETS BREAKDOWN</h2>
        <p class="breakdown-hint">Enter how you broke it down, e.g. 3x20</p>
        <div class="breakdown-presets">
          <button class="preset-btn" onclick="setBreakdownPreset('2x')">2 sets</button>
          <button class="preset-btn" onclick="setBreakdownPreset('3x')">3 sets</button>
          <button class="preset-btn" onclick="setBreakdownPreset('4x')">4 sets</button>
          <button class="preset-btn" onclick="setBreakdownPreset('5x')">5 sets</button>
        </div>
        <input type="text" class="breakdown-input" id="setsBreakdownInput"
          placeholder="e.g. 3x20 or 20+20+20"
          inputmode="text" autocomplete="off" autocorrect="off">
        <button class="log-btn breakdown-save-btn" onclick="saveSetsBreakdown()">SAVE</button>
        <button class="cancel-btn" onclick="closeAllModals()">CANCEL</button>
      </div>
    </div>`;
}

function setBreakdownPreset(prefix) {
  const input = document.getElementById('setsBreakdownInput');
  input.value = prefix;
  input.focus();
}

async function saveSetsBreakdown() {
  const breakdown = document.getElementById('setsBreakdownInput').value.trim();
  if (!pendingLog || !pendingEffort) return;
  const { month, day, exercise } = pendingLog;
  const logKey = `m${month}d${day}`;
  if (!appData[currentUser].logs[logKey]) appData[currentUser].logs[logKey] = {};
  appData[currentUser].logs[logKey][exercise] = {
    effort: pendingEffort,
    sets: 'sets',
    breakdown: breakdown || null,
    ts: Date.now()
  };
  closeAllModals();
  saveData(); // fire and forget — don't await so UI updates instantly
  applyExerciseLog(exercise);
}

function openEffortPicker(month, day, exercise) {
  pendingLog = { month, day, exercise };
  pendingEffort = null;
  document.getElementById('effortModal').style.display = 'flex';
}

function selectEffort(effortKey) {
  pendingEffort = effortKey;
  document.getElementById('effortModal').style.display = 'none';
  document.getElementById('setsModal').style.display = 'flex';
}

async function selectSets(setsKey) {
  if (!pendingLog || !pendingEffort) return;
  if (setsKey === 'sets') {
    // Show breakdown input before saving
    document.getElementById('setsModal').style.display = 'none';
    document.getElementById('setsBreakdownModal').style.display = 'flex';
    setTimeout(() => document.getElementById('setsBreakdownInput')?.focus(), 300);
    return;
  }
  // One sitting — save immediately
  const { month, day, exercise } = pendingLog;
  const logKey = `m${month}d${day}`;
  if (!appData[currentUser].logs[logKey]) appData[currentUser].logs[logKey] = {};
  appData[currentUser].logs[logKey][exercise] = { effort: pendingEffort, sets: setsKey, breakdown: null, ts: Date.now() };
  closeAllModals();
  saveData(); // fire and forget — don't await so UI updates instantly
  applyExerciseLog(exercise);
}

// Reflect a freshly logged exercise in place — no full re-render, no scroll jump
function applyExerciseLog(exercise) {
  const progress = getTodayProgress();
  if (!progress) return;
  const { month, day } = progress;
  const dayData = getDayData(month, day);
  const logKey = `m${month}d${day}`;
  const todayLog = appData[currentUser].logs[logKey] || {};
  const logged = todayLog[exercise];

  // Swap the LOG button for the done state on this exercise card
  const btn = document.querySelector(`[data-ex="${exercise}"]`);
  if (btn && logged) {
    const card = btn.closest('.exercise-card');
    const action = btn.closest('.ex-action');
    if (action) action.innerHTML = `<div class="done-tick">${getSVGIcon('tick')}</div>`;
    if (card) {
      card.classList.add('done');
      const info = card.querySelector('.ex-info');
      const target = info ? info.querySelector('.ex-target') : null;
      if (info && target && !info.querySelector('.ex-logged-row')) {
        const effortLabel = EFFORTS.find(e => e.key === logged.effort)?.label || '';
        const setsLabel = logged.sets === 'single' ? 'One sitting' : 'Sets';
        const breakdownTag = logged.breakdown
          ? `<span class="logged-tag breakdown-tag">${logged.breakdown}</span>`
          : '';
        target.insertAdjacentHTML('afterend', `
          <div class="ex-logged-row">
            <span class="logged-tag effort-${logged.effort}">${getSVGIcon(logged.effort, 14)} ${effortLabel}</span>
            <span class="logged-tag">${getSVGIcon(logged.sets, 14)} ${setsLabel}</span>
            ${breakdownTag}
          </div>`);
      }
    }
  }

  // Logging the last exercise unlocks the cool down — refresh that section in place
  const exercises = [
    { key: 'plank',   target: dayData.plank },
    { key: 'pushups', target: dayData.pushups },
    { key: 'situps',  target: dayData.situps },
  ];
  const exercisesDone = exercises.filter(e => e.target !== null).every(e => todayLog[e.key] !== undefined);
  const cdEl = document.getElementById('cooldown-section');
  if (cdEl) cdEl.outerHTML = buildCooldownSection(getCoolDown(dayData), todayLog, exercisesDone);

  // Update the progress ring + completion banner
  refreshTodayProgress(progress);
}

function closeAllModals() {
  document.getElementById('effortModal').style.display = 'none';
  document.getElementById('setsModal').style.display = 'none';
  document.getElementById('setsBreakdownModal').style.display = 'none';
  pendingLog = null;
  pendingEffort = null;
}

// ============================================================
//  PROGRESS VIEW
// ============================================================

function renderProgress() {
  const months = ['month1', 'month2', 'month3'];
  const monthLabels = ['Month 1', 'Month 2', 'Month 3'];

  const tabs = months.map((m, i) => `
    <button class="prog-tab ${i === 0 ? 'active' : ''}" onclick="switchProgTab(${i})" id="ptab${i}">${monthLabels[i]}</button>
  `).join('');

  const start = new Date(CHALLENGE_START); start.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Build one day card + the metadata the week grouping needs.
  function buildProgDay(d, mi) {
    const logKey = `m${mi + 1}d${d.day}`;
    const markLog = appData.mark.logs[logKey] || {};
    const shelleyLog = appData.shelley.logs[logKey] || {};

    const totalDay = mi * 30 + d.day - 1;
    const dayDate = new Date(start.getTime() + totalDay * 86400000);
    const isPast = dayDate < today;
    const isToday = dayDate.getTime() === today.getTime();

    // Past days collapse by default, colour-coded on the viewing user's completion
    const isCollapsible = isPast && !isToday;
    const viewerLog = appData[currentUser].logs[logKey] || {};
    const dayComplete = ['plank', 'pushups', 'situps']
      .filter(k => d[k] !== null)
      .every(k => viewerLog[k] !== undefined);

    const exRow = (ex, target, mLog, sLog) => {
      if (target === null) {
        return `
            <div class="prog-ex-row rest">
              <span class="prog-ex-name">${ex}</span>
              <span class="prog-rest-label">Rest Day</span>
              <span class="prog-rest-label">Rest Day</span>
            </div>`;
      }
      const mDone = mLog !== undefined;
      const sDone = sLog !== undefined;
      const mCell = mDone
        ? `<span class="prog-done-cell">${getSVGIcon('tick', 13)} ${getSVGIcon(mLog.effort, 13)}</span>`
        : `<span class="prog-empty-cell">${isPast || isToday ? '—' : ''}</span>`;
      const sCell = sDone
        ? `<span class="prog-done-cell">${getSVGIcon('tick', 13)} ${getSVGIcon(sLog.effort, 13)}</span>`
        : `<span class="prog-empty-cell">${isPast || isToday ? '—' : ''}</span>`;
      return `
          <div class="prog-ex-row">
            <span class="prog-ex-name">${ex} <span class="prog-target">${target}</span></span>
            ${mCell}
            ${sCell}
          </div>`;
    };

    const cardClass = [
      'prog-day-card',
      isToday ? 'prog-today' : '',
      isCollapsible ? 'prog-collapsible prog-collapsed' : '',
      isCollapsible ? (dayComplete ? 'prog-complete' : 'prog-incomplete') : '',
    ].filter(Boolean).join(' ');

    const html = `
        <div class="${cardClass}">
          <div class="prog-day-header" ${isCollapsible ? 'onclick="toggleProgDay(this)"' : ''}>
            <span class="prog-day-num">${isToday ? '→ ' : ''}Day ${d.day}</span>
            <div class="prog-day-meta">
              <span class="prog-day-date">${dayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              ${isCollapsible ? `<span class="prog-day-chevron">${getSVGIcon('chevron')}</span>` : ''}
            </div>
          </div>
          <div class="prog-ex-rows"${isCollapsible ? ' style="display:none"' : ''}>
            <div class="prog-ex-header">
              <span></span><span class="prog-user-label">MARK</span><span class="prog-user-label">SHELLEY</span>
            </div>
            ${exRow('Plank', d.plank, markLog.plank, shelleyLog.plank)}
            ${exRow('Push-ups', d.pushups !== null ? d.pushups + ' reps' : null, markLog.pushups, shelleyLog.pushups)}
            ${exRow('Sit-ups', d.situps !== null ? d.situps + ' reps' : null, markLog.situps, shelleyLog.situps)}
          </div>
        </div>`;

    return { html, isPast, isToday, dayComplete };
  }

  const tables = months.map((mk, mi) => {
    const days = CHALLENGE_DATA[mk].days;
    const infos = days.map(d => buildProgDay(d, mi));

    // Group days into weeks of 7. A full week that is entirely in the past
    // collapses into a single "Week N" row; the current/future week and any
    // trailing partial week show their day rows individually.
    let rows = '';
    for (let i = 0; i < infos.length; i += 7) {
      const group = infos.slice(i, i + 7);
      const fullWeek = group.length === 7;
      const allPast = group.every(g => g.isPast && !g.isToday);
      if (fullWeek && allPast) {
        const weekNum = (mi * 4) + (i / 7) + 1;
        const complete = group.every(g => g.dayComplete);
        const daysHtml = group.map(g => g.html).join('');
        rows += `
        <div class="prog-week-card prog-week-collapsed ${complete ? 'prog-complete' : 'prog-incomplete'}">
          <div class="prog-week-header" onclick="toggleProgWeek(this)">
            <span class="prog-week-label">Week ${weekNum}</span>
            <div class="prog-day-meta">
              <span class="prog-week-status">${complete ? 'All 7 complete' : 'Day(s) missed'}</span>
              <span class="prog-week-chevron">${getSVGIcon('chevron')}</span>
            </div>
          </div>
          <div class="prog-week-days" style="display:none">${daysHtml}</div>
        </div>`;
      } else {
        rows += group.map(g => g.html).join('');
      }
    }

    return `
      <div class="prog-table-wrap" id="ptable${mi}" style="${mi === 0 ? '' : 'display:none'}">
        <div class="prog-label">${CHALLENGE_DATA[mk].label}</div>
        ${rows}
      </div>`;
  }).join('');

  setView(`
    <div class="main-screen screen-progress">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderToday()">${getSVGIcon('back', 18)}</button>
          <div class="header-title">
            <span class="header-user">PROGRESS</span>
            <span class="header-sub">${currentUser.toUpperCase()}</span>
          </div>
        </div>
      </header>
      <main class="main-content">
        <div class="prog-tabs">${tabs}</div>
        ${tables}
        ${renderOverallStats()}
      </main>
    </div>
  `);
}

function renderOverallStats() {
  const users = ['mark', 'shelley'];
  const stats = users.map(u => {
    const { done, total, pct } = getUserCompletion(u);
    return `
      <div class="stat-card">
        <div class="stat-name">${u.toUpperCase()}</div>
        <div class="stat-num">${done}<span class="stat-of">/${total}</span></div>
        <div class="stat-label">exercises done</div>
        <div class="stat-bar"><div class="stat-fill" style="width:${pct}%"></div></div>
        <div class="stat-pct">${pct}%</div>
      </div>`;
  }).join('');
  return `<div class="stats-row">${stats}</div>`;
}

function switchProgTab(idx) {
  [0, 1, 2].forEach(i => {
    document.getElementById(`ptab${i}`).classList.toggle('active', i === idx);
    document.getElementById(`ptable${i}`).style.display = i === idx ? '' : 'none';
  });
}

// Expand / collapse a past day row on the progress screen
function toggleProgDay(headerEl) {
  const card = headerEl.closest('.prog-day-card');
  if (!card) return;
  const collapsed = card.classList.toggle('prog-collapsed');
  // Drive the show/hide from an inline style so it does not depend on the
  // stylesheet (which can be served stale from cache).
  const rows = card.querySelector('.prog-ex-rows');
  if (rows) rows.style.display = collapsed ? 'none' : '';
}

// Expand / collapse a past-week row on the progress screen.
function toggleProgWeek(headerEl) {
  const card = headerEl.closest('.prog-week-card');
  if (!card) return;
  const collapsed = card.classList.toggle('prog-week-collapsed');
  const days = card.querySelector('.prog-week-days');
  if (days) days.style.display = collapsed ? 'none' : '';
}

// ============================================================
//  SETTINGS VIEW
// ============================================================

function renderSettings() {
  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderToday()">${getSVGIcon('back', 18)}</button>
          <div class="header-title">
            <span class="header-user">SETTINGS</span>
            <span class="header-sub">TRIPLE CHALLENGE</span>
          </div>
        </div>
      </header>
      <main class="main-content settings-content">
        <div class="settings-section">
          <div class="settings-label">NOTIFICATIONS</div>
          <div class="settings-card">
            <div class="setting-row">
              <span>Daily reminder (07:00)</span>
              <label class="toggle">
                <input type="checkbox" id="notifToggle" ${notifEnabled ? 'checked' : ''} onchange="toggleNotif()">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-hint" id="notifHint">${notifEnabled ? 'On — daily reminder at 07:00' : 'Enable to get a daily 07:00 reminder'}</div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-label">INSTALL APP</div>
          <div class="settings-card">
            <p class="install-text">Add this app to your phone home screen for the best experience and notification support.</p>
            <div class="install-steps">
              <div class="install-platform"><strong>iPhone</strong> — Open in Safari &rarr; Share &rarr; Add to Home Screen</div>
              <div class="install-platform"><strong>Android</strong> — Open in Chrome &rarr; Menu &rarr; Add to Home Screen</div>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-label">PAST DAYS</div>
          <div class="settings-card">
            <p class="install-text">Log exercises for days that were completed before the app was set up.</p>
            <button class="routine-log-btn" style="width:100%;margin:0 0 4px" onclick="renderBackfill()">BACKFILL PAST DAYS</button>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-label">CHALLENGE INFO</div>
          <div class="settings-card">
            <div class="info-row"><span>Started</span><span>24 May 2026</span></div>
            <div class="info-row"><span>Ends</span><span>21 Aug 2026</span></div>
            <div class="info-row"><span>Current user</span><span>${currentUser.toUpperCase()}</span></div>
          </div>
        </div>
        <button class="switch-btn" onclick="renderUserSelect()">SWITCH USER</button>
      </main>
    </div>
  `);

  // Reflect the real OneSignal subscription state in the toggle.
  syncNotifToggle();
}

// ============================================================
//  BACKFILL SCREEN
// ============================================================

function renderBackfill(scrollMonth, scrollDay) {
  // Only show past days (days 1-7 for now, i.e. before today)
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(CHALLENGE_START); start.setHours(0,0,0,0);
  const diffToday = Math.floor((today - start) / 86400000);

  let dayOptions = '';
  for (let i = 0; i < Math.min(diffToday, 90); i++) {
    const month = Math.floor(i / 30) + 1;
    const day = (i % 30) + 1;
    const date = new Date(start.getTime() + i * 86400000);
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const logKey = `m${month}d${day}`;
    const mDone = Object.keys(appData.mark.logs[logKey] || {}).filter(k => !k.startsWith('_')).length;
    const sDone = Object.keys(appData.shelley.logs[logKey] || {}).filter(k => !k.startsWith('_')).length;
    dayOptions += `
      <button class="backfill-day-btn" data-bf="${month}-${day}" onclick="renderBackfillDay(${month}, ${day})">
        <span class="backfill-day-label">Month ${month} — Day ${day}</span>
        <span class="backfill-day-date">${dateStr}</span>
        <span class="backfill-day-status">
          M: ${mDone}/3 &nbsp; S: ${sDone}/3
        </span>
      </button>`;
  }

  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderSettings()">${getSVGIcon('back', 18)}</button>
          <div class="header-title">
            <span class="header-user">BACKFILL</span>
            <span class="header-sub">SELECT A DAY</span>
          </div>
        </div>
      </header>
      <main class="main-content">
        <div class="backfill-list">${dayOptions}</div>
      </main>
    </div>
  `);

  // Returning from a day's backfill: scroll back to that day in the list.
  if (scrollMonth) {
    requestAnimationFrame(() => {
      const btn = document.querySelector(`.backfill-day-btn[data-bf="${scrollMonth}-${scrollDay}"]`);
      if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'center' });
    });
  }
}

function renderBackfillDay(month, day) {
  const dayData = getDayData(month, day);
  const exercises = [
    { key: 'plank',   label: 'Plank',    target: dayData.plank,   unit: '' },
    { key: 'pushups', label: 'Push-ups', target: dayData.pushups, unit: ' reps' },
    { key: 'situps',  label: 'Sit-ups',  target: dayData.situps,  unit: ' reps' },
  ];

  const userSections = ['mark', 'shelley'].map(u => {
    const logKey = `m${month}d${day}`;
    const log = appData[u].logs[logKey] || {};

    const exRows = exercises.map(ex => {
      if (ex.target === null) {
        return `<div class="backfill-ex-row rest"><span>${ex.label}</span><span class="prog-rest-label">Rest Day</span></div>`;
      }
      const logged = log[ex.key];
      const done = logged !== undefined;
      return `
        <div class="backfill-ex-row ${done ? 'done' : ''}">
          <span class="backfill-ex-label">${ex.label} <span class="prog-target">${ex.target}${ex.unit}</span></span>
          ${done
            ? `<span class="backfill-done-tag">${getSVGIcon('tick', 13)} ${EFFORTS.find(e=>e.key===logged.effort)?.label || ''}</span>`
            : `<button class="log-btn backfill-log-btn" onclick="backfillLog('${u}', ${month}, ${day}, '${ex.key}')">LOG</button>`
          }
        </div>`;
    }).join('');

    const warmupDone = log._warmup === true;
    const cooldownDone = log._cooldown === true;

    return `
      <div class="backfill-user-section">
        <div class="backfill-user-header">
          <span class="backfill-user-name">${u.toUpperCase()}</span>
          <span class="backfill-mini-status">
            ${warmupDone ? getSVGIcon('warmup', 12) : '<span style="opacity:0.2">'+getSVGIcon('warmup', 12)+'</span>'}
            ${cooldownDone ? getSVGIcon('cooldown', 12) : '<span style="opacity:0.2">'+getSVGIcon('cooldown', 12)+'</span>'}
          </span>
        </div>
        ${exRows}
        <div class="backfill-extras">
          ${!warmupDone ? `<button class="backfill-extra-btn" onclick="backfillMeta('${u}', ${month}, ${day}, '_warmup')">Mark warm up done</button>` : `<span class="backfill-extra-done">${getSVGIcon('tick',12)} Warm up logged</span>`}
          ${!cooldownDone ? `<button class="backfill-extra-btn" onclick="backfillMeta('${u}', ${month}, ${day}, '_cooldown')">Mark cool down done</button>` : `<span class="backfill-extra-done">${getSVGIcon('tick',12)} Cool down logged</span>`}
        </div>
      </div>`;
  }).join('');

  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderBackfill(${month}, ${day})">${getSVGIcon('back', 18)}</button>
          <div class="header-title">
            <span class="header-user">DAY ${day}</span>
            <span class="header-sub">MONTH ${month} — BACKFILL</span>
          </div>
        </div>
      </header>
      <main class="main-content">
        ${userSections}
      </main>
    </div>
    ${renderBackfillEffortModal(month, day)}
  `);
}

let backfillPending = null;

function renderBackfillEffortModal(month, day) {
  const buttons = EFFORTS.map(e => `
    <button class="pick-btn" onclick="confirmBackfillLog('${e.key}')">
      <span class="pick-icon">${getSVGIcon(e.key, 32)}</span>
      <span class="pick-label">${e.label}</span>
    </button>
  `).join('');
  return `
    <div class="modal-overlay" id="backfillEffortModal" style="display:none">
      <div class="modal-card">
        <h2 class="modal-title">HOW WAS IT?</h2>
        <div class="pick-grid three">${buttons}</div>
        <button class="cancel-btn" onclick="document.getElementById('backfillEffortModal').style.display='none'">CANCEL</button>
      </div>
    </div>`;
}

function backfillLog(user, month, day, exercise) {
  backfillPending = { user, month, day, exercise };
  document.getElementById('backfillEffortModal').style.display = 'flex';
}

async function confirmBackfillLog(effortKey) {
  if (!backfillPending) return;
  const { user, month, day, exercise } = backfillPending;
  const logKey = `m${month}d${day}`;
  if (!appData[user].logs[logKey]) appData[user].logs[logKey] = {};
  appData[user].logs[logKey][exercise] = { effort: effortKey, sets: 'single', breakdown: null, ts: Date.now() };
  backfillPending = null;
  document.getElementById('backfillEffortModal').style.display = 'none';
  await saveData();
  renderBackfillDay(month, day);
}

async function backfillMeta(user, month, day, key) {
  const logKey = `m${month}d${day}`;
  if (!appData[user].logs[logKey]) appData[user].logs[logKey] = {};
  appData[user].logs[logKey][key] = true;
  await saveData();
  renderBackfillDay(month, day);
}

// ---- NOTIFICATIONS (OneSignal web push) ----
// Scheduling/sending of the daily 07:00 reminder is configured in the
// OneSignal dashboard (a recurring message). The app only opts the user in
// or out of push.

function withOneSignal(cb) {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(cb);
}

// True once the OneSignal SDK has loaded and replaced the deferred stub.
function oneSignalReady() {
  return !!(window.OneSignal && window.OneSignal.Notifications && window.OneSignal.User);
}

// Is the app running as an installed PWA (iOS web push only works here)?
function isInstalledPWA() {
  return window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
}

async function toggleNotif() {
  const toggle = document.getElementById('notifToggle');
  const hint = document.getElementById('notifHint');
  if (!toggle) return;

  // Call OneSignal directly (NOT via the deferred queue) so the permission
  // prompt stays inside the tap's user gesture — required on iOS, otherwise
  // the request is silently ignored and the toggle appears to do nothing.
  if (!oneSignalReady()) {
    toggle.checked = false;
    const status = window.__osInit || 'loading';
    // While still loading/retrying, ask the user to wait; once it's a real
    // failure, show the actionable message captured during SDK load/init.
    const stillLoading = status === 'pending' || status === 'loading' || status.indexOf('retry') !== -1;
    if (hint) hint.textContent = stillLoading
      ? 'Notifications are still loading — try again in a moment.'
      : status;
    return;
  }
  const OneSignal = window.OneSignal;

  // iOS only supports web push inside an installed PWA — never in Safari tabs.
  let pushSupported = true;
  try { pushSupported = OneSignal.Notifications.isPushSupported(); } catch (e) {}
  if (!pushSupported) {
    toggle.checked = false;
    if (hint) hint.textContent = isInstalledPWA()
      ? "Push isn't supported on this device/OS version."
      : "Push only works in the installed app. On iPhone: Share → Add to Home Screen, then open it from there.";
    return;
  }

  if (toggle.checked) {
    try {
      await OneSignal.Notifications.requestPermission();
      if (OneSignal.Notifications.permission) {
        await OneSignal.User.PushSubscription.optIn();
        notifEnabled = true;
        localStorage.setItem('notifEnabled', 'true');
        if (hint) hint.textContent = 'On — daily reminder at 07:00';
      } else {
        toggle.checked = false;
        notifEnabled = false;
        localStorage.setItem('notifEnabled', 'false');
        if (hint) hint.textContent = 'Permission denied — enable notifications in your device settings.';
      }
    } catch (e) {
      toggle.checked = false;
      if (hint) hint.textContent = 'Error: ' + ((e && e.message) || 'unknown error');
    }
  } else {
    notifEnabled = false;
    localStorage.setItem('notifEnabled', 'false');
    if (hint) hint.textContent = 'Off';
    try { await OneSignal.User.PushSubscription.optOut(); } catch (e) {}
  }
}

// Write the current OneSignal subscription state into the settings toggle.
function applyNotifState() {
  const toggle = document.getElementById('notifToggle');
  const os = window.OneSignal;
  if (!toggle || !os || !os.User || !os.User.PushSubscription) return;
  const optedIn = !!os.User.PushSubscription.optedIn;
  toggle.checked = optedIn;
  notifEnabled = optedIn;
  localStorage.setItem('notifEnabled', optedIn ? 'true' : 'false');
  const hint = document.getElementById('notifHint');
  if (hint) hint.textContent = optedIn ? 'On — daily reminder at 07:00' : 'Enable to get a daily 07:00 reminder';
}

// Keep the toggle in sync with the real subscription state. OneSignal v16
// hydrates PushSubscription.optedIn / permission slightly AFTER init (and it
// can change later), so a single read can be stale — read reactively via the
// SDK's change events, with delayed re-reads as a backstop for the initial
// hydration race.
function syncNotifToggle() {
  const toggle = document.getElementById('notifToggle');
  if (!toggle) return;
  withOneSignal((OneSignal) => {
    applyNotifState();
    if (!window.__osSyncBound) {
      window.__osSyncBound = true;
      try { OneSignal.User.PushSubscription.addEventListener('change', applyNotifState); } catch (e) {}
      try { OneSignal.Notifications.addEventListener('permissionChange', applyNotifState); } catch (e) {}
    }
    setTimeout(applyNotifState, 1500);
    setTimeout(applyNotifState, 4000);
  });
}
