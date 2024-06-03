import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";

export const handleLogIn = async () => {
  const supabase = supabaseBrowser();

  // Determine the base URL
  const baseUrl ="https://pexels-tawny.vercel.app"; // Replace with your actual Vercel app URL
  
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });
};

export const handleLogOut = async () => {
  const supabase = supabaseBrowser();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
  } else {
    console.log("Successfully signed out");
    // Reload the page
    window.location.reload();
  }
};
