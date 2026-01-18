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
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative">
      {/* Kweebec - OUTSIDE the card */}
      {isLast && (
        <div className="absolute -top-20 right-8 z-30">
          <img 
            src="/kweebec.gif" 
            alt="Kweebec" 
            className="w-28 h-28 drop-shadow-2xl"
          />
        </div>
      )}

      <div 
        className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl hover:border-[#00d2ff]/80 hover:shadow-[0_0_40px_rgba(0,210,255,0.15)] transition-all duration-500 group cursor-pointer relative flex flex-col h-full overflow-hidden"
        onClick={handleClick}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00d2ff]/0 via-[#00d2ff]/0 to-[#00d2ff]/0 group-hover:from-[#00d2ff]/5 group-hover:via-[#00d2ff]/0 group-hover:to-[#00d2ff]/0 transition-all duration-500 rounded-2xl pointer-events-none"></div>

        {/* Image/Icon */}
        <div className="h-48 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300 relative z-10">
          {image}
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
                  <span className="text-white font-semibold">Autor:</span> {author}
                </p>
              )}
              <p className="flex items-center gap-1">
                <span className="text-[#00d2ff]">🔗</span> 
                <span className="text-white font-semibold">Fuente:</span> CurseForge
              </p>
            </div>
          )}

          <p className="text-[#a0a0a0] mb-4 text-sm flex-grow">
            {description}
          </p>

          {/* Buttons container - Always at bottom */}
          <div className="flex items-center justify-between mt-auto">
            {url && (
              <button className="text-[#00d2ff] font-medium hover:text-[#e5c100] transition flex items-center space-x-2 cursor-pointer">
                <span>{badge === 'MOD' ? t('trending.download') : t('trending.readArticle')}</span>
                <span>→</span>
              </button>
            )}

            {badge === 'SERVER' && (
              <div className="flex items-center space-x-2 bg-[#00d2ff]/20 border border-[#00d2ff] px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
                <span className="text-[#00d2ff] text-xs font-medium">126 {t('trending.online')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}