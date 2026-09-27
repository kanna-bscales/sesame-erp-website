import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SesameERP — Custom ERP systems with AI agents built in";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 80px",
          backgroundColor: "#0f1012",
          color: "#ecedf1",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient glow behind content */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229,9,20,0.15) 0%, rgba(229,9,20,0.05) 40%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Canary accent line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #E50914 0%, #E50914 60%, #FFD84D 100%)",
            display: "flex",
          }}
        />

        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#E50914" />
            <g fill="#ffffff">
              <ellipse cx="11" cy="11.5" rx="4.3" ry="2.3" transform="rotate(-32 11 11.5)" />
              <ellipse cx="16" cy="16" rx="4.3" ry="2.3" transform="rotate(-32 16 16)" />
              <ellipse cx="21" cy="20.5" rx="4.3" ry="2.3" transform="rotate(-32 21 20.5)" />
            </g>
          </svg>
          <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            SesameERP
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Custom ERP systems,</span>
          <span>built fast.</span>
          <span style={{ color: "#a5a8b4", marginTop: "4px" }}>Powered by AI agents.</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: "32px",
            fontSize: "22px",
            color: "#a5a8b4",
            maxWidth: "680px",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          A working system delivered in a few weeks — not months.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #2a2c33",
            paddingTop: "20px",
          }}
        >
          <span style={{ fontSize: "16px", color: "#a5a8b4" }}>sesameerp.ai</span>
          <span style={{ fontSize: "16px", color: "#a5a8b4" }}>
            A product of Sesame Labs
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
