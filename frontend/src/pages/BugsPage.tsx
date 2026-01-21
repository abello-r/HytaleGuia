import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

interface BugReport {
	titulo: string;
	resumen: string;
	url: string;
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

export default function BugsPage() {
	const { t, i18n } = useTranslation();
	const [bugs, setBugs] = useState<BugReport[]>([]);
	const [filteredBugs, setFilteredBugs] = useState<BugReport[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [displayCount, setDisplayCount] = useState(8);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [lastCronRun, setLastCronRun] = useState<Date | null>(null);

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
				console.error('❌ Error fetching bugs:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchBugs();
	}, []);

	// Filter bugs based on search query
	useEffect(() => {
		let filtered = bugs;

		if (searchQuery) {
			filtered = filtered.filter(bug =>
				bug.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
				bug.resumen.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		setFilteredBugs(filtered);
		setDisplayCount(8); // Reset display count on search
	}, [searchQuery, bugs]);

	// Map Spanish severity levels to English keys
	const mapSeverityToKey = (nivel: string): string => {
		const mapping: { [key: string]: string } = {
			'Crítico': 'critical',
			'Alto': 'high',
			'Medio': 'medium',
			'Bajo': 'low'
		};
		return mapping[nivel] || 'medium';
	};

	const getSeverityColor = (nivel: string): string => {
		const key = mapSeverityToKey(nivel);
		const colors = {
			critical: 'text-red-400',
			high: 'text-orange-400',
			medium: 'text-yellow-400',
			low: 'text-green-400'
		};
		return colors[key as keyof typeof colors] || colors.medium;
	};

	// Detect status from num_arreglos
	const detectStatus = (numArreglos: number): string => {
		if (numArreglos > 0) return 'fixed';
		return 'reported';
	};

	const getStatusBadge = (estado: string) => {
		if (estado === 'fixed') {
			return {
				bg: 'bg-green-500/10',
				border: 'border-green-500/30',
				text: 'text-green-400'
			};
		}
		return {
			bg: 'bg-[#00d2ff]/10',
			border: 'border-[#00d2ff]/30',
			text: 'text-[#00d2ff]'
		};
	};

	// Extract source from URL
	const getSourceFromUrl = (url: string): string => {
		try {
			const urlObj = new URL(url);
			const hostname = urlObj.hostname.replace('www.', '');
			
			// Map known domains to clean names
			const sourceMap: { [key: string]: string } = {
				'hytale.com': 'Hytale.com',
				'hypixelstudios.com': 'Hypixel Studios',
				'reddit.com': 'Reddit',
				'twitter.com': 'Twitter',
				'x.com': 'X (Twitter)'
			};

			// Check if it's a known source
			for (const [domain, name] of Object.entries(sourceMap)) {
				if (hostname.includes(domain)) {
					return name;
				}
			}

			// Otherwise return the clean hostname
			const parts = hostname.split('.');
			if (parts.length >= 2) {
				return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
			}
			
			return hostname;
		} catch {
			return 'Unknown';
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const locale = i18n.language === 'es' ? 'es-ES' :
					   i18n.language === 'en' ? 'en-US' :
					   i18n.language === 'fr' ? 'fr-FR' :
					   i18n.language === 'it' ? 'it-IT' :
					   i18n.language === 'pt' ? 'pt-PT' : 'en-US';
		return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
	};

	const getTimeAgo = (dateString: string): string => {
		const date = new Date(dateString);
		const diffMs = currentTime.getTime() - date.getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) {
			return diffDays === 1 
				? t('bugs.timeAgo.day', { count: diffDays })
				: t('bugs.timeAgo.days', { count: diffDays });
		}
		
		if (diffHours > 0) {
			return diffHours === 1 
				? t('bugs.timeAgo.hour', { count: diffHours })
				: t('bugs.timeAgo.hours', { count: diffHours });
		}

		if (diffMinutes === 1) return t('bugs.timeAgo.minute');
		if (diffMinutes > 0) return t('bugs.timeAgo.minutes', { count: diffMinutes });
		
		return t('bugs.timeAgo.justNow');
	};

	// Calculate next refresh based on cron: 0 5,10,15,20,23 * * * (5am, 10am, 3pm, 8pm, 11pm)
	const getNextRefresh = (): string => {
		const now = currentTime;
		const hours = now.getHours();

		let nextHour: number;
		if (hours < 5) {
			nextHour = 5;
		} else if (hours < 10) {
			nextHour = 10;
		} else if (hours < 15) {
			nextHour = 15;
		} else if (hours < 20) {
			nextHour = 20;
		} else if (hours < 23) {
			nextHour = 23;
		} else {
			nextHour = 5 + 24;
		}

		const next = new Date(now);
		next.setHours(nextHour % 24);
		next.setMinutes(0);
		next.setSeconds(0);

		if (nextHour >= 24) {
			next.setDate(next.getDate() + 1);
		}

		const diffMs = next.getTime() - now.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

		if (diffHours === 0) {
			if (diffMinutes === 1) return t('bugs.timeIn.minute');
			return t('bugs.timeIn.minutes', { count: diffMinutes });
		}

		if (diffMinutes === 0) {
			if (diffHours === 1) return t('bugs.timeIn.hour');
			return t('bugs.timeIn.hours', { count: diffHours });
		}

		if (diffHours === 1) return t('bugs.timeIn.hourAndMinutes', { minutes: diffMinutes });
		return t('bugs.timeIn.hoursAndMinutes', { hours: diffHours, minutes: diffMinutes });
	};

	const loadMore = () => setDisplayCount(prev => prev + 8);
	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

	// Highlight search text
	const highlightText = (text: string, query: string) => {
		if (!query) return text;
		const parts = text.split(new RegExp(`(${query})`, 'gi'));
		return parts.map((part, index) =>
			part.toLowerCase() === query.toLowerCase()
				? <mark key={index} className="bg-yellow-400 text-[#0b0d12] px-1 rounded">{part}</mark>
				: part
		);
	};

	return (
		<>
			<SEO
				title={t('bugs.seo.title')}
				description={t('bugs.seo.description')}
				keywords={t('bugs.seo.keywords')}
			/>
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('bugs.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('bugs.breadcrumbs.bugs'), url: 'https://hytaleguia.com/bugs' }
					]
				}}
			/>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					{/* Breadcrumbs */}
					<div className="max-w-6xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('bugs.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('bugs.breadcrumbs.bugs')}</span>
						</div>
					</div>

					{/* Header */}
					<div className="max-w-6xl mx-auto mb-12">
						<div className="flex items-center gap-3 mb-4">
							<h1 className="text-5xl font-bold text-white">
								{t('bugs.title')} <span className="text-[#00d2ff]">{t('bugs.titleHighlight')}</span>
							</h1>
						</div>
						<p className="text-gray-400 text-lg mb-4">
							{t('bugs.description')}
						</p>

						{/* Status badges */}
						{!loading && (
							<div className="flex flex-wrap items-center gap-3">
								<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-sm font-medium">
									<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
									<span>{bugs.length} {t('bugs.available')}</span>
								</div>

								{lastCronRun && !isNaN(lastCronRun.getTime()) && (
									<div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
										<span>✓</span>
										<span>{t('bugs.lastUpdate')}: {getTimeAgo(lastCronRun.toISOString())}</span>
									</div>
								)}

								<div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
									<span>⏰</span>
									<span>{t('bugs.nextUpdate')}: {getNextRefresh()}</span>
								</div>
							</div>
						)}
					</div>

					{loading ? (
						<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
							{[...Array(4)].map((_, i) => <BugSkeleton key={i} />)}
						</div>
					) : (
						<>
							{/* Search bar */}
							<div className="max-w-6xl mx-auto mb-8">
								<div className="relative">
									<input
										type="text"
										placeholder={t('bugs.searchPlaceholder')}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
									/>
									<span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>

									{/* Goblin image */}
									<img
										src="/bugs.jpg"
										alt="Bug tracker goblin"
										className="absolute -top-20 right-4 w-28 h-28 object-cover rounded-lg pointer-events-none select-none hidden lg:block"
									/>
								</div>
							</div>

							{/* Bugs Grid */}
							<div className="max-w-6xl mx-auto">
								{bugs.length === 0 ? (
									<div className="text-center text-gray-400 py-12">
										<div className="text-6xl mb-4">🔍</div>
										<p className="text-xl">{t('bugs.noResults')}</p>
									</div>
								) : (
									<>
										<div className="text-gray-400 text-sm mb-6">
											{t('bugs.showing')} {Math.min(displayCount, filteredBugs.length)} {t('bugs.of')} {filteredBugs.length} {t('bugs.results')}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
											{filteredBugs.slice(0, displayCount).map((bug, index) => {
												const estado = detectStatus(bug.num_arreglos || 0);
												const statusBadge = getStatusBadge(estado);
												const severityKey = mapSeverityToKey(bug.nivel);
												const severityColor = getSeverityColor(bug.nivel);
												const isFixed = estado === 'fixed';
												const source = getSourceFromUrl(bug.url);

												return (
													<div
														key={index}
														className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] transition-all duration-300 group cursor-pointer animate-fadeIn"
														style={{ animationDelay: `${index * 50}ms` }}
														onClick={() => window.open(bug.url, '_blank')}>
														
														{/* Status Badge - Simple and clean */}
														<div className="mb-4">
															<span className={`${statusBadge.bg} border ${statusBadge.border} ${statusBadge.text} text-xs font-bold px-3 py-1.5 rounded-lg inline-block`}>
																{t(`bugs.status.${estado}`)}
															</span>
														</div>

														{/* Title */}
														<h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d2ff] transition line-clamp-2">
															{highlightText(bug.titulo, searchQuery)}
														</h3>

														{/* Summary */}
														<p className="text-gray-400 text-sm mb-4 line-clamp-3">
															{highlightText(bug.resumen, searchQuery)}
														</p>

														{/* Info row - Severity and Reports */}
														{!isFixed && (
															<div className="flex items-center gap-4 mb-4 text-sm">
																<div className="flex items-center gap-1.5">
																	<span className="text-gray-500">{t('bugs.severity.label')}:</span>
																	<span className={`font-medium ${severityColor}`}>
																		{t(`bugs.severity.${severityKey}`)}
																	</span>
																</div>
																
																{bug.num_reportes > 0 && (
																	<div className="flex items-center gap-1.5">
																		<span className="text-gray-500">{t('bugs.reports')}:</span>
																		<span className="font-medium text-purple-400">
																			{bug.num_reportes.toLocaleString()}
																		</span>
																	</div>
																)}
															</div>
														)}

														{/* Footer */}
														<div className="flex items-center justify-between pt-3 border-t border-white/10">
															<div className="flex flex-col gap-1">
																<div className="text-xs text-gray-500">
																	{formatDate(bug.fecha_actualizacion)}
																</div>
																<div className="text-xs text-gray-400">
																	{t('bugs.source')}: <span className="text-[#00d2ff]">{source}</span>
																</div>
															</div>

															<div className="text-[#00d2ff] font-medium text-sm group-hover:text-[#e5c100] transition flex items-center gap-1 cursor-pointer">
																<span>{t('bugs.readMore')}</span>
																<span>→</span>
															</div>
														</div>
													</div>
												);
											})}
										</div>

										{/* Load More Button */}
										{displayCount < filteredBugs.length && (
											<div className="text-center py-8">
												<button
													onClick={loadMore}
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

				{/* Scroll to top button */}
				{showScrollTop && (
					<button
						onClick={scrollToTop}
						className="fixed bottom-8 right-8 bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
						aria-label={t('bugs.scrollTop')}
					>
						<span className="text-2xl">↑</span>
					</button>
				)}

				<Footer />
			</div>
		</>
	);
}