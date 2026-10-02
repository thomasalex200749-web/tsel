import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function RoleTest() {
  const [role, setRole] = useState("Loading...");

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setRole("Not logged in");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        setRole("No profile found");
        return;
      }

      setRole(profile.role);
    };

    fetchRole();
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0a0a0a",
      color: "#e8dcc4",
      fontFamily: "sans-serif",
      fontSize: "2rem"
    }}>
      You are logged in as: {role}
    </div>
  );
}

export default RoleTest;