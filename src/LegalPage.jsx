import { LEGAL_LAST_UPDATED, CONTACT_URL } from "./legalContent";

const sectionStyle = { marginBottom: 18 };
const headingStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#d4af7a",
  marginBottom: 8,
};
const paragraphStyle = {
  fontSize: 12,
  color: "#b8c0cc",
  lineHeight: 1.65,
  marginBottom: 8,
};
const listStyle = {
  margin: "0 0 8px 0",
  paddingLeft: 18,
  fontSize: 12,
  color: "#b8c0cc",
  lineHeight: 1.65,
};

export default function LegalPage({ document, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        padding: "12px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 600,
          maxHeight: "92vh",
          background: "#0d1117",
          borderRadius: "16px 16px 12px 12px",
          border: "1px solid #2a2a4a",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 16px 48px #000a",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #2a2a3a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            background: "linear-gradient(135deg, #1a0a30 0%, #0d1a30 100%)",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#d4af7a" }}>{document.title}</div>
            <div style={{ fontSize: 10, color: "#8899aa", marginTop: 2 }}>Last updated: {LEGAL_LAST_UPDATED}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "1px solid #3a3a5a",
              background: "#1a1a2e",
              color: "#c8d0dc",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
          <p style={{ ...paragraphStyle, color: "#c8d0dc", marginBottom: 16 }}>{document.intro}</p>

          {document.sections.map((section) => (
            <section key={section.heading} style={sectionStyle}>
              <h2 style={headingStyle}>{section.heading}</h2>
              {section.paragraphs?.map((text, i) => (
                <p key={i} style={paragraphStyle}>{text}</p>
              ))}
              {section.list && (
                <ul style={listStyle}>
                  {section.list.map((item) => (
                    <li key={item} style={{ marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              )}
              {section.afterList && <p style={paragraphStyle}>{section.afterList}</p>}
            </section>
          ))}

          <div
            style={{
              marginTop: 8,
              padding: "12px 14px",
              background: "#141420",
              borderRadius: 10,
              border: "1px solid #2a2a3a",
            }}
          >
            <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 6 }}>Contact</div>
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#d4af7a", wordBreak: "break-all" }}
            >
              {CONTACT_URL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
