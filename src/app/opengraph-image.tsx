import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ARTHAMONT — Built on principle. Defined by time.";

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
          Conviction · Discipline · Longevity
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: 8, marginTop: 24, display: "flex" }}>
          <span style={{ color: "#D5A267" }}>A</span>RTHAMONT
        </div>
        <div style={{ fontSize: 40, color: "#A3AAB3", marginTop: 32 }}>
          Built on principle. Defined by time.
        </div>
        <div style={{ fontSize: 18, color: "#5F6873", marginTop: 48, letterSpacing: 4, textTransform: "uppercase" }}>
          Futures / Global Markets / Research
        </div>
      </div>
    ),
    size
  );
}
