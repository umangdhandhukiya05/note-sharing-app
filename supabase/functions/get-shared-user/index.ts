import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
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
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
});
