function LogoSVG() {
  return (
    <svg width="92" height="44" viewBox="0 0 92 44" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lg-ai" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1A6FFF"/>
          <stop offset="100%" stopColor="#88CCFF"/>
        </linearGradient>
        <radialGradient id="lg-sphere" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1a2a4a"/>
          <stop offset="100%" stopColor="#080e1f"/>
        </radialGradient>
      </defs>

      {/* Node lines */}
      <line x1="22" y1="8"  x2="22" y2="3"  stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>
      <line x1="22" y1="36" x2="22" y2="41" stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>
      <line x1="8"  y1="22" x2="3"  y2="22" stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>
      <line x1="36" y1="22" x2="41" y2="22" stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>
      <line x1="31" y1="13" x2="35" y2="9"  stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>
      <line x1="13" y1="13" x2="9"  y2="9"  stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>
      <line x1="31" y1="31" x2="35" y2="35" stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>
      <line x1="13" y1="31" x2="9"  y2="35" stroke="#2a4a8a" strokeWidth="0.7" opacity="0.7"/>

      {/* Node dots */}
      {[[22,3],[22,41],[3,22],[41,22],[35,9],[9,9],[35,35],[9,35]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="#3a7bd5"/>
      ))}

      {/* Sphere */}
      <circle cx="22" cy="22" r="14" fill="url(#lg-sphere)"/>
      <circle cx="22" cy="22" r="14" fill="none" stroke="#1e3a6e" strokeWidth="0.8" opacity="0.6"/>

      {/* Rotating arcs — 3 layers */}
      <circle cx="22" cy="22" r="14" fill="none" stroke="#AADDFF" strokeWidth="4" strokeLinecap="round" strokeDasharray="18 70" opacity="0.15">
        <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="22" cy="22" r="14" fill="none" stroke="#66AAFF" strokeWidth="2" strokeLinecap="round" strokeDasharray="13 75" opacity="0.55">
        <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="22" cy="22" r="14" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeDasharray="6 82" opacity="0.95">
        <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="3s" repeatCount="indefinite"/>
      </circle>

      {/* C */}
      <text x="22" y="29" textAnchor="middle" fontSize="20" fontWeight="500" fill="#ffffff" fontFamily="'Segoe UI', sans-serif">C</text>

      {/* onai */}
      <text x="44" y="29" fontFamily="'Segoe UI', sans-serif" fontSize="18" fontWeight="500">
        <tspan fill="#ffffff">on</tspan>
        <tspan fill="url(#lg-ai)">ai</tspan>
      </text>
    </svg>
  )
}

export default LogoSVG
