import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import ShareButton from '../components/ShareButton';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import { getSEOConfig } from '../utils/seoConfig';

interface NewsArticle {
	titulo: string;
	resumen: string;
	fecha: string;
	fuente: string;
	url: string;
	image?: string;
	fileDate: string;
}

interface NewsResponse {
	success: boolean;
	data: {
		news: NewsArticle[];
		total: number;
		lastCronRun: string | null;
	};
	timestamp: string;
}

const SOURCE_ICONS: { [key: string]: string } = {
	'Vandal': 'gamepad',
	'Marca': 'soccer',
	'Infobae': 'newspaper',
	'Meristation': 'target',
	'GamesRadar': 'gamepad',
	'PC Gamer': 'desktop',
	'Windows Central': 'windows'
};


function NewsSkeleton() {
	return (
		<div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse">
			<div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800"></div>
			<div className="p-6 space-y-3">
				<div className="flex gap-2">
					<div className="bg-gray-700 h-5 w-16 rounded-full"></div>
					<div className="bg-gray-700 h-5 w-20 rounded-full"></div>
				</div>
				<div className="bg-gray-700 h-6 w-3/4 rounded"></div>
				<div className="space-y-2">
					<div className="bg-gray-700 h-4 w-full rounded"></div>
					<div className="bg-gray-700 h-4 w-2/3 rounded"></div>
				</div>
			</div>
		</div>
	);
}

function SourceIcon({ source }: { source: string }) {
	const iconType = SOURCE_ICONS[source] || 'newspaper';

	const icons = {
		gamepad: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />,
		newspaper: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />,
		target: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
		desktop: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
		soccer: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
		windows: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
	};

	return (
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			{icons[iconType as keyof typeof icons] || icons.newspaper}
		</svg>
	);
}

