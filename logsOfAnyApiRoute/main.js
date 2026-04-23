
import { Schema } from 'mongoose';


// This UI is for tracking any specifics method like get and retrive unique requests

// START



const express = require("express");
const apiAuditLog = require("../models/apilog");
const router = express.Router();

// ── Unique GET Routes Summary ──────────────────────────────────────────────
router.get("/admin/api-logs", async (req, res) => {
  // Aggregate: only GET, group by route, count hits, get last seen
  const routes = await apiAuditLog.aggregate([
    { $match: { method: "GET" } },
    {
      $group: {
        _id: "$route",
        count: { $sum: 1 },
        lastSeen: { $max: "$createdAt" },
        lastStatus: { $last: "$statusCode" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const totalCalls = routes.reduce((sum, r) => sum + r.count, 0);

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Unique GET APIs</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --bg: #0b0d14;
      --surface: #12151f;
      --surface2: #181c28;
      --border: #1f2437;
      --accent: #00d4aa;
      --accent2: #6c63ff;
      --text: #e2e4f0;
      --muted: #5a607a;
      --get: #00d4aa;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Syne', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 32px 24px;
    }

    /* Header */
    .header {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
    }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .logo {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #00d4aa, #6c63ff);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }
    .header h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { font-size: 12px; color: var(--muted); margin-top: 2px; font-family: 'JetBrains Mono', monospace; }

    /* Stats Row */
    .stats {
      display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 22px;
      flex: 1; min-width: 140px;
    }
    .stat-card .label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .stat-card .value { font-size: 28px; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
    .stat-card.green .value { color: var(--get); }
    .stat-card.purple .value { color: var(--accent2); }
    .stat-card.white .value { color: var(--text); }

    /* Search */
    .search-wrap {
      position: relative; margin-bottom: 20px;
    }
    .search-wrap svg {
      position: absolute; left: 14px; top: 50%;
      transform: translateY(-50%); color: var(--muted); pointer-events: none;
    }
    .search-wrap input {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 10px;
      font-size: 13px;
      padding: 11px 14px 11px 40px;
      outline: none;
      font-family: 'JetBrains Mono', monospace;
      transition: border-color 0.2s;
    }
    .search-wrap input:focus { border-color: var(--accent); }
    .search-wrap input::placeholder { color: var(--muted); }

    /* Table */
    .table-wrap {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead tr {
      background: var(--surface2);
      border-bottom: 1px solid var(--border);
    }
    thead th {
      padding: 12px 16px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1px;
      color: var(--muted); text-align: left;
    }
    thead th.right { text-align: right; }

    tbody tr {
      border-bottom: 1px solid var(--border);
      transition: background 0.15s;
      cursor: default;
    }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: var(--surface2); }

    td { padding: 13px 16px; font-size: 13px; vertical-align: middle; }

    .index-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: var(--muted);
      width: 40px;
    }
    .get-badge {
      display: inline-flex; align-items: center;
      background: rgba(0,212,170,0.1);
      border: 1px solid rgba(0,212,170,0.3);
      color: var(--get);
      font-size: 10px; font-weight: 700;
      padding: 2px 8px; border-radius: 5px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.5px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .route-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px; color: var(--text);
      word-break: break-all;
    }
    .count-pill {
      display: inline-block;
      background: rgba(108,99,255,0.15);
      border: 1px solid rgba(108,99,255,0.3);
      color: var(--accent2);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 700;
      padding: 3px 12px; border-radius: 20px;
    }
    .bar-cell { width: 140px; }
    .bar-bg {
      background: var(--surface2);
      border-radius: 4px; height: 6px;
      overflow: hidden;
    }
    .bar-fill {
      background: linear-gradient(90deg, var(--get), var(--accent2));
      height: 100%; border-radius: 4px;
      transition: width 0.4s ease;
    }
    .last-seen {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: var(--muted);
      text-align: right;
    }

    /* No results */
    .no-results {
      text-align: center; padding: 50px 20px;
      color: var(--muted); display: none;
      font-size: 13px;
    }

    /* Back link */
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--muted); font-size: 12px;
      text-decoration: none;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 24px;
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--accent); }
  </style>
</head>
<body>

<a href="/admin/api-logs" class="back-link">
  ← Back to All Logs
</a>

<!-- Header -->
<div class="header">
  <div class="header-left">
    <div class="logo">📡</div>
    <div>
      <h1>Unique GET APIs</h1>
      <p>deduplicated · sorted by hit count</p>
    </div>
  </div>
</div>

<!-- Stats -->
<div class="stats">
  <div class="stat-card green">
    <div class="label">Unique Routes</div>
    <div class="value">${routes.length}</div>
  </div>
  <div class="stat-card purple">
    <div class="label">Total GET Calls</div>
    <div class="value">${totalCalls.toLocaleString()}</div>
  </div>
  <div class="stat-card white">
    <div class="label">Avg Calls / Route</div>
    <div class="value">${routes.length ? (totalCalls / routes.length).toFixed(1) : 0}</div>
  </div>
</div>

<!-- Search -->
<div class="search-wrap">
  <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
  <input id="searchInput" placeholder="Filter routes…" oninput="filterRoutes()" />
</div>

<!-- Table -->
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Route</th>
        <th>Hits</th>
        <th class="bar-cell"></th>
        <th class="right">Last Seen</th>
      </tr>
    </thead>
    <tbody id="routeBody">
      ${routes.map((r, i) => {
        const maxCount = routes[0]?.count || 1;
        const pct = Math.round((r.count / maxCount) * 100);
        const lastSeen = r.lastSeen
          ? new Date(r.lastSeen).toLocaleString()
          : "—";
        return `
      <tr data-route="${r._id}">
        <td class="index-num">${String(i + 1).padStart(2, "0")}</td>
        <td>
          <span class="get-badge">GET</span>
          <span class="route-text">${r._id}</span>
        </td>
        <td><span class="count-pill">${r.count.toLocaleString()}</span></td>
        <td class="bar-cell">
          <div class="bar-bg">
            <div class="bar-fill" style="width:${pct}%"></div>
          </div>
        </td>
        <td class="last-seen">${lastSeen}</td>
      </tr>`;
      }).join("")}
    </tbody>
  </table>
  <div id="noResults" class="no-results">No routes match your search.</div>
</div>

<script>
  function filterRoutes() {
    const q = document.getElementById("searchInput").value.toLowerCase();
    let visible = 0;
    document.querySelectorAll("#routeBody tr").forEach(row => {
      const route = row.dataset.route.toLowerCase();
      const show = !q || route.includes(q);
      row.style.display = show ? "" : "none";
      if (show) visible++;
    });
    document.getElementById("noResults").style.display = visible === 0 ? "block" : "none";
  }
</script>

</body>
</html>
  `);
});

module.exports = router;

// END =================

// This is actual UI for tracing logs req res

// ? START

const express = require("express");
const apiAuditLog = require("../models/apilog");
const router = express.Router();

function safeParse(data) {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  return data;
}

router.get("/admin/api-logs", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const logs = await apiAuditLog
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalLogs = await apiAuditLog.countDocuments();
  const totalPages = Math.ceil(totalLogs / limit);

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>API Audit Logs</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --bg: #0b0d14;
      --surface: #12151f;
      --surface2: #181c28;
      --border: #1f2437;
      --accent: #6c63ff;
      --accent2: #00d4aa;
      --text: #e2e4f0;
      --muted: #5a607a;
      --get: #00d4aa;
      --post: #6c63ff;
      --put: #f5a623;
      --delete: #ff4d6d;
      --s2: #00d4aa;
      --s4: #f5a623;
      --s5: #ff4d6d;
      --radius: 12px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Syne', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 32px 24px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 28px;
    }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .logo {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #6c63ff, #00d4aa);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .header h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { font-size: 12px; color: var(--muted); margin-top: 2px; font-family: 'JetBrains Mono', monospace; }
    .total-badge {
      background: linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,170,0.1));
      border: 1px solid rgba(108,99,255,0.3);
      color: var(--accent);
      font-size: 12px; font-weight: 700;
      padding: 6px 16px; border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ── Filter Bar ── */
    .filters {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .search-wrap { flex: 1; min-width: 200px; position: relative; }
    .search-wrap svg {
      position: absolute; left: 12px; top: 50%;
      transform: translateY(-50%); color: var(--muted);
      pointer-events: none;
    }
    .filters input, .filters select {
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 8px;
      font-size: 13px;
      padding: 9px 14px;
      outline: none;
      transition: border-color 0.2s;
      font-family: 'Syne', sans-serif;
    }
    .search-wrap input { width: 100%; padding-left: 36px; }
    .filters input:focus, .filters select:focus { border-color: var(--accent); }
    .filters select { cursor: pointer; padding-right: 12px; }
    .filters select option { background: var(--surface2); }

    /* ── Visible count ── */
    .visible-count {
      font-size: 12px; color: var(--muted);
      font-family: 'JetBrains Mono', monospace;
      white-space: nowrap;
    }

    /* ── Log Card ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px 18px;
      margin-bottom: 12px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: rgba(108,99,255,0.4); }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .card-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

    .badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 6px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
      font-family: 'JetBrains Mono', monospace;
    }
    .badge-GET    { background: rgba(0,212,170,0.15); color: var(--get); border: 1px solid rgba(0,212,170,0.3); }
    .badge-POST   { background: rgba(108,99,255,0.15); color: var(--post); border: 1px solid rgba(108,99,255,0.3); }
    .badge-PUT    { background: rgba(245,166,35,0.15); color: var(--put); border: 1px solid rgba(245,166,35,0.3); }
    .badge-DELETE { background: rgba(255,77,109,0.15); color: var(--delete); border: 1px solid rgba(255,77,109,0.3); }

    .route {
      font-size: 14px; font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text);
      word-break: break-all;
    }

    .status-badge {
      padding: 3px 10px; border-radius: 6px;
      font-size: 11px; font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    .s2xx { background: rgba(0,212,170,0.15); color: var(--s2); border: 1px solid rgba(0,212,170,0.3); }
    .s4xx { background: rgba(245,166,35,0.15); color: var(--s4); border: 1px solid rgba(245,166,35,0.3); }
    .s5xx { background: rgba(255,77,109,0.15); color: var(--s5); border: 1px solid rgba(255,77,109,0.3); }

    .meta {
      font-size: 12px; color: var(--muted);
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 10px;
      display: flex; gap: 16px; flex-wrap: wrap;
    }
    .meta span { display: flex; align-items: center; gap: 4px; }

    details { margin-top: 6px; }
    summary {
      cursor: pointer;
      font-size: 12px; font-weight: 600; color: var(--muted);
      padding: 5px 0;
      user-select: none;
      list-style: none;
      display: flex; align-items: center; gap: 6px;
    }
    summary::-webkit-details-marker { display: none; }
    summary::before {
      content: '▶';
      font-size: 9px;
      transition: transform 0.2s;
      display: inline-block;
    }
    details[open] summary::before { transform: rotate(90deg); }
    summary:hover { color: var(--text); }

    pre {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      font-size: 11.5px;
      font-family: 'JetBrains Mono', monospace;
      overflow: auto;
      color: #a8b0cc;
      margin-top: 6px;
      max-height: 240px;
      line-height: 1.6;
    }

    /* ── No Results ── */
    .no-results {
      text-align: center; padding: 60px 20px;
      color: var(--muted); display: none;
    }
    .no-results svg { opacity: 0.3; margin-bottom: 12px; }
    .no-results p { font-size: 14px; }

    /* ── Pagination ── */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
      flex-wrap: wrap;
    }
    .page-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      font-size: 13px; font-weight: 600;
      padding: 9px 18px; border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .page-btn:hover:not(.disabled):not(.active) {
      background: var(--surface2);
      border-color: var(--accent);
      color: var(--accent);
    }
    .page-btn.active {
      background: linear-gradient(135deg, #6c63ff, #5a52d5);
      border-color: #6c63ff;
      color: #fff;
      cursor: default;
    }
    .page-btn.disabled {
      opacity: 0.3;
      cursor: not-allowed;
      pointer-events: none;
    }
    .page-btn svg { flex-shrink: 0; }
    .page-info {
      font-size: 12px; color: var(--muted);
      font-family: 'JetBrains Mono', monospace;
      padding: 9px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
    }
  </style>
</head>
<body>

<!-- Header -->
<div class="header">
  <div class="header-left">
    <div class="logo">🚀</div>
    <div>
      <h1>API Audit Logs</h1>
      <p>admin · real-time request monitor</p>
    </div>
  </div>
  <div class="total-badge">${totalLogs.toLocaleString()} total logs</div>
</div>

<!-- Filters -->
<div class="filters">
  <div class="search-wrap">
    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input id="searchInput" placeholder="Search route…" oninput="filterLogs()" />
  </div>

  <select id="methodFilter" onchange="filterLogs()">
    <option value="">All Methods</option>
    <option value="GET">GET</option>
    <option value="POST">POST</option>
    <option value="PUT">PUT</option>
    <option value="DELETE">DELETE</option>
  </select>

  <select id="statusFilter" onchange="filterLogs()">
    <option value="">All Status</option>
    <option value="2">2xx Success</option>
    <option value="4">4xx Client Error</option>
    <option value="5">5xx Server Error</option>
  </select>

  <span class="visible-count" id="visibleCount"></span>
</div>

<!-- Log Cards -->
<div id="logList">
${logs.map((log) => {
  const statusClass = `s${String(log.statusCode)[0]}xx`;
  return `
  <div class="card" data-method="${log.method}" data-status="${String(log.statusCode)[0]}" data-route="${log.route}">
    <div class="card-top">
      <div class="card-left">
        <span class="badge badge-${log.method}">${log.method}</span>
        <span class="route">${log.route}</span>
      </div>
      <span class="status-badge ${statusClass}">${log.statusCode}</span>
    </div>
    <div class="meta">
      <span>⏱ ${log.durationMs}ms</span>
      <span>🌐 ${log.ip || "—"}</span>
      ${log.createdAt ? `<span>🕐 ${new Date(log.createdAt).toLocaleString()}</span>` : ""}
    </div>
    <details><summary>Request Body</summary><pre>${JSON.stringify(log.request?.body, null, 2)}</pre></details>
    <details><summary>Query Params</summary><pre>${JSON.stringify(log.request?.query, null, 2)}</pre></details>
    <details><summary>Route Params</summary><pre>${JSON.stringify(log.request?.params, null, 2)}</pre></details>
    <details><summary>Headers</summary><pre>${JSON.stringify(log.headers, null, 2)}</pre></details>
    <details><summary>Response</summary><pre>${JSON.stringify(safeParse(log.response), null, 2)}</pre></details>
  </div>`;
}).join("")}
</div>

<!-- No Results -->
<div id="noResults" class="no-results">
  <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
  <p>No logs match your filters.</p>
</div>

<!-- Pagination -->
<div class="pagination">
  ${page > 1
    ? `<a class="page-btn" href="?page=${page - 1}">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        Prev
       </a>`
    : `<span class="page-btn disabled">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        Prev
       </span>`}

  ${(() => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    // First page
    if (totalPages >= 1) {
      pages.push(`<a class="page-btn${page === 1 ? " active" : ""}" href="?page=1">1</a>`);
    }
    // Left ellipsis
    if (left > 2) {
      pages.push(`<span class="page-info">…</span>`);
    }
    // Middle pages
    for (let i = left; i <= right; i++) {
      pages.push(`<a class="page-btn${page === i ? " active" : ""}" href="?page=${i}">${i}</a>`);
    }
    // Right ellipsis
    if (right < totalPages - 1) {
      pages.push(`<span class="page-info">…</span>`);
    }
    // Last page
    if (totalPages > 1) {
      pages.push(`<a class="page-btn${page === totalPages ? " active" : ""}" href="?page=${totalPages}">${totalPages}</a>`);
    }

    return pages.join("");
  })()}

  <span class="page-info">Page ${page} / ${totalPages}</span>

  ${page < totalPages
    ? `<a class="page-btn" href="?page=${page + 1}">
        Next
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
       </a>`
    : `<span class="page-btn disabled">
        Next
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
       </span>`}
</div>

<script>
  function filterLogs() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const method = document.getElementById("methodFilter").value;
    const status = document.getElementById("statusFilter").value;

    let visible = 0;
    document.querySelectorAll("#logList .card").forEach(card => {
      const route  = card.dataset.route.toLowerCase();
      const m      = card.dataset.method;
      const s      = card.dataset.status;

      const ok = (!search || route.includes(search))
               && (!method || m === method)
               && (!status || s === status);

      card.style.display = ok ? "block" : "none";
      if (ok) visible++;
    });

    document.getElementById("noResults").style.display = visible === 0 ? "block" : "none";
    document.getElementById("visibleCount").textContent =
      visible + " result" + (visible !== 1 ? "s" : "");
  }

  document.addEventListener("DOMContentLoaded", filterLogs);
</script>

</body>
</html>
`);
});

module.exports = router;

// END


// Middleware which is use in like app.js

// START

// middleware/apiAuditLogger.js

const ApiAuditLog = require("../models/apilog");

/**
 * Global API Audit Middleware
 * Saves request + response logs with deep masking
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const SKIP_ROUTES = [
  "/v3/admin/api-logs",
  "/v3/deeplinks/.well-known/appspecific/com.chrome.devtools.json",
  "/.well-known/appspecific/com.chrome.devtools.json",
  "/v3/login",
  "/v3/admin/queues",
  "/favicon.ico",
  "/v3/ably/webhook",
];

/**
 * Sensitive keys (MUST be lowercase only)
 */
const SENSITIVE_KEYS = new Set([
  "password",
  "newpassword",
  "oldpassword",
  "confirmpassword",
  "token",
  "accesstoken",
  "refreshtoken",
  "otp",
  "pin",
  "secret",
  "cnic",
  "cardnumber",
  "cvv",
  "email",
  "phone",
  "phonenumber",
  "countrycode",
  "storagefileid",
  "url",
  "codeid",
  "code",
  "auth_token",
  "authtoken"
]);

/** Internal IDs */
const ID_KEYS = new Set(["_id", "id"]);

/** Max response size */
const MAX_RESPONSE_SIZE = 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────

module.exports = function apiAuditLogger(req, res, next) {
  const startTime = Date.now();

  if (SKIP_ROUTES.some((route) => req.originalUrl.includes(route))) {
    return next();
  }

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  let capturedBody = null;

  res.json = function (body) {
    capturedBody = body;
    return originalJson(body);
  };

  res.send = function (body) {
    if (typeof body === "string") {
      try {
        capturedBody = JSON.parse(body);
      } catch {
        capturedBody = body;
      }
    } else if (Buffer.isBuffer(body)) {
      try {
        capturedBody = JSON.parse(body.toString("utf8"));
      } catch {
        capturedBody = "[binary body]";
      }
    } else {
      capturedBody = body;
    }

    return originalSend(body);
  };

  res.on("finish", async () => {
    try {
      const logData = {
        method: req.method,
        route: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startTime,

        userId: req.user?._id || null,

        ip:
          req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.socket?.remoteAddress ||
          null,

        request: {
          params: maskData(req.params),
          query: maskData(req.query),
          body: maskData(req.body),
        },

        response: buildSafeResponse(capturedBody),

        headers: {
          "user-agent": req.headers["user-agent"] || null,
        },

        createdAt: new Date(),
      };

      await ApiAuditLog.create(logData);
    } catch (err) {
      console.error("[apiAuditLogger] Failed to write log:", err.message);
    }
  });

  next();
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskData(data, depth = 0) {
  if (depth > 10) return "[max depth]";
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((item) => maskData(item, depth + 1));
  }

  const result = {};

  for (const key of Object.keys(data)) {
    const lowerKey = key.toLowerCase();

    if (ID_KEYS.has(lowerKey)) {
      result[key] = "[redacted]";
    } else if (SENSITIVE_KEYS.has(lowerKey)) {
      result[key] = "******";
    } else if (data[key] !== null && typeof data[key] === "object") {
      result[key] = maskData(data[key], depth + 1);
    } else {
      result[key] = data[key];
    }
  }

  return result;
}

function buildSafeResponse(body) {
  if (body === null || body === undefined) return null;

  if (typeof body === "string") {
    return body.length > MAX_RESPONSE_SIZE
      ? body.slice(0, MAX_RESPONSE_SIZE) + "…[truncated]"
      : body;
  }

  let cloned;
  try {
    cloned =
      typeof structuredClone === "function"
        ? structuredClone(body)
        : JSON.parse(JSON.stringify(body));
  } catch {
    return "[unserializable body]";
  }

  const masked = maskData(cloned);

  const serialized = JSON.stringify(masked);
  if (serialized.length > MAX_RESPONSE_SIZE) {
    return { _note: "[response truncated — exceeded size limit]" };
  }

  return masked;
}


//  END

// Schema


const mongoose = require("mongoose");

const apiAuditLogSchema = new mongoose.Schema(
  {
    method: String,
    route: String,
    statusCode: Number,
    durationMs: Number,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ip: String,

    request: {
      body: Object,
      query: Object,
      params: Object,
    },

    response: Object,

    headers: Object,

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      expires: "3d", // auto delete after 30 days (IMPORTANT for storage)
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("ApiAuditLog", apiAuditLogSchema);

// END

// Use in app.js or etc

// START

const apiAuditLogger = require("../middlewares/apiAuditLog.js");
const apiAuditLogsRouter = require("../bullBoard/apiAuditlogs.js");
  app.use(apiAuditLogger);
  app.use(`${config.urlMount}`, apiAuditLogsRouter);

//   END