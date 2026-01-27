import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import ShareButton from '../components/ShareButton';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import { getSEOConfig } from '../utils/seoConfig';

interface BugReport {
	titulo: string;
	resumen: string;
	full_link: string;
	nivel: string;
	num_reportes: number;
	num_arreglos?: number;
	fecha_actualizacion: string;
}

interface BugsResponse {
	success: boolean;
	data: {
		bugs: BugReport[];
		total: number;
		lastCronRun: string | null;
	};
	timestamp: string;
}

const SEVERITY_CONFIG = {
	Critical: { key: 'critical', color: 'text-rose-400' },
	High: { key: 'high', color: 'text-amber-400' },
	Medium: { key: 'medium', color: 'text-yellow-300' },
	Low: { key: 'low', color: 'text-teal-400' }
};

const SOURCE_MAP: { [key: string]: string } = {
	'hytaledatabase.com': 'Hytale Database',
	'hytale.com': 'Hytale.com',
	'hypixelstudios.com': 'Hypixel Studios',
	'reddit.com': 'Reddit',
	'twitter.com': 'Twitter',
	'x.com': 'X (Twitter)'
};

const CRON_HOURS = [5, 10, 15, 20, 23];

function BugSkeleton() {
	return (
		<div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse space-y-4">
			<div className="flex items-center gap-3">
				<div className="bg-gray-700 h-6 w-20 rounded-full"></div>
				<div className="bg-gray-700 h-6 w-16 rounded-full"></div>
			</div>
			<div className="bg-gray-700 h-8 w-3/4 rounded"></div>
			<div className="space-y-2">
				<div className="bg-gray-700 h-4 w-full rounded"></div>
				<div className="bg-gray-700 h-4 w-5/6 rounded"></div>
			</div>
		</div>
	);
}

function getSourceFromUrl(url: string): string {
	try {
		const hostname = new URL(url).hostname.replace('www.', '');
		
		for (const [domain, name] of Object.entries(SOURCE_MAP)) {
			if (hostname.includes(domain)) return name;
		}

		const parts = hostname.split('.');
		if (parts.length >= 2) {
			return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
		}
		
		return hostname;
	} catch {
		return 'Unknown';
	}
}

function highlightText(text: string, query: string) {
	if (!query) return text;
	const parts = text.split(new RegExp(`(${query})`, 'gi'));
	return parts.map((part, index) =>
		part.toLowerCase() === query.toLowerCase()
			? <mark key={index} className="bg-yellow-400 text-[#0b0d12] px-1 rounded">{part}</mark>
			: part
	);
}

