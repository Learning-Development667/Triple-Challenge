// ============================================================
//  Triple Challenge — scripts.js
//  Credentials are in config.js — do not add them here.
// ============================================================

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
let notifTime = localStorage.getItem('notifTime') || '07:00';
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
    formguide: `<svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2"/><line x1="16" y1="14" x2="16" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/></svg>`,
    chevron: `<svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="8,12 16,20 24,12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  return icons[name] || '';
}

// ============================================================
//  INIT
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  registerSW();
  renderUserSelect();
});

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// ============================================================
//  DATA — JSONBin
// ============================================================

async function loadData() {
  try {
    const res = await fetch(BIN_URL + '/latest', {
      headers: { 'X-Master-Key': API_KEY }
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
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
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

function renderUserSelect() {
  setView(`
    <div class="user-select-screen">
      <div class="logo-block">
        <h1 class="app-title">TRIPLE<br>CHALLENGE</h1>
        <p class="app-sub">30 DAYS · 3 EXERCISES · 2 LEGENDS</p>
      </div>
      <div class="user-cards">
        <button class="user-card photo-card" onclick="selectUser('mark')">
          <div class="photo-wrap">
            <img src="./images/mark.png" alt="Mark" class="user-photo">
          </div>
          <span class="user-name">MARK</span>
        </button>
        <button class="user-card photo-card" onclick="selectUser('shelley')">
          <div class="photo-wrap">
            <img src="./images/shelley.png" alt="Shelley" class="user-photo">
          </div>
          <span class="user-name">SHELLEY</span>
        </button>
      </div>
    </div>
  `);
}

async function selectUser(user) {
  currentUser = user;
  showLoading();
  await loadData();
  renderToday();
}

function showLoading() {
  setView(`<div class="loading-screen"><div class="spinner"></div><p>Loading...</p></div>`);
}

// ============================================================
//  TODAY VIEW
// ============================================================

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
    const allDone = warmupDone && exercisesDone && cooldownDone;

    // ---- WARM UP SECTION ----
    const warmupItems = warmUp.map(item => `
      <div class="routine-item">
        <div class="routine-item-header">
          <span class="routine-item-name">${item.name}</span>
          <span class="routine-item-duration">${item.duration}</span>
        </div>
        <p class="routine-item-desc">${item.desc}</p>
      </div>
    `).join('');

    const warmupSection = `
      <div class="routine-section ${warmupDone ? 'routine-done' : ''}">
        <div class="routine-header" onclick="toggleRoutine('warmup')">
          <div class="routine-title-row">
            <span class="routine-icon">${getSVGIcon('warmup')}</span>
            <span class="routine-title">WARM UP</span>
            <span class="routine-chevron" id="rc-warmup">${getSVGIcon('chevron', 14)}</span>
          </div>
          ${warmupDone
            ? `<div class="routine-tick">${getSVGIcon('tick', 16)}</div>`
            : `<button class="routine-log-btn" onclick="event.stopPropagation();logWarmup()">DONE</button>`
          }
        </div>
        <div class="routine-items" id="ri-warmup" style="display:none">${warmupItems}</div>
      </div>
    `;

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
                : `<button class="log-btn" onclick="openEffortPicker(${month}, ${day}, '${ex.key}')">LOG</button>`
              }
            </div>
          </div>
          ${formGuideHtml}
        </div>`;
    }).join('');

    // ---- COOL DOWN SECTION ----
    const cooldownItems = coolDown.map(item => `
      <div class="routine-item">
        <div class="routine-item-header">
          <span class="routine-item-name">${item.name}</span>
          <span class="routine-item-duration">${item.duration}</span>
        </div>
        <p class="routine-item-desc">${item.desc}</p>
      </div>
    `).join('');

    // Determine if cool down can be logged
    const canLogCooldown = warmupDone && exercisesDone;

    const cooldownSection = `
      <div class="routine-section ${cooldownDone ? 'routine-done' : ''} ${!canLogCooldown && !cooldownDone ? 'routine-locked' : ''}">
        <div class="routine-header" onclick="toggleRoutine('cooldown')">
          <div class="routine-title-row">
            <span class="routine-icon">${getSVGIcon('cooldown')}</span>
            <span class="routine-title">COOL DOWN</span>
            <span class="routine-chevron" id="rc-cooldown">${getSVGIcon('chevron', 14)}</span>
          </div>
          ${cooldownDone
            ? `<div class="routine-tick">${getSVGIcon('tick', 16)}</div>`
            : canLogCooldown
              ? `<button class="routine-log-btn" onclick="event.stopPropagation();logCooldown()">DONE</button>`
              : `<span class="routine-locked-label">Complete exercises first</span>`
          }
        </div>
        <div class="routine-items" id="ri-cooldown" style="display:none">${cooldownItems}</div>
      </div>
    `;

    // ---- COMPLETION GATE ----
    const doneCount = activeExercises.filter(e => todayLog[e.key] !== undefined).length;
    const allDoneBanner = allDone ? `<div class="all-done-banner">Day ${day} complete — well done!</div>` : '';

    bodyHtml = `
      <div class="day-header">
        <div class="day-badge">
          <span class="day-num">DAY ${day}</span>
          <span class="month-label">MONTH ${month}</span>
        </div>
        <div class="day-progress-ring">
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#2a2a2a" stroke-width="4"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke="${allDone ? '#27ae60' : '#c0392b'}" stroke-width="4"
              stroke-dasharray="${Math.round((doneCount / Math.max(activeExercises.length,1)) * 113)} 113"
              stroke-linecap="round" transform="rotate(-90 22 22)"/>
          </svg>
          <span class="ring-text">${doneCount}/${activeExercises.length}</span>
        </div>
      </div>
      ${allDoneBanner}
      ${warmupSection}
      <div class="exercises-list">${exerciseCards}</div>
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
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderUserSelect()">&#9664;</button>
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
      </main>
    </div>
    ${renderEffortModal()}
    ${renderSetsModal()}
    ${renderSetsBreakdownModal()}
  `);
}

