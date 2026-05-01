import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { handleCorsPreflight, withCors } from "../_shared/cors.ts";

serve(async (req) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) {
    return preflight;
  }

  const authHeader = req.headers.get("Authorization");

  const { title, content } = await req.json();

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

  const token = authHeader.replace("Bearer ", "");

  const { data: userData } = await supabase.auth.getUser(token);

  if (!userData.user) {
    return withCors(req, { status: 401 }, "Unauthorized");
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title: title || "Untitled",
      content: content || "",
      owner_id: userData.user.id,
    })
    .select("*")
    .single();

  if (error) {
    return withCors(req, { status: 400 }, error.message);
  }

  return withCors(
    req,
    { status: 200 },
    JSON.stringify({
      message: "Note created",
      data,
    }),
  );
});
