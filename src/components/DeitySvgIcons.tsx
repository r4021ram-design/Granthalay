import React from 'react';

interface DeityIconProps {
  size?: number | string;
  className?: string;
}

// 1. श्रीगणेश (Ganesha: Vakratunda, Modaka & Ekadanta Silhouette)
export const GaneshaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(245,158,11,0.4)] ${className}`}
  >
    <path
      d="M12 2C8.5 2 6 4.5 6 7.5C6 9.5 7 11 8.5 12C7 13 5.5 14.5 5 16.5C4.5 18.5 5.5 20.5 7.5 21.5C9.5 22.5 12 22 13 20.5C13.8 19.3 14 17.5 13.5 15.5C14.5 16 15.5 16.5 16.5 16.5C18.5 16.5 20 15 20 13C20 11.5 19 10.5 17.5 10C18.5 9 19 7.8 18.5 6.5C18 5 16.5 4 15 4C14.5 4 14 4.2 13.5 4.5C13.2 3 12.8 2 12 2Z"
      stroke="#F59E0B"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#D97706"
      fillOpacity="0.25"
    />
    {/* Trunk curl & Modak */}
    <path
      d="M11 9C11 11.5 12 13.5 11.5 16C11 18 9.5 19 8.5 18"
      stroke="#FDE68A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="16" cy="13" r="1.5" fill="#FBBF24" />
    <path d="M11 5V7" stroke="#FDE68A" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 2. देवाधिदेव शिव (Shiva: Sacred Trishula, Damaru & Chandra)
export const ShivaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(56,189,248,0.4)] ${className}`}
  >
    {/* Central Trishula Spike & Shaft */}
    <path d="M12 2V22" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
    {/* Left and Right Prongs */}
    <path
      d="M7 6C7 10 9.5 12.5 12 12.5C14.5 12.5 17 10 17 6"
      stroke="#38BDF8"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="#0284C7"
      fillOpacity="0.2"
    />
    {/* Outer tips */}
    <path d="M6 5L7 6L8 5" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 5L17 6L18 5" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 1L12 2L13 1" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Damaru */}
    <path d="M9.5 15L14.5 18H9.5L14.5 15H9.5Z" stroke="#FCD34D" strokeWidth="1.4" fill="#B45309" fillOpacity="0.4" />
  </svg>
);

// 3. भगवान् विष्णु (Vishnu: Sudarshana Chakra & Shankha)
export const VishnuSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(234,179,8,0.4)] ${className}`}
  >
    <circle cx="12" cy="12" r="8.5" stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="2.5 1.5" />
    <circle cx="12" cy="12" r="4.5" stroke="#FDE68A" strokeWidth="1.4" fill="#D97706" fillOpacity="0.25" />
    {/* 8 Divine Spokes */}
    <path d="M12 3.5V7.5M12 16.5V20.5M3.5 12H7.5M16.5 12H20.5" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 6L8.8 8.8M15.2 15.2L18 18M6 18L8.8 15.2M15.2 8.8L18 6" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" fill="#FEF3C7" />
  </svg>
);

// 4. भगवती दुर्गा / शक्ति (Devi: Sacred Trishula Blade with Lotus & Bindi)
export const DeviSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(244,63,94,0.4)] ${className}`}
  >
    {/* Sacred Shakti Eye & Lotus Petals */}
    <path
      d="M3 12C5.5 7.5 8.5 5 12 5C15.5 5 18.5 7.5 21 12C18.5 16.5 15.5 19 12 19C8.5 19 5.5 16.5 3 12Z"
      stroke="#FB7185"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="#BE123C"
      fillOpacity="0.25"
    />
    <circle cx="12" cy="12" r="3.5" stroke="#FDA4AF" strokeWidth="1.4" fill="#E11D48" />
    {/* Sindoor Tilak Bindu */}
    <circle cx="12" cy="12" r="1.5" fill="#FFF1F2" />
    <path d="M12 2V4.5M12 19.5V22" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 5. मर्यादा पुरुषोत्तम श्रीराम (Rama: Sacred Kodanda Dhanusha & Arrow)
export const RamaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(52,211,153,0.4)] ${className}`}
  >
    {/* Bow arc */}
    <path
      d="M5 3C11 7 14 13 14 21"
      stroke="#34D399"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Bow string */}
    <path d="M5 3L14 21" stroke="#A7F3D0" strokeWidth="1" strokeDasharray="1.5 1.5" />
    {/* Arrow */}
    <path d="M4 19L20 5" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 4L21 4L21 9" stroke="#FDE68A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="17" r="1.2" fill="#F59E0B" />
  </svg>
);

// 6. योगेश्वर श्रीकृष्ण (Krishna: Sacred Venu Flute & Mayura Feather)
export const KrishnaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(34,211,238,0.4)] ${className}`}
  >
    {/* Peacock Feather Contour */}
    <path
      d="M17 3C14 4 11 7 12 11C13 13 15 13.5 17 12C19.5 10 20.5 6 17 3Z"
      stroke="#22D3EE"
      strokeWidth="1.5"
      fill="#0891B2"
      fillOpacity="0.35"
    />
    <circle cx="15.5" cy="8.5" r="2" fill="#06B6D4" stroke="#FDE68A" strokeWidth="1" />
    <circle cx="15.5" cy="8.5" r="0.8" fill="#1E3A8A" />
    {/* Flute */}
    <path d="M3 21L19 7" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
    {/* Finger holes */}
    <circle cx="8" cy="16" r="0.8" fill="#451A03" />
    <circle cx="11" cy="13" r="0.8" fill="#451A03" />
    <circle cx="14" cy="10" r="0.8" fill="#451A03" />
  </svg>
);