export default function NewsPage() {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language || 'es';
	const seoConfig = getSEOConfig('/noticias', currentLang);


	const [news, setNews] = useState<NewsArticle[]>([]);
	const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
	const [loading, setLoading] = useState(true);
	const [sorting, setSorting] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('newest');
	const [displayCount, setDisplayCount] = useState(10);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [lastCronRun, setLastCronRun] = useState<Date | null>(null);

	const getCanonicalUrl = () => {
		const base = 'https://hytaleguia.com';
		const path = 'noticias';
		return currentLang === 'es' ? `${base}/${path}` : `${base}/${currentLang}/${path}`;
	};

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		async function fetchAllNews() {
			try {
				const response = await fetch('/api/news/all');
				const result: NewsResponse = await response.json();

				if (result.success) {
					setNews(result.data.news);
					setFilteredNews(result.data.news);
					if (result.data.lastCronRun) {
						setLastCronRun(new Date(result.data.lastCronRun));
					}
				}
			} catch (error) {
				console.error('Error fetching news:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchAllNews();
	}, []);

	useEffect(() => {
		const handleScroll = () => setShowScrollTop(window.scrollY > 500);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		let filtered = news.filter(article =>
			!searchQuery ||
			article.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.resumen.toLowerCase().includes(searchQuery.toLowerCase())
		);

		filtered.sort((a, b) => {
			const diff = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
			if (sortBy === 'newest') return diff;
			if (sortBy === 'oldest') return -diff;
			if (sortBy === 'source') return simplifySourceName(a.fuente).localeCompare(simplifySourceName(b.fuente));
			return 0;
		});

		setFilteredNews(filtered);
		setDisplayCount(5);
	}, [searchQuery, sortBy, news]);

	const handleSortChange = (newSort: string) => {
		setSorting(true);
		setSortBy(newSort);
		setTimeout(() => setSorting(false), 300);
	};

	const getTimeAgo = (dateString: string): string => {
		const diffMs = currentTime.getTime() - new Date(dateString).getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) return diffDays === 1 ? t('news.timeAgo.day', { count: diffDays }) : t('news.timeAgo.days', { count: diffDays });
		if (diffHours > 0) return diffHours === 1 ? t('news.timeAgo.hour', { count: diffHours }) : t('news.timeAgo.hours', { count: diffHours });
		if (diffMinutes === 1) return t('news.timeAgo.minute');
		if (diffMinutes > 0) return t('news.timeAgo.minutes', { count: diffMinutes });
		return t('news.timeAgo.justNow');
	};

	const getNextRefresh = (): string => {
		const hours = currentTime.getHours();
		const cronHours = [5, 10, 15, 20, 23];
		let nextHour = cronHours.find(h => h > hours) || cronHours[0] + 24;

		const next = new Date(currentTime);
		next.setHours(nextHour % 24, 0, 0, 0);
		if (nextHour >= 24) next.setDate(next.getDate() + 1);

		const diffMs = next.getTime() - currentTime.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

		if (diffHours === 0) return diffMinutes === 1 ? t('news.timeIn.minute') : t('news.timeIn.minutes', { count: diffMinutes });
		if (diffMinutes === 0) return diffHours === 1 ? t('news.timeIn.hour') : t('news.timeIn.hours', { count: diffHours });
		return diffHours === 1 ? t('news.timeIn.hourAndMinutes', { minutes: diffMinutes }) : t('news.timeIn.hoursAndMinutes', { hours: diffHours, minutes: diffMinutes });
	};

	const simplifySourceName = (source: string): string => {
		const sourceMap: { [key: string]: string } = {
			'vandal.elespanol.com': 'Vandal',
			'amp.marca.com': 'Marca',
			'infobae.com': 'Infobae',
			'Meristation (AS)': 'Meristation',
			'Meristation': 'Meristation',
			'GamesRadar': 'GamesRadar',
			'PC Gamer': 'PC Gamer',
			'Windows Central': 'Windows Central'
		};
		return sourceMap[source] || source;
	};

	const formatDate = (dateString: string) => {
		try {
			const locales: { [key: string]: string } = {
				es: 'es-ES', en: 'en-US', fr: 'fr-FR', it: 'it-IT', pt: 'pt-PT'
			};
			const locale = locales[i18n.language] || 'en-US';
			return new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
		} catch {
			return dateString;
		}
	};

	const isNew = (dateString: string): boolean => {
		const diffTime = Math.abs(currentTime.getTime() - new Date(dateString).getTime());
		return (diffTime / (1000 * 60 * 60)) <= 24;
	};

	const highlightText = (text: string, query: string) => {
		if (!query) return text;
		const parts = text.split(new RegExp(`(${query})`, 'gi'));
		return parts.map((part, index) =>
			part.toLowerCase() === query.toLowerCase()
				? <mark key={index} className="bg-yellow-400 text-[#0b0d12] px-1 rounded">{part}</mark>
				: part
		);
	};

	/*const groupByDate = (articles: NewsArticle[]) => {
		const grouped: { [key: string]: NewsArticle[] } = {};
		articles.forEach(article => {
			const date = formatDate(article.fecha);
			if (!grouped[date]) grouped[date] = [];
			grouped[date].push(article);
		});
		return grouped;
	};*/

	const featuredArticle = filteredNews[0];
	//const groupedNews = groupByDate(filteredNews.slice(1, displayCount));

	return (
		<>
			<SEO
				{...seoConfig}
				canonical={getCanonicalUrl()}
			/>
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('news.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('news.breadcrumbs.news'), url: getCanonicalUrl() }
					]
				}}
			/>
			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					<div className="max-w-5xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('news.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('news.breadcrumbs.news')}</span>
						</div>
					</div>

					<div className="max-w-5xl mx-auto mb-12">
						<h1 className="text-5xl font-bold text-white mb-4">
							{t('news.title')} <span className="text-[#00d2ff]">{t('news.titleHighlight')}</span>
						</h1>
						<p className="text-gray-400 text-lg mb-4">{t('news.description')}</p>

						{!loading && (
							<div className="flex flex-wrap items-center gap-3">
								<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-sm font-medium">
									<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
									<span>{news.length} {t('news.available')}</span>
								</div>

								{lastCronRun && !isNaN(lastCronRun.getTime()) && (
									<div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
										<span>{t('news.lastUpdate')}: {getTimeAgo(lastCronRun.toISOString())}</span>
									</div>
								)}

								<div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>{t('news.nextUpdate')}: {getNextRefresh()}</span>
								</div>
							</div>
						)}
					</div>

					{loading ? (
						<div className="max-w-5xl mx-auto">
							<div className="mb-8 space-y-4">
								<div className="bg-white/5 border border-white/10 rounded-xl h-14 animate-pulse"></div>
								<div className="flex gap-3">
									<div className="bg-white/5 h-10 w-32 rounded-lg animate-pulse"></div>
									<div className="bg-white/5 h-10 w-40 rounded-lg animate-pulse"></div>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{[...Array(6)].map((_, i) => <NewsSkeleton key={i} />)}
							</div>
						</div>
					) : (
						<>
							<div className="max-w-5xl mx-auto mb-8 space-y-4">
								<div className="relative">
									<input
										type="text"
										placeholder={t('news.searchPlaceholder')}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
									/>
									<svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<img src="/News.png" alt="Goblin reading news" className="absolute -top-25 right-4 w-32 h-auto z-20 pointer-events-none select-none" />
								</div>

								<div className="flex items-center gap-3 flex-wrap">
									<span className="text-gray-400 text-sm font-medium">{t('news.sortBy')}:</span>
									{['newest', 'oldest'].map((sort) => (
										<button
											key={sort}
											onClick={() => handleSortChange(sort)}
											disabled={sorting}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${sortBy === sort ? 'bg-[#00d2ff] text-[#0b0d12]' : 'bg-white/5 text-gray-400 hover:bg-white/10'} ${sorting ? 'opacity-50 cursor-not-allowed' : ''}`}
										>
											{t(`news.sortOptions.${sort}`)}
										</button>
									))}
									{sorting && (
										<span className="inline-flex items-center gap-2 text-[#00d2ff] text-sm">
											<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
											{t('news.sorting')}
										</span>
									)}
								</div>

								<div className="text-gray-400 text-sm">
									{t('news.showing')} {Math.min(displayCount, filteredNews.length)} {t('news.of')} {filteredNews.length} {t('news.results')}
								</div>
							</div>

							{sorting ? (
								<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
									{[...Array(6)].map((_, i) => <NewsSkeleton key={i} />)}
								</div>
							) : (
								<div className="max-w-5xl mx-auto space-y-8">
									{filteredNews.length === 0 ? (
										<div className="text-center text-gray-400 py-12">{t('news.noResults')}</div>
									) : (
										<>
											{featuredArticle && (
												<div
													className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer group animate-fadeIn hover:border-[#00d2ff]/50 transition-all duration-300"
													onClick={() => window.open(featuredArticle.url, '_blank')}
												>
													{featuredArticle.image && (
														<div className="relative h-64 overflow-hidden">
															<img
																src={featuredArticle.image}
																alt={featuredArticle.titulo}
																className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
																onError={(e) => e.currentTarget.style.display = 'none'}
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-[#0b0d12]/50 to-transparent"></div>
														</div>
													)}

													<div className="relative z-10 p-8">
														<div className="flex items-start justify-between mb-4">
															<div className="flex items-center gap-3">
																<span className="bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
																	<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																		<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																	</svg>
																	{t('news.featured')}
																</span>
																{isNew(featuredArticle.fecha) && (
																	<span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
																		{t('news.new')}
																	</span>
																)}
															</div>
															<div className="text-right">
																<div className="text-[#00d2ff] font-medium flex items-center gap-1.5 justify-end text-sm">
																	<SourceIcon source={simplifySourceName(featuredArticle.fuente)} />
																	{simplifySourceName(featuredArticle.fuente)}
																</div>
																<div className="text-gray-400 text-xs mt-1">{formatDate(featuredArticle.fecha)}</div>
															</div>
														</div>

														<h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-[#00d2ff] transition leading-tight">
															{highlightText(featuredArticle.titulo, searchQuery)}
														</h2>

														<p className="text-gray-300 text-lg mb-6 leading-relaxed line-clamp-3">
															{highlightText(featuredArticle.resumen, searchQuery)}
														</p>

														<div className="flex items-center justify-between">
															<div className="flex items-center text-[#00d2ff] font-bold group-hover:text-white transition">
																<span>{t('news.readFull')}</span>
																<span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
															</div>
															<ShareButton title={featuredArticle.titulo} text={featuredArticle.resumen} url={featuredArticle.url} />
														</div>
													</div>
												</div>
											)}

											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												{filteredNews.slice(1, displayCount).map((article, index) => (
													<article
														key={index}
														className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] transition-all duration-300 group cursor-pointer animate-fadeIn flex flex-col"
														style={{ animationDelay: `${index * 30}ms` }}
														onClick={() => window.open(article.url, '_blank')}
													>
														{article.image && (
															<div className="relative h-48 overflow-hidden flex-shrink-0">
																<img
																	src={article.image}
																	alt={article.titulo}
																	className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
																	onError={(e) => e.currentTarget.parentElement!.style.display = 'none'}
																/>
															</div>
														)}

														<div className="p-6 flex flex-col flex-1">
															<div className="flex items-center justify-between mb-3">
																<div className="flex items-center gap-2">
																	<span className="bg-[#00d2ff] text-[#0b0d12] text-xs font-bold px-3 py-1 rounded-full">
																		{t('news.badge')}
																	</span>
																	{isNew(article.fecha) && (
																		<span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
																			{t('news.new')}
																		</span>
																	)}
																</div>
																<div className="text-right text-xs">
																	<div className="text-[#00d2ff] font-medium flex items-center gap-1.5 justify-end">
																		<SourceIcon source={simplifySourceName(article.fuente)} />
																		{simplifySourceName(article.fuente)}
																	</div>
																	<div className="text-gray-400 mt-1">{formatDate(article.fecha)}</div>
																</div>
															</div>

															<h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d2ff] transition line-clamp-2">
																{highlightText(article.titulo, searchQuery)}
															</h2>

															<p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
																{highlightText(article.resumen, searchQuery)}
															</p>

															<div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
																<div className="flex items-center text-[#00d2ff] font-medium text-sm group-hover:text-[#e5c100] transition">
																	<span>{t('news.readMore')}</span>
																	<span className="ml-2">→</span>
																</div>
																<ShareButton title={article.titulo} text={article.resumen} url={article.url} />
															</div>
														</div>
													</article>
												))}
											</div>

											{displayCount < filteredNews.length && (
												<div className="text-center py-8">
													<button
														onClick={() => setDisplayCount(prev => prev + 10)}
														className="bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] font-bold px-8 py-3 rounded-xl transition cursor-pointer"
													>
														{t('news.loadMore')}
													</button>
												</div>
											)}
										</>
									)}
								</div>
							)}
						</>
					)}
				</main>

				{showScrollTop && (
					<button
						onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						className="fixed bottom-8 right-8 bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
						aria-label={t('news.scrollTop')}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
						</svg>
					</button>
				)}

				<Footer />
			</div>
		</>
	);
}
