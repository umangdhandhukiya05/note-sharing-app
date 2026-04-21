import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const { title } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");

  const { data: userData } = await supabase.auth.getUser(token);

  if (!userData.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { error } = await supabase.from("notes").insert({
    title: title || "Untitled",
    content: "",
    owner_id: userData.user.id,
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response("Note created", { status: 200 });
});
