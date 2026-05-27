const icons = {
  dashboard: '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  today: '<svg viewBox="0 0 24 24"><path d="M9 5h6"/><path d="M9 3h6v4H9z"/><path d="M6 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"/><path d="m9 14 2 2 4-4"/></svg>',
  irrigation: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/></svg>',
  fertigation: '<svg viewBox="0 0 24 24"><path d="M12 21V9"/><path d="M12 9c-4 0-7-2.5-7-6 4 0 7 2.5 7 6Z"/><path d="M12 13c4 0 7-2.5 7-6-4 0-7 2.5-7 6Z"/></svg>',
  pest: '<svg viewBox="0 0 24 24"><path d="M8 7a4 4 0 0 1 8 0"/><path d="M7 10h10"/><path d="M7 10v5a5 5 0 0 0 10 0v-5"/><path d="M4 13h3"/><path d="M17 13h3"/><path d="M5 19l3-2"/><path d="m19 19-3-2"/></svg>',
  labor: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  stock: '<svg viewBox="0 0 24 24"><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
  harvest: '<svg viewBox="0 0 24 24"><path d="M7 20h10"/><path d="M12 20V8"/><path d="M12 8c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 12c3 0 5-2 5-5-3 0-5 2-5 5Z"/></svg>',
  equipment: '<svg viewBox="0 0 24 24"><path d="M3 14h11l3 4h4"/><path d="M5 14V8h7l3 6"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  structure: '<svg viewBox="0 0 24 24"><path d="M3 6h6v6H3z"/><path d="M15 3h6v6h-6z"/><path d="M15 15h6v6h-6z"/><path d="M9 9h3a3 3 0 0 0 3-3"/><path d="M9 9h3a3 3 0 0 1 3 3v3"/></svg>',
  planning: '<svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="m8 15 2 2 5-5"/></svg>',
  exceptions: '<svg viewBox="0 0 24 24"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
  workorders: '<svg viewBox="0 0 24 24"><path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="m3 6 1 1 2-2"/><path d="m3 12 1 1 2-2"/><path d="m3 18 1 1 2-2"/></svg>',
  approvals: '<svg viewBox="0 0 24 24"><path d="M12 3 4 7v6c0 5 3.4 7.6 8 8 4.6-.4 8-3 8-8V7l-8-4Z"/><path d="m8.5 12.5 2 2 5-5"/></svg>',
  costs: '<svg viewBox="0 0 24 24"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3-4 3 2 5-7"/><path d="M18 7h1v1"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="m17 11 2 2 4-4"/></svg>',
  sync: '<svg viewBox="0 0 24 24"><path d="M20 16.2A4.5 4.5 0 0 0 17 8h-1.3A6 6 0 1 0 4 10.5"/><path d="M8 17h8"/><path d="m13 14 3 3-3 3"/><path d="M16 7l-4 4-2-2"/></svg>',
  reports: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M8 17V9"/><path d="M13 17V5"/><path d="M18 17v-6"/></svg>',
  admin: '<svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.88.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.88-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.2.38.55.64.95.74.22.06.43.08.65.08h.1a2 2 0 1 1 0 4H21c-.57 0-1.14.24-1.6.68Z"/></svg>',
  map: '<svg class="inline-icon" viewBox="0 0 24 24"><path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  check: '<svg class="inline-icon" viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg>',
  camera: '<svg class="inline-icon" viewBox="0 0 24 24"><path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z"/><circle cx="12" cy="13" r="3"/></svg>',
  save: '<svg class="inline-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>'
};

const navItems = [
  ["dashboard", "Dashboard"],
  ["today", "Today's Work"],
  ["planning", "Work Plan"],
  ["structure", "Farm Structure"],
  ["irrigation", "Irrigation"],
  ["fertigation", "Fertigation"],
  ["pest", "Pest / Disease"],
  ["exceptions", "Tree Issues"],
  ["labor", "Labor"],
  ["stock", "Stock"],
  ["harvest", "Harvest"],
  ["equipment", "Equipment"],
  ["workorders", "Work Orders"],
  ["approvals", "Input Approval"],
  ["costs", "Block Costs"],
  ["reports", "Reports"],
  ["users", "Users & Roles"],
  ["sync", "Sync & Backup"],
  ["admin", "Admin"]
];

const pageTitles = {
  dashboard: "Farm Operations Dashboard",
  today: "Today's Work Entry",
  planning: "Today And Weekly Work Plan",
  structure: "Farm Land Structure",
  irrigation: "Irrigation Entry",
  fertigation: "Fertigation Entry",
  pest: "Pest / Disease Observation",
  exceptions: "Tree-level Exception Tracking",
  labor: "Labor Attendance & Activity",
  stock: "Stock Purchase & Usage",
  harvest: "Harvest Batch Tracking",
  equipment: "Equipment & Utility Tracking",
  workorders: "Work Order Planning",
  approvals: "Input Usage Approval",
  costs: "Block-wise Cost Center",
  reports: "Reports & Analytics",
  users: "Users, Roles, And Block Access",
  sync: "Offline Sync And Cloud Backup",
  admin: "Farm Setup & Admin"
};

const zones = ["South Block", "North West Block", "Equipment Yard", "Stock Yard", "East Block"];
const blocks = ["South Block", "North West Block", "Equipment Yard", "Stock Yard", "East Block"];
const plots = ["Plot A1", "Plot A2", "Plot B1", "Plot C1", "Plot D1", "Plot E1"];
const rows = ["Row 1-5", "Row 6-10", "Row 11-15", "Row 16-20", "Full Block"];
const treeTypes = ["Water Coconut", "Nilembu Timber", "Alphonso Mango", "Teak", "Lemon"];
const farmProperties = [
  ["Tree", "Water Coconut", ""],
  ["Tree", "Nilembu Timber", ""],
  ["Tree", "Alphonso Mango", ""],
  ["Equipment", "Tractor", "3"],
  ["Equipment", "JCB", "1"],
  ["Equipment", "Water Tank", "6"],
  ["Equipment", "Trailer", "4"]
];
const farmPropertyTypes = [...new Set(farmProperties.map(([type]) => type))];
const farmPropertyNames = [...new Set(farmProperties.map(([, name]) => name))];
const treePropertyNames = [...new Set(farmProperties.filter(([type]) => type === "Tree").map(([, name]) => name))];
const lastIrrigationDates = {
  "South Block|Row 1-5": "May 22, 2026",
  "South Block|Row 6-10": "May 21, 2026",
  "South Block|Row 11-15": "May 20, 2026",
  "South Block|Row 16-20": "May 19, 2026",
  "South Block|Full Block": "May 22, 2026",
  "North West Block|Row 1-5": "May 23, 2026",
  "North West Block|Row 6-10": "May 21, 2026",
  "East Block|Full Block": "May 18, 2026",
  "Equipment Yard|Full Block": "May 20, 2026"
};
const lastFertigationDates = {
  "South Block|Row 1-5": "May 18, 2026",
  "South Block|Row 6-10": "May 17, 2026",
  "South Block|Row 11-15": "May 16, 2026",
  "South Block|Row 16-20": "May 15, 2026",
  "South Block|Full Block": "May 18, 2026",
  "North West Block|Row 1-5": "May 19, 2026",
  "North West Block|Row 6-10": "May 17, 2026",
  "East Block|Full Block": "May 14, 2026",
  "Equipment Yard|Full Block": "May 15, 2026"
};
let active = "dashboard";
let selectedWorkPlanDate = "2026-05-24";
let selectedWorkPlanActivityIndex = 0;
let workPlanPanelMode = "add";
let structureSubmenu = "land";
let selectedLandBlock = "South Block";
const workPlanStatuses = ["Open", "In Progress", "Cancelled", "Hold", "Completed"];

