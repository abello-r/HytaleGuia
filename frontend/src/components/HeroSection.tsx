import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatModal from './AIChatModal';
import AIAssistantButton from './AIAssistantButton';
import HytaleStatusBadge from './HytaleStatusBadge';
import { useChatContext } from '../context/ChatContext';

const subtitles = [
	'La guía definitiva en Español',
	'The ultimate guide in English',
	'Le guide ultime en Français',
	'Il manuale definitivo in italiano',
	'A guia definitiva em Português'
];

const languageFlags = [
	{ src: '/Spain.png', alt: 'Spanish' },
	{ src: '/UK.png', alt: 'English' },
	{ src: '/France.png', alt: 'French' },
	{ src: '/Italy.png', alt: 'Italian' },
	{ src: '/Portugal.png', alt: 'Portuguese' }
];

export default function HeroSection() {
	const { t } = useTranslation();
	const { hasMessages } = useChatContext();
	const [searchQuery, setSearchQuery] = useState('');
	const [langIndex, setLangIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [initialQuery, setInitialQuery] = useState('');

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);
			setTimeout(() => {
				setLangIndex((prev) => (prev + 1) % subtitles.length);
				setIsAnimating(false);
			}, 300);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;
		setInitialQuery(searchQuery);
		setIsChatOpen(true);
		setSearchQuery('');
	};

	const closeChat = () => {
		setIsChatOpen(false);
		setInitialQuery('');
	};

	return (
		<>
			<div className="relative flex-1 flex items-center z-10">
				<div className="container mx-auto px-4 py-12 md:py-24">
					<div className="max-w-3xl mx-auto text-center">
						<div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
							<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 backdrop-blur-sm border border-[#00d2ff]/30 text-[#00d2ff] px-3 md:px-4 h-8 md:h-10 rounded-lg text-xs md:text-sm font-medium">
								{t('hero.betaBadge')}
							</div>

							<div className="hidden md:inline-flex items-center gap-2 bg-[#00d2ff]/10 backdrop-blur-sm border border-[#00d2ff]/30 text-white px-3 md:px-4 h-8 md:h-10 rounded-lg text-xs md:text-sm font-medium">
								<span className="flex items-center gap-1">
									{languageFlags.map((flag, i) => (
										<img
											key={i}
											src={flag.src}
											alt={flag.alt}
											className={`w-3 h-3 md:w-4 md:h-4 rounded-sm object-cover transition-all duration-300 ${
												i === langIndex ? 'scale-110 opacity-100' : 'opacity-60'
											}`}
										/>
									))}
								</span>
								<span className="text-[10px] md:text-xs font-semibold text-[#00d2ff]">5 Languages</span>
							</div>

							<div className="hidden md:block">
								<HytaleStatusBadge />
							</div>
						</div>

						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
							{t('hero.title')} <span className="text-[#00d2ff]">{t('hero.titleHighlight')}</span>
						</h1>

						<div className="h-14 md:h-20 flex items-center justify-center mb-3 md:mb-4 overflow-hidden">
							<p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white transition-all duration-300 ${
								isAnimating ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
							}`}>
								{subtitles[langIndex]}
							</p>
						</div>

						<p className="text-lg md:text-xl lg:text-2xl font-medium text-white mb-6 md:mb-8 leading-relaxed px-4 md:px-0">
							{t('hero.description')}
						</p>

						{hasMessages ? (
							<div className="relative">
								<div className="flex flex-col md:flex-row items-stretch md:items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden opacity-50 cursor-not-allowed">
									<input
										type="text"
										disabled
										placeholder={t('hero.chatActivePlaceholder')}
										className="flex-1 bg-transparent text-white px-4 py-4 outline-none placeholder-[#a0a0a0] text-base md:text-sm cursor-not-allowed"
									/>
									<div className="bg-white/10 text-white/40 px-6 py-3 md:py-4 font-bold text-sm text-center">
										{t('hero.searchButton')}
									</div>
								</div>
								<p className="text-[10px] md:text-xs text-gray-500 mt-2 text-center">
									{t('hero.chatActiveHint')}
								</p>
							</div>
						) : (
							<form onSubmit={handleSearch} className="relative">
								<div className="flex flex-col md:flex-row items-stretch md:items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:border-[#00d2ff]/30 transition-all duration-300">
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder={t('hero.searchPlaceholder')}
										className="flex-1 bg-transparent text-white px-4 py-4 outline-none placeholder-[#a0a0a0] text-base md:text-sm"
									/>
									<button
										type="submit"
										className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] text-[#0b0d12] px-6 py-3 md:py-4 font-bold transition cursor-pointer text-sm"
									>
										{t('hero.searchButton')}
									</button>
								</div>
								<p className="text-[10px] md:text-xs text-gray-500 mt-2 text-center">
									{t('hero.searchHint')}
								</p>
							</form>
						)}
					</div>
				</div>
			</div>

			<AIChatModal isOpen={isChatOpen} onClose={closeChat} initialQuery={initialQuery} />
			{hasMessages && <AIAssistantButton onClick={() => setIsChatOpen(true)} />}
		</>
	);
}
