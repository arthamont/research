"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export function EquityChart({ data }: { data: { date: string; equity: number; pnl: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--text-faint)", fontSize: 10, fontFamily: "var(--font-mono)" }}
          stroke="var(--border)"
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-faint)", fontSize: 10, fontFamily: "var(--font-mono)" }}
          stroke="var(--border)"
          tickLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text)",
          }}
          labelStyle={{ color: "var(--text-faint)" }}
        />
        <ReferenceLine y={0} stroke="var(--border-strong)" strokeDasharray="4 4" />
        <Line type="stepAfter" dataKey="equity" stroke="var(--accent)" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
