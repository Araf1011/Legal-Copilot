import React from 'react';

export default function BangladeshLegalBackdrop({ className = "" }) {
  // Key judicial city coordinates mapped to an 800x900 cartographic SVG space
  const judicialNodes = [
    { name: 'Dhaka', bn: 'ঢাকা (সুপ্রিম কোর্ট)', x: 420, y: 470, isApex: true, type: 'Supreme Court & CMM' },
    { name: 'Chittagong', bn: 'চট্টগ্রাম', x: 570, y: 640, type: 'District & Sessions' },
    { name: 'Sylhet', bn: 'সিলেট', x: 580, y: 340, type: 'Divisional Registry' },
    { name: 'Rajshahi', bn: 'রাজশাহী', x: 250, y: 400, type: 'District Court' },
    { name: 'Khulna', bn: 'খুলনা', x: 310, y: 620, type: 'Judges Court' },
    { name: 'Barishal', bn: 'বরিশাল', x: 410, y: 650, type: 'Divisional Court' },
    { name: 'Rangpur', bn: 'রংপুর', x: 260, y: 220, type: 'Circuit Bench' },
    { name: 'Mymensingh', bn: 'ময়মনসিংহ', x: 420, y: 350, type: 'District Court' },
  ];

  return (
    <div className={`pointer-events-none select-none relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 900 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle sovereign gradients */}
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id="riverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
          </linearGradient>

          <radialGradient id="apexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
          </radialGradient>

          {/* Cartographic hatching pattern */}
          <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#0f766e" strokeWidth="0.5" strokeOpacity="0.08" />
          </pattern>
        </defs>

        {/* ── Cartographic Coordinates & Grid Lines ── */}
        <g stroke="#d6cebf" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6">
          {/* Latitude Lines */}
          <line x1="80" y1="200" x2="820" y2="200" />
          <text x="90" y="195" fill="#a8a29e" fontSize="9" fontFamily="monospace">26° 00' N (Tetulia)</text>

          <line x1="80" y1="360" x2="820" y2="360" />
          <text x="90" y="355" fill="#a8a29e" fontSize="9" fontFamily="monospace">24° 30' N (Mymensingh/Sylhet)</text>

          {/* Tropic of Cancer (কর্কটক্রান্তি রেখা) */}
          <line x1="80" y1="480" x2="820" y2="480" stroke="#b45309" strokeWidth="0.8" strokeDasharray="6 4" strokeOpacity="0.5" />
          <text x="680" y="475" fill="#b45309" fontSize="9" fontFamily="serif" fontWeight="bold">Tropic of Cancer (২৩.৫° উত্তর)</text>

          <line x1="80" y1="640" x2="820" y2="640" />
          <text x="90" y="635" fill="#a8a29e" fontSize="9" fontFamily="monospace">22° 30' N (Barishal/Khulna)</text>

          {/* Longitude Lines */}
          <line x1="260" y1="100" x2="260" y2="880" />
          <text x="265" y="870" fill="#a8a29e" fontSize="9" fontFamily="monospace">89° E</text>

          <line x1="420" y1="100" x2="420" y2="880" />
          <text x="425" y="870" fill="#a8a29e" fontSize="9" fontFamily="monospace">90° E (Dhaka Meridian)</text>

          <line x1="580" y1="100" x2="580" y2="880" />
          <text x="585" y="870" fill="#a8a29e" fontSize="9" fontFamily="monospace">91° 30' E</text>
        </g>

        {/* ── Artistic Detailed Silhouette of Bangladesh Map ── */}
        {/* Geographic contour path calibrated to Bangladesh boundaries */}
        <g id="bangladesh-boundary">
          {/* Subtle drop shadow/glow behind the map */}
          <path
            d="
              M 220 160
              C 240 140, 260 130, 280 140
              C 300 150, 310 180, 330 190
              C 360 180, 400 190, 440 210
              C 480 200, 520 220, 560 250
              C 600 270, 630 300, 630 330
              C 640 370, 610 400, 590 420
              C 620 440, 660 480, 680 540
              C 700 600, 690 680, 660 740
              C 640 780, 620 830, 590 850
              C 560 840, 540 800, 520 780
              C 500 760, 480 770, 450 780
              C 420 800, 390 810, 360 800
              C 330 790, 300 750, 280 720
              C 260 680, 240 650, 230 600
              C 220 560, 230 520, 240 480
              C 230 450, 210 420, 200 380
              C 190 340, 190 300, 200 260
              C 210 220, 200 180, 220 160
              Z
            "
            fill="url(#mapGradient)"
            stroke="#0f766e"
            strokeWidth="1.8"
            strokeOpacity="0.45"
          />

          {/* Internal Landmass Hatching Accent (Topographic Feel) */}
          <path
            d="
              M 240 200
              C 320 200, 420 230, 520 270
              C 580 320, 600 400, 570 480
              C 530 560, 480 680, 380 740
              C 280 700, 240 580, 230 480
              C 220 380, 220 260, 240 200
              Z
            "
            fill="url(#hatch)"
            opacity="0.7"
          />
        </g>

        {/* ── River Network (পদ্মা, মেঘনা, যমুনা - Bengal Delta Lifelines) ── */}
        <g id="rivers" fill="none" stroke="url(#riverGradient)" strokeLinecap="round">
          {/* Jamuna River coming from North */}
          <path d="M 320 190 Q 330 280, 350 360 T 380 460" strokeWidth="2.5" />
          
          {/* Padma River coming from West */}
          <path d="M 210 420 Q 280 430, 340 450 T 380 460" strokeWidth="2.5" />

          {/* Combined Padma & Lower Meghna down to the Bay */}
          <path d="M 380 460 Q 420 490, 450 540 T 480 660 Q 500 730, 510 790" strokeWidth="3.5" />

          {/* Surma / Meghna from Northeast */}
          <path d="M 610 320 Q 560 380, 500 440 T 450 540" strokeWidth="2" />

          {/* Coastal Estuary Branches */}
          <path d="M 450 540 Q 390 620, 340 730" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 480 660 Q 560 700, 600 760" strokeWidth="1.5" strokeDasharray="3 2" />
          
          {/* River Label */}
          <text x="390" y="445" fill="#0284c7" fontSize="8" fontFamily="serif" fontStyle="italic" opacity="0.6">পদ্মা-মেঘনা সঙ্গমস্থল</text>
        </g>

        {/* ── Classical Nautical Compass Rose (দিগদর্শন যন্ত্র) in Upper Right ── */}
        <g id="compass" transform="translate(730, 190) scale(0.85)" opacity="0.65">
          {/* Outer ring with graduation marks */}
          <circle cx="0" cy="0" r="60" stroke="#0f766e" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="0" cy="0" r="52" stroke="#b45309" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="44" stroke="#0f766e" strokeWidth="0.5" strokeDasharray="1 2" />

          {/* 4 Cardinal Diamond Points */}
          {/* North Point */}
          <polygon points="0,-52 6,-12 0,-4" fill="#0f766e" />
          <polygon points="0,-52 -6,-12 0,-4" fill="#044e46" />
          {/* South Point */}
          <polygon points="0,52 6,12 0,4" fill="#b45309" />
          <polygon points="0,52 -6,12 0,4" fill="#78350f" />
          {/* East Point */}
          <polygon points="52,0 12,6 4,0" fill="#0f766e" />
          <polygon points="52,0 12,-6 4,0" fill="#044e46" />
          {/* West Point */}
          <polygon points="-52,0 -12,6 -4,0" fill="#0f766e" />
          <polygon points="-52,0 -12,-6 -4,0" fill="#044e46" />

          {/* Compass Letters */}
          <text x="0" y="-58" textAnchor="middle" fill="#0f766e" fontSize="11" fontFamily="serif" fontWeight="bold">N</text>
          <text x="0" y="68" textAnchor="middle" fill="#b45309" fontSize="10" fontFamily="serif">S</text>
          <text x="65" y="4" textAnchor="start" fill="#0f766e" fontSize="10" fontFamily="serif">E</text>
          <text x="-65" y="4" textAnchor="end" fill="#0f766e" fontSize="10" fontFamily="serif">W</text>

          {/* Center Pivot */}
          <circle cx="0" cy="0" r="3" fill="#b45309" />
        </g>

        {/* ── Classical Sovereign Emblem & Scales of Justice Watermark (Lower Left) ── */}
        <g id="sovereign-emblem" transform="translate(140, 720) scale(0.9)" opacity="0.65">
          {/* Seal Double Ring */}
          <circle cx="0" cy="0" r="68" stroke="#0f766e" strokeWidth="1.2" strokeDasharray="4 2" />
          <circle cx="0" cy="0" r="62" stroke="#b45309" strokeWidth="0.8" />

          {/* Circular Text Placeholder Path */}
          <text x="0" y="-48" textAnchor="middle" fill="#0f766e" fontSize="7" fontFamily="serif" fontWeight="bold" letterSpacing="1.5">
            JURISPRUDENTIA BANGLADESH
          </text>
          <text x="0" y="54" textAnchor="middle" fill="#b45309" fontSize="6.5" fontFamily="serif" letterSpacing="1">
            • STATUTORY INTEGRITY •
          </text>

          {/* Engraved Scales of Justice Icon Inside Seal */}
          <g transform="translate(0, -2) scale(0.85)">
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#0f766e" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="-30" y1="-14" x2="30" y2="-14" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
            {/* Center finial */}
            <circle cx="0" cy="-28" r="3" fill="#b45309" />
            {/* Left pan */}
            <path d="M -30 -14 L -40 6 L -20 6 Z" stroke="#0f766e" strokeWidth="1" fill="#0f766e" fillOpacity="0.1" />
            <line x1="-40" y1="6" x2="-20" y2="6" stroke="#b45309" strokeWidth="1.5" />
            {/* Right pan */}
            <path d="M 30 -14 L 20 6 L 40 6 Z" stroke="#0f766e" strokeWidth="1" fill="#0f766e" fillOpacity="0.1" />
            <line x1="20" y1="6" x2="40" y2="6" stroke="#b45309" strokeWidth="1.5" />
            {/* Pedestal */}
            <path d="M -12 28 L 12 28 M -18 32 L 18 32" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        {/* ── 8 Divisional Judicial Nodes with Pulsing High Court Beacon ── */}
        <g id="judicial-nodes">
          {judicialNodes.map((node, i) => (
            <g key={i} transform={`translate(${node.x}, ${node.y})`}>
              {node.isApex ? (
                /* Supreme Court / Dhaka Beacon (Special Pulsing Sovereign Node) */
                <g>
                  {/* Outer pulsating radial glow */}
                  <circle cx="0" cy="0" r="36" fill="url(#apexGlow)" className="animate-pulse" />
                  <circle cx="0" cy="0" r="16" stroke="#0f766e" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
                  <circle cx="0" cy="0" r="8" fill="#0f766e" fillOpacity="0.2" />
                  <circle cx="0" cy="0" r="4.5" fill="#0f766e" />
                  <circle cx="0" cy="0" r="2" fill="#fef08a" />
                  
                  {/* Elegant Judicial Callout Label */}
                  <rect x="12" y="-18" width="138" height="28" rx="6" fill="#ffffff" fillOpacity="0.95" stroke="#0f766e" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
                  <text x="20" y="-5" fill="#0f766e" fontSize="9.5" fontFamily="serif" fontWeight="bold">
                    🏛️ {node.name}
                  </text>
                  <text x="20" y="6" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">
                    Apex Court • High Court
                  </text>
                </g>
              ) : (
                /* Divisional District Registry Points */
                <g opacity="0.85">
                  <circle cx="0" cy="0" r="10" fill="#0d9488" fillOpacity="0.08" />
                  <circle cx="0" cy="0" r="4" stroke="#0f766e" strokeWidth="1.2" fill="#ffffff" />
                  <circle cx="0" cy="0" r="2" fill="#b45309" />
                  <text x="8" y="3" fill="#1e293b" fontSize="8.5" fontFamily="serif" fontWeight="600">
                    {node.name}
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>

        {/* ── Classical Cartographic Boundary Scale & Title Cartouche ── */}
        <g id="cartouche" transform="translate(80, 840)" opacity="0.65">
          <text x="0" y="0" fill="#0f766e" fontSize="10" fontFamily="serif" fontWeight="bold" letterSpacing="0.8">
            STATUTORY CARTOGRAPHY OF BANGLADESH
          </text>
          <text x="0" y="13" fill="#78716c" fontSize="8" fontFamily="sans-serif">
            64 Districts • 8 Administrative Divisions • Universal Jurisdiction
          </text>
          {/* Nautical Distance Bar */}
          <line x1="0" y1="22" x2="160" y2="22" stroke="#1c1917" strokeWidth="1.5" />
          <line x1="0" y1="18" x2="0" y2="26" stroke="#1c1917" strokeWidth="1.5" />
          <line x1="80" y1="19" x2="80" y2="25" stroke="#1c1917" strokeWidth="1" />
          <line x1="160" y1="18" x2="160" y2="26" stroke="#1c1917" strokeWidth="1.5" />
          <text x="0" y="34" fill="#a8a29e" fontSize="7" fontFamily="monospace">0 km</text>
          <text x="73" y="34" fill="#a8a29e" fontSize="7" fontFamily="monospace">150 km</text>
          <text x="145" y="34" fill="#a8a29e" fontSize="7" fontFamily="monospace">300 km</text>
        </g>

        {/* Bay of Bengal Label (বঙ্গোপসাগর) with Wave Motif */}
        <g id="bay-of-bengal" transform="translate(480, 880)" opacity="0.5">
          <path d="M 0 0 C 15 -4, 30 4, 45 0 C 60 -4, 75 4, 90 0 C 105 -4, 120 4, 135 0" stroke="#0ea5e9" strokeWidth="0.8" fill="none" />
          <text x="68" y="16" textAnchor="middle" fill="#0284c7" fontSize="11" fontFamily="serif" letterSpacing="2" fontStyle="italic">
            BAY OF BENGAL (বঙ্গোপসাগর)
          </text>
        </g>
      </svg>
    </div>
  );
}

