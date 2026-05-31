// ============================================================
//  Triple Challenge — scripts.js
// ============================================================

const BIN_ID  = '6a1c638621f9ee59d2a1ac2c';
const API_KEY = '$2a$10$3ndQ23/GtXtiDjSQ8iUDOOQ7Qi/0m2u8KKkGmhfz5tJv1hSfb/U2W';
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const MOODS = [
  { emoji: '💀', label: 'Dying' },
  { emoji: '😓', label: 'Hard' },
  { emoji: '😐', label: 'OK' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '🔥', label: 'Crushed it' }
];

let currentUser = null;
let appData = null;
let notifTime = localStorage.getItem('notifTime') || '07:00';
let notifEnabled = localStorage.getItem('notifEnabled') === 'true';
let pendingLog = null; // { month, day, exercise } waiting for mood

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
    // Offline or first run — use localStorage as fallback
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
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(appData)
    });
  } catch (e) {
    // Saved locally, will sync next time online
  }
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
        <div class="logo-icon">⚡</div>
        <h1 class="app-title">TRIPLE<br>CHALLENGE</h1>
        <p class="app-sub">30 DAYS · 3 EXERCISES · 2 LEGENDS</p>
      </div>
      <div class="user-cards">
        <button class="user-card" onclick="selectUser('mark')">
          <span class="user-avatar">🏋️</span>
          <span class="user-name">MARK</span>
        </button>
        <button class="user-card" onclick="selectUser('shelley')">
          <span class="user-avatar">💪</span>
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

// ---- TODAY VIEW ----

function renderToday() {
  const progress = getTodayProgress();
  const userData = appData[currentUser];

  let bodyHtml;

  if (!progress) {
    bodyHtml = `<div class="complete-banner">🏆 All 90 days complete! Legend.</div>`;
  } else {
    const { month, day } = progress;
    const dayData = getDayData(month, day);
    const logKey = `m${month}d${day}`;
    const todayLog = userData.logs[logKey] || {};

    const exercises = [
      { key: 'plank',   label: 'PLANK',     icon: '⏱', target: dayData.plank,   unit: '' },
      { key: 'pushups', label: 'PUSH-UPS',  icon: '👊', target: dayData.pushups, unit: ' reps' },
      { key: 'situps',  label: 'SIT-UPS',   icon: '🔄', target: dayData.situps,  unit: ' reps' },
    ];

    const exerciseCards = exercises.map(ex => {
      const isRest = ex.target === null;
      const logged = todayLog[ex.key];
      const done = logged !== undefined;

      if (isRest) {
        return `
          <div class="exercise-card rest">
            <div class="ex-icon">${ex.icon}</div>
            <div class="ex-info">
              <div class="ex-label">${ex.label}</div>
              <div class="ex-target rest-label">REST DAY</div>
            </div>
            <div class="ex-status rest-badge">💤</div>
          </div>`;
      }

      const targetDisplay = ex.target + ex.unit;

      return `
        <div class="exercise-card ${done ? 'done' : ''}">
          <div class="ex-icon">${ex.icon}</div>
          <div class="ex-info">
            <div class="ex-label">${ex.label}</div>
            <div class="ex-target">TARGET: <strong>${targetDisplay}</strong></div>
            ${done ? `<div class="ex-mood">Mood: ${MOODS[logged.mood].emoji} ${MOODS[logged.mood].label}</div>` : ''}
          </div>
          <div class="ex-action">
            ${done
              ? `<div class="done-tick">✓</div>`
              : `<button class="log-btn" onclick="openMoodPicker(${month}, ${day}, '${ex.key}')">LOG</button>`
            }
          </div>
        </div>`;
    }).join('');

    // Count how many active exercises are done today
    const activeExercises = exercises.filter(e => e.target !== null);
    const doneCount = activeExercises.filter(e => todayLog[e.key] !== undefined).length;
    const allDone = doneCount === activeExercises.length;

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
      ${allDone ? '<div class="all-done-banner">🎉 All done for today!</div>' : ''}
      <div class="exercises-list">${exerciseCards}</div>
    `;
  }

  // Partner summary
  const partner = currentUser === 'mark' ? 'shelley' : 'mark';
  const partnerLabel = partner === 'mark' ? 'MARK' : 'SHELLEY';
  const partnerSummary = getPartnerSummary(partner);

  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderUserSelect()">◀</button>
          <div class="header-title">
            <span class="header-user">${currentUser.toUpperCase()}</span>
            <span class="header-sub">TRIPLE CHALLENGE</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" onclick="renderProgress()" title="Progress">📊</button>
          <button class="icon-btn" onclick="renderSettings()" title="Settings">⚙️</button>
        </div>
      </header>

      <main class="main-content">
        ${bodyHtml}

        <div class="partner-strip">
          <div class="partner-label">⚡ ${partnerLabel}</div>
          <div class="partner-info">${partnerSummary}</div>
        </div>
      </main>
    </div>

    ${renderMoodPickerModal()}
  `);
}

