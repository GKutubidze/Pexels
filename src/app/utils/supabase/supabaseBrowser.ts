import { createBrowserClient } from "@supabase/ssr";
import React from "react";

export default function supabaseBrowser() {
  // Read environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Ensure environment variables are set
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anonymous Key must be set in environment variables"
    );
  }

  // Create and return Supabase client
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
