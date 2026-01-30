import { useTranslation } from 'react-i18next';

interface TrendingCardProps {
	title: string;
	description: string;
	badge: string;
	badgeColor: string;
	image: string;
	url?: string;
	author?: string;
	isLast?: boolean;
}

export default function TrendingCard({ title, description, badge, badgeColor, image, url, author, isLast }: TrendingCardProps) {
	const { t } = useTranslation();
	const isClickable = url && badge !== 'SERVER';

	const handleClick = () => {
		if (isClickable) window.open(url, '_blank', 'noopener,noreferrer');
	};

	return (
		<div className="relative">
			{isLast && (
				<div className="absolute -top-16 md:-top-20 right-4 md:right-8 z-30 pointer-events-none">
					<img src="/kweebec.gif" alt="Kweebec" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-2xl" />
				</div>
			)}

			<div
				className={`bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl hover:border-[#00d2ff]/80 hover:shadow-[0_0_40px_rgba(0,210,255,0.15)] transition-all duration-500 group relative flex flex-col h-full overflow-hidden ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
				onClick={handleClick}
			>
				<div className="absolute inset-0 bg-gradient-to-b from-[#00d2ff]/0 to-[#00d2ff]/0 group-hover:from-[#00d2ff]/5 transition-all duration-500 rounded-2xl pointer-events-none" />

				<div className="h-36 md:h-48 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300 relative z-10 overflow-hidden">
					{image.startsWith('/') || image.startsWith('http') ? (
						<img src={image} alt={title} className="w-full h-full object-cover" />
					) : (
						<span>{image}</span>
					)}
				</div>

				<div className="p-4 md:p-6 flex flex-col flex-grow relative z-10">
					<span className={`${badgeColor} text-[#0b0d12] text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full w-fit mb-2 md:mb-3`}>
						{badge}
					</span>

					<h3 className="text-base md:text-xl font-bold text-white mb-2 line-clamp-2">{title}</h3>

					{badge === 'MOD' && (
						<div className="text-[#a0a0a0] text-[10px] md:text-xs mb-2 md:mb-3 space-y-1">
							{author && (
								<p className="flex items-center gap-1">
									<svg className="w-3 h-3 text-[#00d2ff]" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
									</svg>
									<span className="text-white font-semibold">{t('trending.author')}:</span> {author}
								</p>
							)}
							<p className="flex items-center gap-1">
								<svg className="w-3 h-3 text-[#00d2ff]" viewBox="0 0 24 24" fill="currentColor">
									<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
								</svg>
								<span className="text-white font-semibold">{t('trending.source')}:</span> CurseForge
							</p>
						</div>
					)}

					<p className="text-[#a0a0a0] mb-3 md:mb-4 text-xs md:text-sm flex-grow line-clamp-3">{description}</p>

					<div className="flex items-center justify-between mt-auto">
						{isClickable && (
							<button className="text-[#00d2ff] font-medium hover:text-[#e5c100] transition flex items-center gap-1 cursor-pointer text-sm">
								<span>{badge === 'MOD' ? t('trending.download') : t('trending.readArticle')}</span>
								<span>→</span>
							</button>
						)}

						{badge === 'SERVER' && (
							<div className="text-yellow-400/80 font-medium text-xs md:text-sm flex items-center gap-1">
								<svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
									<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
								</svg>
								<span>{t('trending.comingSoon')}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
