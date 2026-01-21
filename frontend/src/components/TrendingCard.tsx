import { useTranslation } from 'react-i18next';

interface TrendingCardProps {
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  image: string;
  url?: string;
  author?: string;
  date?: string;
  isLast?: boolean;
}

export default function TrendingCard({ 
  title, 
  description, 
  badge, 
  badgeColor, 
  image, 
  url,
  author,
  isLast 
}: TrendingCardProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    if (url && badge !== 'SERVER') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative">
      {/* Kweebec - OUTSIDE the card */}
      {isLast && (
        <div className="absolute -top-20 right-8 z-30 user-select-none pointer-events-none">
          <img 
            src="/kweebec.gif" 
            alt="Kweebec" 
            className="w-28 h-28 drop-shadow-2xl"
          />
        </div>
      )}

      <div 
        className={`bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl hover:border-[#00d2ff]/80 hover:shadow-[0_0_40px_rgba(0,210,255,0.15)] transition-all duration-500 group relative flex flex-col h-full overflow-hidden ${badge !== 'SERVER' ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={handleClick}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00d2ff]/0 via-[#00d2ff]/0 to-[#00d2ff]/0 group-hover:from-[#00d2ff]/5 group-hover:via-[#00d2ff]/0 group-hover:to-[#00d2ff]/0 transition-all duration-500 rounded-2xl pointer-events-none"></div>

        {/* Image/Icon - Now supports both emoji and image paths */}
        <div className="h-48 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300 relative z-10 overflow-hidden">
          {image.startsWith('/') || image.startsWith('http') ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span>{image}</span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className={`${badgeColor} text-[#0b0d12] text-xs font-bold px-3 py-1 rounded-full`}>
              {badge}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {title}
          </h3>

          {/* Author and metadata - Only for MODs */}
          {badge === 'MOD' && (
            <div className="text-[#a0a0a0] text-xs mb-3 space-y-1">
              {author && (
                <p className="flex items-center gap-1">
                  <span className="text-[#00d2ff]">👤</span> 
                  <span className="text-white font-semibold">{t('trending.author')}:</span> {author}
                </p>
              )}
              <p className="flex items-center gap-1">
                <span className="text-[#00d2ff]">🔗</span> 
                <span className="text-white font-semibold">{t('trending.source')}:</span>CurseForge
              </p>
            </div>
          )}

          <p className="text-[#a0a0a0] mb-4 text-sm flex-grow">
            {description}
          </p>

          {/* Buttons container - Always at bottom */}
          <div className="flex items-center justify-between mt-auto">
            {url && badge !== 'SERVER' && (
              <button className="text-[#00d2ff] font-medium hover:text-[#e5c100] transition flex items-center space-x-2 cursor-pointer">
                <span>{badge === 'MOD' ? t('trending.download') : t('trending.readArticle')}</span>
                <span>→</span>
              </button>
            )}

            {badge === 'SERVER' && (
              <>
                <div className="text-yellow-400/80 font-medium text-sm flex items-center space-x-2">
                  <span>🔒</span>
                  <span>{t('trending.comingSoon')}</span>
                </div>
                {/*<div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/40 px-3 py-1.5 rounded-full shadow-lg">
                	<span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-green-400 text-xs font-semibold">1042 {t('trending.online')}</span>
                </div>*/}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
