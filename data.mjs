import { getStore } from "@netlify/blobs";

// Shared data store for BBB Content OS.
// GET  /api/data  -> returns the saved JSON (or null if nothing saved yet)
// POST /api/data  -> saves the JSON body as the new shared state
export default async (req) => {
  const store = getStore("content-os");
  try {
    if (req.method === "GET") {
      const data = await store.get("data", { type: "json" });
      return new Response(JSON.stringify(data ?? null), {
        headers: { "content-type": "application/json", "cache-control": "no-store" },
      });
    }
    if (req.method === "POST" || req.method === "PUT") {
      const body = await req.text();
      await store.set("data", body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

export const config = { path: "/api/data" };