// 7. श्रीहनुमत् / मारुति (Hanuman: Sacred Gada & Saffron Dhwaja)
export const MarutiSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(249,115,22,0.4)] ${className}`}
  >
    {/* Gada Head */}
    <circle cx="16.5" cy="7.5" r="5" stroke="#FB923C" strokeWidth="1.8" fill="#EA580C" fillOpacity="0.3" />
    <path d="M13 4L20 11M13 11L20 4" stroke="#FED7AA" strokeWidth="1.2" strokeLinecap="round" />
    {/* Gada Handle */}
    <path d="M13 11L5 19" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="4" cy="20" r="1.5" fill="#B45309" stroke="#FED7AA" strokeWidth="1" />
    {/* Spikes */}
    <path d="M16.5 1.5V3M22.5 7.5H21M16.5 13.5V12" stroke="#FDBA74" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 8. भगवान् सूर्य (Surya: Radiant 12-Ray Divine Solar Wheel)
export const SuryaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(245,158,11,0.5)] ${className}`}
  >
    <circle cx="12" cy="12" r="5" stroke="#F59E0B" strokeWidth="1.8" fill="#FBBF24" fillOpacity="0.35" />
    <circle cx="12" cy="12" r="2" fill="#FEF3C7" />
    {/* 8 Cardinal & Diagonal Rays */}
    <path d="M12 2V4.5M12 19.5V22M2 12H4.5M19.5 12H22" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4.93 4.93L6.7 6.7M17.3 17.3L19.07 19.07M4.93 19.07L6.7 17.3M17.3 6.7L19.07 4.93" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 9. अवतार व गुरु परम्परा (Avatara & Guru: Sacred Charan Padukas)
export const AvataraSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(192,132,252,0.4)] ${className}`}
  >
    {/* Left Paduka */}
    <path
      d="M7 6C5.5 6 4.5 7.5 4.5 11C4.5 15 5.5 19 7 19C8.5 19 9.5 15 9.5 11C9.5 7.5 8.5 6 7 6Z"
      stroke="#C084FC"
      strokeWidth="1.5"
      fill="#7E22CE"
      fillOpacity="0.25"
    />
    <circle cx="7" cy="9" r="1.3" fill="#FDE68A" />
    {/* Right Paduka */}
    <path
      d="M17 6C15.5 6 14.5 7.5 14.5 11C14.5 15 15.5 19 17 19C18.5 19 19.5 15 19.5 11C19.5 7.5 18.5 6 17 6Z"
      stroke="#C084FC"
      strokeWidth="1.5"
      fill="#7E22CE"
      fillOpacity="0.25"
    />
    <circle cx="17" cy="9" r="1.3" fill="#FDE68A" />
    {/* Guru Radiance rays */}
    <path d="M12 2V4M12 20V22" stroke="#E9D5FF" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 10. गङ्गादि तीर्थ (Ganga: Sacred Kalasha & Amrita Streams)
export const GangaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(96,165,250,0.4)] ${className}`}
  >
    {/* Kalasha Pot */}
    <path
      d="M7 9C6 11 5 13.5 5 16C5 19 8 21 12 21C16 21 19 19 19 16C19 13.5 18 11 17 9H7Z"
      stroke="#60A5FA"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="#1D4ED8"
      fillOpacity="0.25"
    />
    {/* Rim */}
    <path d="M6.5 9H17.5" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
    {/* Holy Mango Leaves / Water Coconut */}
    <path d="M12 3C10 5.5 9 8 9 9H15C15 8 14 5.5 12 3Z" stroke="#34D399" strokeWidth="1.4" fill="#059669" fillOpacity="0.4" />
    <path d="M9 15C10.5 16 13.5 16 15 15" stroke="#BFDBFE" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 11. नवग्रह मण्डल (Navagraha: Sacred 9-Planetary Cosmic Mandala)
