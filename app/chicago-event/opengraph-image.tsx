import { ImageResponse } from "next/og";

export const alt = "PLMA 2026 exclusive: one ERP module built free, US$5,000 development value — SesameERP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social image for the PLMA 2026 campaign page; same layout as app/opengraph-image.tsx.
export default async function PlmaOgImage() {
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
            fontSize: "22px",
            color: "#FFD84D",
            fontWeight: 700,
            marginBottom: "18px",
            display: "flex",
          }}
        >
          PLMA 2026 attendee exclusive
        </div>
        <div
          style={{
            fontSize: "68px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "980px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Get one ERP module</span>
          <span>built for free.</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: "28px",
            fontSize: "26px",
            color: "#a5a8b4",
            maxWidth: "820px",
            lineHeight: 1.45,
            display: "flex",
          }}
        >
          US$5,000 worth of ERP development work, for PLMA conference users.
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
          <span style={{ fontSize: "16px", color: "#a5a8b4" }}>sesameerp.ai/chicago-event</span>
          <span style={{ fontSize: "16px", color: "#a5a8b4" }}>
            A product of BusinessScales.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
