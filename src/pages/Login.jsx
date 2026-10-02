import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/tsel-logo.png";
import "./Home.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, site_id")
      .eq("id", authData.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setError("Logged in, but no profile found for this user");
      return;
    }

    navigate(profile.role === "builder" ? "/builder" : `/site/${profile.site_id}`);
  };

  return (
    <div className="auth-page page">
      <div className="auth-card">
        <a className="brand" href="/">
          <img src={logo} alt="TSEL" className="brand-logo" />
        </a>

        <h1 className="auth-title">Sign in</h1>
        <p className="auth-sub">Enter your credentials to access your workspace.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@builder.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer-note">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
