const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map();

const json = (status, body) => ({
  status,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
  body: JSON.stringify(body),
});

const getClientKey = (request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("cf-connecting-ip") ||
  "unknown";

const validText = (value, optional = false) =>
  optional && value === "" ? true : typeof value === "string" && value.trim().length > 0 && value.length <= 2000;

export default async function handler(request) {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  if (request.headers.get("origin") !== process.env.PUBLIC_ORIGIN) return json(403, { error: "Origin not allowed" });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json(415, { error: "JSON is required" });

  const key = getClientKey(request);
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return json(429, { error: "Too many requests" });
  recent.push(now);
  attempts.set(key, recent);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { name, email, matter = "", message = "", website = "" } = payload;
  if (!validText(name) || !validText(email) || !validText(matter, true) || !validText(message, true)) {
    return json(400, { error: "Please check the form fields" });
  }
  if (website) return json(400, { error: "Invalid request" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "Please provide a valid email address" });

  const { ODYSSEUS_EMAIL_URL, ODYSSEUS_EMAIL_TOKEN, INTAKE_RECIPIENT } = process.env;
  if (!ODYSSEUS_EMAIL_URL || !ODYSSEUS_EMAIL_TOKEN || !INTAKE_RECIPIENT) {
    console.error("Intake relay is not configured");
    return json(503, { error: "Intake is temporarily unavailable" });
  }

  const response = await fetch(ODYSSEUS_EMAIL_URL, {
    method: "POST",
    headers: {
      authorization: "Bearer " + ODYSSEUS_EMAIL_TOKEN,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      to: INTAKE_RECIPIENT,
      subject: `Website inquiry${matter ? `: ${matter}` : ""}`,
      body: `Name: ${name}\nEmail: ${email}\nMatter: ${matter || "Not specified"}\n\nOverview:\n${message || "Not provided"}`,
      reply_to: email,
    }),
  });

  if (!response.ok) {
    console.error("Odysseus email relay failed", response.status);
    return json(502, { error: "Intake is temporarily unavailable" });
  }
  return json(202, { accepted: true });
}
