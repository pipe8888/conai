function LogoSVG() {
  return (
    <svg height="50" viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="logo-glowBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A6FFF" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#1A6FFF" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="logo-dotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5599FF"/>
          <stop offset="100%" stopColor="#1A6FFF" stopOpacity="0.6"/>
        </radialGradient>
        <linearGradient id="logo-aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#66AAFF"/>
          <stop offset="100%" stopColor="#1A6FFF"/>
        </linearGradient>
        <mask id="logo-textGaps" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="680" height="280" fill="white"/>
          <rect x="219.14" y="75.8" width="241.73" height="113.6" fill="black" rx="2"/>
        </mask>
      </defs>

      <ellipse cx="340" cy="140" rx="130" ry="130" fill="url(#logo-glowBg)"/>
      <circle cx="340" cy="140" r="90" fill="none" stroke="#1A6FFF" strokeWidth="1.5" opacity="0.15"/>

      <circle cx="340" cy="140" r="90" fill="none" stroke="#AADDFF" strokeWidth="6" strokeLinecap="round" strokeDasharray="60 505" opacity="0.25">
        <animateTransform attributeName="transform" type="rotate" from="0 340 140" to="360 340 140" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="340" cy="140" r="90" fill="none" stroke="#66AAFF" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="50 515" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 340 140" to="360 340 140" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="340" cy="140" r="90" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="30 535" opacity="0.95">
        <animateTransform attributeName="transform" type="rotate" from="0 340 140" to="360 340 140" dur="2.5s" repeatCount="indefinite"/>
      </circle>

      <line x1="270" y1="95" x2="230" y2="68" mask="url(#logo-textGaps)" stroke="#1A6FFF" strokeWidth="1" opacity="0.3"/>
      <line x1="410" y1="95" x2="450" y2="68" mask="url(#logo-textGaps)" stroke="#1A6FFF" strokeWidth="1" opacity="0.3"/>
      <line x1="270" y1="185" x2="230" y2="212" mask="url(#logo-textGaps)" stroke="#1A6FFF" strokeWidth="1" opacity="0.3"/>
      <line x1="410" y1="185" x2="450" y2="212" mask="url(#logo-textGaps)" stroke="#1A6FFF" strokeWidth="1" opacity="0.3"/>
      <line x1="340" y1="50" x2="340" y2="20" stroke="#1A6FFF" strokeWidth="1" opacity="0.3"/>
      <line x1="340" y1="230" x2="340" y2="260" stroke="#1A6FFF" strokeWidth="1" opacity="0.3"/>

      {[[230,68],[450,68],[230,212],[450,212],[340,20],[340,260]].map(([cx,cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="url(#logo-dotGlow)"/>
          <circle cx={cx} cy={cy} r="2.5" fill="#88BBFF"/>
        </g>
      ))}

      <text x="340" y="165" textAnchor="middle">
        <tspan fill="#0a0a0f" fontFamily="'Segoe UI', sans-serif" fontSize="88" fontWeight="500">Con</tspan>
        <tspan fill="url(#logo-aiGrad)" fontFamily="'Segoe UI', sans-serif" fontSize="88" fontWeight="500">ai</tspan>
      </text>
    </svg>
  )
}

export default LogoSVG
