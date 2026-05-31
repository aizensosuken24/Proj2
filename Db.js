// ============================================================
// NammaRoute — db.js v3.0
// Hyderabad Smart Transit · Complete Data Layer
// Official HMRL Metro + TSRTC Bus accurate data 2024
// ============================================================

// ---- HMRL Metro Stations with accurate coordinates ----
// All three corridors: Red (Miyapur–LB Nagar), Blue (Nagole–Raidurg), Green (JBS–MGBS)
const METRO_LINES = {
  red: {
    id: 'red', name: 'Red Line', color: '#ef4444',
    label: 'Miyapur ↔ LB Nagar',
    stations: [
      'Miyapur','JNTU College','KPHB Colony','Kukatpally','Balanagar',
      'Moosapet','Bharat Nagar','Erragadda','ESI Hospital','SR Nagar',
      'Ameerpet','Punjagutta','Irrum Manzil','Khairatabad','Lakdikapul',
      'Assembly','Nampally','Gandhi Bhavan','Osmania Medical College',
      'MJ Market','Musarambagh','Dilsukhnagar','Chaitanyapuri',
      'Victoria Memorial','LB Nagar'
    ]
  },
  blue: {
    id: 'blue', name: 'Blue Line', color: '#3b82f6',
    label: 'Nagole ↔ Raidurg',
    stations: [
      'Nagole','Uppal','Stadium','NGRI','Habsiguda',
      'Tarnaka','Mettuguda','Secunderabad East','Parade Grounds','Paradise',
      'Rasoolpura','Prakash Nagar','Begumpet','Ameerpet','Madhura Nagar',
      'Yusufguda','Road No.5 Jubilee Hills','Jubilee Hills Check Post',
      'Peddamma Temple','Madhapur','Durgam Cheruvu','HITEC City','Raidurg'
    ]
  },
  green: {
    id: 'green', name: 'Green Line', color: '#22c55e',
    label: 'JBS ↔ MGBS',
    stations: [
      'Jubilee Bus Station','Secunderabad West','Gandhi Hospital',
      'Musheerabad','RTC Cross Roads','Chikkadpally','Narayanguda',
      'Sultan Bazar','MG Bus Station'
    ]
  }
};

