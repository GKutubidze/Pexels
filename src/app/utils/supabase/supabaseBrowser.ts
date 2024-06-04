import { createBrowserClient } from "@supabase/ssr";
import React from "react";

export default function supabaseBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anonymous Key must be set in environment variables"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
