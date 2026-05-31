// ============================================
// NammaRoute — script.js v3.0
// Hyderabad Smart Transit · AI-Powered Routing
// Uses db.js for all data — accurate HMRL + TSRTC
// ============================================

// ---- Animated Background Canvas ----
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, lines = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function Line() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
    this.len = Math.random() * 60 + 20;
    this.opacity = Math.random() * 0.12 + 0.02;
    this.color = Math.random() > 0.5 ? '#38bdf8' : '#818cf8';
    this.horizontal = Math.random() > 0.5;
  }
  Line.prototype.update = function() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -this.len) this.x = W + this.len;
    if (this.x > W + this.len) this.x = -this.len;
    if (this.y < -this.len) this.y = H + this.len;
    if (this.y > H + this.len) this.y = -this.len;
  };
  Line.prototype.draw = function() {
    ctx.strokeStyle = this.color; ctx.globalAlpha = this.opacity;
    ctx.lineWidth = 1; ctx.beginPath();
    if (this.horizontal) { ctx.moveTo(this.x, this.y); ctx.lineTo(this.x + this.len, this.y); }
    else { ctx.moveTo(this.x, this.y); ctx.lineTo(this.x, this.y + this.len); }
    ctx.stroke();
  };

  function animate() {
    ctx.clearRect(0, 0, W, H);
    lines.forEach(l => { l.update(); l.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  resize();
  lines = Array.from({ length: 40 }, () => new Line());
  animate();
  window.addEventListener('resize', () => { resize(); lines = Array.from({ length: 40 }, () => new Line()); });
})();

// ---- Live Clock ----
function updateClock() {
  const el = document.getElementById('current-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000); updateClock();

// ---- Nav Pills ----
document.querySelector('[data-nav="status"]')?.addEventListener('click', () => {
  const r = document.getElementById('resultsSection');
  if (r && !r.classList.contains('hidden')) r.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else showToast('Select a route first to see live status', 'info');
});
document.querySelector('[data-nav="fares"]')?.addEventListener('click', showFareGuide);

// ---- Toast ----
function showToast(msg, type = 'info') {
  document.getElementById('nr-toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'nr-toast';
  const color = type === 'error' ? '#fb7185' : '#38bdf8';
  toast.style.cssText = `position:fixed;bottom:32px;left:50%;transform:translateX(-50%);
    background:#0f1421;border:1px solid ${color}44;border-radius:10px;padding:12px 24px;
    color:#e2e8f5;font-family:'Space Grotesk',sans-serif;font-size:14px;
    z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:toastIn .3s ease;`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  const s = document.createElement('style');
  s.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
  document.head.appendChild(s);
  setTimeout(() => toast.remove(), 3200);
}

// ---- Fare Guide Modal ----
function showFareGuide() {
  const existing = document.getElementById('fareGuideModal');
  if (existing) { existing.remove(); return; }
  const modal = document.createElement('div');
  modal.id = 'fareGuideModal';
  modal.style.cssText = `position:fixed;inset:0;z-index:9000;background:rgba(6,9,16,.88);
    backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;`;

  const metroRows = METRO_FARE_SLABS.map(({ maxKm, fare }, i) => {
    const prev = i === 0 ? 0 : METRO_FARE_SLABS[i-1].maxKm;
    const label = maxKm === Infinity ? `Above ${prev} km` : i === 0 ? `Up to ${maxKm} km` : `${prev}–${maxKm} km`;
    return `<tr style="border-bottom:1px solid rgba(255,255,255,.04)">
      <td style="padding:9px 0;color:#c8d1e5">${label}</td>
      <td style="padding:9px 0;text-align:right;font-family:'JetBrains Mono',monospace;font-weight:600;
        background:linear-gradient(135deg,#34d399,#38bdf8);-webkit-background-clip:text;
        -webkit-text-fill-color:transparent;background-clip:text">₹${fare}</td>
      <td style="padding:9px 0;text-align:right;font-family:'JetBrains Mono',monospace;color:#818cf8">
        ₹${metroFareSmartCard(maxKm === Infinity ? 25 : (prev + maxKm)/2)}</td>
    </tr>`;
  }).join('');

  const busRows = BUS_FARE_ORDINARY.map(({ maxKm, fare }, i) => {
    const prev = i === 0 ? 0 : BUS_FARE_ORDINARY[i-1].maxKm;
    const label = maxKm === Infinity ? `Above ${prev} km` : i === 0 ? `Up to ${maxKm} km` : `${prev}–${maxKm} km`;
    const express = BUS_FARE_EXPRESS[i]?.fare ?? 30;
    return `<tr style="border-bottom:1px solid rgba(255,255,255,.04)">
      <td style="padding:9px 0;color:#c8d1e5">${label}</td>
      <td style="padding:9px 0;text-align:right;font-family:'JetBrains Mono',monospace;color:#34d399;font-weight:600">₹${fare}</td>
      <td style="padding:9px 0;text-align:right;font-family:'JetBrains Mono',monospace;color:#38bdf8;font-weight:600">₹${express}</td>
    </tr>`;
  }).join('');

  modal.innerHTML = `
    <div style="background:#0f1421;border:1px solid rgba(56,189,248,.25);border-radius:20px;
      max-width:580px;width:100%;padding:32px;max-height:85vh;overflow-y:auto;position:relative;
      box-shadow:0 32px 64px rgba(0,0,0,.6)">
      <button onclick="document.getElementById('fareGuideModal').remove()" style="
        position:absolute;top:20px;right:20px;background:rgba(255,255,255,.07);
        border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#6b7a99;
        font-size:18px;width:32px;height:32px;cursor:pointer;display:flex;
        align-items:center;justify-content:center;font-family:monospace">×</button>
      <div style="font-family:'Space Grotesk',sans-serif">
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#3d4a65;margin-bottom:12px">OFFICIAL FARE GUIDE 2024</div>
        <h2 style="font-family:'Playfair Display',serif;font-size:22px;color:#e2e8f5;margin-bottom:6px;font-style:italic">Hyderabad Transit Fares</h2>
        <p style="font-size:12px;color:#6b7a99;margin-bottom:24px">HMRL Metro & TSRTC Bus — Official tariff slabs</p>

        <div style="margin-bottom:28px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
            <span style="background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;color:#38bdf8;font-family:'JetBrains Mono',monospace">🚇 HMRL METRO</span>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead><tr style="border-bottom:1px solid rgba(255,255,255,.07)">
              <th style="text-align:left;padding:8px 0;color:#6b7a99;font-weight:500">Distance</th>
              <th style="text-align:right;padding:8px 0;color:#6b7a99;font-weight:500">Token</th>
              <th style="text-align:right;padding:8px 0;color:#818cf8;font-weight:500">Smart Card</th>
            </tr></thead>
            <tbody>${metroRows}</tbody>
          </table>
          <p style="font-size:11px;color:#3d4a65;margin-top:8px">Smart card: 10% discount (min ₹10). Children under 90cm: free.</p>
        </div>

        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
            <span style="background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;color:#34d399;font-family:'JetBrains Mono',monospace">🚌 TSRTC BUS</span>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead><tr style="border-bottom:1px solid rgba(255,255,255,.07)">
              <th style="text-align:left;padding:8px 0;color:#6b7a99;font-weight:500">Distance</th>
              <th style="text-align:right;padding:8px 0;color:#34d399;font-weight:500">Ordinary</th>
              <th style="text-align:right;padding:8px 0;color:#38bdf8;font-weight:500">Express/Pushpak</th>
            </tr></thead>
            <tbody>${busRows}</tbody>
          </table>
          <p style="font-size:11px;color:#3d4a65;margin-top:8px">Pushpak & Metro Express charge express fare. TSRTC monthly pass available at depots.</p>
        </div>

        <div style="margin-top:24px;padding:16px;background:rgba(129,140,248,.07);border:1px solid rgba(129,140,248,.2);border-radius:12px">
          <p style="font-size:12px;color:#818cf8;font-weight:600;margin-bottom:6px">💡 Money-Saving Tips</p>
          <p style="font-size:12px;color:#6b7a99;line-height:1.7">
            • Metro Smart Card saves 10% per trip — buy at any metro station<br>
            • TSRTC day pass: ₹65 (ordinary), ₹90 (express) for unlimited rides<br>
            • For distances under 3 km, walking or auto is often cheaper<br>
            • Pushpak AC buses cost express fare but are far more comfortable
          </p>
        </div>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

// ---- State ----
let map = null, mapLayers = [];
let selectedPreference = 'fastest', selectedTime = 'now';
let currentRoutes = [], selectedRouteIdx = 0;
let currentSrc = '', currentDst = '';

// ---- Preference & Time Pills ----
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedPreference = pill.dataset.pref;
  });
});
document.querySelectorAll('.time-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedTime = pill.dataset.time;
  });
});

// ---- Swap Button ----
document.getElementById('swapBtn').addEventListener('click', () => {
  const s = document.getElementById('source'), d = document.getElementById('destination');
  [s.value, d.value] = [d.value, s.value];
});

// ---- Build Routes using db.js data ----
function buildRoutes(src, dst) {
  const A = STATIONS[src], B = STATIONS[dst];
  if (!A || !B) return [];

  const directKm = haversineKm(A, B);

  // Try metro shortest path
  const srcMetro = nearestMetroStation(src);
  const dstMetro = nearestMetroStation(dst);
  const metroPath = (srcMetro && dstMetro) ? metroShortestPath(srcMetro, dstMetro) : null;
  const metroKm = metroPath ? metroPath.km : directKm * 1.2;

  // Access legs (walk/bus to metro station)
  const srcIsMetro = A.line !== 'bus';
  const dstIsMetro = B.line !== 'bus';
  const accessKmSrc = srcIsMetro ? 0 : haversineKm(A, STATIONS[srcMetro] || A) * 1.3;
  const accessKmDst = dstIsMetro ? 0 : haversineKm(B, STATIONS[dstMetro] || B) * 1.3;
  const accessTimeSrc = Math.round(accessKmSrc * 12); // ~12 min/km walking
  const accessTimeDst = Math.round(accessKmDst * 12);

  // Bus distance is road distance (~30% longer than straight line)
  const busKm = directKm * 1.28;

  // Combo: bus to nearest metro, then metro
  const comboKmBus = accessKmSrc + accessKmDst;
  const comboKmMetro = metroKm;

  // Fares using db.js
  const fastFare = metroFare(metroKm);
  const fastFareCard = metroFareSmartCard(metroKm);
  const cheapFare = busFareOrdinary(busKm);
  const cheapFareExpress = busFareExpress(busKm);
  const comboFare = busFareExpress(Math.max(comboKmBus, 2)) + metroFare(comboKmMetro);
  const ecoFare = metroFare(metroKm);

  // Crowd profiles
  const metroCrowd = getCrowdProfile('metro', selectedTime);
  const busCrowd = getCrowdProfile('bus', selectedTime);
  const comboCrowd = getCrowdProfile('combo', selectedTime);

  // Transit times
  const metroSpeed = 34; // km/h average for Hyderabad metro incl. stops
  const busSpeed = 18;   // km/h average TSRTC city bus
  const fastTime = Math.round((metroKm / metroSpeed) * 60 + 8 + (metroPath?.path.filter((_, i, a) => {
    // count line changes
    const sA = STATIONS[a[i-1]], sB = STATIONS[a[i]];
    return sA && sB && sA.line !== sB.line && sA.line !== 'both' && sB.line !== 'both';
  }).length || 0) * 5);
  const cheapTime = Math.round((busKm / busSpeed) * 60 + 5);
  const comboTime = Math.round((comboKmBus / busSpeed) * 60 + (comboKmMetro / metroSpeed) * 60 + 12);
  const ecoTime = fastTime + 3;

  // Determine interchange
  const hasInterchange = metroPath && metroPath.path.some((s, i, a) => {
    const sA = STATIONS[a[i-1]], sB = STATIONS[s];
    return sA && sB && sA.line !== sB.line && sA.line !== 'both' && sB.line !== 'both';
  });
  const interchangeStation = hasInterchange ? 'Ameerpet' : null;

  // Build metro steps from path
  function buildMetroSteps(path) {
    if (!path || path.length === 0) return [];
    const steps = [{ icon: '📍', type: 'start', name: src, desc: srcIsMetro ? `Board at ${src} Metro Station` : `Walk ${Math.ceil(accessKmSrc*10)/10} km to ${srcMetro} Metro` }];
    if (!srcIsMetro) steps.push({ icon: '🚶', type: 'walk', name: `Walk to ${srcMetro}`, desc: `~${accessTimeSrc} min walk or take auto`, meta: `${Math.ceil(accessKmSrc*10)/10} km · ~₹20–30 auto` });

    let segment = [path[0]], segLine = STATIONS[path[0]]?.line;
    for (let i = 1; i < path.length; i++) {
      const curLine = STATIONS[path[i]]?.line;
      if (curLine !== segLine && curLine !== 'both' && segLine !== 'both') {
        const segKm = metroShortestPath(segment[0], segment[segment.length-1])?.km ?? 0;
        const lineLabel = segLine === 'red' ? '🔴 Red Line' : segLine === 'blue' ? '🔵 Blue Line' : '🟢 Green Line';
        steps.push({
          icon: '🚇', type: 'metro',
          name: `Metro ${lineLabel} → ${segment[segment.length-1]}`,
          desc: `${segment[0]} → ${segment[segment.length-1]} (${segment.length - 1} stops)`,
          meta: `~${Math.round((segKm/metroSpeed)*60)} min · ₹${metroFare(segKm)}`
        });
        steps.push({ icon: '🔄', type: 'walk', name: `Transfer at ${path[i]}`, desc: 'Change metro line — same station concourse', meta: '3–5 min' });
        segment = [path[i]]; segLine = curLine;
      } else {
        segment.push(path[i]);
      }
    }
    if (segment.length > 1) {
      const segKm = metroShortestPath(segment[0], segment[segment.length-1])?.km ?? 0;
      const lineLabel = segLine === 'red' ? '🔴 Red Line' : segLine === 'blue' ? '🔵 Blue Line' : '🟢 Green Line';
      steps.push({
        icon: '🚇', type: 'metro',
        name: `Metro ${lineLabel} → ${segment[segment.length-1]}`,
        desc: `${segment[0]} → ${segment[segment.length-1]} (${segment.length - 1} stops)`,
        meta: `~${Math.round((segKm/metroSpeed)*60)} min · ₹${metroFare(segKm)}`
      });
    }
    if (!dstIsMetro) steps.push({ icon: '🚶', type: 'walk', name: `Walk/Auto to ${dst}`, desc: `~${accessTimeDst} min walk or take auto`, meta: `${Math.ceil(accessKmDst*10)/10} km · ~₹20–30 auto` });
    steps.push({ icon: '🏁', type: 'end', name: dst, desc: 'You have arrived!' });
    return steps;
  }

  const metroSteps = buildMetroSteps(metroPath?.path || [srcMetro || src, dstMetro || dst]);

  return [
    {
      id: 'fastest', type: 'fastest',
      label: 'Fastest Route', icon: '⚡', mode: 'Metro',
      fare: fastFare, fareNote: `₹${fastFareCard} with Smart Card · ${metroKm.toFixed(1)} km on metro`,
      time: fastTime, transfers: hasInterchange ? 1 : 0,
      crowd: metroCrowd, co2: co2Saved(metroKm, 'metro'), tags: ['metro'],
      metroPath: metroPath?.path,
      steps: metroSteps,
    },
    {
      id: 'cheapest', type: 'cheapest',
      label: 'Cheapest Route', icon: '₹', mode: 'TSRTC Ordinary Bus',
      fare: cheapFare, fareNote: `₹${cheapFareExpress} Express/Pushpak · ${busKm.toFixed(1)} km by road`,
      time: cheapTime, transfers: directKm > 12 ? 1 : 0,
      crowd: busCrowd, co2: co2Saved(busKm, 'bus'), tags: ['bus'],
      steps: directKm > 12 ? [
        { icon: '📍', type: 'start', name: src, desc: 'Board at nearby TSRTC stop' },
        { icon: '🚌', type: 'bus', name: `Ordinary Bus → Ameerpet`, desc: 'Board TSRTC at origin stop', meta: `~${Math.round(cheapTime*0.5)} min · ₹${busFareOrdinary(busKm*0.5)}` },
        { icon: '🔄', type: 'walk', name: 'Transfer at Ameerpet', desc: 'Change bus at interchange', meta: '5 min' },
        { icon: '🚌', type: 'bus', name: `Bus → ${dst}`, desc: 'Continue on connecting bus', meta: `~${Math.round(cheapTime*0.5)} min · ₹${busFareOrdinary(busKm*0.5)}` },
        { icon: '🏁', type: 'end', name: dst, desc: 'You have arrived!' },
      ] : [
        { icon: '📍', type: 'start', name: src, desc: 'Board at nearby TSRTC stop' },
        { icon: '🚌', type: 'bus', name: `Ordinary Bus → ${dst}`, desc: `TSRTC city bus · ${busKm.toFixed(1)} km`, meta: `~${cheapTime} min · ₹${cheapFare}` },
        { icon: '🏁', type: 'end', name: dst, desc: 'You have arrived!' },
      ],
    },
    {
      id: 'least_crowd', type: 'least_crowd',
      label: 'Least Crowded', icon: '👤', mode: 'Express Bus + Metro',
      fare: comboFare, fareNote: 'Bus + Metro combined fare',
      time: comboTime, transfers: 1,
      crowd: comboCrowd, co2: co2Saved(comboKmMetro, 'metro') + co2Saved(Math.max(comboKmBus, 1), 'bus'),
      tags: ['bus', 'metro'],
      steps: [
        { icon: '📍', type: 'start', name: src, desc: 'Board at origin' },
        { icon: '🚌', type: 'bus', name: `Pushpak / Metro Express Bus → ${srcMetro || 'Nearest Metro'}`, desc: `AC bus to metro feeder — less crowded`, meta: `~${Math.round(comboKmBus/busSpeed*60 + 5)} min · ₹${busFareExpress(Math.max(comboKmBus,2))}` },
        { icon: '🔄', type: 'walk', name: `Enter ${srcMetro || 'Metro'} Station`, desc: '3–5 min walk from bus stop to metro gate', meta: '~4 min' },
        { icon: '🚇', type: 'metro', name: `Metro → ${dstMetro || dst}`, desc: `Fast metro leg · ${comboKmMetro.toFixed(1)} km`, meta: `~${Math.round(comboKmMetro/metroSpeed*60)} min · ₹${metroFare(comboKmMetro)}` },
        { icon: '🏁', type: 'end', name: dst, desc: 'You have arrived!' },
      ],
    },
    {
      id: 'eco', type: 'eco',
      label: 'Eco Route', icon: '🌿', mode: 'Metro (Greenest)',
      fare: ecoFare, fareNote: `~${co2Saved(metroKm, 'metro')}g CO₂ saved vs auto-rickshaw`,
      time: ecoTime, transfers: hasInterchange ? 1 : 0,
      crowd: metroCrowd, co2: co2Saved(metroKm, 'metro'), tags: ['metro'],
      metroPath: metroPath?.path,
      steps: metroSteps,
    },
  ];
}

// ---- Render Route Cards ----
function renderRouteCards(routes) {
  const container = document.getElementById('routeCards');
  container.innerHTML = '';
  document.getElementById('routeCount').textContent = `${routes.length} options`;

  routes.forEach((route, idx) => {
    const crowdEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[route.crowd.level] || '🟡';
    const crowdText  = route.crowd.label || 'Moderate';
    const crowdPct   = route.crowd.pct || 50;

    const card = document.createElement('div');
    card.className = `route-card ${route.type}${idx === selectedRouteIdx ? ' selected' : ''}`;
    card.style.animationDelay = `${idx * 0.07}s`;

    card.innerHTML = `
      <div class="card-badge">${route.icon} ${route.label.toUpperCase()}</div>
      <div class="card-title">${route.mode}</div>
      <div class="card-stats">
        <div class="stat"><span class="stat-val fare-val">₹${route.fare}</span><span class="stat-label">Fare</span></div>
        <div class="stat"><span class="stat-val">${route.time}<span style="font-size:13px;font-weight:400"> min</span></span><span class="stat-label">Duration</span></div>
        <div class="stat"><span class="stat-val" style="font-size:15px">${route.transfers}</span><span class="stat-label">Transfers</span></div>
        <div class="stat"><span class="stat-val" style="font-size:13px;color:var(--emerald)">-${route.co2}g</span><span class="stat-label">CO₂ vs Auto</span></div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;font-family:var(--font-mono)">${route.fareNote}</div>
      <div class="crowd-bar"><div class="crowd-fill ${route.crowd.level}" style="width:${crowdPct}%"></div></div>
      <div class="crowd-label ${route.crowd.level}">${crowdEmoji} ${crowdText}</div>
      <div class="card-tags">
        ${route.tags.map(t => `<span class="tag ${t}">${t.toUpperCase()}</span>`).join('')}
        ${route.transfers > 0 ? `<span class="tag walk">${route.transfers} TRANSFER${route.transfers > 1 ? 'S' : ''}</span>` : ''}
      </div>`;

    card.addEventListener('click', () => {
      selectedRouteIdx = idx;
      document.querySelectorAll('.route-card').forEach((c, i) => c.classList.toggle('selected', i === idx));
      renderJourneyDetail(routes[idx]);
      initMap(currentSrc, currentDst, routes[idx]);
    });
    container.appendChild(card);
  });
  renderJourneyDetail(routes[0]);
}

// ---- Render Journey Detail ----
function renderJourneyDetail(route) {
  const panel = document.getElementById('journeyDetail');
  const steps = document.getElementById('detailSteps');
  panel.classList.remove('hidden');
  steps.innerHTML = route.steps.map(step => `
    <div class="step">
      <div class="step-icon ${step.type}">${step.icon}</div>
      <div class="step-info">
        <div class="step-name">${step.name}</div>
        <div class="step-desc">${step.desc}</div>
        ${step.meta ? `<div class="step-meta">${step.meta}</div>` : ''}
      </div>
    </div>`).join('');
}

// ---- Journey Banner ----
function updateJourneyBanner(src, dst, routes) {
  document.getElementById('jbFrom').textContent = src;
  document.getElementById('jbTo').textContent = dst;
  const best = routes[0];
  const eta = new Date(Date.now() + best.time * 60000);
  const fares = routes.map(r => r.fare);
  document.getElementById('jbMeta').innerHTML = `
    <span>Best: ${best.label}</span> &nbsp;·&nbsp;
    <span>ETA ~${eta.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span> &nbsp;·&nbsp;
    <span>₹${Math.min(...fares)}–₹${Math.max(...fares)} range</span>`;
}

// ---- Map ----
function initMap(src, dst, route) {
  const A = STATIONS[src], B = STATIONS[dst];
  if (!A || !B) return;

  const midLat = (A.lat + B.lat) / 2, midLng = (A.lng + B.lng) / 2;

  if (!map) {
    map = L.map('map', { zoomControl: true }).setView([midLat, midLng], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
    }).addTo(map);
  } else {
    map.setView([midLat, midLng], 12);
  }

  mapLayers.forEach(l => map.removeLayer(l));
  mapLayers = [];

  const makeIcon = (color, emoji) => L.divIcon({
    className: '',
    html: `<div style="background:${color};border:2px solid rgba(255,255,255,.25);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,.6),0 0 16px ${color}40">${emoji}</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18],
  });

  mapLayers.push(L.marker([A.lat, A.lng], { icon: makeIcon('#34d399', '📍') })
    .bindPopup(`<b style="color:#e2e8f5">${src}</b><br><span style="color:#34d399;font-size:11px">Origin</span>`).addTo(map));
  mapLayers.push(L.marker([B.lat, B.lng], { icon: makeIcon('#fb7185', '🏁') })
    .bindPopup(`<b style="color:#e2e8f5">${dst}</b><br><span style="color:#fb7185;font-size:11px">Destination</span>`).addTo(map));

  // Draw metro path if available
  const pathStations = route.metroPath
    ? route.metroPath.filter(s => STATIONS[s]).map(s => [STATIONS[s].lat, STATIONS[s].lng])
    : [[A.lat, A.lng], [B.lat, B.lng]];

  const isMetroOnly = route.tags.includes('metro') && !route.tags.includes('bus');
  const isBusOnly = route.tags.includes('bus') && !route.tags.includes('metro');
  const lineColor = isMetroOnly ? '#38bdf8' : isBusOnly ? '#34d399' : '#818cf8';

  // Draw shadow + main line
  mapLayers.push(L.polyline(pathStations, { color: lineColor, weight: 10, opacity: 0.08 }).addTo(map));
  mapLayers.push(L.polyline(pathStations, {
    color: lineColor, weight: 3.5, opacity: 0.9,
    dashArray: isBusOnly ? '10,7' : null,
  }).addTo(map));

  // Draw intermediate metro stops
  if (route.metroPath && route.metroPath.length > 2) {
    route.metroPath.slice(1, -1).forEach(sname => {
      const s = STATIONS[sname];
      if (!s) return;
      const isXfer = s.interchange;
      mapLayers.push(L.circleMarker([s.lat, s.lng], {
        radius: isXfer ? 8 : 4,
        color: isXfer ? '#818cf8' : lineColor,
        fillColor: isXfer ? '#818cf8' : lineColor,
        fillOpacity: 0.9, weight: 2,
      }).bindPopup(`<b style="color:#e2e8f5">${sname}</b><br><span style="color:${isXfer ? '#818cf8' : lineColor};font-size:11px">${isXfer ? 'Interchange' : 'Metro Stop'}</span>`).addTo(map));
    });
  }

  map.fitBounds(L.latLngBounds(pathStations), { padding: [50, 50] });
}

// ---- AI Recommendation ----
async function fetchAIRecommendation(src, dst, routes, preference) {
  const aiBody = document.getElementById('aiBody');
  aiBody.innerHTML = `<div class="ai-loading"><div class="ai-dots"><span></span><span></span><span></span></div><span>Claude is analysing your route…</span></div>`;

  const preferenceText = {
    fastest: 'fastest route possible',
    cheapest: 'cheapest route',
    least_crowd: 'least crowded route',
    eco: 'most eco-friendly route',
  }[preference] || 'best balance of speed and cost';

  const routeSummary = routes.map(r =>
    `• ${r.label}: ${r.mode}, ₹${r.fare} official fare, ${r.time} min, crowd: ${r.crowd.label}, ${r.transfers} transfer(s), saves ${r.co2}g CO₂ vs auto`
  ).join('\n');

  const timeCtx = selectedTime === 'now'
    ? `Current time: ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
    : `Planned departure: ${selectedTime.replace('_', ' ')} peak`;

  const prompt = `You are NammaRoute AI, a Hyderabad city transport assistant. A commuter wants to travel from ${src} to ${dst} and prefers the ${preferenceText}.
${timeCtx}

Available routes (official HMRL Metro + TSRTC Bus fares):
${routeSummary}

Give a friendly, specific recommendation in 2–3 sentences. Name the best route, exact fare, travel time, and add one practical Hyderabad-specific tip (smart card, nearby landmark, peak hour advice, auto-fare comparison, etc). Be conversational, no bullet points.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'You are NammaRoute AI — a friendly, knowledgeable Hyderabad transit expert. Be concise, helpful, and always include a local tip. Fares shown are official HMRL Metro and TSRTC rates.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = data.content?.map(c => c.text || '').join('') || '';
    aiBody.innerHTML = `<div class="ai-text">${formatAIText(text)}</div>`;
  } catch {
    // Fallback
    const best = routes[0];
    const tips = {
      fastest: 'Tap your Smart Card for 10% off — and metro is fully AC, a lifesaver in Hyderabad summers.',
      cheapest: 'TSRTC ordinary buses are among the cheapest in India. Ask for the stop by name when boarding.',
      least_crowd: 'The Express Bus + Metro combo avoids peak-hour crush at Ameerpet.',
      eco: 'Hyderabad Metro emits ~95% less CO₂/km than a private auto-rickshaw.',
    };
    aiBody.innerHTML = `<div class="ai-text">For your journey from <strong>${src}</strong> to <strong>${dst}</strong>, I recommend the <span class="ai-highlight">${best.label}</span> via ${best.mode}. Official fare is <strong>₹${best.fare}</strong> (₹${metroFareSmartCard && best.tags.includes('metro') ? metroFareSmartCard(haversineKm(STATIONS[src]||{lat:17.44,lng:78.45}, STATIONS[dst]||{lat:17.44,lng:78.45})*1.15) : best.fare} smart card) with ~<strong>${best.time} minutes</strong> travel time. ${tips[preference] || tips.fastest}</div>`;
  }
}

function formatAIText(text) {
  return text
    .replace(/₹\d+/g, m => `<span class="ai-highlight">${m}</span>`)
    .replace(/\d+ minutes?/g, m => `<strong>${m}</strong>`)
    .replace(/(HITEC City|Ameerpet|Miyapur|Lingampally|Raidurg|Kukatpally|Secunderabad|Uppal|LB Nagar|Gachibowli|Paradise|Nampally|MGBS|Dilsukhnagar|Begumpet|Madhapur|Jubilee Hills|KPHB)/g,
      m => `<strong>${m}</strong>`);
}

// ---- Share ----
document.getElementById('shareBtn')?.addEventListener('click', () => {
  const url = `${location.origin}${location.pathname}?r=${btoa(`${currentSrc}|${currentDst}|${selectedPreference}`)}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('shareBtn');
      btn.textContent = '✓ Copied!';
      setTimeout(() => btn.textContent = '🔗 Share', 2000);
    });
  }
});

// ---- Main Handler ----
document.getElementById('findRouteBtn').addEventListener('click', async () => {
  const src = document.getElementById('source').value;
  const dst = document.getElementById('destination').value;

  if (!src || !dst) { shakeElement(document.getElementById('findRouteBtn')); return; }
  if (src === dst) { showToast('Origin and destination cannot be the same!', 'error'); shakeElement(document.getElementById('findRouteBtn')); return; }

  currentSrc = src; currentDst = dst; selectedRouteIdx = 0;
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('resultsSection').classList.add('hidden');
  document.getElementById('journeyDetail').classList.add('hidden');

  await new Promise(r => setTimeout(r, 1200));
  currentRoutes = buildRoutes(src, dst);
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('resultsSection').classList.remove('hidden');

  updateJourneyBanner(src, dst, currentRoutes);
  renderRouteCards(currentRoutes);
  setTimeout(() => initMap(src, dst, currentRoutes[0]), 100);
  fetchAIRecommendation(src, dst, currentRoutes, selectedPreference);
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ---- Shake animation ----
function shakeElement(el) {
  el.style.animation = 'none'; el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;
document.head.appendChild(styleEl);

document.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.target.matches('button')) document.getElementById('findRouteBtn').click(); });

// ---- URL param restore ----
(function restoreFromURL() {
  const r = new URLSearchParams(location.search).get('r');
  if (!r) return;
  try {
    const [s, d, p] = atob(r).split('|');
    if (s) document.getElementById('source').value = s;
    if (d) document.getElementById('destination').value = d;
    if (p) {
      document.querySelectorAll('.pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.pref === p);
        if (pill.dataset.pref === p) selectedPreference = p;
      });
    }
  } catch {}
})();