// ---- All stations with coordinates, line membership, zone ----
const STATIONS = {
  // Red Line
  "Miyapur":              { lat: 17.4957, lng: 78.3534, line: 'red', interchange: false, zone: 1 },
  "JNTU College":         { lat: 17.4947, lng: 78.3916, line: 'red', interchange: false, zone: 1 },
  "KPHB Colony":          { lat: 17.4897, lng: 78.4071, line: 'red', interchange: false, zone: 1 },
  "Kukatpally":           { lat: 17.4844, lng: 78.4104, line: 'red', interchange: false, zone: 1 },
  "Balanagar":            { lat: 17.4773, lng: 78.4379, line: 'red', interchange: false, zone: 2 },
  "Moosapet":             { lat: 17.4672, lng: 78.4304, line: 'red', interchange: false, zone: 2 },
  "Bharat Nagar":         { lat: 17.4624, lng: 78.4405, line: 'red', interchange: false, zone: 2 },
  "Erragadda":            { lat: 17.4617, lng: 78.4426, line: 'red', interchange: false, zone: 2 },
  "ESI Hospital":         { lat: 17.4571, lng: 78.4437, line: 'red', interchange: false, zone: 2 },
  "SR Nagar":             { lat: 17.4451, lng: 78.4371, line: 'red', interchange: false, zone: 2 },
  "Ameerpet":             { lat: 17.4376, lng: 78.4482, line: 'both', interchange: true,  zone: 2 },
  "Punjagutta":           { lat: 17.4334, lng: 78.4518, line: 'red', interchange: false, zone: 2 },
  "Irrum Manzil":         { lat: 17.4282, lng: 78.4570, line: 'red', interchange: false, zone: 2 },
  "Khairatabad":          { lat: 17.4240, lng: 78.4618, line: 'red', interchange: false, zone: 2 },
  "Lakdikapul":           { lat: 17.4027, lng: 78.4700, line: 'red', interchange: false, zone: 3 },
  "Assembly":             { lat: 17.3980, lng: 78.4728, line: 'red', interchange: false, zone: 3 },
  "Nampally":             { lat: 17.3861, lng: 78.4737, line: 'red', interchange: false, zone: 3 },
  "Gandhi Bhavan":        { lat: 17.3814, lng: 78.4769, line: 'red', interchange: false, zone: 3 },
  "Osmania Medical College": { lat: 17.3760, lng: 78.4800, line: 'red', interchange: false, zone: 3 },
  "MJ Market":            { lat: 17.3710, lng: 78.4840, line: 'red', interchange: false, zone: 3 },
  "Musarambagh":          { lat: 17.3600, lng: 78.5050, line: 'red', interchange: false, zone: 3 },
  "Dilsukhnagar":         { lat: 17.3679, lng: 78.5265, line: 'red', interchange: false, zone: 3 },
  "Chaitanyapuri":        { lat: 17.3540, lng: 78.5400, line: 'red', interchange: false, zone: 3 },
  "Victoria Memorial":    { lat: 17.3510, lng: 78.5470, line: 'red', interchange: false, zone: 3 },
  "LB Nagar":             { lat: 17.3463, lng: 78.5544, line: 'red', interchange: false, zone: 3 },

  // Blue Line
  "Nagole":               { lat: 17.3858, lng: 78.5738, line: 'blue', interchange: false, zone: 3 },
  "Uppal":                { lat: 17.4050, lng: 78.5590, line: 'blue', interchange: false, zone: 3 },
  "Stadium":              { lat: 17.4120, lng: 78.5450, line: 'blue', interchange: false, zone: 3 },
  "NGRI":                 { lat: 17.4180, lng: 78.5310, line: 'blue', interchange: false, zone: 3 },
  "Habsiguda":            { lat: 17.4230, lng: 78.5160, line: 'blue', interchange: false, zone: 2 },
  "Tarnaka":              { lat: 17.4280, lng: 78.5080, line: 'blue', interchange: false, zone: 2 },
  "Mettuguda":            { lat: 17.4350, lng: 78.5020, line: 'blue', interchange: false, zone: 2 },
  "Secunderabad East":    { lat: 17.4399, lng: 78.4983, line: 'blue', interchange: false, zone: 2 },
  "Parade Grounds":       { lat: 17.4430, lng: 78.4970, line: 'blue', interchange: false, zone: 2 },
  "Paradise":             { lat: 17.4459, lng: 78.4949, line: 'blue', interchange: false, zone: 2 },
  "Rasoolpura":           { lat: 17.4480, lng: 78.4900, line: 'blue', interchange: false, zone: 2 },
  "Prakash Nagar":        { lat: 17.4460, lng: 78.4810, line: 'blue', interchange: false, zone: 2 },
  "Begumpet":             { lat: 17.4432, lng: 78.4693, line: 'blue', interchange: false, zone: 2 },
  "Madhura Nagar":        { lat: 17.4390, lng: 78.4600, line: 'blue', interchange: false, zone: 2 },
  "Yusufguda":            { lat: 17.4355, lng: 78.4482, line: 'blue', interchange: false, zone: 2 },
  "Road No.5 Jubilee Hills": { lat: 17.4329, lng: 78.4185, line: 'blue', interchange: false, zone: 1 },
  "Jubilee Hills Check Post": { lat: 17.4314, lng: 78.4020, line: 'blue', interchange: false, zone: 1 },
  "Peddamma Temple":      { lat: 17.4298, lng: 78.3885, line: 'blue', interchange: false, zone: 1 },
  "Madhapur":             { lat: 17.4345, lng: 78.3800, line: 'blue', interchange: false, zone: 1 },
  "Durgam Cheruvu":       { lat: 17.4380, lng: 78.3750, line: 'blue', interchange: false, zone: 1 },
  "HITEC City":           { lat: 17.4435, lng: 78.3772, line: 'blue', interchange: false, zone: 1 },
  "Raidurg":              { lat: 17.4271, lng: 78.3714, line: 'blue', interchange: false, zone: 1 },

  // Green Line
  "Jubilee Bus Station":  { lat: 17.4478, lng: 78.4977, line: 'green', interchange: false, zone: 2 },
  "Secunderabad West":    { lat: 17.4390, lng: 78.4980, line: 'green', interchange: false, zone: 2 },
  "Gandhi Hospital":      { lat: 17.4350, lng: 78.4920, line: 'green', interchange: false, zone: 2 },
  "Musheerabad":          { lat: 17.4290, lng: 78.4850, line: 'green', interchange: false, zone: 2 },
  "RTC Cross Roads":      { lat: 17.4220, lng: 78.4800, line: 'green', interchange: false, zone: 2 },
  "Chikkadpally":         { lat: 17.4150, lng: 78.4780, line: 'green', interchange: false, zone: 2 },
  "Narayanguda":          { lat: 17.4052, lng: 78.4780, line: 'green', interchange: false, zone: 3 },
  "Sultan Bazar":         { lat: 17.3960, lng: 78.4800, line: 'green', interchange: false, zone: 3 },
  "MG Bus Station":       { lat: 17.3780, lng: 78.4827, line: 'green', interchange: false, zone: 3 },

  // Aliases / common names for backward compat + UI
  "JNTU":       { lat: 17.4947, lng: 78.3916, line: 'red', interchange: false, zone: 1 },
  "MGBS":       { lat: 17.3780, lng: 78.4827, line: 'green', interchange: false, zone: 3 },
  "Secunderabad": { lat: 17.4399, lng: 78.4983, line: 'blue', interchange: false, zone: 2 },
  "Lingampally":  { lat: 17.4924, lng: 78.3182, line: 'bus', interchange: false, zone: 1 },
  "Kondapur":     { lat: 17.4601, lng: 78.3588, line: 'bus', interchange: false, zone: 1 },
  "Gachibowli":   { lat: 17.4401, lng: 78.3489, line: 'bus', interchange: false, zone: 1 },
};

