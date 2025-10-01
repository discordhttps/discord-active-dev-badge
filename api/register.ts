export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const ALLOWED_ORIGIN = "badge-hunt.vercel.app";

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  }

  if (!req.headers.get("Authorization")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  }

  const body = await req.json();

  try {
    const discordRes = await fetch(body.url, {
      method: "POST",
      headers: {
        Authorization: req.headers.get("Authorization") ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body.payload),
    });
    return new Response(null, {
      status: discordRes.status,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  } catch (err) {
    return new Response(null, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  }
}
