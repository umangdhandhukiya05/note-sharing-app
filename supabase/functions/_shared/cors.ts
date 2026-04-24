const allowedOrigins = new Set([
  "https://note-sharing-app-beta.vercel.app",
  "http://localhost:3000",
]);

export const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && allowedOrigins.has(origin)
    ? origin
    : "https://note-sharing-app-beta.vercel.app";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
};

export const handleCorsPreflight = (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: getCorsHeaders(req.headers.get("origin")),
    });
  }

  return null;
};

export const withCors = (
  req: Request,
  response: ResponseInit,
  body?: BodyInit | null,
) => {
  const headers = new Headers(response.headers);
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));

  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));

  return new Response(body, {
    ...response,
    headers,
  });
};