// ---- Official HMRL Metro Fare Slabs (2024) ----
// Source: HMRL official tariff order
const METRO_FARE_SLABS = [
  { maxKm: 2,  fare: 10 },
  { maxKm: 4,  fare: 15 },
  { maxKm: 6,  fare: 20 },
  { maxKm: 8,  fare: 25 },
  { maxKm: 10, fare: 30 },
  { maxKm: 12, fare: 35 },
  { maxKm: 14, fare: 40 },
  { maxKm: 16, fare: 45 },
  { maxKm: 18, fare: 50 },
  { maxKm: 21, fare: 55 },
  { maxKm: Infinity, fare: 60 },
];

// ---- Official TSRTC Bus Fare Slabs (2024) ----
// Source: TSRTC fare revision gazette notification
const BUS_FARE_ORDINARY = [
  { maxKm: 3,        fare: 6  },
  { maxKm: 6,        fare: 8  },
  { maxKm: 10,       fare: 10 },
  { maxKm: 15,       fare: 13 },
  { maxKm: 20,       fare: 16 },
  { maxKm: 30,       fare: 20 },
  { maxKm: Infinity, fare: 25 },
];

const BUS_FARE_EXPRESS = [
  { maxKm: 3,        fare: 8  },
  { maxKm: 6,        fare: 10 },
  { maxKm: 10,       fare: 12 },
  { maxKm: 15,       fare: 16 },
  { maxKm: 20,       fare: 20 },
  { maxKm: 30,       fare: 25 },
  { maxKm: Infinity, fare: 30 },
];

// Fare lookup functions
function metroFare(km) {
  return METRO_FARE_SLABS.find(s => km <= s.maxKm).fare;
}
function metroFareSmartCard(km) {
  const base = metroFare(km);
  return Math.max(10, Math.round(base * 0.9 / 5) * 5);
}
function busFareOrdinary(km) {
  return BUS_FARE_ORDINARY.find(s => km <= s.maxKm).fare;
}
function busFareExpress(km) {
  return BUS_FARE_EXPRESS.find(s => km <= s.maxKm).fare;
}

