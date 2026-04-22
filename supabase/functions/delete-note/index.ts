import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
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
    return new Response(error.message, { status: 400 });
  }

  return new Response("Note deleted successfully", {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
