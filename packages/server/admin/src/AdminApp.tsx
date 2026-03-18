// @author João Gabriel de Almeida

import { useEffect, useState } from "react";

interface Feedback {
  id: string;
  highlight: {
    selector: string;
    boundingRect: { x: number; y: number; width: number; height: number };
    pageUrl: string;
    screenshot?: string;
  };
  comment: string;
  createdAt: string;
}

function getApiBase(): string {
  if (typeof window === "undefined") return "/api/owl";
  const base = (window as unknown as { __OWL_API_BASE__?: string }).__OWL_API_BASE__;
  if (base) return base.replace(/\/$/, "");
  const path = window.location.pathname;
  const adminIdx = path.lastIndexOf("/admin");
  if (adminIdx !== -1) return path.slice(0, adminIdx);
  return "/api/owl";
}

export function AdminApp() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const apiBase = getApiBase();
    fetch(`${apiBase}/feedback`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { feedbacks: Feedback[] }) => setFeedbacks(data.feedbacks))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter.trim() === ""
      ? feedbacks
      : feedbacks.filter(
          (f) =>
            f.highlight.pageUrl.toLowerCase().includes(filter.toLowerCase()) ||
            f.comment.toLowerCase().includes(filter.toLowerCase())
        );

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>Owl Feedback</h1>
        <input
          type="search"
          placeholder="Filter by URL or comment..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-filter"
        />
      </header>
      <main className="admin-list">
        {filtered.length === 0 ? (
          <p className="admin-empty">No feedback yet.</p>
        ) : (
          filtered.map((f) => (
            <article key={f.id} className="admin-card">
              <div className="admin-card-meta">
                <span className="admin-date">
                  {new Date(f.createdAt).toLocaleString()}
                </span>
                <a
                  href={f.highlight.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-url"
                >
                  {f.highlight.pageUrl}
                </a>
              </div>
              <div className="admin-selector">{f.highlight.selector}</div>
              <p className="admin-comment">{f.comment}</p>
              {f.highlight.screenshot && (
                <img
                  src={f.highlight.screenshot}
                  alt="Screenshot"
                  className="admin-screenshot"
                />
              )}
            </article>
          ))
        )}
      </main>
    </div>
  );
}
