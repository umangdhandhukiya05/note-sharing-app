import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
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
    return new Response("Not found", { status: 404 });
  }

  const { error } = await supabase
    .from("notes")
    .update({
      title: version.title,
      content: version.content,
    })
    .eq("id", version.note_id);

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response("Restored", { status: 200 });
});
