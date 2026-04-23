import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const url = new URL(req.url);
  const note_id = url.searchParams.get("note_id");

  const authHeader = req.headers.get("Authorization");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: { Authorization: authHeader! },
      },
    },
  );

  const { data, error } = await supabase
    .from("note_versions")
    .select("*")
    .eq("note_id", note_id)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
});
