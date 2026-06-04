function LogoSVG() {
  return (
    <svg width="112" height="40" viewBox="0 0 112 40" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lg-txt" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1A6FFF"/>
          <stop offset="100%" stopColor="#33AAFF"/>
        </linearGradient>
        <radialGradient id="rg-ai" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#7ECCFF"/>
          <stop offset="58%" stopColor="#1A6FFF"/>
          <stop offset="100%" stopColor="#003BB5"/>
        </radialGradient>
        <radialGradient id="rg-nd" cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#5588FF"/>
          <stop offset="100%" stopColor="#0D49BE"/>
        </radialGradient>
        <radialGradient id="rg-hl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A6FFF" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#1A6FFF" stopOpacity="0"/>
        </radialGradient>
        <filter id="fi-gl" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer triangle skeleton */}
      <line x1="8" y1="22" x2="19" y2="6" stroke="#1A6FFF" strokeWidth="0.55" opacity="0.18" strokeLinecap="round"/>
      <line x1="19" y1="6" x2="30" y2="22" stroke="#1A6FFF" strokeWidth="0.55" opacity="0.18" strokeLinecap="round"/>
      <line x1="8" y1="22" x2="30" y2="22" stroke="#1A6FFF" strokeWidth="0.55" opacity="0.14" strokeLinecap="round"/>

      {/* Neural pathways */}
      <line x1="8" y1="22" x2="13" y2="14" stroke="#1A6FFF" strokeWidth="1.2" opacity="0.72" strokeLinecap="round"/>
      <line x1="13" y1="14" x2="19" y2="6" stroke="#1A6FFF" strokeWidth="1.2" opacity="0.72" strokeLinecap="round"/>
      <line x1="19" y1="6" x2="25" y2="14" stroke="#2878FF" strokeWidth="1.2" opacity="0.78" strokeLinecap="round"/>
      <line x1="25" y1="14" x2="30" y2="22" stroke="#3A99FF" strokeWidth="1.4" opacity="0.88" strokeLinecap="round"/>
      <line x1="13" y1="14" x2="25" y2="14" stroke="#1E70EE" strokeWidth="0.9" opacity="0.48" strokeLinecap="round"/>

      {/* Bottom arc */}
      <line x1="8" y1="22" x2="19" y2="30" stroke="#1A6FFF" strokeWidth="0.9" opacity="0.42" strokeLinecap="round"/>
      <line x1="19" y1="30" x2="30" y2="22" stroke="#3AACFF" strokeWidth="1.1" opacity="0.52" strokeLinecap="round"/>

      {/* Diagonal cross-connects */}
      <line x1="13" y1="14" x2="19" y2="30" stroke="#1A6FFF" strokeWidth="0.55" opacity="0.22" strokeLinecap="round"/>
      <line x1="25" y1="14" x2="19" y2="30" stroke="#3AACFF" strokeWidth="0.55" opacity="0.22" strokeLinecap="round"/>

      {/* AI node pulsing halo */}
      <circle cx="30" cy="22" r="9" fill="url(#rg-hl)">
        <animate attributeName="r" values="8;13;8" dur="3s" repeatCount="indefinite" calcMode="ease"/>
        <animate attributeName="opacity" values="1;0.45;1" dur="3s" repeatCount="indefinite" calcMode="ease"/>
      </circle>

      {/* Secondary nodes: S1(13,14), S2(25,14), T1(19,30) */}
      <circle cx="13" cy="14" r="2.2" fill="#1A6FFF" opacity="0.82"/>
      <circle cx="13" cy="14" r="0.9" fill="#AACEFF" opacity="0.95"/>
      <circle cx="25" cy="14" r="2.2" fill="#2070EE" opacity="0.85"/>
      <circle cx="25" cy="14" r="0.9" fill="#AACEFF" opacity="0.95"/>
      <circle cx="19" cy="30" r="1.8" fill="#1A6FFF" opacity="0.6"/>
      <circle cx="19" cy="30" r="0.75" fill="#AACEFF" opacity="0.8"/>

      {/* CO — left main node */}
      <circle cx="8" cy="22" r="3.8" fill="url(#rg-nd)"/>
      <circle cx="8" cy="22" r="1.5" fill="#D0E8FF"/>

      {/* N — top main node */}
      <circle cx="19" cy="6" r="3.8" fill="url(#rg-nd)"/>
      <circle cx="19" cy="6" r="1.5" fill="#D0E8FF"/>

      {/* AI — right main node (glowing, largest) */}
      <circle cx="30" cy="22" r="5" fill="url(#rg-ai)" filter="url(#fi-gl)"/>
      <circle cx="30" cy="22" r="2" fill="#EBF7FF"/>

      {/* Neural signal: CO → S1 → S2 → AI */}
      <circle r="1.4" fill="#88DDFF">
        <animateMotion path="M8,22 L13,14 L25,14 L30,22" dur="2.6s" repeatCount="indefinite" calcMode="linear"/>
        <animate attributeName="opacity" values="0;0.88;0.88;0" keyTimes="0;0.06;0.88;1" dur="2.6s" repeatCount="indefinite"/>
      </circle>

      {/* Wordmark */}
      <text fontFamily="'Segoe UI','Inter',-apple-system,sans-serif" y="28">
        <tspan x="43" fontSize="19" fontWeight="600" fill="#0a0a0f" letterSpacing="-0.4">Con</tspan>
        <tspan fontSize="20" fontWeight="800" fill="url(#lg-txt)" letterSpacing="-0.2">AI</tspan>
      </text>

    </svg>
  )
}

export default LogoSVG
