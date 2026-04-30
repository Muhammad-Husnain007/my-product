import {Router} from "express";
import { ApiAuditModel } from "./apiAudit.model.js";
import { apiAuditLogger } from "./apiAudit.middleware.js";

const router = Router();

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

router.get("/api-logs", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const logs = await ApiAuditModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalLogs = await ApiAuditModel.countDocuments();
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
${logs
  .map((log) => {
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
  })
  .join("")}
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
  ${
    page > 1
      ? `<a class="page-btn" href="?page=${page - 1}">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        Prev
       </a>`
      : `<span class="page-btn disabled">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        Prev
       </span>`
  }

  ${(() => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    // First page
    if (totalPages >= 1) {
      pages.push(
        `<a class="page-btn${page === 1 ? " active" : ""}" href="?page=1">1</a>`,
      );
    }
    // Left ellipsis
    if (left > 2) {
      pages.push(`<span class="page-info">…</span>`);
    }
    // Middle pages
    for (let i = left; i <= right; i++) {
      pages.push(
        `<a class="page-btn${page === i ? " active" : ""}" href="?page=${i}">${i}</a>`,
      );
    }
    // Right ellipsis
    if (right < totalPages - 1) {
      pages.push(`<span class="page-info">…</span>`);
    }
    // Last page
    if (totalPages > 1) {
      pages.push(
        `<a class="page-btn${page === totalPages ? " active" : ""}" href="?page=${totalPages}">${totalPages}</a>`,
      );
    }

    return pages.join("");
  })()}

  <span class="page-info">Page ${page} / ${totalPages}</span>

  ${
    page < totalPages
      ? `<a class="page-btn" href="?page=${page + 1}">
        Next
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
       </a>`
      : `<span class="page-btn disabled">
        Next
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
       </span>`
  }
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

export default router;
