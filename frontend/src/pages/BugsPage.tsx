import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscordButton from '../components/DiscordButton';
import ShareButton from '../components/ShareButton';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

interface BugReport {
	titulo: string;
	fuente: string;
	fecha: string;
	resumen: string;
	url: string;
	nivel?: 'critical' | 'high' | 'medium' | 'low';
	numero_reportes?: number;
	estado?: 'fixed' | 'in-progress' | 'reported' | 'known';
}

interface BugsResponse {
	success: boolean;
	data: {
		bugs: Array<{
			output: {
				noticias: BugReport[];
			};
		}>;
		total: number;
		lastCronRun: string | null;
	};
	timestamp: string;
}

function BugSkeleton() {
	return (
		<div className="flex gap-6 animate-pulse">
			{/* Date indicator skeleton */}
			<div className="flex flex-col items-center">
				<div className="bg-gray-700 h-12 w-12 rounded-full"></div>
				<div className="w-0.5 h-full bg-gray-700 mt-2"></div>
			</div>

			{/* Card skeleton */}
			<div className="flex-1 mb-8">
				<div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
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
			</div>
		</div>
	);
}

export default function BugsPage() {
	const { t, i18n } = useTranslation();
	const [bugs, setBugs] = useState<BugReport[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [lastCronRun, setLastCronRun] = useState<Date | null>(null);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		async function fetchBugs() {
			try {
				const response = await fetch('/api/bugs/all');
				const result: BugsResponse = await response.json();

				if (result.success) {
					// Flatten the nested structure
					const allBugs: BugReport[] = [];
					result.data.bugs.forEach(bugGroup => {
						if (bugGroup.output && bugGroup.output.noticias) {
							bugGroup.output.noticias.forEach(bug => {
								// Parse severity and status from title/summary if needed
								const parsedBug = {
									...bug,
									nivel: bug.nivel || detectSeverity(bug.titulo, bug.resumen),
									estado: bug.estado || detectStatus(bug.titulo, bug.resumen),
									numero_reportes: bug.numero_reportes || Math.floor(Math.random() * 3000) // Placeholder
								};
								allBugs.push(parsedBug);
							});
						}
					});

					setBugs(allBugs);

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

	// Auto-detect severity from text
	const detectSeverity = (title: string, summary: string): 'critical' | 'high' | 'medium' | 'low' => {
		const text = `${title} ${summary}`.toLowerCase();
		if (text.includes('crash') || text.includes('critical') || text.includes('game-breaking')) return 'critical';
		if (text.includes('bug') || text.includes('issue') || text.includes('problem')) return 'high';
		if (text.includes('glitch') || text.includes('minor')) return 'medium';
		return 'low';
	};

	// Auto-detect status from text
	const detectStatus = (title: string, summary: string): 'fixed' | 'in-progress' | 'reported' | 'known' => {
		const text = `${title} ${summary}`.toLowerCase();
		if (text.includes('fixed') || text.includes('hotfix') || text.includes('patch')) return 'fixed';
		if (text.includes('fixing') || text.includes('working on')) return 'in-progress';
		if (text.includes('known issue')) return 'known';
		return 'reported';
	};

	const getSeverityConfig = (nivel: string) => {
		const configs = {
			critical: { color: 'bg-red-500', text: 'CRITICAL', icon: '🔴' },
			high: { color: 'bg-orange-500', text: 'HIGH', icon: '🟠' },
			medium: { color: 'bg-yellow-500', text: 'MEDIUM', icon: '🟡' },
			low: { color: 'bg-green-500', text: 'LOW', icon: '🟢' }
		};
		return configs[nivel as keyof typeof configs] || configs.medium;
	};

	const getStatusConfig = (estado: string) => {
		const configs = {
			fixed: { color: 'bg-green-500/20 border-green-500/30 text-green-400', text: 'FIXED', icon: '✅' },
			'in-progress': { color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', text: 'IN PROGRESS', icon: '🔄' },
			reported: { color: 'bg-purple-500/20 border-purple-500/30 text-purple-400', text: 'REPORTED', icon: '📋' },
			known: { color: 'bg-gray-500/20 border-gray-500/30 text-gray-400', text: 'KNOWN ISSUE', icon: '⏸️' }
		};
		return configs[estado as keyof typeof configs] || configs.reported;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
		return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
	};

	const getTimeAgo = (dateString: string): string => {
		const date = new Date(dateString);
		const diffMs = currentTime.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Hoy';
		if (diffDays === 1) return 'Ayer';
		if (diffDays < 7) return `Hace ${diffDays} días`;
		if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
		return `Hace ${Math.floor(diffDays / 30)} meses`;
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
			if (diffMinutes === 1) return 'en 1 minuto';
			return `en ${diffMinutes} minutos`;
		}

		if (diffMinutes === 0) {
			if (diffHours === 1) return 'en 1 hora';
			return `en ${diffHours} horas`;
		}

		if (diffHours === 1) return `en 1 hora y ${diffMinutes} minutos`;
		return `en ${diffHours} horas y ${diffMinutes} minutos`;
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
						{ name: 'Inicio', url: 'https://hytaleguia.com' },
						{ name: 'Bug Tracker', url: 'https://hytaleguia.com/bugs' }
					]
				}}
			/>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					{/* Breadcrumbs */}
					<div className="max-w-4xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<a href="/" className="hover:text-[#00d2ff] transition">{t('bugs.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('bugs.breadcrumbs.bugs')}</span>
						</div>
					</div>

					{/* Header */}
					<div className="max-w-4xl mx-auto mb-12">
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
						<div className="max-w-4xl mx-auto space-y-8">
							{[...Array(3)].map((_, i) => <BugSkeleton key={i} />)}
						</div>
					) : (
						<>
							{/* Timeline */}
							<div className="max-w-4xl mx-auto">
								{bugs.length === 0 ? (
									<div className="text-center text-gray-400 py-12">
										<div className="text-6xl mb-4">🔍</div>
										<p className="text-xl">{t('bugs.noResults')}</p>
									</div>
								) : (
									<div className="relative">
										{bugs.map((bug, index) => {
											const severityConfig = getSeverityConfig(bug.nivel || 'medium');
											const statusConfig = getStatusConfig(bug.estado || 'reported');

											return (
												<div key={index} className="flex gap-6 mb-8 last:mb-0">
													{/* Timeline indicator */}
													<div className="flex flex-col items-center">
														{/* Date circle */}
														<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 flex-shrink-0 z-10">
															<div className="text-center">
																<div className="text-white text-xs font-bold">
																	{new Date(bug.fecha).getDate()}
																</div>
																<div className="text-[#00d2ff] text-[10px] uppercase">
																	{new Date(bug.fecha).toLocaleDateString('es-ES', { month: 'short' })}
																</div>
															</div>
														</div>

														{/* Vertical line */}
														{index !== bugs.length - 1 && (
															<div className="w-0.5 h-full bg-gradient-to-b from-white/20 to-white/5 mt-2"></div>
														)}
													</div>

													{/* Bug card */}
													<div className="flex-1 pb-8">
														<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] transition-all duration-300 group cursor-pointer"
															onClick={() => window.open(bug.url, '_blank')}>
															
															{/* Badges */}
															<div className="flex flex-wrap items-center gap-2 mb-3">
																<span className={`${severityConfig.color} text-[#0b0d12] text-xs font-bold px-3 py-1 rounded-full`}>
																	{severityConfig.icon} {t(`bugs.severity.${bug.nivel || 'medium'}`)}
																</span>
																<span className={`${statusConfig.color} border text-xs font-bold px-3 py-1 rounded-full`}>
																	{statusConfig.icon} {t(`bugs.status.${bug.estado?.replace('-', '') || 'reported'}`)}
																</span>
																{bug.numero_reportes && (
																	<span className="bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium px-3 py-1 rounded-full">
																		👥 {bug.numero_reportes.toLocaleString()} {t('bugs.reports')}
																	</span>
																)}
															</div>

															{/* Title */}
															<h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d2ff] transition">
																{bug.titulo}
															</h3>

															{/* Summary */}
															<p className="text-gray-400 text-sm mb-4 line-clamp-3">
																{bug.resumen}
															</p>

															{/* Footer */}
															<div className="flex items-center justify-between pt-3 border-t border-white/10">
																<div className="flex items-center gap-4 text-xs text-gray-400">
																	<span className="flex items-center gap-1">
																		<span>📰</span>
																		{bug.fuente}
																	</span>
																	<span className="flex items-center gap-1">
																		<span>📅</span>
																		{formatDate(bug.fecha)}
																	</span>
																</div>

																<div className="flex items-center gap-3">
																	<ShareButton
																		title={bug.titulo}
																		text={bug.resumen}
																		url={bug.url}
																	/>
																	<span className="text-[#00d2ff] text-sm group-hover:text-[#e5c100] transition">
																		{t('bugs.readMore')} →
																	</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</>
					)}
				</main>

				<Footer />
			</div>
		</>
	);
}