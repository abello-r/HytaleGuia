import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import LanguageSelector from './components/LanguageSelector';
import './i18n';

// Inicializa Google Analytics
ReactGA.initialize('G-06EYV38MQG');

function App() {
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState('');
	const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const subtitles = [
		'La guía definitiva en Español',
		'The ultimate guide in English',
		'Le guide ultime en Français',
		'Il manuale definitivo in italiano',
		'A guia definitiva em Português'
	];

	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname });
	}, []);

	// Rotación automática con animación roll
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

	const trendingTopics = [
		{
			id: 1,
			title: 'Actualización de Verano',
			description: 'Nuevos biomas actualizados y mecánicas de buceo reveladas.',
			badge: 'NOTICIA',
			badgeColor: 'bg-[#00d2ff]',
			image: '🏝️'
		},
		{
			id: 2,
			title: 'Maestría en Forja',
			description: 'Cómo crear armaduras de Void metal paso a paso.',
			badge: 'GUÍA',
			badgeColor: 'bg-[#00d2ff]',
			image: '⚔️'
		},
		{
			id: 3,
			title: 'Orbis Legends: RPG',
			description: 'Servidor número 1 en habla hispana. Economía y PvP.',
			badge: 'SERVIDOR',
			badgeColor: 'bg-[#00d2ff]',
			image: '🎮'
		},
		{
			id: 4,
			title: 'Guía de Mods',
			description: 'Los mejores mods para mejorar tu experiencia en Hytale.',
			badge: 'MODS',
			badgeColor: 'bg-[#00d2ff]',
			image: '🔧'
		}
	];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Buscando:', searchQuery);
	};

	return (
		<div className="min-h-screen bg-[#0b0d12]">
			{/* Discord Sticky Button */}
			<a
				href="https://discord.gg/hytale"
				target="_blank"
				rel="noopener noreferrer"
				className="fixed top-1/5 right-0 z-50 group"
			>
				<div className="bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 rounded-l-2xl shadow-2xl pl-3 pr-3 py-3 hover:pr-4 cursor-pointer relative">
					<svg
						className="w-8 h-8 text-white"
						fill="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
					</svg>

					{/* Tooltip al hover */}
					<div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0b0d12] text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
						{t('discord.tooltip')}
					</div>
				</div>
			</a>

			{/* Hero Section con fondo completo */}
			<div className="relative min-h-screen flex flex-col">
				{/* Background image */}
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: 'url("/forest.png")',
					}}
				>
					<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b0d12]"></div>
				</div>

				{/* Header centrado con margin top - z-50 para que esté por encima */}
				<nav className="relative z-50 mt-8">
					<div className="container mx-auto px-4">
						<div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
							<div className="flex items-center justify-between">
								{/* Logo */}
								<div className="flex items-center space-x-2 cursor-pointer">
									<div className="w-8 h-8 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded"></div>
									<span className="text-white font-bold text-xl">
										HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
									</span>
								</div>

								{/* Navigation */}
								<div className="hidden md:flex items-center space-x-8">
									<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.home')}</a>
									<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.news')}</a>
									<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.guides')}</a>
									<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.mods')}</a>
									<a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition cursor-pointer">{t('nav.serverList')}</a>
								</div>

								{/* Right side */}
								<div className="flex items-center space-x-4 relative z-50">
									<LanguageSelector />
									<button className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] hover:from-[#0099cc] hover:to-[#00d2ff] text-[#0b0d12] px-8 py-2 rounded-lg font-bold transition cursor-pointer">
										{t('auth.login')}
									</button>
								</div>
							</div>
						</div>
					</div>
				</nav>

				{/* Content */}
				<div className="relative flex-1 flex items-center z-10">
					<div className="container mx-auto px-4 py-24">
						<div className="max-w-3xl mx-auto text-center">
							<div className="inline-block bg-[#00d2ff]/20 backdrop-blur-sm border border-[#00d2ff] text-[#00d2ff] px-4 py-1 rounded-full text-sm font-medium mb-6">
								{t('hero.betaBadge')}
							</div>

							<h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
								{t('hero.title')} <span className="text-[#00d2ff]">{t('hero.titleHighlight')}</span>
							</h1>

							{/* Subtítulo rotativo sin banderitas */}
							<div className="h-20 flex items-center justify-center mb-4 overflow-hidden">
								<p
									className={`text-3xl md:text-4xl font-bold text-white transition-all duration-300 ${isAnimating ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'
										}`}
								>
									{subtitles[currentLanguageIndex]}
								</p>
							</div>

							{/* Descripción más destacada */}
							<p className="text-2xl font-medium text-white mb-8 leading-relaxed">
								{t('hero.description')}
							</p>

							{/* Search Bar con IA */}
							<form onSubmit={handleSearch} className="relative">
								<div className="flex items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
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
						</div>
					</div>
				</div>
			</div>

			{/* Trending Section */}
			<div className="relative bg-[#0b0d12] py-16">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-center space-x-3 mb-12">
						<h2 className="text-4xl font-bold text-white">
							{t('trending.title')} <span className="text-[#00d2ff]">{t('trending.titleHighlight')}</span>
						</h2>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
						{trendingTopics.map((topic) => (
							<div
								key={topic.id}
								className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#00d2ff]/50 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
							>
								{/* Image/Icon */}
								<div className="h-48 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
									{topic.image}
								</div>

								{/* Content */}
								<div className="p-6">
									<span className={`${topic.badgeColor} text-[#0b0d12] text-xs font-bold px-3 py-1 rounded-full`}>
										{topic.badge}
									</span>

									<h3 className="text-xl font-bold text-white mt-4 mb-2">
										{topic.title}
									</h3>

									<p className="text-[#a0a0a0] mb-4 text-sm">
										{topic.description}
									</p>

									<div className="flex items-center justify-between">
										<button className="text-[#00d2ff] font-medium hover:text-[#e5c100] transition flex items-center space-x-2 cursor-pointer">
											<span>{t('trending.readArticle')}</span>
											<span>→</span>
										</button>

										{topic.badge === 'SERVIDOR' && (
											<div className="flex items-center space-x-2 bg-[#00d2ff]/20 border border-[#00d2ff] px-3 py-1 rounded-full">
												<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
												<span className="text-[#00d2ff] text-xs font-medium">126 {t('trending.online')}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="relative bg-[#0b0d12] border-t border-white/10">
				<div className="container mx-auto px-4 py-12">
					<div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
						{/* Columna 1 - Logo y descripción */}
						<div className="md:col-span-1">
							<div className="flex items-center space-x-2 mb-4 cursor-pointer">
								<div className="w-10 h-10 bg-gradient-to-br from-[#00d2ff] to-[#0099cc] rounded"></div>
								<span className="text-white font-bold text-xl">
									HYTALE<span className="text-[#00d2ff]"> GUÍA</span>
								</span>
							</div>
							<p className="text-[#a0a0a0] text-sm leading-relaxed">
								{t('footer.description')}
							</p>
						</div>

						{/* Columna 2 - Enlaces rápidos */}
						<div>
							<h3 className="text-white font-bold mb-4">{t('footer.quickLinks')}</h3>
							<ul className="space-y-2">
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.home')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.news')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.guides')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.mods')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.serverList')}</a></li>
							</ul>
						</div>

						{/* Columna 3 - Comunidad */}
						<div>
							<h3 className="text-white font-bold mb-4">{t('footer.community')}</h3>
							<ul className="space-y-2">
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.discord')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.twitter')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.youtube')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.reddit')}</a></li>
							</ul>
						</div>

						{/* Columna 4 - Legal */}
						<div>
							<h3 className="text-white font-bold mb-4">{t('footer.legal')}</h3>
							<ul className="space-y-2">
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.terms')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.privacy')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.cookies')}</a></li>
								<li><a href="#" className="text-[#a0a0a0] hover:text-[#00d2ff] transition text-sm cursor-pointer">{t('footer.contact')}</a></li>
							</ul>
						</div>
					</div>

					{/* Copyright */}
					<div className="border-t border-white/10 mt-8 pt-8 text-center">
						<p className="text-[#a0a0a0] text-sm">
							{t('footer.copyright')}
							<span className="text-[#00d2ff]"> {t('footer.madeWith')}</span>
						</p>
						<p className="text-[#a0a0a0] text-xs mt-2">
							{t('footer.disclaimer')}
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;