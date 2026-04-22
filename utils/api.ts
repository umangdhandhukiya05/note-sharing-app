import axios from "axios";
import { supabase } from "@/utils/supabase/client";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL,
});

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  console.log("TOKEN:", session?.access_token);
  return config;
});
