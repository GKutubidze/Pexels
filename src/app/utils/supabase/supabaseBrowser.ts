import { createBrowserClient, createServerClient } from "@supabase/ssr";
import React from "react";

export default function supabaseBrowser() {
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}