function getPartnerSummary(partner) {
  const progress = getTodayProgress();
  if (!progress) return 'Challenge complete!';
  const { month, day } = progress;
  const logKey = `m${month}d${day}`;
  const log = appData[partner]?.logs[logKey] || {};
  const keys = Object.keys(log);
  if (keys.length === 0) return 'Not logged yet today';
  const moods = keys.map(k => MOODS[log[k].mood].emoji).join(' ');
  return `Logged ${keys.length} exercise${keys.length > 1 ? 's' : ''} today ${moods}`;
}

// ---- MOOD PICKER ----

function renderMoodPickerModal() {
  return `
    <div class="modal-overlay" id="moodModal" style="display:none">
      <div class="modal-card">
        <h2 class="modal-title">HOW WAS IT?</h2>
        <div class="mood-grid" id="moodGrid">
          ${MOODS.map((m, i) => `
            <button class="mood-btn" onclick="selectMood(${i})">
              <span class="mood-emoji">${m.emoji}</span>
              <span class="mood-label">${m.label}</span>
            </button>
          `).join('')}
        </div>
        <button class="cancel-btn" onclick="closeMoodPicker()">CANCEL</button>
      </div>
    </div>
  `;
}

function openMoodPicker(month, day, exercise) {
  pendingLog = { month, day, exercise };
  document.getElementById('moodModal').style.display = 'flex';
}

function closeMoodPicker() {
  pendingLog = null;
  document.getElementById('moodModal').style.display = 'none';
}

async function selectMood(moodIndex) {
  if (!pendingLog) return;
  const { month, day, exercise } = pendingLog;
  const logKey = `m${month}d${day}`;
  if (!appData[currentUser].logs[logKey]) appData[currentUser].logs[logKey] = {};
  appData[currentUser].logs[logKey][exercise] = { mood: moodIndex, ts: Date.now() };
  closeMoodPicker();
  await saveData();
  renderToday();
}

// ---- PROGRESS VIEW ----

