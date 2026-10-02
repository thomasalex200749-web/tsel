import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/tsel-logo.png";
import "./Home.css";
import "./BuilderDashboard.css";

const NAV_ITEMS = [
  { key: "portfolio", label: "Portfolio", icon: "▦" },
  { key: "attention", label: "Attention", icon: "△" },
  { key: "photos", label: "Site photos", icon: "▤" },
  { key: "updates", label: "Engineer update", icon: "✎" },
  { key: "reports", label: "Reports", icon: "📈" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

function deriveStatus(site) {
  // No dedicated status/issues table confirmed yet — derive a reasonable
  // placeholder from progress and days since last update, until those
  // tables exist. Swap this out once issues/daily_updates are wired in.
  if (site._issueCount > 0) return "attention";
  if (site._daysSinceUpdate === null) return "no-update";
  if (site._daysSinceUpdate > 3) return "no-update";
  return "on-track";
}

const STATUS_LABEL = {
  "on-track": "On Track",
  attention: "Attention",
  "no-update": "No Update",
};

export default function BuilderDashboard() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    const { data: siteRows, error } = await supabase
      .from("sites")
      .select("id, code, loc, stage, progress, target_date")
      .order("id", { ascending: true });

    if (error || !siteRows) {
      setSites([]);
      setLoading(false);
      return;
    }

    // Try to enrich with last-update and issue-count, but never let a
    // missing/renamed table break the whole dashboard.
    const enriched = await Promise.all(
      siteRows.map(async (site) => {
        let lastUpdate = null;
        let daysSinceUpdate = null;
        let issueCount = 0;

        try {
          const { data: updateRows } = await supabase
            .from("daily_updates")
            .select("created_at")
            .eq("site_id", site.id)
            .order("created_at", { ascending: false })
            .limit(1);
          if (updateRows && updateRows.length > 0) {
            lastUpdate = updateRows[0].created_at;
            daysSinceUpdate = Math.floor(
              (Date.now() - new Date(lastUpdate).getTime()) / 86400000
            );
          }
        } catch {
          /* daily_updates table not available yet — ignore */
        }

        try {
          const { count } = await supabase
            .from("issues")
            .select("id", { count: "exact", head: true })
            .eq("site_id", site.id)
            .eq("status", "open");
          issueCount = count || 0;
        } catch {
          /* issues table not available yet — ignore */
        }

        return {
          ...site,
          _lastUpdate: lastUpdate,
          _daysSinceUpdate: daysSinceUpdate,
          _issueCount: issueCount,
        };
      })
    );

    setSites(enriched);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const rows = useMemo(() => {
    return sites
      .map((s) => ({ ...s, _status: deriveStatus(s) }))
      .filter((s) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          (s.code || "").toLowerCase().includes(q) ||
          (s.loc || "").toLowerCase().includes(q);
        const matchesStage = stageFilter === "all" || s.stage === stageFilter;
        const matchesStatus = statusFilter === "all" || s._status === statusFilter;
        return matchesSearch && matchesStage && matchesStatus;
      });
  }, [sites, search, stageFilter, statusFilter]);

  const stages = useMemo(
    () => Array.from(new Set(sites.map((s) => s.stage).filter(Boolean))),
    [sites]
  );

  const stats = useMemo(() => {
    const total = sites.length;
    const onTrack = sites.filter((s) => deriveStatus(s) === "on-track").length;
    const attention = sites.filter((s) => deriveStatus(s) === "attention").length;
    const noUpdate = sites.filter((s) => deriveStatus(s) === "no-update").length;
    return { total, onTrack, attention, noUpdate };
  }, [sites]);

  const formatLastUpdate = (site) => {
    if (site._daysSinceUpdate === null) return "—";
    if (site._daysSinceUpdate === 0) return "Today";
    if (site._daysSinceUpdate === 1) return "Yesterday";
    return `${site._daysSinceUpdate} days ago`;
  };

  return (
    <div className="bd-shell">
      <aside className="bd-sidebar">
        <div className="bd-sidebar-brand">
          <img src={logo} alt="TSEL" className="bd-sidebar-logo" />
        </div>

        <nav className="bd-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`bd-nav-item ${item.key === "portfolio" ? "is-active" : ""}`}
              onClick={(e) => e.preventDefault()}
            >
              <span className="bd-nav-icon">{item.icon}</span>
              {item.label}
              {item.key === "attention" && stats.attention > 0 && (
                <span className="bd-nav-dot" />
              )}
            </button>
          ))}
        </nav>

        <button className="bd-logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="bd-main">
        <div className="bd-header">
          <div>
            <p className="bd-eyebrow">Project Control</p>
            <h1 className="bd-title">{stats.total} active sites</h1>
            <p className="bd-subtitle">Every site under construction, in one place.</p>
          </div>
          {stats.attention > 0 && (
            <div className="bd-alert-pill">⚠ {stats.attention} need attention</div>
          )}
        </div>

        <div className="bd-stat-row">
          <div className="bd-stat">
            <span className="bd-stat-num">{stats.total}</span>
            <span className="bd-stat-label">Active sites</span>
          </div>
          <div className="bd-stat">
            <span className="bd-stat-num">{stats.onTrack}</span>
            <span className="bd-stat-label">On track</span>
          </div>
          <div className="bd-stat">
            <span className="bd-stat-num bd-stat-warn">{stats.attention}</span>
            <span className="bd-stat-label">Attention required</span>
          </div>
          <div className="bd-stat">
            <span className="bd-stat-num">{stats.noUpdate}</span>
            <span className="bd-stat-label">No recent update</span>
          </div>
        </div>

        <div className="bd-filters">
          <input
            className="bd-search"
            placeholder="Search sites or locations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="bd-select"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="all">All stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="bd-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="on-track">On Track</option>
            <option value="attention">Attention</option>
            <option value="no-update">No Update</option>
          </select>
        </div>

        <div className="bd-table">
          <div className="bd-table-head">
            <span>Site</span>
            <span>Location</span>
            <span>Progress</span>
            <span>Current stage</span>
            <span>Last update</span>
            <span>Issues</span>
            <span>Status</span>
            <span></span>
          </div>

          {loading && <p className="bd-empty">Loading sites...</p>}
          {!loading && rows.length === 0 && <p className="bd-empty">No sites found.</p>}

          {rows.map((site) => (
            <div
              className="bd-table-row"
              key={site.id}
              onClick={() => navigate(`/site/${site.id}`)}
            >
              <div className="bd-site-cell">
                <strong>{site.code}</strong>
                <span>Construction site</span>
              </div>
              <span>{site.loc || "—"}</span>
              <div className="bd-progress-cell">
                <div className="bd-progress-track">
                  <div
                    className="bd-progress-fill"
                    style={{ width: `${site.progress ?? 0}%` }}
                  />
                </div>
                <span>{site.progress ?? 0}%</span>
              </div>
              <span>
                {site.stage && <span className="bd-badge">{site.stage}</span>}
              </span>
              <span>{formatLastUpdate(site)}</span>
              <span>{site._issueCount > 0 ? site._issueCount : "—"}</span>
              <span>
                <span className={`bd-status bd-status-${site._status}`}>
                  {STATUS_LABEL[site._status]}
                </span>
              </span>
              <span className="bd-row-arrow">›</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
