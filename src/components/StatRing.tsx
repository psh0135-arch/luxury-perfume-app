const StatRing = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: "primary" | "accent";
}) => {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  const stroke = color === "primary" ? "hsl(var(--primary))" : "hsl(var(--accent))";
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 flex-shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-base text-foreground">{pct}%</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="mt-1 font-serif text-lg leading-tight text-foreground">
          {value}
          <span className="text-sm text-muted-foreground"> / {total}</span>
        </p>
      </div>
    </div>
  );
};

export default StatRing;
