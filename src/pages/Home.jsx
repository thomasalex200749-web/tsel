import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/tsel-logo.png";
import "./Home.css";

const NAV_LINKS = ["Product", "How it works", "Pricing", "Customers"];

const INDEX_ITEMS = [
  {
    code: "01",
    title: "Plans, in one place",
    body:
      "Upload a blueprint once and everyone — builder, subs, homeowner — works off the same sheet. No more seven scanned versions of the same PDF.",
  },
  {
    code: "02",
    title: "Mark it up together",
    body:
      "Pin selections, comments, and change orders directly to a room on the plan. Approvals happen where the decision actually lives.",
  },
  {
    code: "03",
    title: "Hand it off clean",
    body:
      "When the build is done, the homeowner keeps a living record of every material, warranty, and fixture — searchable, not boxed up in a binder.",
  },
];

const STEPS = [
  { n: "01", label: "Upload the plan", detail: "Drop in blueprints or a floor plan PDF." },
  { n: "02", label: "Invite the team", detail: "Builders, subs, suppliers, homeowner — one roster." },
  { n: "03", label: "Track approvals", detail: "Every selection and change order, timestamped." },
  { n: "04", label: "Hand off the home", detail: "Homeowner gets the full record, permanently." },
];

function ElevationArt() {
  return (
    <svg viewBox="0 0 560 460" className="elevation-svg" aria-hidden="true">
      <g stroke="#8a8578" strokeWidth="1.4" fill="none">
        <line x1="40" y1="400" x2="520" y2="400" strokeWidth="2" />
        <path d="M90 400 L90 200 L280 90 L470 200 L470 400" />
        <line x1="90" y1="200" x2="470" y2="200" strokeDasharray="3 4" strokeWidth="1" />
        <rect x="130" y="250" width="50" height="60" />
        <rect x="220" y="250" width="50" height="60" />
        <rect x="310" y="250" width="50" height="60" />
        <rect x="130" y="330" width="50" height="55" />
        <rect x="380" y="250" width="50" height="60" />
        <rect x="245" y="320" width="60" height="80" />
        <line x1="275" y1="320" x2="275" y2="400" strokeWidth="0.8" strokeDasharray="2 3" />
      </g>

      <g stroke="#c9b896" strokeWidth="1" fill="none">
        <line x1="500" y1="90" x2="500" y2="400" />
        <line x1="493" y1="90" x2="507" y2="90" />
        <line x1="493" y1="400" x2="507" y2="400" />
      </g>
      <text
        x="518"
        y="248"
        fill="#c9b896"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
        transform="rotate(90 518 248)"
      >
        24'-6"
      </text>

      <g stroke="#c9b896" strokeWidth="1" fill="none">
        <line x1="90" y1="420" x2="470" y2="420" />
        <line x1="90" y1="413" x2="90" y2="427" />
        <line x1="470" y1="413" x2="470" y2="427" />
      </g>
      <text x="255" y="440" fill="#c9b896" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        38'-0"
      </text>

      <text x="90" y="30" fill="#8a8578" fontFamily="Inter, sans-serif" fontSize="11">
        Front elevation — scale N.T.S.
      </text>
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="page">
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="#top">
            <img src={logo} alt="TSEL" className="brand-logo" />
          </a>

          <nav className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}>
                {link}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="link-muted link-button" onClick={() => navigate("/login")}>
              Sign in
            </button>
            <a className="btn btn-primary" href="#get-started">
              Start a project
            </a>
          </div>

          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-kicker">Built for residential construction</p>
            <h1>
              From blueprint to
              <br />
              build, in one place.
            </h1>
            <p className="hero-sub">
              TSEL turns a static floor plan into a shared workspace, so builders,
              suppliers, and homeowners stop chasing the same decision across five inboxes.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => navigate("/login")}>
                Start a project
              </button>
              <a className="btn btn-ghost" href="#how-it-works">
                See how it works
              </a>
            </div>
            <p className="hero-note">Free for your first project. No card required.</p>
          </div>

          <div className="hero-art">
            <ElevationArt />
          </div>
        </section>

        <div className="dim-rule">
          <span className="dim-tick" />
          <span className="dim-label">Trusted at scale</span>
          <span className="dim-tick" />
        </div>

        <section className="trust-strip">
          <div className="trust-stats">
            <div>
              <strong>4,200+</strong>
              <span>active projects</span>
            </div>
            <div>
              <strong>18,000</strong>
              <span>plan revisions tracked</span>
            </div>
            <div>
              <strong>96%</strong>
              <span>approvals closed on time</span>
            </div>
          </div>
        </section>

        <section id="product" className="index-section">
          <div className="section-head">
            <h2>The drawing set for your whole build</h2>
            <p>Three connected sheets. One shared plan.</p>
          </div>

          <div className="index-list">
            {INDEX_ITEMS.map((item) => (
              <article className="index-row" key={item.code}>
                <span className="index-code">{item.code}</span>
                <div className="index-copy">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="dim-rule">
          <span className="dim-tick" />
          <span className="dim-label">Process</span>
          <span className="dim-tick" />
        </div>

        <section id="how-it-works" className="steps">
          <div className="section-head">
            <h2>How a project moves through TSEL</h2>
          </div>

          <ol className="step-list">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span className="step-n">{step.n}</span>
                <div>
                  <h3>{step.label}</h3>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="quote-section">
          <blockquote>
            "We used to get eight scanned versions of one blueprint back from subs. Now
            there's one plan, and everyone marks up the same copy."
          </blockquote>
          <div className="quote-attribution">
            <strong>Maria Ostrowski</strong>
            <span>Project lead, Ostrowski Custom Homes</span>
          </div>
        </section>

        <section id="get-started" className="cta-band">
          <h2>Put your next build on one plan.</h2>
          <form className="cta-form" onSubmit={handleSubmit}>
            <label htmlFor="email" className="visually-hidden">
              Work email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@builder.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              Start a project
            </button>
          </form>
          {submitted && <p className="cta-confirm">Check your inbox — we sent a link to get set up.</p>}
        </section>
      </main>

      <footer className="site-footer">
        <div className="titleblock-footer">
          <div className="titleblock-row titleblock-top">
            <div>
              <span className="tb-label">Project</span>
              <strong>TSEL Platform</strong>
            </div>
            <div>
              <span className="tb-label">Sheet</span>
              <strong>T-001</strong>
            </div>
            <div>
              <span className="tb-label">Scale</span>
              <strong>N.T.S.</strong>
            </div>
          </div>

          <div className="titleblock-row titleblock-links">
            <div>
              <span className="tb-label">Product</span>
              <a href="#product">Overview</a>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div>
              <span className="tb-label">Company</span>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <span className="tb-label">Resources</span>
              <a href="#guides">Guides</a>
              <a href="#support">Support</a>
              <a href="#status">Status</a>
            </div>
          </div>

          <div className="titleblock-row titleblock-bottom">
            <div className="brand brand-footer">
              <img src={logo} alt="TSEL" className="brand-logo brand-logo-footer" />
            </div>
            <p>© {new Date().getFullYear()} TSEL, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
