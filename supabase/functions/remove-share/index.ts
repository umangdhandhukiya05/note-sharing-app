import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");

  const { share_id } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: authHeader } },
    }
  );

  const { error } = await supabase
    .from("note_shares")
    .delete()
    .eq("id", share_id);

  if (error) return new Response(error.message, { status: 400 });

  return new Response("Removed", { status: 200 });
});