export const NavagrahaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(168,85,247,0.4)] ${className}`}
  >
    {/* Outer Sacred Square / Mandala */}
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#A855F7" strokeWidth="1.5" fill="#581C87" fillOpacity="0.2" />
    {/* 9 Planets / Bindus */}
    <circle cx="7" cy="7" r="1.5" fill="#F87171" />
    <circle cx="12" cy="7" r="1.5" fill="#E2E8F0" />
    <circle cx="17" cy="7" r="1.5" fill="#FBBF24" />
    <circle cx="7" cy="12" r="1.5" fill="#34D399" />
    <circle cx="12" cy="12" r="2.2" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="0.8" />
    <circle cx="17" cy="12" r="1.5" fill="#FCD34D" />
    <circle cx="7" cy="17" r="1.5" fill="#60A5FA" />
    <circle cx="12" cy="17" r="1.5" fill="#818CF8" />
    <circle cx="17" cy="17" r="1.5" fill="#C084FC" />
  </svg>
);

// 12. वेदान्त एवं आत्मज्ञान (Vedanta: Sacred Pothi & Upanishadic Jyoti)
export const VedantaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(217,119,6,0.4)] ${className}`}
  >
    {/* Manuscript Folio */}
    <rect x="3" y="7" width="18" height="13" rx="2" stroke="#D97706" strokeWidth="1.6" fill="#78350F" fillOpacity="0.3" />
    {/* Binding String */}
    <path d="M3 13.5H21" stroke="#FDE68A" strokeWidth="1.2" strokeDasharray="3 2" />
    {/* Sacred Flame (Brahma-Jnana Jyoti) */}
    <path
      d="M12 2C10.5 4 10.5 5.5 12 7C13.5 5.5 13.5 4 12 2Z"
      stroke="#F59E0B"
      strokeWidth="1.4"
      fill="#FBBF24"
    />
    <circle cx="12" cy="13.5" r="1.2" fill="#FEF3C7" />
  </svg>
);

// 13. संकीर्ण स्तुतियाँ (Sankeerna: Sacred Arati Deepa Flame)
export const SankeernaSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(245,158,11,0.4)] ${className}`}
  >
    {/* Diya Base */}
    <path
      d="M4 14C4 18 7.5 21 12 21C16.5 21 20 18 20 14H4Z"
      stroke="#F59E0B"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="#B45309"
      fillOpacity="0.3"
    />
    <path d="M2 14H22" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
    {/* Pure Holy Flame */}
    <path
      d="M12 3C9.5 6.5 9 9 12 12C15 9 14.5 6.5 12 3Z"
      stroke="#EA580C"
      strokeWidth="1.5"
      fill="#F97316"
    />
    <circle cx="12" cy="9.5" r="1.2" fill="#FEF3C7" />
  </svg>
);

// 14. समस्त देवता (All Deities / Universal Om Lotus)
export const AllDeitiesSvgIcon: React.FC<DeityIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block drop-shadow-[0_1px_4px_rgba(245,158,11,0.5)] ${className}`}
  >
    {/* Outer Lotus Ring */}
    <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.4" strokeDasharray="3 2" />
    {/* Central Divine Om Representation */}
    <path
      d="M8 8.5C8 7 9.5 5.5 11.5 5.5C13.5 5.5 14.5 7 14 8.5C13.5 10 11.5 10.5 11.5 10.5C13.5 10.5 15.5 11.5 15.5 13.5C15.5 16 13 17.5 10.5 17C8.5 16.5 7.5 15 7.5 13.5"
      stroke="#FDE68A"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M15 8C17 9 18 11.5 18 14" stroke="#FBBF24" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="16.5" cy="5.5" r="1" fill="#FEF3C7" />
  </svg>
);

// Dynamic Resolver for any deity ID
export const DeitySvgIcon: React.FC<{ deityId: string; size?: number | string; className?: string }> = ({
  deityId,
  size = 20,
  className = '',
}) => {
  switch (deityId) {
    case 'ganesha':
      return <GaneshaSvgIcon size={size} className={className} />;
    case 'shiva':
      return <ShivaSvgIcon size={size} className={className} />;
    case 'vishnu':
      return <VishnuSvgIcon size={size} className={className} />;
    case 'devi':
      return <DeviSvgIcon size={size} className={className} />;
    case 'rama':
      return <RamaSvgIcon size={size} className={className} />;
    case 'krishna':
      return <KrishnaSvgIcon size={size} className={className} />;
    case 'maruti':
      return <MarutiSvgIcon size={size} className={className} />;
    case 'surya':
      return <SuryaSvgIcon size={size} className={className} />;
    case 'avatara':
      return <AvataraSvgIcon size={size} className={className} />;
    case 'ganga':
      return <GangaSvgIcon size={size} className={className} />;
    case 'navagraha':
      return <NavagrahaSvgIcon size={size} className={className} />;
    case 'vedanta':
      return <VedantaSvgIcon size={size} className={className} />;
    case 'sankeerna':
      return <SankeernaSvgIcon size={size} className={className} />;
    case 'all':
    default:
      return <AllDeitiesSvgIcon size={size} className={className} />;
  }
};
