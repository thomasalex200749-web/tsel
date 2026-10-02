import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/tsel-logo.png";
import "./Home.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("builder");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Engineers need to be assigned to an existing site
    const fetchSites = async () => {
      const { data } = await supabase.from("sites").select("id, code");
      setSites(data || []);
    };
    fetchSites();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "engineer" && !siteId) {
      setError("Please select a site");
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        full_name: fullName,
        role,
        site_id: role === "engineer" ? siteId : null,
      },
    ]);

    setLoading(false);

    if (profileError) {
      setError("Account created, but profile setup failed: " + profileError.message);
      return;
    }

    navigate(role === "builder" ? "/builder" : `/site/${siteId}`);
  };

  return (
    <div className="auth-page page">
      <div className="auth-card">
        <a className="brand" href="/">
          <img src={logo} alt="TSEL" className="brand-logo" />
        </a>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Set up access to your TSEL workspace.</p>

        <form className="auth-form" onSubmit={handleSignUp}>
          <label className="auth-field">
            <span>Full name</span>
            <input
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>

          <label className="auth-field">
            <span>I am a</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: "0.7rem 0.85rem",
                border: "1px solid var(--ink)",
                background: "var(--paper)",
                color: "var(--ink)",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            >
              <option value="builder">Builder</option>
              <option value="engineer">Engineer</option>
            </select>
          </label>

          {role === "engineer" && (
            <label className="auth-field">
              <span>Assigned site</span>
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                style={{
                  padding: "0.7rem 0.85rem",
                  border: "1px solid var(--ink)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                }}
              >
                <option value="">Select a site</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}
                  </option>
                ))}
              </select>
            </label>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer-note">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
