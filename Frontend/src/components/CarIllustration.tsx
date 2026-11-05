/**
 * Ilustração vetorial de carro (o backend não possui fotos).
 * A cor varia de forma estável a partir da marca/modelo.
 */
const COLORS = ['#e5e7eb', '#9ca3af', '#27272a', '#7f1d1d', '#1e3a8a', '#14532d', '#d4d4d8']

function pick(seed: string): string {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return COLORS[h % COLORS.length]
}

export function CarIllustration({
  marca,
  modelo,
  className = '',
}: {
  marca: string
  modelo: string
  className?: string
}) {
  const body = pick(`${marca}${modelo}`)
  return (
    <svg
      viewBox="0 0 320 120"
      role="img"
      aria-label={`${marca} ${modelo}`}
      className={className}
    >
      <ellipse cx="160" cy="108" rx="140" ry="7" fill="#000" opacity="0.45" />
      <path
        d="M16 84 L24 66 Q34 56 68 52 L108 30 Q124 22 152 22 L200 22 Q228 24 242 46 L278 52 Q302 56 305 72 L306 86 Q306 92 298 92 L22 92 Q14 92 16 84 Z"
        fill={body}
      />
      <path
        d="M114 34 Q126 28 150 28 L150 50 L96 50 Z M158 28 L198 28 Q218 30 230 50 L158 50 Z"
        fill="#0b0b0d"
        opacity="0.85"
      />
      <path d="M20 78 L300 78" stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
      <rect x="292" y="62" width="12" height="6" rx="2" fill="#fde68a" opacity="0.9" />
      <rect x="14" y="68" width="8" height="6" rx="2" fill="#ef4444" opacity="0.9" />
      {[80, 246].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="92" r="20" fill="#0a0a0b" />
          <circle cx={cx} cy="92" r="11" fill="#52525b" />
          <circle cx={cx} cy="92" r="4" fill="#0a0a0b" />
        </g>
      ))}
    </svg>
  )
}
