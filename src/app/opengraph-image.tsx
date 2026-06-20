import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = "Paul's Hotel & Lodge, Bhedetar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
          background: "linear-gradient(135deg, #091625 0%, #14304f 60%, #1b3f72 100%)",
          color: "#fbfaf7",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 999,
              background: "#fbbf24",
              color: "#091625",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#fcd34d" }}>
            BHEDETAR · NEPAL
          </div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
          Paul&apos;s Hotel &amp; Lodge
        </div>
        <div style={{ fontSize: 34, marginTop: 24, color: "rgba(251,250,247,0.85)", maxWidth: 900 }}>
          Wake up above the clouds. Rooms, food &amp; valley views at Charles Point.
        </div>
        <div style={{ fontSize: 26, marginTop: 36, color: "#fcd34d" }}>
          ★ {siteConfig.rating.value} · {siteConfig.rating.count} Google reviews
        </div>
      </div>
    ),
    size,
  );
}
