import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const inputStyle = {
  width: "100%",
  background: "#141420",
  border: "1px solid #2a2a3a",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#e6e6e6",
  fontSize: 12,
  boxSizing: "border-box",
};

export default function AuthPanel({ title = "Sign in to continue", onDismiss }) {
  const { signInWithEmail, isSignedIn, profile, user } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isSignedIn) {
    return (
      <div style={{ background: "#141420", borderRadius: 12, padding: "14px", border: "1px solid #2a2a3a" }}>
        <div style={{ fontSize: 12, color: "#7fd4a0", marginBottom: 4 }}>Signed in</div>
        <div style={{ fontSize: 13, color: "#e6e6e6", fontWeight: 600 }}>
          {profile?.display_name || user?.email}
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmail(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send magic link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#141420", borderRadius: 12, padding: "14px", border: "1px solid #2a2a3a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a" }}>{title}</div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            style={{ background: "none", border: "none", color: "#8899aa", cursor: "pointer", fontSize: 16 }}
          >
            ×
          </button>
        )}
      </div>
      <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 12, lineHeight: 1.5 }}>
        Use the same email as Gather Ummah. We will send a magic link to sign in.
      </div>
      {sent ? (
        <div style={{ fontSize: 12, color: "#7fd4a0", lineHeight: 1.5 }}>
          Check your email for the sign-in link, then return here.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{ ...inputStyle, marginBottom: 10 }}
          />
          {error && <div style={{ fontSize: 11, color: "#f08080", marginBottom: 8 }}>{error}</div>}
          <button
            type="submit"
            disabled={submitting || !email.trim()}
            style={{
              width: "100%",
              background: submitting ? "#3a3a4a" : "#d4af7a",
              border: "none",
              borderRadius: 8,
              padding: "10px",
              color: submitting ? "#8899aa" : "#1a1a2e",
              fontWeight: 700,
              fontSize: 12,
              cursor: submitting ? "default" : "pointer",
            }}
          >
            {submitting ? "Sending…" : "Send magic link"}
          </button>
        </form>
      )}
    </div>
  );
}
