import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/tsel-logo.png";
import "./Home.css";

export default function SiteDetail() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoLabel, setPhotoLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    fetchSite();
    fetchUpdates();
    fetchPhotos();
  }, [siteId]);

  const fetchSite = async () => {
    const { data } = await supabase
      .from("sites")
      .select("id, code, loc, stage, progress, target_date")
      .eq("id", siteId)
      .single();
    setSite(data);
    setLoading(false);
  };

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from("daily_updates")
      .select("*")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false });

    if (error) {
      // Table/columns may not match yet — surface it instead of failing silently
      console.warn("daily_updates fetch error:", error.message);
      setUpdates([]);
      return;
    }
    setUpdates(data || []);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setError("");

    const { error } = await supabase
      .from("daily_updates")
      .insert([{ site_id: siteId, note }]);

    if (error) {
      setError("Couldn't save update: " + error.message);
      return;
    }

    setNote("");
    fetchUpdates();
  };

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("photos fetch error:", error.message);
      setPhotos([]);
      return;
    }

    // Attach a public URL for each photo based on its storage_path
    const withUrls = (data || []).map((p) => ({
      ...p,
      _url: supabase.storage.from("site-photos").getPublicUrl(p.storage_path).data
        .publicUrl,
    }));
    setPhotos(withUrls);
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      setPhotoError("Choose a photo first");
      return;
    }
    setPhotoError("");
    setUploading(true);

    const fileExt = photoFile.name.split(".").pop();
    const filePath = `${siteId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("site-photos")
      .upload(filePath, photoFile);

    if (uploadError) {
      setPhotoError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase.from("photos").insert([
      {
        site_id: siteId,
        storage_path: filePath,
        label: photoLabel || null,
      },
    ]);

    setUploading(false);

    if (insertError) {
      setPhotoError("Saved file, but couldn't record it: " + insertError.message);
      return;
    }

    setPhotoFile(null);
    setPhotoLabel("");
    e.target.reset?.();
    fetchPhotos();
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="page">
        <p style={{ padding: "3rem" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="/">
            <img src={logo} alt="TSEL" className="brand-logo" />
          </a>
          <div className="nav-actions">
            <button className="link-muted link-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="section-head" style={{ marginTop: "3rem" }}>
          <h2>{site?.code || "Site"}</h2>
          <p>
            {site?.loc}
            {site?.stage ? ` · ${site.stage}` : ""}
            {site?.progress != null ? ` · ${site.progress}% complete` : ""}
          </p>
        </div>

        <div style={{ maxWidth: "640px", margin: "0 auto 3rem", padding: "0 1.5rem" }}>
          <form className="auth-form" onSubmit={handleSubmitUpdate}>
            <label className="auth-field">
              <span>Daily update</span>
              <input
                type="text"
                placeholder="What happened on site today?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button className="btn btn-primary auth-submit" type="submit">
              Submit update
            </button>
          </form>
        </div>

        <div className="index-list">
          {updates.length === 0 && <p style={{ padding: "2rem 0" }}>No updates yet.</p>}
          {updates.map((u) => (
            <article className="index-row" key={u.id}>
              <span className="index-code">
                {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
              </span>
              <div className="index-copy">
                <p>{u.note}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="section-head" style={{ marginTop: "4rem" }}>
          <h2>Site photos</h2>
          <p>Upload progress photos for this site.</p>
        </div>

        <div style={{ maxWidth: "640px", margin: "0 auto 2rem", padding: "0 1.5rem" }}>
          <form className="auth-form" onSubmit={handleUploadPhoto}>
            <label className="auth-field">
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </label>

            <label className="auth-field">
              <span>Label (optional)</span>
              <input
                type="text"
                placeholder="e.g. Foundation, north wall"
                value={photoLabel}
                onChange={(e) => setPhotoLabel(e.target.value)}
              />
            </label>

            {photoError && <p className="auth-error">{photoError}</p>}

            <button className="btn btn-primary auth-submit" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload photo"}
            </button>
          </form>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
            maxWidth: "960px",
            margin: "0 auto 3rem",
            padding: "0 1.5rem",
          }}
        >
          {photos.length === 0 && (
            <p style={{ padding: "1rem 0", color: "var(--grey)" }}>No photos yet.</p>
          )}
          {photos.map((p) => (
            <div key={p.id} style={{ border: "1px solid var(--hairline)" }}>
              <img
                src={p._url}
                alt={p.label || "Site photo"}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {p.label && (
                <p
                  style={{
                    margin: 0,
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.8rem",
                    color: "var(--grey)",
                  }}
                >
                  {p.label}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
