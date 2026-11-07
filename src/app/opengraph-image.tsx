import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NAYXOR — Trade the plan. Not the noise.";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#090B0E",
          color: "#F1F0EC",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: 6, color: "#A3AAB3", textTransform: "uppercase" }}>
          Independent trader · Research · Execution
        </div>
        <div style={{ fontSize: 140, fontWeight: 700, letterSpacing: 8, marginTop: 24, display: "flex" }}>
          NAY<span style={{ color: "#D5A267" }}>X</span>OR
        </div>
        <div style={{ fontSize: 40, color: "#A3AAB3", marginTop: 32 }}>
          Trade the plan. Not the noise.
        </div>
        <div style={{ fontSize: 18, color: "#5F6873", marginTop: 48, letterSpacing: 4, textTransform: "uppercase" }}>
          US Futures / Forex / Indian Markets
        </div>
      </div>
    ),
    size
  );
}