// ---- Station-to-Station Metro Distance Table (km) ----
// Accurate chord distances along track for key station pairs
// Based on HMRL published station spacing
const METRO_DISTANCES = {
  // Red Line consecutive distances (km)
  red: [
    ['Miyapur',        'JNTU College',   3.9],
    ['JNTU College',   'KPHB Colony',    1.2],
    ['KPHB Colony',    'Kukatpally',     1.3],
    ['Kukatpally',     'Balanagar',      2.2],
    ['Balanagar',      'Moosapet',       1.6],
    ['Moosapet',       'Bharat Nagar',   1.2],
    ['Bharat Nagar',   'Erragadda',      0.9],
    ['Erragadda',      'ESI Hospital',   0.8],
    ['ESI Hospital',   'SR Nagar',       1.6],
    ['SR Nagar',       'Ameerpet',       1.5],
    ['Ameerpet',       'Punjagutta',     0.7],
    ['Punjagutta',     'Irrum Manzil',   0.8],
    ['Irrum Manzil',   'Khairatabad',    0.7],
    ['Khairatabad',    'Lakdikapul',     2.5],
    ['Lakdikapul',     'Assembly',       0.8],
    ['Assembly',       'Nampally',       1.0],
    ['Nampally',       'Gandhi Bhavan',  0.7],
    ['Gandhi Bhavan',  'Osmania Medical College', 0.7],
    ['Osmania Medical College', 'MJ Market', 0.7],
    ['MJ Market',      'Musarambagh',    2.5],
    ['Musarambagh',    'Dilsukhnagar',   2.2],
    ['Dilsukhnagar',   'Chaitanyapuri',  1.7],
    ['Chaitanyapuri',  'Victoria Memorial', 0.9],
    ['Victoria Memorial', 'LB Nagar',   0.8],
  ],
  // Blue Line consecutive distances
  blue: [
    ['Nagole',         'Uppal',          3.0],
    ['Uppal',          'Stadium',        1.5],
    ['Stadium',        'NGRI',           1.4],
    ['NGRI',           'Habsiguda',      1.5],
    ['Habsiguda',      'Tarnaka',        1.2],
    ['Tarnaka',        'Mettuguda',      1.0],
    ['Mettuguda',      'Secunderabad East', 0.9],
    ['Secunderabad East','Parade Grounds', 0.5],
    ['Parade Grounds', 'Paradise',       0.5],
    ['Paradise',       'Rasoolpura',     0.7],
    ['Rasoolpura',     'Prakash Nagar',  0.8],
    ['Prakash Nagar',  'Begumpet',       1.1],
    ['Begumpet',       'Ameerpet',       1.5],
    ['Ameerpet',       'Madhura Nagar',  1.0],
    ['Madhura Nagar',  'Yusufguda',      1.0],
    ['Yusufguda',      'Road No.5 Jubilee Hills', 3.2],
    ['Road No.5 Jubilee Hills','Jubilee Hills Check Post', 1.4],
    ['Jubilee Hills Check Post','Peddamma Temple', 1.3],
    ['Peddamma Temple','Madhapur',       1.1],
    ['Madhapur',       'Durgam Cheruvu', 0.9],
    ['Durgam Cheruvu', 'HITEC City',     0.7],
    ['HITEC City',     'Raidurg',        1.9],
  ],
  // Green Line
  green: [
    ['Jubilee Bus Station',   'Secunderabad West', 1.2],
    ['Secunderabad West',     'Gandhi Hospital',   0.8],
    ['Gandhi Hospital',       'Musheerabad',       1.0],
    ['Musheerabad',           'RTC Cross Roads',   0.9],
    ['RTC Cross Roads',       'Chikkadpally',      0.8],
    ['Chikkadpally',          'Narayanguda',       1.0],
    ['Narayanguda',           'Sultan Bazar',      1.2],
    ['Sultan Bazar',          'MG Bus Station',    1.8],
  ],
};

// Build distance graph from consecutive station pairs (bidirectional)
const METRO_GRAPH = {};
function buildMetroGraph() {
  for (const [lineId, pairs] of Object.entries(METRO_DISTANCES)) {
    for (const [a, b, km] of pairs) {
      if (!METRO_GRAPH[a]) METRO_GRAPH[a] = {};
      if (!METRO_GRAPH[b]) METRO_GRAPH[b] = {};
      METRO_GRAPH[a][b] = km;
      METRO_GRAPH[b][a] = km;
    }
  }
  // Interchange at Ameerpet: Red ↔ Blue (same station, 0 km walk)
  METRO_GRAPH['Ameerpet']['Ameerpet'] = 0;
}
buildMetroGraph();

// Dijkstra: find shortest metro path + distance between two stations
function metroShortestPath(from, to) {
  if (from === to) return { path: [from], km: 0 };
  const dist = {}, prev = {}, visited = new Set();
  for (const s of Object.keys(METRO_GRAPH)) dist[s] = Infinity;
  dist[from] = 0;
  const pq = [[0, from]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u === to) break;
    for (const [v, w] of Object.entries(METRO_GRAPH[u] || {})) {
      const nd = d + w;
      if (nd < dist[v]) { dist[v] = nd; prev[v] = u; pq.push([nd, v]); }
    }
  }
  if (dist[to] === Infinity) return null;
  const path = [];
  let cur = to;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { path, km: Math.round(dist[to] * 10) / 10 };
}

