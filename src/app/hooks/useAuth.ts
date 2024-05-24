// hooks/useAuth.ts
import { useState, useEffect } from "react";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setUser(data.session?.user || null);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return user;
};

export default useAuth;
