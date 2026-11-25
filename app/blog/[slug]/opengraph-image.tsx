import { ImageResponse } from "next/og";
import { blogPosts, visiblePosts } from "@/content/blog/posts";

// Social share image per article: brand mark, "Blog" label and the article title.
export const alt = "SesameERP blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return visiblePosts().map((p) => ({ slug: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const title = post?.title ?? "SesameERP blog";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0f1012",
          color: "#ecedf1",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#E50914" />
            <g fill="#ffffff">
              <ellipse cx="11" cy="11.5" rx="4.3" ry="2.3" transform="rotate(-32 11 11.5)" />
              <ellipse cx="16" cy="16" rx="4.3" ry="2.3" transform="rotate(-32 16 16)" />
              <ellipse cx="21" cy="20.5" rx="4.3" ry="2.3" transform="rotate(-32 21 20.5)" />
            </g>
          </svg>
          <span style={{ fontSize: "28px", fontWeight: 800 }}>SesameERP</span>
          <span
            style={{
              marginLeft: "8px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#16171b",
              backgroundColor: "#FFD84D",
              padding: "4px 14px",
              borderRadius: "999px",
            }}
          >
            Blog
          </span>
        </div>
        <div style={{ fontSize: "58px", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: "1000px", display: "flex" }}>
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #2a2c33",
            paddingTop: "20px",
            fontSize: "18px",
            color: "#a5a8b4",
          }}
        >
          <span>sesameerp.ai/blog</span>
          <span>Custom ERP systems with AI agents built in</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