export default function BugsPage() {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language || 'es';
	const seoConfig = getSEOConfig('/bugs', currentLang);
	const [bugs, setBugs] = useState<BugReport[]>([]);
	const [filteredBugs, setFilteredBugs] = useState<BugReport[]>([]);
	const [loading, setLoading] = useState(true);
	const [sorting, setSorting] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('newest');
	const [displayCount, setDisplayCount] = useState(8);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [lastCronRun, setLastCronRun] = useState<Date | null>(null);

	const getCanonicalUrl = () => {
		const base = 'https://hytaleguia.com';
		const path = 'bugs';
		return currentLang === 'es' ? `${base}/${path}` : `${base}/${currentLang}/${path}`;
	};

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const handleScroll = () => setShowScrollTop(window.scrollY > 500);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		async function fetchBugs() {
			try {
				const response = await fetch('/api/bugs/all');
				const result: BugsResponse = await response.json();

				if (result.success) {
					setBugs(result.data.bugs);
					setFilteredBugs(result.data.bugs);
					if (result.data.lastCronRun) {
						setLastCronRun(new Date(result.data.lastCronRun));
					}
				}
			} catch (error) {
				console.error('Error fetching bugs:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchBugs();
	}, []);

	useEffect(() => {
		let filtered = bugs.filter(bug =>
			!searchQuery || 
			bug.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
			bug.resumen.toLowerCase().includes(searchQuery.toLowerCase())
		);

		filtered.sort((a, b) => {
			const diff = new Date(b.fecha_actualizacion).getTime() - new Date(a.fecha_actualizacion).getTime();
			return sortBy === 'newest' ? diff : -diff;
		});

		setFilteredBugs(filtered);
		setDisplayCount(8);
	}, [searchQuery, sortBy, bugs]);

	const getSeverity = (nivel: string) => SEVERITY_CONFIG[nivel as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.Medium;

	const getStatusBadge = (numArreglos: number) => {
		return numArreglos > 0 
			? { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', key: 'fixed' }
			: { bg: 'bg-[#00d2ff]/10', border: 'border-[#00d2ff]/30', text: 'text-[#00d2ff]', key: 'reported' };
	};

	const formatDate = (dateString: string) => {
		const locales: { [key: string]: string } = {
			es: 'es-ES', en: 'en-US', fr: 'fr-FR', it: 'it-IT', pt: 'pt-PT'
		};
		const locale = locales[i18n.language] || 'en-US';
		return new Date(dateString).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
	};

	const getTimeAgo = (dateString: string): string => {
		const diffMs = currentTime.getTime() - new Date(dateString).getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) return diffDays === 1 ? t('bugs.timeAgo.day', { count: diffDays }) : t('bugs.timeAgo.days', { count: diffDays });
		if (diffHours > 0) return diffHours === 1 ? t('bugs.timeAgo.hour', { count: diffHours }) : t('bugs.timeAgo.hours', { count: diffHours });
		if (diffMinutes === 1) return t('bugs.timeAgo.minute');
		if (diffMinutes > 0) return t('bugs.timeAgo.minutes', { count: diffMinutes });
		return t('bugs.timeAgo.justNow');
	};

	const getNextRefresh = (): string => {
		const hours = currentTime.getHours();
		let nextHour = CRON_HOURS.find(h => h > hours) || CRON_HOURS[0] + 24;
		
		const next = new Date(currentTime);
		next.setHours(nextHour % 24, 0, 0, 0);
		if (nextHour >= 24) next.setDate(next.getDate() + 1);

		const diffMs = next.getTime() - currentTime.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

		if (diffHours === 0) return diffMinutes === 1 ? t('bugs.timeIn.minute') : t('bugs.timeIn.minutes', { count: diffMinutes });
		if (diffMinutes === 0) return diffHours === 1 ? t('bugs.timeIn.hour') : t('bugs.timeIn.hours', { count: diffHours });
		return diffHours === 1 ? t('bugs.timeIn.hourAndMinutes', { minutes: diffMinutes }) : t('bugs.timeIn.hoursAndMinutes', { hours: diffHours, minutes: diffMinutes });
	};

	return (
		<>
			<SEO {...seoConfig} canonical={getCanonicalUrl()} />
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('bugs.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('bugs.breadcrumbs.bugs'), url: getCanonicalUrl() }
					]
				}}
			/>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					<div className="max-w-5xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('bugs.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('bugs.breadcrumbs.bugs')}</span>
						</div>
					</div>

					<div className="max-w-5xl mx-auto mb-12">
						<h1 className="text-5xl font-bold text-white mb-4">
							{t('bugs.title')} <span className="text-[#00d2ff]">{t('bugs.titleHighlight')}</span>
						</h1>
						<p className="text-gray-400 text-lg mb-4">{t('bugs.description')}</p>

						{!loading && (
							<div className="flex flex-wrap items-center gap-3">
								<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-sm font-medium">
									<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
									<span>{bugs.length} {t('bugs.available')}</span>
								</div>

								{lastCronRun && !isNaN(lastCronRun.getTime()) && (
									<div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
										</svg>
										<span>{t('bugs.lastUpdate')}: {getTimeAgo(lastCronRun.toISOString())}</span>
									</div>
								)}

								<div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
									<span>{t('bugs.nextUpdate')}: {getNextRefresh()}</span>
								</div>
							</div>
						)}
					</div>

					{loading ? (
						<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
							{[...Array(4)].map((_, i) => <BugSkeleton key={i} />)}
						</div>
					) : (
						<>
							<div className="max-w-5xl mx-auto mb-8 space-y-4">
								<div className="relative">
									<input
										type="text"
										placeholder={t('bugs.searchPlaceholder')}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
									/>
									<svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
									</svg>

									<img
										src="/bugreport.png"
										alt="Bug tracker mascot"
										className="absolute -top-31 right-4 w-36 h-36 object-cover rounded-lg pointer-events-none select-none hidden lg:block"
									/>
								</div>

								<div className="flex items-center gap-3 flex-wrap">
									<span className="text-gray-400 text-sm font-medium">{t('bugs.sortBy')}:</span>

									{['newest', 'oldest'].map((sort) => (
										<button
											key={sort}
											onClick={() => { setSorting(true); setSortBy(sort); setTimeout(() => setSorting(false), 300); }}
											disabled={sorting}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${sortBy === sort ? 'bg-[#00d2ff] text-[#0b0d12]' : 'bg-white/5 text-gray-400 hover:bg-white/10'} ${sorting ? 'opacity-50 cursor-not-allowed' : ''}`}
										>
											{t(`bugs.sortOptions.${sort}`)}
										</button>
									))}

									{sorting && (
										<span className="inline-flex items-center gap-2 text-[#00d2ff] text-sm">
											<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
											{t('bugs.sorting')}
										</span>
									)}
								</div>

								<div className="text-gray-400 text-sm">
									{t('bugs.showing')} {Math.min(displayCount, filteredBugs.length)} {t('bugs.of')} {filteredBugs.length} {t('bugs.results')}
								</div>
							</div>

							<div className="max-w-5xl mx-auto">
								{filteredBugs.length === 0 ? (
									<div className="text-center text-gray-400 py-12">
										<svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
										</svg>
										<p className="text-xl">{t('bugs.noResults')}</p>
									</div>
								) : (
									<>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 auto-rows-fr">
											{filteredBugs.slice(0, displayCount).map((bug, index) => {
												const status = getStatusBadge(bug.num_arreglos || 0);
												const severity = getSeverity(bug.nivel);
												const source = getSourceFromUrl(bug.full_link);

												return (
													<div
														key={index}
														className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] transition-all duration-300 group cursor-pointer animate-fadeIn flex flex-col"
														style={{ animationDelay: `${index * 50}ms` }}
														onClick={() => window.open(bug.full_link, '_blank')}>
														
														<div className="mb-4">
															<span className={`${status.bg} border ${status.border} ${status.text} text-xs font-bold px-3 py-1.5 rounded-lg inline-block`}>
																{t(`bugs.status.${status.key}`)}
															</span>
														</div>

														<h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d2ff] transition h-14 line-clamp-2">
															{highlightText(bug.titulo, searchQuery)}
														</h3>

														<p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
															{highlightText(bug.resumen, searchQuery)}
														</p>

														{status.key === 'reported' && (
															<div className="flex items-center gap-4 mb-4 text-sm">
																<div className="flex items-center gap-1.5">
																	<span className="text-gray-500">{t('bugs.severity.label')}:</span>
																	<span className={`font-medium ${severity.color}`}>
																		{t(`bugs.severity.${severity.key}`)}
																	</span>
																</div>
																
																{bug.num_reportes > 0 && (
																	<div className="flex items-center gap-1.5">
																		<span className="text-gray-500">{t('bugs.reports')}:</span>
																		<span className="font-medium text-gray-400">
																			{bug.num_reportes.toLocaleString()}
																		</span>
																	</div>
																)}
															</div>
														)}

														<div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
															<div className="flex flex-col gap-1">
																<div className="text-xs text-gray-500">{formatDate(bug.fecha_actualizacion)}</div>
																<div className="text-xs text-gray-400">
																	{t('bugs.source')}: <span className="text-slate-400">{source}</span>
																</div>
															</div>

															<ShareButton title={bug.titulo} text={bug.resumen} url={bug.full_link} />
														</div>
													</div>
												);
											})}
										</div>

										{displayCount < filteredBugs.length && (
											<div className="text-center py-8">
												<button
													onClick={() => setDisplayCount(prev => prev + 8)}
													className="bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] font-bold px-8 py-3 rounded-xl transition cursor-pointer"
												>
													{t('bugs.loadMore')}
												</button>
											</div>
										)}
									</>
								)}
							</div>
						</>
					)}
				</main>

				{showScrollTop && (
					<button
						onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						className="fixed bottom-8 right-8 bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
						aria-label={t('bugs.scrollTop')}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
						</svg>
					</button>
				)}

				<Footer />
			</div>
		</>
	);
}