const landLayoutBlocks = [
  { name: "South Block", acres: "28", rows: 18, status: "Active", note: "Primary coconut area" },
  { name: "North West Block", acres: "22", rows: 14, status: "Active", note: "Timber and mixed trees" },
  { name: "Equipment Yard", acres: "3", rows: 0, status: "Active", note: "Tractors, JCB, trailers, tanks" },
  { name: "Stock Yard", acres: "2", rows: 0, status: "Active", note: "Fertilizer, chemicals, spares, and stock storage" },
  { name: "East Block", acres: "35", rows: 24, status: "Active", note: "Irrigation priority area" }
];

const landLayoutRows = {
  "South Block": [
    ["Row 1", "Active"],
    ["Row 2", "Active"],
    ["Row 3", "Active"],
    ["Custom nursery row", "Hold"]
  ],
  "North West Block": [
    ["Row 1", "Active"],
    ["Row 2", "Active"],
    ["Windbreak row", "Active"]
  ],
  "Equipment Yard": [
    ["Service lane", "Active"],
    ["Storage row", "Active"]
  ],
  "Stock Yard": [
    ["Input storage lane", "Active"],
    ["Dispatch lane", "Active"]
  ],
  "East Block": [
    ["Row 1", "Active"],
    ["Row 2", "Active"],
    ["Row 3", "Active"]
  ]
};

const workPlanActivities = {
  "2026-05-22": [
    ["6:15 AM", "Irrigation", "South Block rows 1-10", "Bore Motor 2", "Completed", "May 22, 2026", "Farm Manager"],
    ["10:30 AM", "Drip repair", "North West Block rows 8-12", "Ramesh", "Completed", "May 22, 2026", "Supervisor 1"]
  ],
  "2026-05-23": [
    ["7:00 AM", "Fertigation", "North West Block full block", "Stock person", "Completed", "May 23, 2026", "Stock person"],
    ["2:30 PM", "Equipment service", "Tractor 2", "Mechanic", "Open", "-", "-"]
  ],
  "2026-05-24": [
    ["6:00 AM", "Irrigation", "South Block rows 1-20", "Bore Motor 2", "Completed", "May 24, 2026", "Farm Manager"],
    ["9:00 AM", "Labor", "East Block weeding", "Team 1", "In Progress", "May 24, 2026", "Supervisor 1"],
    ["2:00 PM", "Pest treatment", "East Block row 12", "Supervisor 2", "Open", "-", "-"]
  ],
  "2026-05-25": [
    ["6:30 AM", "Fertigation", "South Block full block", "Stock person", "Open", "-", "-"],
    ["11:00 AM", "Drip repair", "North West Block rows 10-15", "Ramesh", "Hold", "May 25, 2026", "Farm Manager"],
    ["3:00 PM", "Harvest prep", "South Block rows 1-8", "Supervisor 1", "Open", "-", "-"]
  ],
  "2026-05-26": [
    ["7:15 AM", "Irrigation", "East Block full block", "Bore Motor 1", "Open", "-", "-"],
    ["1:00 PM", "Pest observation", "East Block rows 10-14", "Supervisor 2", "Open", "-", "-"]
  ],
  "2026-05-27": [
    ["8:00 AM", "Labor", "North West Block pruning", "Team 2", "Open", "-", "-"],
    ["4:00 PM", "Stock check", "Fertilizer store", "Stock person", "Open", "-", "-"]
  ]
};

function pill(text, tone = "info") {
  return `<span class="pill ${tone}">${text}</span>`;
}

function statusTone(status) {
  return {
    Open: "violet",
    "In Progress": "info",
    Cancelled: "bad",
    Hold: "warn",
    Completed: "good"
  }[status] || "info";
}

function statusPill(status) {
  return pill(status, statusTone(status));
}

function card(content, extra = "") {
  return `<article class="card ${extra}">${content}</article>`;
}

function field(label, type = "text", options = null, placeholder = "Enter value") {
  const control = options
    ? `<select>${options.map((option) => `<option>${option}</option>`).join("")}</select>`
    : `<input type="${type}" placeholder="${placeholder}" />`;
  return `<label class="field"><span>${label}</span>${control}</label>`;
}

function fieldWithDefault(label, options, selectedValue) {
  return `
    <label class="field">
      <span>${label}</span>
      <select>${options.map((option) => `<option ${option === selectedValue ? "selected" : ""}>${option}</option>`).join("")}</select>
    </label>
  `;
}

function textFieldWithValue(label, value, id = "") {
  return `
    <label class="field">
      <span>${label}</span>
      <input ${id ? `id="${id}"` : ""} type="text" value="${value}" />
    </label>
  `;
}

function dateFieldWithValue(label, value, id = "") {
  return `
    <label class="field">
      <span>${label}</span>
      <input ${id ? `id="${id}"` : ""} type="date" value="${value}" />
    </label>
  `;
}

function dateValueFromDisplay(value, fallback) {
  if (!value || value === "-") return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return dateKeyFromDate(parsed);
}

function selectField(label, id, options) {
  return `
    <label class="field">
      <span>${label}</span>
      <select id="${id}">${options.map((option) => `<option>${option}</option>`).join("")}</select>
    </label>
  `;
}

function dateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDateKey(dateKey, dayOffset) {
  const date = dateFromKey(dateKey);
  date.setDate(date.getDate() + dayOffset);
  return dateKeyFromDate(date);
}