function renderProgress() {
  const months = ['month1', 'month2', 'month3'];
  const monthLabels = ['Month 1', 'Month 2', 'Month 3'];

  const tabs = months.map((m, i) => `
    <button class="prog-tab ${i === 0 ? 'active' : ''}" onclick="switchProgTab(${i})" id="ptab${i}">
      ${monthLabels[i]}
    </button>
  `).join('');

  const tables = months.map((mk, mi) => {
    const days = CHALLENGE_DATA[mk].days;
    const rows = days.map(d => {
      const logKey = `m${mi + 1}d${d.day}`;
      const markLog = appData.mark.logs[logKey] || {};
      const shelleyLog = appData.shelley.logs[logKey] || {};

      const exCell = (log, target) => {
        if (target === null) return '<td class="rest-cell">💤</td>';
        const done = log !== undefined;
        const mood = done ? MOODS[log.mood].emoji : '';
        return `<td class="${done ? 'done-cell' : 'pending-cell'}">${done ? '✓' + mood : '—'}</td>`;
      };

      // Determine if this day is in the past, today, or future
      const totalDay = mi * 30 + d.day - 1;
      const start = new Date(CHALLENGE_START);
      start.setHours(0,0,0,0);
      const today = new Date(); today.setHours(0,0,0,0);
      const dayDate = new Date(start.getTime() + totalDay * 86400000);
      const isPast = dayDate < today;
      const isToday = dayDate.getTime() === today.getTime();

      return `
        <tr class="${isToday ? 'today-row' : ''} ${isPast && !isToday ? 'past-row' : ''}">
          <td class="day-cell">${isToday ? '→' : ''}${d.day}</td>
          <td class="target-cell">${d.plank || '💤'}</td>
          ${exCell(markLog.plank, d.plank)}
          ${exCell(shelleyLog.plank, d.plank)}
          <td class="target-cell">${d.pushups !== null ? d.pushups : '💤'}</td>
          ${exCell(markLog.pushups, d.pushups)}
          ${exCell(shelleyLog.pushups, d.pushups)}
          <td class="target-cell">${d.situps !== null ? d.situps : '💤'}</td>
          ${exCell(markLog.situps, d.situps)}
          ${exCell(shelleyLog.situps, d.situps)}
        </tr>`;
    }).join('');

    return `
      <div class="prog-table-wrap" id="ptable${mi}" style="${mi === 0 ? '' : 'display:none'}">
        <div class="prog-label">${CHALLENGE_DATA[mk].label}</div>
        <div class="table-scroll">
          <table class="prog-table">
            <thead>
              <tr>
                <th>Day</th>
                <th colspan="3">⏱ PLANK</th>
                <th colspan="3">👊 PUSH-UPS</th>
                <th colspan="3">🔄 SIT-UPS</th>
              </tr>
              <tr class="sub-header">
                <th></th>
                <th>Target</th><th>M</th><th>S</th>
                <th>Target</th><th>M</th><th>S</th>
                <th>Target</th><th>M</th><th>S</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }).join('');

  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderToday()">◀</button>
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

// ---- SETTINGS VIEW ----

function renderSettings() {
  setView(`
    <div class="main-screen">
      <header class="app-header">
        <div class="header-left">
          <button class="back-btn" onclick="renderToday()">◀</button>
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
            <div class="setting-hint" id="notifHint">${notifEnabled ? '✓ Notifications on' : 'Enable to get daily reminders'}</div>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">INSTALL APP</div>
          <div class="settings-card">
            <p class="install-text">Add this app to your phone's home screen for the best experience and notification support.</p>
            <div class="install-steps">
              <div class="install-platform"><strong>iPhone</strong> — Open in Safari → Share → Add to Home Screen</div>
              <div class="install-platform"><strong>Android</strong> — Open in Chrome → Menu → Add to Home Screen</div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">CHALLENGE INFO</div>
          <div class="settings-card">
            <div class="info-row"><span>Started</span><span>22 May 2026</span></div>
            <div class="info-row"><span>Ends</span><span>19 Aug 2026</span></div>
            <div class="info-row"><span>Current user</span><span>${currentUser.toUpperCase()}</span></div>
          </div>
        </div>

        <button class="switch-btn" onclick="renderUserSelect()">SWITCH USER</button>

      </main>
    </div>
  `);
}

async function toggleNotif() {
  const checked = document.getElementById('notifToggle').checked;
  if (checked) {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      document.getElementById('notifToggle').checked = false;
      document.getElementById('notifHint').textContent = '✗ Permission denied — check browser settings';
      return;
    }
    notifEnabled = true;
    localStorage.setItem('notifEnabled', 'true');
    scheduleNotification();
    document.getElementById('notifHint').textContent = '✓ Notifications on';
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
  const delay = next - now;
  setTimeout(() => {
    const progress = getTodayProgress();
    if (progress) {
      new Notification('⚡ Triple Challenge', {
        body: `Day ${progress.day} — time to train, ${currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}!`,
        icon: './icons/icon-192.png'
      });
    }
    // Re-schedule for tomorrow
    if (notifEnabled) setTimeout(scheduleNotification, 60000);
  }, delay);
}

// Auto-schedule on load if previously enabled
if (notifEnabled && 'Notification' in window && Notification.permission === 'granted') {
  setTimeout(scheduleNotification, 2000);
}
