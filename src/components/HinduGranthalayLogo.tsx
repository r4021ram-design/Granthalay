import React from 'react';

interface HinduGranthalayLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const HinduGranthalayLogo: React.FC<HinduGranthalayLogoProps> = ({
  size = 48,
  className = '',
  showText = false,
  textColor = 'text-amber-100',
}) => {
  return (
    <div className={`inline-flex items-center space-x-3.5 select-none ${className}`}>
      {/* Sacred SVG Emblem */}
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D0F06] via-[#1A0802] to-[#0A0402] border border-amber-500/40 shadow-xl shadow-amber-950/60 p-1.5 group transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(234,88,12,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sacred Gold Gradient */}
            <linearGradient id="sacredGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1B8" />
              <stop offset="40%" stopColor="#FFC53D" />
              <stop offset="80%" stopColor="#D48806" />
              <stop offset="100%" stopColor="#874D00" />
            </linearGradient>

            {/* Saffron Flame Gradient */}
            <linearGradient id="saffronFlame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#D9363E" />
              <stop offset="40%" stopColor="#FA541C" />
              <stop offset="80%" stopColor="#FA8C16" />
              <stop offset="100%" stopColor="#FFEC3D" />
            </linearGradient>

            {/* Radiant Halo Glow */}
            <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FA8C16" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#FA541C" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FA541C" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="50" cy="50" r="46" fill="url(#haloGlow)" />

          {/* Outer Sacred Mandali Ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#sacredGoldGrad)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            opacity="0.7"
          />

          {/* 8 Sun Rays / Lotus Petal Accents */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <line
                x1="50"
                y1="7"
                x2="50"
                y2="11"
                stroke="url(#sacredGoldGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="13" r="1" fill="#FFC53D" />
            </g>
          ))}

          {/* Consecrated Pothi / Open Scripture Base */}
          <path
            d="M 18 68 Q 34 60 50 67 Q 66 60 82 68 L 84 76 Q 66 69 50 75 Q 34 69 16 76 Z"
            fill="url(#sacredGoldGrad)"
            opacity="0.9"
          />
          <path
            d="M 20 63 Q 35 55 50 62 Q 65 55 80 63 L 82 69 Q 65 62 50 68 Q 35 62 18 69 Z"
            fill="#FFF1B8"
            opacity="0.95"
          />

          {/* Scripture Page Spine Knot */}
          <circle cx="50" cy="65" r="2.5" fill="#874D00" />

          {/* Sacred Kalasha / Jyoti Base */}
          <path
            d="M 38 60 C 38 52 42 46 50 46 C 58 46 62 52 62 60 Z"
            fill="url(#sacredGoldGrad)"
            opacity="0.85"
          />

          {/* Akhanda Jyoti (Sacred Flame) */}
          <path
            d="M 50 18 C 54 28 60 34 57 42 C 55 48 45 48 43 42 C 40 34 46 28 50 18 Z"
            fill="url(#saffronFlame)"
          />
          <path
            d="M 50 25 C 52 31 55 35 54 40 C 53 44 47 44 46 40 C 45 35 48 31 50 25 Z"
            fill="#FFF9E6"
            opacity="0.9"
          />

          {/* Sacred ॐ Devanagari Glyph in Center */}
          <text
            x="50"
            y="43"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
            fontWeight="900"
            fontFamily="'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif"
            fill="#FFE58F"
            filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.8))"
          >
            ॐ
          </text>
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h1
              className={`font-extrabold text-lg sm:text-xl font-serifDevanagari tracking-wide ${textColor}`}
            >
              हिन्दू ग्रन्थालय
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600/30 to-sacred-600/30 text-amber-300 border border-amber-500/40 font-devanagari font-bold shadow-xs">
              सनातन ज्ञान कोष
            </span>
          </div>
          <p className="text-[11px] text-amber-300/70 font-devanagari font-medium tracking-normal">
            HINDU GRANTHALAY • प्रामाणिक धर्मशास्त्र एवं मन्त्र पीठ
          </p>
        </div>
      )}
    </div>
  );
};
