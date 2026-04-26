// middleware/apiAuditLogger.js

import { ApiAuditModel } from "./apiAudit.model.js";


const SKIP_ROUTES = [
  "/api/v1/admin/api-logs",
  "/.well-known/appspecific/com.chrome.devtools.json"
  
];

/**
 * Sensitive keys (MUST be lowercase only)
 */
const SENSITIVE_KEYS = new Set([
  "otp",
  "email",
  "phone",
  "token",
  "accessToken",
  "refreshToken",
  "phoneNumber",
  
]);

/** Internal IDs */
const ID_KEYS = new Set(["_id", "id"]);

/** Max response size */
const MAX_RESPONSE_SIZE = 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────

export function apiAuditLogger(req, res, next) {
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

      await ApiAuditModel.create(logData);
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