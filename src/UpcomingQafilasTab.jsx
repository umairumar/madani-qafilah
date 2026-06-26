import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useGroup } from "./contexts/GroupContext";
import AuthPanel from "./components/AuthPanel";

const GATHER_UMMAH_BASE = "https://gatherummah.com";
const TRAVEL_LISTING_URL = `${GATHER_UMMAH_BASE}/events/category/travel`;

function eventUrl(id) {
  return `${GATHER_UMMAH_BASE}/events/${id}`;
}

function formatEventDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

async function fetchUpcomingTravelEvents() {
  const { supabase } = await import("./lib/supabaseClient");
  const { data, error } = await supabase
    .from("events")
    .select("id, title, starts_at, ends_at, city, venue_name, image_url, rsvp_count, is_free")
    .eq("category_slug", "travel")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(20);

  if (error) throw error;
  return data || [];
}

export default function UpcomingQafilasTab({ onJoined }) {
  const { isSignedIn } = useAuth();
  const { joinGroup } = useGroup();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningId, setJoiningId] = useState(null);
  const [authEventId, setAuthEventId] = useState(null);
  const [joinError, setJoinError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUpcomingTravelEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || "Could not load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleJoin = async (eventId) => {
    setJoinError(null);
    if (!isSignedIn) {
      setAuthEventId(eventId);
      return;
    }
    setJoiningId(eventId);
    try {
      await joinGroup(eventId);
      onJoined?.();
    } catch (err) {
      setJoinError(err.message || "Could not join this Qafilah group.");
    } finally {
      setJoiningId(null);
    }
  };

  useEffect(() => {
    if (isSignedIn && authEventId) {
      const id = authEventId;
      setAuthEventId(null);
      handleJoin(id);
    }
  }, [isSignedIn, authEventId]);

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#1a2030,#0d1a30)",
          borderRadius: 12,
          padding: "12px 14px",
          marginBottom: 14,
          border: "1px solid #2a3a4a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>Upcoming Qafilas</div>
            <div style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.5 }}>
              Tap <strong style={{ color: "#c8d0dc" }}>I'm going</strong> to RSVP and join the private coordination group for that trip.
            </div>
          </div>
          <button
            type="button"
            onClick={loadEvents}
            disabled={loading}
            style={{
              flexShrink: 0,
              background: "#1a2a3a",
              border: "1px solid #2d4a6b",
              borderRadius: 8,
              padding: "6px 10px",
              color: loading ? "#556" : "#7aa0d4",
              fontSize: 11,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {authEventId && !isSignedIn && (
        <div style={{ marginBottom: 14 }}>
          <AuthPanel
            title="Sign in to join this Qafilah"
            onDismiss={() => setAuthEventId(null)}
          />
        </div>
      )}

      {joinError && (
        <div style={{ fontSize: 11, color: "#f08080", marginBottom: 12, lineHeight: 1.5 }}>{joinError}</div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: "#141420", borderRadius: 12, height: 120, border: "1px solid #2a2a3a", opacity: 0.6 }} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#1a1010", borderRadius: 12, padding: "14px", border: "1px solid #4a2a2a" }}>
          <div style={{ fontSize: 12, color: "#f08080", marginBottom: 10 }}>{error}</div>
          <button type="button" onClick={loadEvents} style={{ background: "#2a2a3a", border: "none", borderRadius: 8, padding: "8px 14px", color: "#c8d0dc", fontSize: 12, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div style={{ background: "#141420", borderRadius: 12, padding: "24px 14px", textAlign: "center", border: "1px solid #2a2a3a" }}>
          <div style={{ fontSize: 12, color: "#8899aa", marginBottom: 12 }}>No upcoming travel events right now.</div>
          <a href={TRAVEL_LISTING_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#7aa0d4", fontWeight: 600 }}>
            Browse on Gather Ummah →
          </a>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "#141420",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #2a2a3a",
                borderLeft: "3px solid #d4af7a",
              }}
            >
              <div style={{ display: "flex", gap: 0, flexDirection: event.image_url ? "row" : "column" }}>
                {event.image_url && (
                  <img src={event.image_url} alt="" style={{ width: 100, minHeight: 100, objectFit: "cover", flexShrink: 0, background: "#1e2030" }} />
                )}
                <div style={{ flex: 1, padding: "12px 14px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    {event.is_free && (
                      <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, background: "#0d1f14", color: "#7fd4a0", fontWeight: 600, textTransform: "uppercase" }}>Free</span>
                    )}
                    <span style={{ fontSize: 10, color: "#8899aa" }}>{formatEventDate(event.starts_at)}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e6e6e6", marginBottom: 6, lineHeight: 1.4 }}>{event.title}</div>
                  <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>{event.city}</div>
                  <div style={{ fontSize: 11, color: "#6677aa", marginBottom: 10 }}>{event.rsvp_count ?? 0} attending on Gather Ummah</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleJoin(event.id)}
                      disabled={joiningId === event.id}
                      style={{
                        display: "inline-block",
                        background: joiningId === event.id ? "#3a3a4a" : "#d4af7a",
                        color: joiningId === event.id ? "#8899aa" : "#1a1a2e",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 14px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: joiningId === event.id ? "default" : "pointer",
                      }}
                    >
                      {joiningId === event.id ? "Joining…" : "I'm going"}
                    </button>
                    <a href={eventUrl(event.id)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#7aa0d4", fontWeight: 600, textDecoration: "none" }}>
                      View on Gather Ummah
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #2a2a3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#556", marginBottom: 8 }}>Events powered by Gather Ummah</div>
        <a href={TRAVEL_LISTING_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#7aa0d4", fontWeight: 600 }}>
          View all travel events →
        </a>
      </div>
    </div>
  );
}
