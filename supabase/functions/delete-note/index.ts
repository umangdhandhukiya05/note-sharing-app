import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

serve(async (req) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) {
    return preflight;
  }

  const authHeader = req.headers.get("Authorization");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    },
  );

  const { id } = await req.json();

  const { data, error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    return withCors(req, { status: 400 }, error.message);
  }

  return withCors(req, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }, "Note deleted successfully");
});
