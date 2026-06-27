import { motion } from "framer-motion";

/** Decorative animated background: clouds, stars and confetti blobs. */
export function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Soft blobs */}
      <div className="absolute -top-24 -left-24 size-80 rounded-full bg-pink/30 blur-3xl" />
      <div className="absolute top-1/3 -right-32 size-96 rounded-full bg-sky/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 size-72 rounded-full bg-sun/30 blur-3xl" />

      {/* Clouds */}
      <Cloud className="absolute top-16 left-[8%] w-28 text-white/80 animate-float-slow" />
      <Cloud className="absolute top-40 right-[12%] w-36 text-white/70 animate-float-rev" />
      <Cloud className="absolute top-[60%] left-[6%] w-24 text-white/70 animate-float-slow" />

      {/* Stars */}
      {[
        { top: "12%", left: "30%", size: 14, color: "var(--sun)", delay: "0s" },
        { top: "22%", left: "70%", size: 10, color: "var(--pink)", delay: "0.7s" },
        { top: "48%", left: "22%", size: 12, color: "var(--violet)", delay: "1.4s" },
        { top: "70%", left: "78%", size: 16, color: "var(--sky)", delay: "0.3s" },
        { top: "85%", left: "44%", size: 12, color: "var(--sun)", delay: "1.1s" },
      ].map((s, i) => (
        <Star key={i} style={{ top: s.top, left: s.left, color: s.color, width: s.size, height: s.size, animationDelay: s.delay }} />
      ))}

      {/* Confetti dots */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: [0, 14, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
          className="absolute rounded-full"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            width: 6 + (i % 4) * 2,
            height: 6 + (i % 4) * 2,
            background:
              i % 4 === 0
                ? "var(--pink)"
                : i % 4 === 1
                  ? "var(--sky)"
                  : i % 4 === 2
                    ? "var(--sun)"
                    : "var(--violet)",
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="currentColor">
      <ellipse cx="35" cy="40" rx="25" ry="18" />
      <ellipse cx="60" cy="32" rx="28" ry="22" />
      <ellipse cx="88" cy="42" rx="22" ry="16" />
      <rect x="20" y="40" width="80" height="18" rx="9" />
    </svg>
  );
}

function Star({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="absolute animate-twinkle" style={style}>
      <path d="M12 2l2.6 6.6L21 10l-5 4.5L17.2 22 12 18.2 6.8 22 8 14.5 3 10l6.4-1.4z" />
    </svg>
  );
}