// ---- WARM UP / COOL DOWN LOGGING ----

async function logWarmup() {
  const progress = getTodayProgress();
  if (!progress) return;
  const { month, day } = progress;
  const logKey = `m${month}d${day}`;
  if (!appData[currentUser].logs[logKey]) appData[currentUser].logs[logKey] = {};
  appData[currentUser].logs[logKey]._warmup = true;
  await saveData();
  renderToday();
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

// ---- ROUTINE TOGGLE ----

function toggleRoutine(key) {
  const items = document.getElementById(`ri-${key}`);
  const chevron = document.getElementById(`rc-${key}`);
  if (!items) return;
  const isOpen = items.style.display !== 'none';
  items.style.display = isOpen ? 'none' : 'block';
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
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
  await saveData();
  renderToday();
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
  await saveData();
  renderToday();
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

  const tables = months.map((mk, mi) => {
    const days = CHALLENGE_DATA[mk].days;
    const rows = days.map(d => {
      const logKey = `m${mi + 1}d${d.day}`;
      const markLog = appData.mark.logs[logKey] || {};
      const shelleyLog = appData.shelley.logs[logKey] || {};

      const totalDay = mi * 30 + d.day - 1;
      const start = new Date(CHALLENGE_START);
      start.setHours(0,0,0,0);
      const today = new Date(); today.setHours(0,0,0,0);
      const dayDate = new Date(start.getTime() + totalDay * 86400000);
      const isPast = dayDate < today;
      const isToday = dayDate.getTime() === today.getTime();

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

      return `
        <div class="prog-day-card ${isToday ? 'prog-today' : ''} ${isPast && !isToday ? 'prog-past' : ''}">
          <div class="prog-day-header">
            <span class="prog-day-num">${isToday ? '→ ' : ''}Day ${d.day}</span>
            <span class="prog-day-date">${dayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div class="prog-ex-rows">
            <div class="prog-ex-header">
              <span></span><span class="prog-user-label">MARK</span><span class="prog-user-label">SHELLEY</span>
            </div>
            ${exRow('Plank', d.plank, markLog.plank, shelleyLog.plank)}
            ${exRow('Push-ups', d.pushups !== null ? d.pushups + ' reps' : null, markLog.pushups, shelleyLog.pushups)}
            ${exRow('Sit-ups', d.situps !== null ? d.situps + ' reps' : null, markLog.situps, shelleyLog.situps)}
          </div>
        </div>`;
    }).join('');

    return `
      <div class="prog-table-wrap" id="ptable${mi}" style="${mi === 0 ? '' : 'display:none'}">
        <div class="prog-label">${CHALLENGE_DATA[mk].label}</div>
        ${rows}
      </div>`;
  }).join('');

  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderToday()">&#9664;</button>
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
    const logs = appData[u].logs;
    let total = 0, done = 0;
    for (let m = 1; m <= 3; m++) {
      const days = CHALLENGE_DATA[`month${m}`].days;
      days.forEach(d => {
        ['plank', 'pushups', 'situps'].forEach(ex => {
          if (d[ex] !== null) {
            total++;
            if (logs[`m${m}d${d.day}`]?.[ex] !== undefined) done++;
          }
        });
      });
    }
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
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

// ============================================================
//  SETTINGS VIEW
// ============================================================

function renderSettings() {
  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderToday()">&#9664;</button>
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
              <span>Daily reminder</span>
              <label class="toggle">
                <input type="checkbox" id="notifToggle" ${notifEnabled ? 'checked' : ''} onchange="toggleNotif()">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-row">
              <span>Reminder time</span>
              <input type="time" class="time-input" id="notifTimeInput" value="${notifTime}" onchange="updateNotifTime()">
            </div>
            <div class="setting-hint" id="notifHint">${notifEnabled ? 'Notifications on' : 'Enable to get daily reminders'}</div>
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
}

// ============================================================
//  BACKFILL SCREEN
// ============================================================

function renderBackfill() {
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
      <button class="backfill-day-btn" onclick="renderBackfillDay(${month}, ${day})">
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
          <button class="back-btn" onclick="renderSettings()">&#9664;</button>
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
          <button class="back-btn" onclick="renderBackfill()">&#9664;</button>
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

async function toggleNotif() {
  const checked = document.getElementById('notifToggle').checked;
  if (checked) {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      document.getElementById('notifToggle').checked = false;
      document.getElementById('notifHint').textContent = 'Permission denied — check browser settings';
      return;
    }
    notifEnabled = true;
    localStorage.setItem('notifEnabled', 'true');
    scheduleNotification();
    document.getElementById('notifHint').textContent = 'Notifications on';
  } else {
    notifEnabled = false;
    localStorage.setItem('notifEnabled', 'false');
    document.getElementById('notifHint').textContent = 'Notifications off';
  }
}

function updateNotifTime() {
  notifTime = document.getElementById('notifTimeInput').value;
  localStorage.setItem('notifTime', notifTime);
  if (notifEnabled) scheduleNotification();
}

function scheduleNotification() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const [h, m] = notifTime.split(':').map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  setTimeout(() => {
    const progress = getTodayProgress();
    if (progress) {
      new Notification('Triple Challenge', {
        body: `Day ${progress.day} — time to train, ${currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}!`,
        icon: './icons/icon-192.png'
      });
    }
    if (notifEnabled) setTimeout(scheduleNotification, 60000);
  }, next - now);
}

if (notifEnabled && 'Notification' in window && Notification.permission === 'granted') {
  setTimeout(scheduleNotification, 2000);
}
