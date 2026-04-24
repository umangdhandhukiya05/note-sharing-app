import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

serve(async (req) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) {
    return preflight;
  }

  const authHeader = req.headers.get("Authorization");

  const { note_id } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: { Authorization: authHeader },
      },
    },
  );

  const { data, error } = await supabase
    .from("note_shares")
    .select(
      `
      id,
      permission,
      user:profiles ( id, email, display_name )
    `,
    )
    .eq("note_id", note_id);

  if (error) {
    return withCors(req, { status: 400 }, error.message);
  }

  return withCors(req, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }, JSON.stringify(data));
});