function formatWorkPlanDate(dateKey) {
  return dateFromKey(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function entryPanel(title, fields, buttonLabel = "Save", showPhoto = false) {
  const controls = fields.map(([label, type = "text", options = null, placeholder = "Enter value"]) => {
    return field(label, type, options, placeholder);
  }).join("");

  return card(`
    <div class="section-head"><h2>${title}</h2>${pill("Data entry", "info")}</div>
    <div class="grid">${controls}</div>
    <div class="form-actions">
      <button class="button primary">${icons.save} ${buttonLabel}</button>
      ${showPhoto ? `<button class="button secondary">${icons.camera} Add Photo</button>` : ""}
    </div>
  `, "entry-panel");
}

function renderNav() {
  const nav = document.querySelector("#nav");
  nav.innerHTML = navItems
    .map(([id, label]) => `
      <button class="nav-button ${active === id ? "active" : ""}" data-route="${id}">
        <span class="nav-icon">${icons[id]}</span>
        <span>${label}</span>
      </button>
    `)
    .join("");
}

function setActive(route) {
  active = route;
  document.querySelector("#page-title").textContent = pageTitles[route];
  renderNav();
  renderContent();
}

function dashboard() {
  const kpis = [
    ["Active Trees", "18,420", "Water Coconut, Nilembu Timber, Mango", "good"],
    ["Farm Properties", "14", "Tractors, JCB, tanks, trailers", "info"],
    ["Blocks / Plots", "5 / 17", "Farm -> Block -> Plot -> Rows", "violet"],
    ["Today Labor Cost", "Rs 18,600", "32 workers", "info"],
    ["Fertilizer Stock", "Low", "19-19-19 below limit", "warn"],
    ["Pest Alerts", "3 Open", "1 high severity", "bad"],
    ["Irrigation", "72%", "East Block pending", "warn"],
    ["Work Orders", "18 Open", "6 due today", "violet"],
    ["Input Approvals", "5 Waiting", "Fertilizer issue queue", "warn"],
    ["Cost / Acre", "Rs 4,820", "Month to date", "info"],
    ["Equipment Service", "2 Due", "Bore motor, tractor", "violet"]
  ];

  const zoneCards = blocks.map((zone, index) => {
    const tone = index === 4 ? "bad" : index === 2 ? "warn" : "good";
    const status = index === 4 ? "Pest risk" : index === 2 ? "Water pending" : "Healthy";
    return `<button class="zone-card ${tone} clickable" data-route="today">
      ${icons.map}
      <h3>${zone}</h3>
      <p>25 acres</p>
      <div class="zone-status">${status}</div>
    </button>`;
  }).join("");

  const alerts = [
    "High pest severity in East Block Row 12",
    "Bore Motor 1 service due",
    "19-19-19 stock below 50 kg",
    "No irrigation entry for East Block"
  ].map((alert) => `<div class="alert-item"><span class="alert-symbol">!</span><span>${alert}</span></div>`).join("");

  return `
    <div class="grid grid-3">
      ${kpis.map(([label, value, sub, tone]) => card(`
        <div class="section-head">
          <div>
            <div class="kpi-label">${label}</div>
            <div class="kpi-value">${value}</div>
            <div class="kpi-sub">${sub}</div>
          </div>
          ${pill(tone === "good" ? "Good" : tone === "bad" ? "Action" : "Review", tone)}
        </div>
      `)).join("")}
    </div>
    <div class="grid grid-3" style="margin-top:14px">
      ${card(`
        <div class="section-head">
          <h2>Block Health View</h2>
          ${pill("Tap block", "info")}
        </div>
        <div class="grid grid-5">${zoneCards}</div>
      `, "wide")}
      ${card(`
        <div class="section-head"><h2>Today's Alerts</h2></div>
        <div class="alert-list">${alerts}</div>
      `)}
    </div>
    <div class="grid grid-3" style="margin-top:14px">
      ${card(`
        <div class="section-head"><h2>Management Focus</h2>${pill("125-acre controls", "violet")}</div>
        <div class="mini-metric-list">
          <button data-route="structure"><strong>Land hierarchy</strong><span>Master Farm, blocks, rows, layout mapping</span></button>
          <button data-route="planning"><strong>Work planning</strong><span>Today, this week, pending repairs, schedules</span></button>
          <button data-route="workorders"><strong>Pending field work</strong><span>Drip repair, pest spray, pruning, harvest prep</span></button>
          <button data-route="exceptions"><strong>Tree exceptions</strong><span>Mortality, disease, replanting, fallen tree</span></button>
          <button data-route="approvals"><strong>Input issue control</strong><span>Plan, issue, confirm, then reduce stock</span></button>
          <button data-route="costs"><strong>Block profitability</strong><span>Labor, fertilizer, utility, harvest cost by block</span></button>
        </div>
      `)}
      ${card(`
        <div class="section-head"><h2>Harvest Pipeline</h2>${pill("Batch-wise", "good")}</div>
        <div class="report-metric"><span class="small-label">Next batch</span><strong>HB-2026-07-SouthBlock</strong></div>
        <div class="report-metric compact"><span class="small-label">Expected quantity</span><strong>2,500 kg</strong></div>
      `)}
      ${card(`
        <div class="section-head"><h2>Cost Alerts</h2>${pill("Review", "warn")}</div>
        <div class="alert-list">
          <div class="alert-item"><span class="alert-symbol">!</span><span>East Block labor cost is 14% above monthly plan</span></div>
          <div class="alert-item"><span class="alert-symbol">!</span><span>Tractor maintenance cost crossed Rs 22,000</span></div>
        </div>
      `)}
    </div>
  `;
}

function today() {
  const actions = [
    ["irrigation", "Irrigation", "Record block and row water activity"],
    ["planning", "Today's Plan", "Irrigation, labor, repair, stock, and harvest schedule"],
    ["fertigation", "Fertigation", "Use fertilizer and reduce stock"],
    ["pest", "Pest Observation", "Capture issue with photo"],
    ["exceptions", "Tree Issue", "Mortality, disease, fallen tree, or replanting"],
    ["labor", "Labor Attendance", "Worker activity and cost"],
    ["stock", "Stock Purchase", "Add fertilizer or diesel stock"],
    ["equipment", "Equipment Usage", "Motor, tractor, and utility activity"],
    ["workorders", "Work Order", "Assign drip, pest, harvest, or maintenance work"],
    ["approvals", "Input Issue", "Approve and confirm fertilizer or chemical use"],
    ["harvest", "Harvest Batch", "Create estimated or actual harvest batch"]
  ];

  const rowsHtml = [
    ["7:15 AM", "Irrigation", "South Block", pill("Saved", "good"), "Manager"],
    ["9:20 AM", "Labor", "All Blocks", pill("Saved", "good"), "Supervisor"],
    ["11:45 AM", "Pest", "East Block", pill("Follow-up", "warn"), "Manager"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="grid grid-3">
      ${actions.map(([id, name, desc]) => `
        <article class="card clickable" data-route="${id}">
        <div class="action-card">
          <div class="icon-box">${icons[id]}</div>
          <div><strong>${name}</strong><span>${desc}</span></div>
          <span class="chevron">&rsaquo;</span>
        </div>
        </article>
      `).join("")}
    </div>
    ${card(`
      <div class="section-head"><h2>Today's Saved Entries</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Time</th><th>Activity</th><th>Block</th><th>Status</th><th>Entered by</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `, "entry-table-card")}
  `;
}

function entryForm(type) {
  const configs = {
    irrigation: ["Add Irrigation Entry", ["Water Source", "Motor Used", "Start Time", "End Time", "Drip Condition"]],
    fertigation: ["Add Fertigation Entry", ["Fertilizer Type", "Fertilizer Name", "Quantity Used", "Unit", "Application Method"]],
    pest: ["Add Pest / Disease Observation", ["Tree Type", "Name", "Pest / Disease", "Severity", "Affected Tree Count", "Follow-up Date"]],
    labor: ["Add Labor Activity", ["Worker Name", "Worker Type", "Activity Performed", "Work Hours", "Daily Cost"]],
    stock: ["Add Stock Transaction", ["Transaction Type", "Item Category", "Item Name", "Quantity", "Cost"]],
    harvest: ["Add Harvest Batch", ["Batch Code", "Crop Family", "Crop Type", "Quantity Kg", "Labor Cost", "Transport Cost", "Buyer"]],
    equipment: ["Add Equipment Activity", ["Equipment Type", "Activity", "Running Hours", "Service Type", "Maintenance Cost"]]
  };

  const [title, fields] = configs[type];
  const blockOptions = landLayoutBlocks.map((block) => block.name);
  const rowOptions = rows;
  const extraFields = fields.map((name, index) => {
    const options = name.includes("Severity")
      ? ["Low", "Medium", "High"]
      : name === "Tree Type"
        ? ["Tree"]
      : name === "Name"
        ? treePropertyNames
      : name.includes("Type") || name.includes("Method") || name.includes("Source")
        ? ["Select", "Option 1", "Option 2", "Option 3"]
        : null;
    return field(name, "text", options, index % 2 === 0 ? "Select or enter value" : "Enter value");
  }).join("");

  const rules = [
    "Date and user are auto captured.",
    "Labor can add only; manager can approve or edit.",
    "Changes create audit history.",
    "Offline entries sync later."
  ].map((rule) => `<div class="rule-item">${icons.check}<span>${rule}</span></div>`).join("");

  const usesBlockLocation = ["irrigation", "fertigation", "pest"].includes(type);
  const locationFields = type === "irrigation" || type === "fertigation"
    ? `${selectField("Block", `${type}-zone`, blockOptions)}${selectField("Row / Row Range", `${type}-row`, rowOptions)}`
    : usesBlockLocation
      ? `${field("Block", "text", blockOptions)}${field("Row / Row Range", "text", rowOptions)}`
      : `${field("Block", "text", zones)}${field("Row / Row Range", "text", rows)}`;

  const detailPanel = type === "irrigation" || type === "fertigation"
    ? `
      <div class="section-head"><h2>${type === "irrigation" ? "Irrigation" : "Fertigation"} Lookup</h2>${pill("Auto pulled", "info")}</div>
      <div class="report-metric">
        <span class="small-label">Last ${type} for selected block and rows</span>
        <strong id="last-${type}-date">Select block and row</strong>
        <div id="last-${type}-context" class="kpi-sub">South Block / Row 1-5</div>
      </div>
      <div class="rule-list" style="margin-top:10px">${rules}</div>
    `
    : `<div class="section-head"><h2>Form Rules</h2></div><div class="rule-list">${rules}</div>`;

  return `
    <div class="form-layout">
      ${card(`
        <div class="form-title">
          <div class="icon-box">${icons[type]}</div>
          <div><h2>${title}</h2><p>Quick field entry with minimum typing.</p></div>
        </div>
        <div class="grid grid-2">
          ${field("Date", "date")}
          ${locationFields}
          ${extraFields}
          <label class="field wide"><span>Remarks</span><textarea placeholder="Optional notes"></textarea></label>
        </div>
        <div class="form-actions">
          <button class="button primary">${icons.save} Save Entry</button>
          <button class="button secondary">${icons.camera} Add Photo</button>
        </div>
      `)}
      ${card(`
        ${detailPanel}
      `)}
    </div>
  `;
}

function structure() {
  const levels = [
    ["Master Farm", "Top-level farm record", "125 acres total"],
    ["Block", "Custom land area under the farm", "South Block, North West Block, Equipment Yard, Stock Yard"],
    ["Rows", "Rows or custom lanes under a block", "Row 1, Row 2, Service lane"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  const farmBlockRows = [
    ["125 Acre Farm", "Block A", "20 acres", "Active"],
    ["125 Acre Farm", "Block B", "15 acres", "Active"],
    ["125 Acre Farm", "Block C", "25 acres", "Active"],
    ["125 Acre Farm", "Block D", "30 acres", "Active"],
    ["125 Acre Farm", "Block E", "35 acres", "Active"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}<td><button class="mini-button">Update</button> <button class="mini-button">Remove</button></td></tr>`).join("");

  const blockPlotRows = [
    ["Block A", "Plot A1", "5 acres", "Water Coconut"],
    ["Block A", "Plot A2", "5 acres", "Water Coconut"],
    ["Block B", "Plot B1", "5 acres", "Nilembu Timber"],
    ["Block C", "Plot C1", "6 acres", "Alphonso Mango"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}<td><button class="mini-button">Update</button> <button class="mini-button">Remove</button></td></tr>`).join("");

  const plotRowRows = [
    ["Plot A1", "Row 1-5", "Water Coconut", "2,100"],
    ["Plot A1", "Row 6-10", "Water Coconut", "2,050"],
    ["Plot B1", "Row 1-8", "Nilembu Timber", "1,900"],
    ["Plot C1", "Row 1-12", "Alphonso Mango", "2,450"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}<td><button class="mini-button">Update</button> <button class="mini-button">Remove</button></td></tr>`).join("");

  const blockRows = [
    ["Block A", "20 acres", "Plot A1-A4", "Rows 1-20", "Water Coconut", "8,400"],
    ["Block B", "15 acres", "Plot B1-B3", "Rows 1-16", "Nilembu Timber", "4,250"],
    ["Block C", "25 acres", "Plot C1-C5", "Rows 1-24", "Alphonso Mango", "5,770"],
    ["Block D", "30 acres", "Plot D1-D6", "Rows 1-30", "Water Coconut", "6,100"],
    ["Block E", "35 acres", "Plot E1-E7", "Rows 1-34", "Mixed trees", "7,900"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  const propertyRows = farmProperties
    .map((row) => `<tr>${row.map((cell) => `<td>${cell || "-"}</td>`).join("")}<td><button class="mini-button">Remove</button></td></tr>`)
    .join("");

  const treeRows = [
    ["Tree", "Water Coconut", "All Blocks", "All Rows", "14,500"],
    ["Tree", "Water Coconut", "South Block", "Row 1-3", "1,265"],
    ["Tree", "Nilembu Timber", "North West Block", "Row 1-2", "515"],
    ["Tree", "Alphonso Mango", "East Block", "Row 1-2", "595"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  const selectedBlock = landLayoutBlocks.find((block) => block.name === selectedLandBlock) || landLayoutBlocks[0];
  const blockCards = landLayoutBlocks.map((block) => `
    <button class="land-block-card ${block.name === selectedBlock.name ? "active" : ""}" data-land-block="${block.name}">
      <strong>${block.name}</strong>
      <span>${block.acres} acres • ${block.rows} rows</span>
      <small>${block.note}</small>
    </button>
  `).join("");

  const selectedBlockRows = (landLayoutRows[selectedBlock.name] || [])
    .map((row) => `<tr><td>${selectedBlock.name}</td>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("");

  const submenuItems = [
    ["land", "Land Structure"],
    ["properties", "Farm Property Master"],
    ["trees", "Tree Type Assignment"]
  ].map(([id, label]) => `
    <button class="subnav-button ${structureSubmenu === id ? "active" : ""}" data-structure-submenu="${id}">
      ${label}
    </button>
  `).join("");

  const landPanel = `
    ${card(`
      <div class="section-head"><h2>Land Layout Builder</h2>${pill("Master Farm -> Blocks -> Rows", "info")}</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Level</th><th>Purpose</th><th>Example</th></tr></thead>
          <tbody>${levels}</tbody>
        </table>
      </div>
    `)}
    <div class="land-builder">
      ${card(`
        <div class="section-head">
          <div>
            <h2>Master Farm Blocks</h2>
            <div class="kpi-sub">Create custom blocks like Equipment Yard, Stock Yard, South Block, or North West Block.</div>
          </div>
          ${pill(`${landLayoutBlocks.length} blocks`, "good")}
        </div>
        <div class="master-farm-band">
          <strong>Master Farm</strong>
          <span>125 acres configured into custom blocks</span>
        </div>
        <div class="land-block-list">${blockCards}</div>
        <div class="form-actions">
          <button class="button primary">${icons.save} Add Block</button>
        </div>
      `)}
      ${card(`
        <div class="section-head"><h2>Block Details</h2>${pill(selectedBlock.status, selectedBlock.status === "Active" ? "good" : "warn")}</div>
        <div class="grid grid-2">
          ${textFieldWithValue("Block Name", selectedBlock.name)}
          ${textFieldWithValue("Acres", selectedBlock.acres)}
          ${field("Status", "text", ["Active", "Inactive"])}
          ${textFieldWithValue("Notes", selectedBlock.note)}
        </div>
        <div class="form-actions">
          <button class="button primary">${icons.save} Save Block</button>
          <button class="button secondary">Remove Block</button>
        </div>
      `)}
    </div>
    <div class="land-rows-layout">
      ${card(`
        <div class="section-head">
          <div>
            <h2>Rows mapped to ${selectedBlock.name}</h2>
            <div class="kpi-sub">Every row belongs to exactly one selected block. Add, modify, or delete rows only inside this block.</div>
          </div>
          ${pill(`${selectedBlock.rows} rows`, "violet")}
        </div>
        <div class="grid grid-4">
          ${textFieldWithValue("Selected Block", selectedBlock.name)}
          ${textFieldWithValue("Row Name", "Row 1")}
          ${field("Status", "text", ["Active", "Inactive", "Hold"])}
        </div>
        <div class="form-actions">
          <button class="button primary">${icons.save} Add Row</button>
          <button class="button secondary">Remove Row</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Mapped Block</th><th>Row</th><th>Status</th></tr></thead>
            <tbody>${selectedBlockRows}</tbody>
          </table>
        </div>
      `)}
    </div>
  `;

  const propertyPanel = `
    <div class="form-layout">
      ${card(`
        <div class="section-head"><h2>Farm Property Master</h2>${pill("Configurable", "violet")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Name</th><th>Count</th><th>Action</th></tr></thead>
            <tbody>${propertyRows}</tbody>
          </table>
        </div>
      `)}
      ${entryPanel("Add / Edit Farm Property", [
        ["Property Type", "text", ["Tree", "Equipment"]],
        ["Name", "text", null, "Example: Water Coconut or JCB"],
        ["Count", "number", null, "Required for equipment, optional for tree master"],
        ["Status", "text", ["Active", "Inactive", "Needs service"]]
      ], "Save Property")}
    </div>
  `;

  const treePanel = `
    <div class="form-layout">
      ${card(`
        <div class="section-head"><h2>Tree Type Assignment</h2>${pill("Uses property master", "info")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Name</th><th>Block</th><th>Rows</th><th>Count</th></tr></thead>
            <tbody>${treeRows}</tbody>
          </table>
        </div>
      `)}
      ${entryPanel("Assign Tree Type", [
        ["Type", "text", farmPropertyTypes],
        ["Name", "text", farmPropertyNames],
        ["Block", "text", ["All Blocks", ...landLayoutBlocks.map((block) => block.name)]],
        ["Rows", "text", ["All Rows", ...rows]],
        ["Count", "number", null, "How many trees"]
      ], "Save Assignment")}
    </div>
  `;

  const activePanel = {
    land: landPanel,
    properties: propertyPanel,
    trees: treePanel
  }[structureSubmenu];

  return `
    <div class="grid grid-3">
      ${card(`<div class="kpi-label">Farm Size</div><div class="kpi-value">125 acres</div><div class="kpi-sub">Managed by blocks and rows</div>`)}
      ${card(`<div class="kpi-label">Primary Unit</div><div class="kpi-value">Block</div><div class="kpi-sub">Routine work rolls up by block</div>`)}
      ${card(`<div class="kpi-label">Farm Properties</div><div class="kpi-value">14</div><div class="kpi-sub">Trees, tractors, JCBs, tanks, trailers</div>`)}
    </div>
    <div class="subnav">${submenuItems}</div>
    ${activePanel}
  `;
}

function planning() {
  const planCards = [
    ["Today's irrigation plan", "South Block rows 1-20 complete, East Block pending"],
    ["Today's labor plan", "32 workers across irrigation, weeding, harvest prep"],
    ["Pending drip repair", "North West Block rows 10-15 assigned to Ramesh"],
    ["Pending pest treatment", "East Block row 12 high severity follow-up"],
    ["Fertigation schedule", "South Block tomorrow morning, 19-19-19"],
    ["Harvest schedule", "South Block mango batch on July 15"],
    ["Equipment service due", "Bore Motor 1 and Tractor 2"],
    ["Fertilizer stock low", "19-19-19 below 50 kg reorder level"]
  ].map(([title, desc]) => card(`<h2>${title}</h2><div class="kpi-sub">${desc}</div>`, "clickable")).join("");

  const selectedActivities = workPlanActivities[selectedWorkPlanDate] || [];
  if (selectedWorkPlanActivityIndex >= selectedActivities.length) selectedWorkPlanActivityIndex = 0;
  const selectedActivity = selectedActivities[selectedWorkPlanActivityIndex];
  const schedule = selectedActivities.length
    ? selectedActivities.map((row, index) => `
        <tr class="selectable-row ${index === selectedWorkPlanActivityIndex ? "selected" : ""}" data-work-activity-index="${index}">
          <td>${row[0]}</td>
          <td><strong>${row[1]}</strong></td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${statusPill(row[4])}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="5">No planned activities for this date.</td></tr>`;

  const workPlanDetailPanel = workPlanPanelMode === "detail" && selectedActivity
    ? `
      ${card(`
        <div class="section-head">
          <h2>Activity Details</h2>
          ${pill("Update status", "warn")}
        </div>
        <div class="selected-activity">
          <div class="small-label">Selected activity</div>
          <strong>${selectedActivity[1]}</strong>
          <span>${selectedActivity[0]} - ${selectedActivity[2]} - ${selectedActivity[3]}</span>
        </div>
        <div class="grid grid-2">
          ${textFieldWithValue("Time", selectedActivity[0])}
          ${textFieldWithValue("Activity", selectedActivity[1])}
          ${textFieldWithValue("Area", selectedActivity[2])}
          ${textFieldWithValue("Owner", selectedActivity[3])}
          <label class="field">
            <span>Update Status</span>
            <select id="selected-work-status">
              ${workPlanStatuses.map((status) => `<option ${status === selectedActivity[4] ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          ${dateFieldWithValue("Updated Date", dateValueFromDisplay(selectedActivity[5], selectedWorkPlanDate), "selected-work-updated-date")}
          ${selectField("Updated By", "selected-work-updated-by", ["Farm Manager", "Supervisor 1", "Supervisor 2", "Stock person", "Owner / Admin"])}
        </div>
        <div class="form-actions">
          <button class="button primary" data-save-work-status>${icons.save} Save Update</button>
          <button class="button secondary" data-show-add-plan>Add Planned Work</button>
        </div>
      `, "work-plan-panel")}
    `
    : `
      ${card(`
        <div class="section-head"><h2>Add Planned Work</h2>${pill("Data entry", "info")}</div>
        <div class="grid grid-2">
          ${dateFieldWithValue("Date", selectedWorkPlanDate)}
          ${field("Activity", "text", ["Irrigation", "Labor", "Drip repair", "Pest treatment", "Fertigation", "Harvest", "Equipment service"])}
          ${field("Block", "text", zones)}
          ${field("Rows", "text", rows)}
          ${field("Assigned To", "text", ["Supervisor 1", "Supervisor 2", "Stock person", "Team 1", "Ramesh"])}
          ${field("Priority", "text", ["Low", "Medium", "High"])}
          ${fieldWithDefault("Status", workPlanStatuses, "Open")}
        </div>
        <div class="form-actions">
          <button class="button primary">${icons.save} Save Plan</button>
        </div>
      `, "work-plan-panel")}
    `;

  return `
    <div class="grid grid-4">${planCards}</div>
    <div style="margin-top:14px">
      ${card(`
        <div class="section-head">
          <div>
            <h2>Work Calendar</h2>
            <div class="kpi-sub">${formatWorkPlanDate(selectedWorkPlanDate)}</div>
          </div>
          <button class="button primary" data-show-add-plan>${icons.save} Add Planned Work</button>
        </div>
        <div class="calendar-toolbar">
          <input id="work-plan-date" type="date" value="${selectedWorkPlanDate}" />
          <div class="calendar-nav-buttons">
            <button class="button secondary" data-calendar-nav="-1">Previous</button>
            <button class="button secondary" data-calendar-nav="1">Next</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Time</th><th>Activity</th><th>Area</th><th>Owner</th><th>Status</th></tr></thead>
            <tbody>${schedule}</tbody>
          </table>
        </div>
      `)}
      ${workPlanDetailPanel}
    </div>
  `;
}

function exceptions() {
  const issueRows = [
    ["TE-301", "East Block", "Row 12 / Tree 48", "Disease affected", "High", pill("Work order opened", "bad")],
    ["TE-302", "North West Block", "Row 5 / Tree 17", "Dead tree", "Medium", pill("Replant planned", "warn")],
    ["TE-303", "South Block", "Row 3 / Tree 8", "High-value observation", "Low", pill("Monitor", "info")]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="form-layout">
      ${card(`
        <div class="section-head"><h2>Tree Exception Log</h2>${pill("Not routine entry", "warn")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Block</th><th>Position</th><th>Exception</th><th>Severity</th><th>Status</th></tr></thead>
            <tbody>${issueRows}</tbody>
          </table>
        </div>
      `)}
      ${card(`
        <div class="section-head"><h2>Add Tree Issue</h2></div>
        <div class="grid">
          ${field("Block", "text", landLayoutBlocks.map((block) => block.name))}
          ${field("Row", "text", rows)}
          ${field("Tree Number", "number", null, "Tree position number")}
          ${field("Issue Type", "text", ["Fallen tree", "Dead tree / mortality", "Replanting", "Disease affected", "Special observation", "High-value tree"])}
          ${field("Severity", "text", ["Low", "Medium", "High"])}
        </div>
        <div class="form-actions">
          <button class="button primary">${icons.save} Save Issue</button>
          <button class="button secondary">${icons.camera} Add Photo</button>
        </div>
      `)}
    </div>
  `;
}

function workOrders() {
  const orders = [
    ["WO-1042", "Drip repair", "North West Block", "Rows 10-15", "Ramesh", "Tomorrow", pill("Pending", "warn")],
    ["WO-1043", "Pest spray", "East Block", "Row 12", "Supervisor 2", "Today", pill("In progress", "info")],
    ["WO-1044", "Pruning", "South Block", "Full Block", "Team 1", "Friday", pill("Planned", "violet")]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="grid grid-3">
      ${card(`<div class="kpi-label">Open Work Orders</div><div class="kpi-value">18</div><div class="kpi-sub">6 due today</div>${pill("Review", "warn")}`)}
      ${card(`<div class="kpi-label">Completed This Week</div><div class="kpi-value">42</div><div class="kpi-sub">Drip, weed, pest, pruning</div>${pill("Good", "good")}`)}
      ${card(`<div class="kpi-label">Overdue</div><div class="kpi-value">3</div><div class="kpi-sub">East Block and North West Block</div>${pill("Action", "bad")}`)}
    </div>
    <div class="form-layout" style="margin-top:14px">
      ${card(`
        <div class="section-head"><h2>Work Order Board</h2>${pill("Assign and track", "info")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Type</th><th>Block</th><th>Rows</th><th>Assigned</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>${orders}</tbody>
          </table>
        </div>
      `)}
      ${card(`
        <div class="section-head"><h2>Create Work Order</h2></div>
        <div class="grid">
          ${field("Work Type", "text", ["Drip repair", "Pest spray", "Fertigation", "Tree replacement", "Harvest prep", "Equipment maintenance", "Weed removal", "Pruning"])}
          ${field("Block", "text", zones)}
          ${field("Rows", "text", rows)}
          ${field("Assigned To", "text", ["Ramesh", "Supervisor 1", "Supervisor 2", "Team 1"])}
          ${field("Due Date", "date")}
        </div>
        <div class="form-actions"><button class="button primary">${icons.save} Save Work Order</button></div>
      `)}
    </div>
  `;
}

function approvals() {
  const flow = ["Manager creates usage plan", "Stock person issues input", "Field worker confirms usage", "System reduces stock"];
  const approvalsTable = [
    ["UP-2201", "19-19-19", "South Block", "125 kg", "Issue pending", pill("Waiting", "warn")],
    ["UP-2202", "Neem oil", "East Block", "18 L", "Worker confirmation", pill("Issued", "info")],
    ["UP-2203", "Urea", "North West Block", "80 kg", "Confirmed", pill("Reduce stock", "good")]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="grid grid-4">
      ${flow.map((step, index) => card(`<div class="step-number">${index + 1}</div><h2>${step}</h2><div class="kpi-sub">Controlled inventory movement</div>`)).join("")}
    </div>
    <div class="form-layout" style="margin-top:14px">
      ${card(`
        <div class="section-head"><h2>Input Usage Approval Queue</h2>${pill("No manual stock reduction", "bad")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Plan ID</th><th>Item</th><th>Block</th><th>Quantity</th><th>Current Step</th><th>Status</th></tr></thead>
            <tbody>${approvalsTable}</tbody>
          </table>
        </div>
      `)}
      ${entryPanel("Create Usage Plan", [
        ["Planned For", "date"],
        ["Block", "text", zones],
        ["Inventory Item", "text", ["19-19-19", "Neem oil", "Urea", "Diesel", "Drip spare part"]],
        ["Planned Quantity", "number", null, "Quantity"],
        ["Unit", "text", ["kg", "L", "pieces"]],
        ["Issue To", "text", ["Supervisor 1", "Supervisor 2", "Team 1", "Ramesh"]]
      ], "Submit Plan")}
      </div>
    <div class="grid grid-3" style="margin-top:14px">
      ${card(`<div class="kpi-label">Waiting for Manager</div><div class="kpi-value">5</div><div class="kpi-sub">Usage plan approvals</div>`)}
      ${card(`<div class="kpi-label">Issued Not Confirmed</div><div class="kpi-value">7</div><div class="kpi-sub">Field confirmation pending</div>`)}
      ${card(`<div class="kpi-label">Stock Variance</div><div class="kpi-value">1.8%</div><div class="kpi-sub">Target below 2%</div>`)}
    </div>
  `;
}

function costs() {
  const rowsHtml = [
    ["South Block", "Rs 1,240", "Rs 820", "18.5 hrs", "3.8 tons", pill("Profitable", "good")],
    ["North West Block", "Rs 1,410", "Rs 760", "21.0 hrs", "3.4 tons", pill("Review", "warn")],
    ["Equipment Yard", "Rs 1,180", "Rs 910", "24.3 hrs", "3.1 tons", pill("Water cost", "warn")],
    ["East Block", "Rs 1,620", "Rs 740", "17.2 hrs", "2.9 tons", pill("Labor high", "bad")]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="grid grid-4">
      ${card(`<div class="kpi-label">Cost / Acre</div><div class="kpi-value">Rs 4,820</div><div class="kpi-sub">Month to date</div>`)}
      ${card(`<div class="kpi-label">Labor / Acre</div><div class="kpi-value">Rs 1,360</div><div class="kpi-sub">32 workers average</div>`)}
      ${card(`<div class="kpi-label">Harvest Cost / Kg</div><div class="kpi-value">Rs 6.80</div><div class="kpi-sub">Latest harvest batch</div>`)}
      ${card(`<div class="kpi-label">Maintenance / Equipment</div><div class="kpi-value">Rs 9,400</div><div class="kpi-sub">Monthly average</div>`)}
    </div>
    <div class="form-layout" style="margin-top:14px">
      ${card(`
        <div class="section-head"><h2>Block-wise Cost Center</h2>${pill("Compare profitability", "info")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Block</th><th>Labor / Acre</th><th>Fertilizer / Acre</th><th>Irrigation Hours</th><th>Yield Estimate</th><th>Signal</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `)}
      ${entryPanel("Add Block Cost", [
        ["Date", "date"],
        ["Block", "text", zones],
        ["Cost Category", "text", ["Labor", "Fertilizer", "Chemical", "Drip repair", "Tractor work", "Utility", "Transport"]],
        ["Amount", "number", null, "Cost amount"],
        ["Linked Activity", "text", ["Irrigation", "Fertigation", "Pest", "Labor", "Harvest", "Equipment"]],
        ["Paid By", "text", ["Cash", "Bank", "Credit", "Not paid"]]
      ], "Save Cost")}
      </div>
  `;
}

function reports() {
  const reportCards = [
    ["Daily Summary", "Irrigation missed, labor used, urgent issues"],
    ["Weekly Block Health", "Growth, drip repair, soil moisture, pest trend"],
    ["Monthly Cost", "Fertilizer, labor, utility, mortality, block performance"],
    ["Yearly Productivity", "Yield, cost per acre, mortality, best/worst blocks"]
  ].map(([name, desc]) => card(`
      <div class="icon-box">${icons.reports}</div>
      <h2 style="margin:12px 0 3px;font-size:18px">${name}</h2>
      <div class="kpi-sub">${desc}</div>
    `, "clickable")).join("");

  const questions = [
    "Which blocks were irrigated or missed?",
    "What pest trend needs follow-up?",
    "Which work orders are pending or overdue?",
    "Which block is costly compared with yield?",
    "What stock is low or has variance?",
    "Which equipment service is due?"
  ].map((item) => `<div class="rule-item">${icons.check}<span>${item}</span></div>`).join("");

  const costMetrics = [
    ["Cost per acre", "Rs 4,820", "Farm profitability"],
    ["Labor cost per acre", "Rs 1,360", "Labor efficiency"],
    ["Fertilizer cost per acre", "Rs 822", "Input control"],
    ["Yield per acre", "3.4 tons", "Productivity"],
    ["Mortality percentage", "1.6%", "Plantation health"],
    ["Irrigation hours per acre", "19.8 hrs", "Water usage"],
    ["Maintenance cost per equipment", "Rs 9,400", "Utility efficiency"],
    ["Harvest cost per kg", "Rs 6.80", "Profitability"],
    ["Stock variance", "1.8%", "Leakage and waste control"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="grid grid-4">${reportCards}</div>
    <div class="form-layout" style="margin-top:14px">
      ${card(`
        <div class="section-head"><h2>Management Questions</h2>${pill("Reports answer decisions", "violet")}</div>
        <div class="grid grid-2">${questions}</div>
      `)}
      ${entryPanel("Report Filters / Export", [
        ["Report Type", "text", ["Daily Summary", "Weekly Block Health", "Monthly Cost", "Yearly Productivity"]],
        ["Date From", "date"],
        ["Date To", "date"],
        ["Block", "text", ["All Blocks", ...zones]],
        ["Export Format", "text", ["View Dashboard", "Excel", "PDF"]]
      ], "Generate Report")}
    </div>
    ${card(`
      <div class="section-head"><h2>Cost-focused Metrics</h2>${pill("125-acre KPIs", "info")}</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Metric</th><th>Sample Value</th><th>Why it matters</th></tr></thead>
          <tbody>${costMetrics}</tbody>
        </table>
      </div>
    `)}
    ${card(`
      <div class="section-head"><h2>Sample Owner Report</h2></div>
      <div class="grid grid-3">
        <div class="report-metric"><span class="small-label">Labor Cost / Acre</span><strong>Rs 1,240</strong></div>
        <div class="report-metric"><span class="small-label">Fertilizer Used</span><strong>425 kg</strong></div>
        <div class="report-metric"><span class="small-label">Yield Estimate</span><strong>12.5 tons</strong></div>
      </div>
    `)}
  `;
}

function users() {
  const roles = [
    ["Labor / Field Assistant", "Add daily entries only", "Assigned blocks only"],
    ["Field Supervisor", "Add and review entries", "South Block, North West Block"],
    ["Farm Manager", "Edit entries, approve work completion", "All blocks"],
    ["Store / Stock Person", "Purchase and issue inventory", "Stock module only"],
    ["Owner / Admin", "Full access, delete/cancel, reports", "All blocks and admin"],
    ["Auditor / Consultant", "View-only access", "Reports and records"]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  const assignments = [
    ["Supervisor 1", "Field Supervisor", "South Block, North West Block", pill("Active", "good")],
    ["Supervisor 2", "Field Supervisor", "Equipment Yard, East Block", pill("Active", "good")],
    ["Stock Person", "Store / Stock Person", "Inventory only", pill("Limited", "info")],
    ["Consultant", "Auditor / Consultant", "View only", pill("Read only", "violet")]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="form-layout">
      ${card(`
        <div class="section-head"><h2>Role Access Matrix</h2>${pill("Permission control", "info")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Role</th><th>Access</th><th>Block Scope</th></tr></thead>
            <tbody>${roles}</tbody>
          </table>
        </div>
      `)}
      ${entryPanel("Assign User Access", [
        ["User", "text", ["Supervisor 1", "Supervisor 2", "Stock Person", "Farm Manager", "Consultant"]],
        ["Role", "text", ["Labor / Field Assistant", "Field Supervisor", "Farm Manager", "Store / Stock Person", "Owner / Admin", "Auditor / Consultant"]],
        ["Assigned Blocks", "text", [...zones, "All Blocks", "Inventory only"]],
        ["Status", "text", ["Active", "Inactive", "Read only"]]
      ], "Save Access")}
    </div>
    ${card(`
      <div class="section-head"><h2>User Block Assignment</h2>${pill("Prevents confusion", "good")}</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>User</th><th>Role</th><th>Assigned Area</th><th>Status</th></tr></thead>
          <tbody>${assignments}</tbody>
        </table>
      </div>
    `)}
  `;
}

function syncBackup() {
  const queue = [
    ["Android Tablet 1", "8 entries", "Irrigation, labor", pill("Waiting for internet", "warn")],
    ["iPad Supervisor", "3 entries", "Pest photos", pill("Ready to sync", "info")],
    ["Office Laptop", "0 entries", "Reports exported", pill("Synced", "good")]
  ].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");

  return `
    <div class="grid grid-4">
      ${card(`<div class="step-number">1</div><h2>Tablet / iPad / Laptop</h2><div class="kpi-sub">Field data entry device</div>`)}
      ${card(`<div class="step-number">2</div><h2>Offline Local Storage</h2><div class="kpi-sub">IndexedDB queue when internet is weak</div>`)}
      ${card(`<div class="step-number">3</div><h2>Cloud Sync</h2><div class="kpi-sub">Supabase backup and owner dashboard</div>`)}
      ${card(`<div class="step-number">4</div><h2>Exports</h2><div class="kpi-sub">Daily backup plus monthly Excel/PDF</div>`)}
    </div>
    <div class="form-layout" style="margin-top:14px">
      ${card(`
        <div class="section-head"><h2>Offline Sync Queue</h2>${pill("Strongly recommended", "violet")}</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Device</th><th>Pending</th><th>Data Type</th><th>Status</th></tr></thead>
            <tbody>${queue}</tbody>
          </table>
        </div>
      `)}
      ${entryPanel("Sync / Backup Settings", [
        ["Device Name", "text", ["Android Tablet 1", "iPad Supervisor", "Office Laptop"]],
        ["Sync Mode", "text", ["When online", "Manual only", "Wi-Fi only"]],
        ["Backup Frequency", "text", ["Daily", "Weekly", "Monthly"]],
        ["Export Schedule", "text", ["Monthly Excel", "Monthly PDF", "Excel and PDF"]],
        ["Owner Dashboard", "text", ["Enabled", "Paused"]]
      ], "Save Sync Settings")}
      </div>
    ${card(`
      <div class="section-head"><h2>Cloud Safety Controls</h2></div>
      <div class="grid grid-3">
        <div class="report-metric"><span class="small-label">Daily cloud backup</span><strong>Enabled</strong></div>
        <div class="report-metric"><span class="small-label">Monthly export</span><strong>Excel / PDF</strong></div>
        <div class="report-metric"><span class="small-label">Lost tablet risk</span><strong>Protected by sync</strong></div>
      </div>
    `)}
  `;
}

function admin() {
  const items = ["Farm Setup", "Block Setup", "Plot Setup", "Row Setup", "Tree Type Setup", "Farm Property Setup", "Worker Setup", "Equipment Setup", "Fertilizer Setup", "User Roles", "Audit Log"];
  return `
    <div class="form-layout">
      ${card(`
        <div class="section-head"><h2>Admin Configuration</h2>${pill("Setup modules", "info")}</div>
        <div class="grid grid-2">
          ${items.map((item) => `
            <div class="report-metric">
              <span class="small-label">${item}</span>
              <strong>Configure</strong>
            </div>
          `).join("")}
        </div>
      `)}
      ${entryPanel("Edit Setup Item", [
        ["Setup Area", "text", items],
        ["Name", "text", null, "Configuration name"],
        ["Status", "text", ["Active", "Inactive"]],
        ["Applies To", "text", ["All Blocks", ...zones, "Inventory", "Reports"]],
        ["Notes", "text", null, "Optional setup notes"]
      ], "Save Setup")}
    </div>
  `;
}

function renderContent() {
  const content = document.querySelector("#content");
  if (active === "dashboard") content.innerHTML = dashboard();
  else if (active === "today") content.innerHTML = today();
  else if (active === "planning") content.innerHTML = planning();
  else if (active === "structure") content.innerHTML = structure();
  else if (["irrigation", "fertigation", "pest", "labor", "stock", "harvest", "equipment"].includes(active)) content.innerHTML = entryForm(active);
  else if (active === "exceptions") content.innerHTML = exceptions();
  else if (active === "workorders") content.innerHTML = workOrders();
  else if (active === "approvals") content.innerHTML = approvals();
  else if (active === "costs") content.innerHTML = costs();
  else if (active === "reports") content.innerHTML = reports();
  else if (active === "users") content.innerHTML = users();
  else if (active === "sync") content.innerHTML = syncBackup();
  else content.innerHTML = admin();

  updateLastActivityDate("irrigation", lastIrrigationDates);
  updateLastActivityDate("fertigation", lastFertigationDates);
}

function updateLastActivityDate(type, dates) {
  const zoneSelect = document.querySelector(`#${type}-zone`);
  const rowSelect = document.querySelector(`#${type}-row`);
  const dateTarget = document.querySelector(`#last-${type}-date`);
  const contextTarget = document.querySelector(`#last-${type}-context`);

  if (!zoneSelect || !rowSelect || !dateTarget || !contextTarget) return;

  const zone = zoneSelect.value;
  const row = rowSelect.value;
  const lastDate = dates[`${zone}|${row}`] || "No previous entry found";
  dateTarget.textContent = lastDate;
  contextTarget.textContent = `${zone} / ${row}`;
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    setActive(routeButton.dataset.route);
  }

  const calendarNav = event.target.closest("[data-calendar-nav]");
  if (calendarNav) {
    selectedWorkPlanDate = shiftDateKey(selectedWorkPlanDate, Number(calendarNav.dataset.calendarNav));
    selectedWorkPlanActivityIndex = 0;
    workPlanPanelMode = "add";
    renderContent();
  }

  const workActivityRow = event.target.closest("[data-work-activity-index]");
  if (workActivityRow) {
    selectedWorkPlanActivityIndex = Number(workActivityRow.dataset.workActivityIndex);
    workPlanPanelMode = "detail";
    renderContent();
  }

  if (event.target.closest("[data-show-add-plan]")) {
    workPlanPanelMode = "add";
    renderContent();
  }

  if (event.target.closest("[data-save-work-status]")) {
    const selectedActivities = workPlanActivities[selectedWorkPlanDate] || [];
    const selectedActivity = selectedActivities[selectedWorkPlanActivityIndex];
    const statusValue = document.querySelector("#selected-work-status")?.value;
    const updatedDate = document.querySelector("#selected-work-updated-date")?.value;
    const updatedBy = document.querySelector("#selected-work-updated-by")?.value;

    if (selectedActivity && statusValue) {
      selectedActivity[4] = statusValue;
      selectedActivity[5] = updatedDate ? formatWorkPlanDate(updatedDate) : formatWorkPlanDate(selectedWorkPlanDate);
      selectedActivity[6] = updatedBy || "Farm Manager";
      renderContent();
    }
  }

  const structureButton = event.target.closest("[data-structure-submenu]");
  if (structureButton) {
    structureSubmenu = structureButton.dataset.structureSubmenu;
    renderContent();
  }

  const landBlockButton = event.target.closest("[data-land-block]");
  if (landBlockButton) {
    selectedLandBlock = landBlockButton.dataset.landBlock;
    renderContent();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("#irrigation-zone, #irrigation-row")) {
    updateLastActivityDate("irrigation", lastIrrigationDates);
  }
  if (event.target.matches("#fertigation-zone, #fertigation-row")) {
    updateLastActivityDate("fertigation", lastFertigationDates);
  }
  if (event.target.matches("#work-plan-date")) {
    selectedWorkPlanDate = event.target.value;
    selectedWorkPlanActivityIndex = 0;
    workPlanPanelMode = "add";
    renderContent();
  }
  if (event.target.matches("#selected-work-status")) {
    const selectedActivities = workPlanActivities[selectedWorkPlanDate] || [];
    if (selectedActivities[selectedWorkPlanActivityIndex]) {
      selectedActivities[selectedWorkPlanActivityIndex][4] = event.target.value;
      renderContent();
    }
  }
});

renderNav();
renderContent();