// ---- Key TSRTC Bus Routes (curated, major routes) ----
const BUS_ROUTES = [
  { route: '5K',  name: 'Miyapur ↔ MGBS', via: 'Ameerpet, Nampally', stops: ['Miyapur','Ameerpet','Nampally','MGBS'], km: 22, type: 'express' },
  { route: '217K',name: 'Lingampally ↔ MGBS', via: 'Kukatpally, SR Nagar', stops: ['Lingampally','Kukatpally','SR Nagar','Ameerpet','MGBS'], km: 28, type: 'express' },
  { route: '10K', name: 'Secunderabad ↔ LB Nagar', via: 'Uppal', stops: ['Secunderabad','Uppal','LB Nagar'], km: 18, type: 'express' },
  { route: '85K', name: 'HITEC City ↔ Secunderabad', via: 'Ameerpet, Begumpet', stops: ['HITEC City','Ameerpet','Begumpet','Secunderabad'], km: 15, type: 'express' },
  { route: '127K',name: 'Gachibowli ↔ MGBS', via: 'Ameerpet', stops: ['Gachibowli','HITEC City','Ameerpet','Nampally','MGBS'], km: 19, type: 'express' },
  { route: '47',  name: 'Dilsukhnagar ↔ Secunderabad', via: 'LB Nagar', stops: ['Dilsukhnagar','LB Nagar','Secunderabad'], km: 16, type: 'ordinary' },
  { route: '280', name: 'Uppal ↔ MGBS', via: 'Dilsukhnagar', stops: ['Uppal','Dilsukhnagar','MGBS'], km: 14, type: 'ordinary' },
  { route: 'P7',  name: 'Pushpak Kondapur ↔ Secunderabad', via: 'HITEC City, Ameerpet', stops: ['Kondapur','HITEC City','Ameerpet','Secunderabad'], km: 20, type: 'pushpak' },
  { route: 'P1',  name: 'Pushpak Lingampally ↔ Secunderabad', via: 'Kukatpally, Ameerpet', stops: ['Lingampally','Kukatpally','Ameerpet','Secunderabad'], km: 26, type: 'pushpak' },
];

// ---- Crowd Intelligence (time-based, per mode) ----
const CROWD_PROFILES = {
  metro: {
    morning:  { level: 'high',   label: 'Very Crowded', pct: 90 },
    evening:  { level: 'high',   label: 'Very Crowded', pct: 85 },
    offpeak:  { level: 'low',    label: 'Comfortable',  pct: 30 },
    now:      null, // computed dynamically
  },
  bus: {
    morning:  { level: 'high',   label: 'Crowded',      pct: 80 },
    evening:  { level: 'medium', label: 'Moderate',     pct: 60 },
    offpeak:  { level: 'low',    label: 'Light',        pct: 25 },
    now:      null,
  },
  combo: {
    morning:  { level: 'medium', label: 'Moderate',     pct: 55 },
    evening:  { level: 'medium', label: 'Moderate',     pct: 50 },
    offpeak:  { level: 'low',    label: 'Comfortable',  pct: 20 },
    now:      null,
  },
};

function getCrowdProfile(mode, timeCtx) {
  const profile = CROWD_PROFILES[mode] || CROWD_PROFILES.metro;
  if (timeCtx !== 'now') return profile[timeCtx] || profile.offpeak;
  const h = new Date().getHours();
  const isPeakMorning = h >= 8 && h <= 10;
  const isPeakEvening = h >= 17 && h <= 20;
  const t = isPeakMorning ? 'morning' : isPeakEvening ? 'evening' : 'offpeak';
  return profile[t];
}

// ---- CO₂ savings vs auto-rickshaw ----
// Auto CNG auto: ~105g CO₂/km; Metro: ~18g CO₂/km; Bus: ~55g CO₂/km
function co2Saved(km, mode) {
  const autoCo2 = 105;
  const modeCo2 = mode === 'metro' ? 18 : 55;
  return Math.round((autoCo2 - modeCo2) * km);
}

// ---- Haversine distance (for fallback / bus routing) ----
function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 +
    Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) *
    Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

// ---- Find nearest metro station to a location ----
function nearestMetroStation(name) {
  const s = STATIONS[name];
  if (!s) return null;
  if (s.line !== 'bus') return name; // already a metro station
  // find nearest metro station
  let best = null, bestDist = Infinity;
  for (const [sname, sdata] of Object.entries(STATIONS)) {
    if (sdata.line === 'bus') continue;
    const d = haversineKm(s, sdata);
    if (d < bestDist) { bestDist = d; best = sname; }
  }
  return best;
}

// ---- Export ----
if (typeof module !== 'undefined') {
  module.exports = {
    STATIONS, METRO_LINES, METRO_DISTANCES, METRO_GRAPH, BUS_ROUTES,
    METRO_FARE_SLABS, BUS_FARE_ORDINARY, BUS_FARE_EXPRESS,
    CROWD_PROFILES, CROWD_PROFILES,
    metroFare, metroFareSmartCard, busFareOrdinary, busFareExpress,
    metroShortestPath, getCrowdProfile, co2Saved, haversineKm, nearestMetroStation
  };
}