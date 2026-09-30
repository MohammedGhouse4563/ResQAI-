import React from 'react';

interface ResQLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const ResQLogo: React.FC<ResQLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  textColor = 'text-white'
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg 
        viewBox="0 0 512 512" 
        width={size} 
        height={size} 
        className="shrink-0 drop-shadow-md"
        aria-label="ResQAI Emergency Command Emblem"
      >
        <defs>
          <linearGradient id="waterGrad_cmp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d72fe" />
            <stop offset="100%" stopColor="#0052cc" />
          </linearGradient>

          <linearGradient id="fireGrad_cmp" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff3b00" />
            <stop offset="100%" stopColor="#ff7a00" />
          </linearGradient>

          <linearGradient id="quakeGrad_cmp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6e3314" />
            <stop offset="100%" stopColor="#4a200a" />
          </linearGradient>

          <linearGradient id="shieldGrad_cmp" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d6efd" />
            <stop offset="50%" stopColor="#0052cc" />
            <stop offset="100%" stopColor="#003580" />
          </linearGradient>

          <linearGradient id="handGrad_cmp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#28c73e" />
            <stop offset="100%" stopColor="#0f9923" />
          </linearGradient>

          <linearGradient id="pinGrad_cmp" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff2a2a" />
            <stop offset="100%" stopColor="#d90000" />
          </linearGradient>

          <clipPath id="circleClip_cmp">
            <circle cx="256" cy="256" r="236" />
          </clipPath>
        </defs>

        <g clipPath="url(#circleClip_cmp)">
          {/* Top-Left Sector: Water & Flood */}
          <path d="M 256,256 L 256,20 A 236,236 0 0,0 20,256 L 70,360 L 256,256 Z" fill="url(#waterGrad_cmp)" />
          
          {/* Top-Right Sector: Fire */}
          <path d="M 256,256 L 256,20 A 236,236 0 0,1 482,180 L 256,256 Z" fill="url(#fireGrad_cmp)" />
          
          {/* Bottom-Right Sector: Earthquake */}
          <path d="M 256,256 L 482,180 A 236,236 0 0,1 420,380 L 256,256 Z" fill="url(#quakeGrad_cmp)" />

          {/* Dividing Lines */}
          <line x1="256" y1="20" x2="256" y2="256" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <line x1="256" y1="256" x2="482" y2="180" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <line x1="256" y1="256" x2="20" y2="256" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />

          {/* Top-Left: Cloud, Rain Drops & Waves */}
          <g transform="translate(142, 130)">
            <path d="M -45,-5 C -55,-5 -62,-15 -58,-25 C -54,-35 -40,-38 -32,-35 C -28,-50 -5,-55 10,-48 C 22,-55 45,-45 42,-30 C 52,-28 55,-15 50,-5 Z" fill="#ffffff" />
            <g fill="#ffffff">
              <path d="M -40,12 C -40,17 -43,20 -46,20 C -49,20 -52,17 -52,12 C -52,7 -46,2 -46,2 C -46,2 -40,7 -40,12 Z" transform="rotate(-15, -46, 12)" />
              <path d="M -22,10 C -22,15 -25,18 -28,18 C -31,18 -34,15 -34,10 C -34,5 -28,0 -28,0 C -28,0 -22,5 -22,10 Z" transform="rotate(-15, -28, 10)" />
              <path d="M -4,12 C -4,17 -7,20 -10,20 C -13,20 -16,17 -16,12 C -16,7 -10,2 -10,2 C -10,2 -4,7 -4,12 Z" transform="rotate(-15, -10, 12)" />
              <path d="M 14,10 C 14,15 11,18 8,18 C 5,18 2,15 2,10 C 2,5 8,0 8,0 C 8,0 14,5 14,10 Z" transform="rotate(-15, 8, 10)" />
              <path d="M 32,12 C 32,17 29,20 26,20 C 23,20 20,17 20,12 C 20,7 26,2 26,2 C 26,2 32,7 32,12 Z" transform="rotate(-15, 26, 12)" />

              <path d="M -30,30 C -30,35 -33,38 -36,38 C -39,38 -42,35 -42,30 C -42,25 -36,20 -36,20 C -36,20 -30,25 -30,30 Z" transform="rotate(-15, -36, 30)" />
              <path d="M -12,28 C -12,33 -15,36 -18,36 C -21,36 -24,33 -24,28 C -24,23 -18,18 -18,18 C -18,18 -12,23 -12,28 Z" transform="rotate(-15, -18, 28)" />
              <path d="M 6,30 C 6,35 3,38 0,38 C -3,38 -6,35 -6,30 C -6,25 0,20 0,20 C 0,20 6,25 6,30 Z" transform="rotate(-15, 0, 30)" />
              <path d="M 24,28 C 24,33 21,36 18,36 C 15,36 12,33 12,28 C 12,23 18,18 18,18 C 18,18 24,23 24,28 Z" transform="rotate(-15, 18, 28)" />
            </g>
            <path d="M -60,65 Q -45,55 -30,65 T 0,65 T 30,65 T 60,65" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <path d="M -60,85 Q -45,75 -30,85 T 0,85 T 30,85 T 60,85" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          </g>

          {/* Top-Right: Fire */}
          <g transform="translate(345, 125)">
            <path d="M 0,45 C -25,45 -38,25 -38,5 C -38,-15 -25,-35 -15,-48 C -12,-35 -5,-25 0,-25 C 8,-42 22,-65 18,-85 C 35,-60 48,-30 48,5 C 48,28 32,45 0,45 Z" fill="#ffffff" />
            <path d="M 2,36 C -12,36 -20,24 -20,10 C -20,-4 -12,-18 -5,-26 C -3,-18 2,-12 6,-12 C 12,-22 18,-35 15,-46 C 24,-32 30,-12 30,10 C 30,24 20,36 2,36 Z" fill="url(#fireGrad_cmp)" />
          </g>

          {/* Bottom-Right: Earthquake House & Crack */}
          <g transform="translate(385, 235)">
            <path d="M -30,15 L 0,-15 L 30,15 L 22,15 L 22,45 L -22,45 L -22,15 Z" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinejoin="round" />
            <polygon points="0,-15 30,15 -30,15" fill="#ffffff" />
            <rect x="14" y="-12" width="7" height="15" fill="#ffffff" />
            <rect x="-7" y="22" width="14" height="23" fill="#ffffff" />
            <line x1="-55" y1="52" x2="45" y2="52" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <path d="M -22,52 L -32,70 L -12,85 L -26,105 L 12,120" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 0,52 L 10,72 L -5,88 L 8,108" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Bottom Green Hands */}
          <path d="M 250,455 C 210,455 130,440 90,380 C 65,340 55,290 62,255 C 65,240 85,245 88,260 C 95,295 115,350 160,385 C 195,410 230,412 245,412 Z" fill="url(#handGrad_cmp)" />
          <path d="M 125,320 C 115,360 145,415 220,435" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" opacity="0.9" />

          <path d="M 262,455 C 302,455 382,440 422,380 C 447,340 457,290 450,255 C 447,240 427,245 424,260 C 417,295 397,350 352,385 C 317,410 282,412 267,412 Z" fill="url(#handGrad_cmp)" />
          <path d="M 387,320 C 397,360 367,415 292,435" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" opacity="0.9" />

          <path d="M 80,280 C 60,340 90,420 180,470 C 215,488 297,488 332,470 C 422,420 452,340 432,280 C 455,345 425,435 345,482 C 300,505 212,505 167,482 C 87,435 57,345 80,280 Z" fill="url(#handGrad_cmp)" />
        </g>

        {/* Outer Circle Ring */}
        <circle cx="256" cy="256" r="236" fill="none" stroke="#ffffff" strokeWidth="8" />

        {/* Central Shield */}
        <g>
          {/* White Border */}
          <path d="M 256,105 C 315,130 355,140 362,175 C 370,250 340,325 256,385 C 172,325 142,250 150,175 C 157,140 197,130 256,105 Z" fill="#ffffff" />
          {/* Blue Shield Fill */}
          <path d="M 256,117 C 310,140 345,148 350,180 C 358,245 330,315 256,370 C 182,315 154,245 162,180 C 167,148 202,140 256,117 Z" fill="url(#shieldGrad_cmp)" />

          {/* Wifi Broadcast Waves */}
          <path d="M 215,180 C 230,165 282,165 297,180" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <path d="M 228,198 C 238,188 274,188 284,198" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />

          {/* Red Pin (SOS) */}
          <g transform="translate(256, 245)">
            <path d="M 0,65 C -2,-3 -50,-5 -50,-50 C -50,-78 -28,-100 0,-100 C 28,-100 50,-78 50,-50 C 50,-5 2,-3 0,65 Z" fill="url(#pinGrad_cmp)" stroke="#ffffff" strokeWidth="5" />
            <circle cx="0" cy="-50" r="32" fill="#ffffff" />
            <text x="0" y="-41" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="900" letterSpacing="0.5" fill="#d90000" textAnchor="middle">SOS</text>
          </g>

          {/* Three Citizen Icons */}
          <g fill="#ffffff">
            <circle cx="256" cy="326" r="14" />
            <path d="M 230,366 C 230,348 242,344 256,344 C 270,344 282,348 282,366 Z" />

            <circle cx="222" cy="328" r="10" />
            <path d="M 204,358 C 204,345 212,342 222,342 C 228,342 234,344 237,348 C 233,353 231,360 231,366 L 204,366 Z" />

            <circle cx="290" cy="328" r="10" />
            <path d="M 308,358 C 308,345 300,342 290,342 C 284,342 278,344 275,348 C 279,353 281,360 281,366 L 308,366 Z" />
          </g>
        </g>
      </svg>

      {showText && (
        <span className={`font-black tracking-tight ${textColor}`}>
          ResQAI
        </span>
      )}
    </div>
  );
};
