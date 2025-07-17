// Game image components as SVG illustrations

export const CrossFireIcon = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="crossfireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4444" />
        <stop offset="50%" stopColor="#CC0000" />
        <stop offset="100%" stopColor="#990000" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#crossfireGrad)" rx="20"/>
    <circle cx="100" cy="100" r="70" fill="none" stroke="#FFD700" strokeWidth="4"/>
    <path d="M 70 70 L 130 130 M 130 70 L 70 130" stroke="#FFD700" strokeWidth="6" strokeLinecap="round"/>
    <text x="100" y="180" textAnchor="middle" fill="#FFD700" fontSize="16" fontWeight="bold">CROSSFIRE</text>
  </svg>
);

export const FreeFireIcon = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="freefireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35" />
        <stop offset="50%" stopColor="#F7931E" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#freefireGrad)" rx="20"/>
    <polygon points="100,30 130,80 170,80 135,115 150,165 100,140 50,165 65,115 30,80 70,80" 
             fill="#FFD700" stroke="#FFF" strokeWidth="2"/>
    <circle cx="100" cy="100" r="25" fill="#FF4500"/>
    <text x="100" y="185" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">FREE FIRE</text>
  </svg>
);

export const PubgIcon = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="pubgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#pubgGrad)" rx="20"/>
    <circle cx="100" cy="90" r="50" fill="none" stroke="#FFD700" strokeWidth="4"/>
    <rect x="75" y="65" width="50" height="50" fill="#FFD700" rx="5"/>
    <circle cx="85" cy="75" r="3" fill="#1E3A8A"/>
    <circle cx="115" cy="75" r="3" fill="#1E3A8A"/>
    <rect x="90" y="85" width="20" height="3" fill="#1E3A8A"/>
    <text x="100" y="170" textAnchor="middle" fill="#FFD700" fontSize="16" fontWeight="bold">PUBG</text>
    <text x="100" y="185" textAnchor="middle" fill="#FFD700" fontSize="12">MOBILE</text>
  </svg>
);

export const getGameIcon = (gameSlug: string) => {
  switch (gameSlug) {
    case 'crossfire':
      return <CrossFireIcon />;
    case 'free-fire':
      return <FreeFireIcon />;
    case 'pubg-mobile':
      return <PubgIcon />;
    default:
      return <div className="w-full h-full bg-gaming-accent rounded-lg flex items-center justify-center text-white font-bold">
        {gameSlug.charAt(0).toUpperCase()}
      </div>;
  }
};