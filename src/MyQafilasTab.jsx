import { useGroup } from "./contexts/GroupContext";
import { useAuth } from "./contexts/AuthContext";
import AuthPanel from "./components/AuthPanel";

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

export default function MyQafilasTab({ onSwitchGroup }) {
  const { isSignedIn } = useAuth();
  const { myGroups, loadingGroup, switchGroup, switchToSolo, isGroupMode, activeGroupId } = useGroup();

  if (!isSignedIn) {
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
          <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>My Qafilas</div>
          <div style={{ fontSize: 11, color: "#8899aa" }}>Sign in to see your private Qafilah groups.</div>
        </div>
        <AuthPanel title="Sign in to view your groups" />
      </div>
    );
  }

  const handleSelect = async (groupId) => {
    await switchGroup(groupId);
    onSwitchGroup?.();
  };

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
        <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>My Qafilas</div>
        <div style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.5 }}>
          Your private coordination groups for upcoming trips. Tap a group to open shared journey, schedule, and expenses.
        </div>
      </div>

      {isGroupMode && (
        <button
          type="button"
          onClick={switchToSolo}
          style={{
            width: "100%",
            marginBottom: 12,
            background: "#1a2a3a",
            border: "1px solid #2d4a6b",
            borderRadius: 8,
            padding: "10px",
            color: "#7aa0d4",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Switch to solo offline trip
        </button>
      )}

      {loadingGroup && (
        <div style={{ fontSize: 12, color: "#8899aa", marginBottom: 12 }}>Loading group…</div>
      )}

      {myGroups.length === 0 ? (
        <div
          style={{
            background: "#141420",
            borderRadius: 12,
            padding: "20px 14px",
            textAlign: "center",
            border: "1px solid #2a2a3a",
          }}
        >
          <div style={{ fontSize: 12, color: "#8899aa" }}>No groups yet. Join a Qafilah from the Upcoming tab.</div>
        </div>
      ) : (
        myGroups.map((g) => {
          const isActive = activeGroupId === g.id && isGroupMode;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => handleSelect(g.id)}
              style={{
                width: "100%",
                textAlign: "left",
                background: isActive ? "#1a2a1a" : "#141420",
                border: isActive ? "1px solid #2a4a2a" : "1px solid #2a2a3a",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 8,
                cursor: "pointer",
                borderLeft: "3px solid #d4af7a",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e6e6e6", marginBottom: 4, lineHeight: 1.4 }}>
                {g.event?.title || "Qafilah group"}
              </div>
              <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>
                {formatEventDate(g.event?.starts_at)} · {g.city}
              </div>
              <div style={{ fontSize: 10, color: g.role === "admin" ? "#7fd4a0" : "#6677aa" }}>
                {g.role === "admin" ? "Ameer (admin)" : "Member"} · {g.status}
                {isActive ? " · Active now" : ""}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
