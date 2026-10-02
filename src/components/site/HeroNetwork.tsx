const nodes = [
  { label: "Hospitality Business", y: 40 },
  { label: "Available Resources", y: 118 },
  { label: "Smart Matching", y: 196 },
  { label: "Business Requirement", y: 274 },
  { label: "Booking", y: 352 },
];

export function HeroNetwork() {
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 420 400" className="h-full w-full" role="img" aria-label="ResourceX matching flow">
        <defs>
          <linearGradient id="rx-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {[70, 210, 350].map((x) => (
          <line
            key={x}
            x1={x}
            y1="24"
            x2={x}
            y2="376"
            stroke="var(--color-primary)"
            strokeOpacity="0.08"
          />
        ))}

        {nodes.slice(0, -1).map((n, i) => (
          <g key={n.label}>
            <line
              x1="210"
              y1={n.y + 12}
              x2="210"
              y2={nodes[i + 1]!.y - 12}
              stroke="url(#rx-line)"
              strokeWidth="1.4"
              className="dash-flow"
            />
            <line
              x1="210"
              y1={n.y}
              x2={i % 2 === 0 ? 70 : 350}
              y2={nodes[i + 1]!.y}
              stroke="var(--color-primary)"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          </g>
        ))}

        {nodes.map((n, i) => (
          <g key={n.label}>
            <circle
              cx="210"
              cy={n.y}
              r="18"
              fill="var(--color-card)"
              stroke="var(--color-primary)"
              strokeOpacity="0.35"
            />
            <circle cx="210" cy={n.y} r="5" fill="var(--color-primary)" className="pulse-node" style={{ animationDelay: `${i * 0.4}s` }} />
            <text
              x="210"
              y={n.y + 36}
              textAnchor="middle"
              fill="var(--color-foreground)"
              fontSize="12"
              fontWeight="600"
              letterSpacing="0.06em"
            >
              {n.label.toUpperCase()}
            </text>
          </g>
        ))}

        {[70, 350].map((x) =>
          [70, 160, 250, 330].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="var(--color-primary)" fillOpacity="0.4" />
          )),
        )}
      </svg>
    </div>
  );
}
