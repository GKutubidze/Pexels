import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";

export const handleLogIn = async () => {
  const supabase = supabaseBrowser();

  // Determine the base URL
  const baseUrl = "https://pexels-tawny.vercel.app"; // Replace with your actual Vercel app URL

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}src/app/auth/callback/`,
      },
    });

    if (error) {
      console.error("Error during sign in:", error);
      // Handle the error appropriately
    } else {
      console.log("Sign in successful");
    }
  } catch (err) {
    console.error("Unexpected error during sign in:", err);
  }
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
