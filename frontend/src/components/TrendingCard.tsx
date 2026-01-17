import { useTranslation } from 'react-i18next';

interface TrendingCardProps {
	title: string;
	description: string;
	badge: string;
	badgeColor: string;
	image: string;
	isLast?: boolean;
}

export default function TrendingCard({ title, description, badge, badgeColor, image, isLast }: TrendingCardProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#00d2ff]/50 hover:bg-white/10 transition-all duration-300 group cursor-pointer relative">
			{/* Kweebec */}
			{isLast && (
				<div className="absolute -top-20 right-8 z-20">
					<img 
						src="/kweebec.gif" 
						alt="Kweebec" 
						className="w-28 h-28 drop-shadow-2xl"
					/>
				</div>
			)}

			{/* Image/Icon */}
			<div className="h-48 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
				{image}
			</div>

			{/* Content */}
			<div className="p-6">
				<span className={`${badgeColor} text-[#0b0d12] text-xs font-bold px-3 py-1 rounded-full`}>
					{badge}
				</span>

				<h3 className="text-xl font-bold text-white mt-4 mb-2">
					{title}
				</h3>

				<p className="text-[#a0a0a0] mb-4 text-sm">
					{description}
				</p>

				<div className="flex items-center justify-between">
					<button className="text-[#00d2ff] font-medium hover:text-[#e5c100] transition flex items-center space-x-2 cursor-pointer">
						<span>{t('trending.readArticle')}</span>
						<span>→</span>
					</button>

					{badge === 'SERVIDOR' && (
						<div className="flex items-center space-x-2 bg-[#00d2ff]/20 border border-[#00d2ff] px-3 py-1 rounded-full">
							<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
							<span className="text-[#00d2ff] text-xs font-medium">126 {t('trending.online')}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}