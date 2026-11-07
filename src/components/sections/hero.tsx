"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface HeroContent {
  eyebrow?: string;
  line1?: string;
  line2?: string;
  lede?: string;
  cta1Label?: string;
  cta2Label?: string;
  strip?: string;
  note?: string;
}

const DEFAULTS: Required<HeroContent> = {
  eyebrow: "Conviction. Discipline. Longevity.",
  line1: "Built on principle.",
  line2: "Defined by time.",
  lede: "An independent pursuit of disciplined trading, rigorous market research, and long-term capital stewardship.",
  cta1Label: "Explore our philosophy",
  cta2Label: "Discover our research",
  strip: "Futures / Global markets / Research",
  note: "An independent trading and research initiative with a long-term institutional vision.",
};

function Line({ delay, d }: { delay: number; d: string }) {
  return (
    <motion.path
      d={d}
      stroke="var(--accent)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1.6, delay, ease: EASE }}
    />
  );
}

export function Hero({ content }: { content?: HeroContent }) {
  const c = { ...DEFAULTS, ...content };
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 14;
    const y = (e.clientY / innerHeight - 0.5) * 10;
    ref.current.style.setProperty("--px", `${x}px`);
    ref.current.style.setProperty("--py", `${y}px`);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
    >
      {/* structural grid */}
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />

      {/* signature geometry — abstract price-path lines + precision node */}
      <motion.svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ translateX: "var(--px,0px)", translateY: "var(--py,0px)", transition: "translate 0.6s ease-out" }}
        aria-hidden
      >
        <Line delay={0.9} d="M-40 520 L 260 480 L 420 505 L 620 380 L 800 420 L 1000 250 L 1260 210" />
        <Line delay={1.2} d="M-40 620 L 300 610 L 560 640 L 840 560 L 1260 590" />
        <Line delay={1.5} d="M940 120 V 620 M860 240 H 1120" />
        <motion.circle
          cx="1000"
          cy="250"
          r="7"
          stroke="var(--accent)"
          strokeWidth="1"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.8, delay: 2.2, ease: EASE }}
          style={{ transformOrigin: "1000px 250px" }}
        />
        <motion.circle
          cx="1000"
          cy="250"
          r="2"
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        />
        {[620, 800].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={i === 0 ? 380 : 420}
            r="3"
            fill="var(--text-faint)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2 + i * 0.2 }}
          />
        ))}
      </motion.svg>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 pt-40 sm:px-8">
        <motion.p
          className="micro-label"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          {c.eyebrow}
        </motion.p>

        <div className="mt-8 overflow-hidden">
          <motion.h1
            className="font-display select-none text-[13vw] font-semibold leading-[0.95] tracking-[-0.02em] sm:text-[10vw] lg:text-[8.5rem]"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: EASE }}
            aria-label="ARTHAMONT"
          >
            <span className="relative inline-block">
              A
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-[62%] block h-[0.045em] w-[0.52em] -translate-x-1/2 bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 1.4, ease: EASE }}
              />
            </span>
            RTHAMONT
          </motion.h1>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.p
              className="font-display text-3xl font-medium text-text sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: EASE }}
            >
              {c.line1}
              <br />
              <span className="text-text-secondary">{c.line2}</span>
            </motion.p>
            <motion.p
              className="mt-6 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              {c.lede}
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col items-start gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
          >
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent-text"
              >
                {c.cta1Label}
              </Link>
              <Link
                href="/outlook"
                className="border border-border-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-text transition-colors hover:border-accent hover:text-accent-text"
              >
                {c.cta2Label}
              </Link>
            </div>
            <p className="micro-label">{c.strip}</p>
            <p className="text-[11px] italic leading-relaxed text-text-faint">{c.note}</p>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        aria-hidden
      >
        <span className="micro-label">Scroll</span>
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-accent to-transparent"
          animate={reduce ? {} : { scaleY: [1, 0.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
