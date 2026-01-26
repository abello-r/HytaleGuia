import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatModal from './AIChatModal';
import AIAssistantButton from './AIAssistantButton';
import HytaleStatusBadge from './HytaleStatusBadge';
import { useChatContext } from '../context/ChatContext';

export default function HeroSection() {
	const { t } = useTranslation();
	const { hasMessages } = useChatContext();
	const [searchQuery, setSearchQuery] = useState('');
	const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [initialChatQuery, setInitialChatQuery] = useState('');

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

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);
			setTimeout(() => {
				setCurrentLanguageIndex((prev) => (prev + 1) % subtitles.length);
				setIsAnimating(false);
			}, 300);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			setInitialChatQuery(searchQuery);
			setIsChatOpen(true);
			setSearchQuery('');
		}
	};

	const handleCloseChat = () => {
		setIsChatOpen(false);
		setInitialChatQuery('');
	};

	const handleOpenChatFromButton = () => {
		setIsChatOpen(true);
	};

	return (
		<>
			<div className="relative flex-1 flex items-center z-10">
				<div className="container mx-auto px-4 py-24">
					<div className="max-w-3xl mx-auto text-center">
						{/* Badges container */}
						<div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
							{/* Beta badge */}
							<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 backdrop-blur-sm border border-[#00d2ff]/30 text-[#00d2ff] px-4 h-10 rounded-[8px] text-sm font-medium">
								{t('hero.betaBadge')}
							</div>

							{/* Multi-language badge */}
							<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 backdrop-blur-sm border border-[#00d2ff]/30 text-white px-4 h-10 rounded-[8px] text-sm font-medium">
								<span className="flex items-center gap-1">
									{languageFlags.map((flag, index) => (
										<img
											key={index}
											src={flag.src}
											alt={flag.alt}
											className={`w-4 h-4 rounded-sm object-cover transition-all duration-300 ${
												index === currentLanguageIndex ? 'scale-110 opacity-100' : 'scale-100 opacity-60'
											}`}
										/>
									))}
								</span>
								<span className="text-xs font-semibold text-[#00d2ff]">5 Languages</span>
							</div>

							{/* Hytale Status Badge */}
							<HytaleStatusBadge />
						</div>

						<h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
							{t('hero.title')} <span className="text-[#00d2ff]">{t('hero.titleHighlight')}</span>
						</h1>

						{/* Rotating subtitle */}
						<div className="h-20 flex items-center justify-center mb-4 overflow-hidden">
							<p
								className={`text-3xl md:text-4xl font-bold text-white transition-all duration-300 ${
									isAnimating ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'
								}`}
							>
								{subtitles[currentLanguageIndex]}
							</p>
						</div>

						{/* Description */}
						<p className="text-2xl font-medium text-white mb-8 leading-relaxed">
							{t('hero.description')}
						</p>

						{/* Search Bar with AI */}
						{hasMessages ? (
							<div className="relative">
								<div className="flex items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden opacity-50 cursor-not-allowed">
									<span className="pl-6 text-[#00d2ff] text-xl">✨</span>
									<input
										type="text"
										disabled
										placeholder={t('hero.chatActivePlaceholder')}
										className="flex-1 bg-transparent text-white px-4 py-5 outline-none placeholder-[#a0a0a0] cursor-not-allowed"
									/>
									<div className="bg-white/10 text-white/40 px-8 py-5 font-bold">
										{t('hero.searchButton')}
									</div>
								</div>
								<p className="text-xs text-[#00d2ff]/60 mt-2 flex items-center justify-center gap-1">
									<span>💬</span> {t('hero.chatActiveHint')}
								</p>
							</div>
						) : (
							<form onSubmit={handleSearch} className="relative">
								<div className="flex items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-[#00d2ff]/30 transition-all duration-300">
									<span className="pl-6 text-[#00d2ff] text-xl">✨</span>
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder={t('hero.searchPlaceholder')}
										className="flex-1 bg-transparent text-white px-4 py-5 outline-none placeholder-[#a0a0a0]"
									/>
									<button
										type="submit"
										className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] text-[#0b0d12] px-8 py-5 font-bold transition cursor-pointer"
									>
										{t('hero.searchButton')}
									</button>
								</div>
								<p className="text-xs text-[#00d2ff] mt-2 flex items-center justify-center gap-1">
									<span>💡</span> {t('hero.searchHint')}
								</p>
							</form>
						)}
					</div>
				</div>
			</div>

			<AIChatModal
				isOpen={isChatOpen}
				onClose={handleCloseChat}
				initialQuery={initialChatQuery}
			/>

			{hasMessages && (
				<AIAssistantButton onClick={handleOpenChatFromButton} />
			)}
		</>
	);
}
