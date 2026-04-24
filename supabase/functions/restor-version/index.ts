import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

serve(async (req) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) {
    return preflight;
  }

  const { version_id } = await req.json();

  const authHeader = req.headers.get("Authorization");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    {
      global: {
        headers: { Authorization: authHeader! },
      },
    },
  );

  const { data: version } = await supabase
    .from("note_versions")
    .select("*")
    .eq("id", version_id)
    .single();

  if (!version) {
    return withCors(req, { status: 404 }, "Not found");
  }

  const { error } = await supabase
    .from("notes")
    .update({
      title: version.title,
      content: version.content,
    })
    .eq("id", version.note_id);

  if (error) {
    return withCors(req, { status: 400 }, error.message);
  }

  return withCors(req, { status: 200 }, "Restored");
});
