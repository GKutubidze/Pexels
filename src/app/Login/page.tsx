import React from "react";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function LoginPage() {
  const supabase = createClient();
  const origin = headers().get("origin");
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}`,
    },
  });

  if (error) {
    console.log(error);
  } else {
    return redirect(data.url);
  }

  return <div>page</div>;
}

export default LoginPage;
