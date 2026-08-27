import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const revalidate = 86400;

const MAX_TITLE = 110;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("title") ?? site.name;
  const title = raw.length > MAX_TITLE ? `${raw.slice(0, MAX_TITLE).trimEnd()}…` : raw;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0b0d12",
          backgroundImage:
            "radial-gradient(900px 500px at 12% 0%, rgba(16,185,129,0.20), transparent 60%), radial-gradient(700px 500px at 92% 100%, rgba(234,88,12,0.16), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#34d399,#f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b0d12",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            ch
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#f8fafc", fontSize: 28, fontWeight: 600 }}>Code Hippies</span>
            <span style={{ color: "#94a3b8", fontSize: 20 }}>Deepak Joshi</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#f8fafc",
            fontSize: title.length > 60 ? 58 : 70,
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#94a3b8", fontSize: 24 }}>
            Full-stack · Mobile · AI/LLM engineering
          </span>
          <span style={{ color: "#34d399", fontSize: 24, fontWeight: 500 }}>
            {site.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
