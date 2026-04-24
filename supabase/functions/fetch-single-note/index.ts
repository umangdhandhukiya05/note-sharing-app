import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

serve(async (req) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) {
    return preflight;
  }

  const authHeader = req.headers.get("Authorization");

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

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

  const { data, error } = await supabase
    .from("notes")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    return withCors(req, { status: 400 }, error.message);
  }

  // Fetch the owner's profile to get their display_name
  if (data?.owner_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", data.owner_id)
      .single();

    if (profile) {
      data.display_name = profile.display_name;
    }
  }

  return withCors(req, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }, JSON.stringify(data));
});
