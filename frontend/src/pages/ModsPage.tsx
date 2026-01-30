import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DiscordButton from '../components/DiscordButton'
import ShareButton from '../components/ShareButton'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import { getSEOConfig } from '../utils/seoConfig'
import { useTrackAchievement } from '../context/AchievementsContext'

interface ModItem {
	titulo: string
	descripcion: string
	resumen: string
	autor: string
	version: string
	fecha_publicacion: string
	links_descarga: string[]
}

interface ModsResponse {
	success: boolean
	data: {
		mods: ModItem[]
		total: number
		lastCronRun: string | null
	}
	timestamp: string
}

function ModsSkeleton() {
	return (
		<div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse h-[420px]">
			<div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800"></div>
			<div className="p-4 space-y-3">
				<div className="flex gap-2">
					<div className="bg-gray-700 h-5 w-16 rounded-full"></div>
					<div className="bg-gray-700 h-5 w-20 rounded-full"></div>
				</div>
				<div className="bg-gray-700 h-6 w-3/4 rounded"></div>
				<div className="space-y-2">
					<div className="bg-gray-700 h-4 w-full rounded"></div>
					<div className="bg-gray-700 h-4 w-full rounded"></div>
					<div className="bg-gray-700 h-4 w-2/3 rounded"></div>
				</div>
			</div>
		</div>
	)
}

export default function ModsPage() {
	const { t, i18n } = useTranslation()
	const { trackModDownload } = useTrackAchievement()
	const currentLang = i18n.language || 'es'
	const seoConfig = getSEOConfig('/mods', currentLang)
	const [mods, setMods] = useState<ModItem[]>([])
	const [filteredMods, setFilteredMods] = useState<ModItem[]>([])
	const [loading, setLoading] = useState(true)
	const [sorting, setSorting] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('newest')
	const [displayCount, setDisplayCount] = useState(8)
	const [showScrollTop, setShowScrollTop] = useState(false)
	const [currentTime, setCurrentTime] = useState(new Date())
	const [lastCronRun, setLastCronRun] = useState<Date | null>(null)

	const getCanonicalUrl = () => {
		const base = 'https://hytaleguia.com'
		const path = 'mods'
		return currentLang === 'es' ? `${base}/${path}` : `${base}/${currentLang}/${path}`
	}

	const handleModDownload = (url: string) => {
		window.open(url, '_blank')
		trackModDownload()
	}

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000)
		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		async function fetchAllMods() {
			try {
				const response = await fetch('/api/mods/all')
				const result: ModsResponse = await response.json()

				if (result.success) {
					setMods(result.data.mods)
					setFilteredMods(result.data.mods)
					if (result.data.lastCronRun) {
						setLastCronRun(new Date(result.data.lastCronRun))
					}
				}
			} catch (error) {
				console.error('Error fetching mods:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchAllMods()
	}, [])

	useEffect(() => {
		const handleScroll = () => setShowScrollTop(window.scrollY > 500)
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const handleSortChange = (newSort: string) => {
		setSorting(true)
		setSortBy(newSort)
		setTimeout(() => setSorting(false), 300)
	}

	const getTimeAgo = (dateString: string): string => {
		const date = new Date(dateString)
		const diffMs = currentTime.getTime() - date.getTime()
		const diffMinutes = Math.floor(diffMs / (1000 * 60))
		const diffHours = Math.floor(diffMinutes / 60)
		const diffDays = Math.floor(diffHours / 24)

		if (diffDays > 0) return diffDays === 1 ? t('mods.timeAgo.day', { count: diffDays }) : t('mods.timeAgo.days', { count: diffDays })
		if (diffHours > 0) return diffHours === 1 ? t('mods.timeAgo.hour', { count: diffHours }) : t('mods.timeAgo.hours', { count: diffHours })
		if (diffMinutes === 1) return t('mods.timeAgo.minute')
		if (diffMinutes > 0) return t('mods.timeAgo.minutes', { count: diffMinutes })
		return t('mods.timeAgo.justNow')
	}

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString)
			const locales: { [key: string]: string } = {
				es: 'es-ES', en: 'en-US', fr: 'fr-FR', it: 'it-IT', pt: 'pt-PT'
			}
			const locale = locales[i18n.language] || 'en-US'
			return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
		} catch {
			return dateString
		}
	}

	const getNextRefresh = (): string => {
		const hours = currentTime.getHours()
		const cronHours = [5, 10, 15, 20, 23]
		let nextHour = cronHours.find(h => h > hours) || cronHours[0] + 24

		const next = new Date(currentTime)
		next.setHours(nextHour % 24, 0, 0, 0)
		if (nextHour >= 24) next.setDate(next.getDate() + 1)

		const diffMs = next.getTime() - currentTime.getTime()
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

		if (diffHours === 0) return diffMinutes === 1 ? t('mods.timeIn.minute') : t('mods.timeIn.minutes', { count: diffMinutes })
		if (diffMinutes === 0) return diffHours === 1 ? t('mods.timeIn.hour') : t('mods.timeIn.hours', { count: diffHours })
		return diffHours === 1 ? t('mods.timeIn.hourAndMinutes', { minutes: diffMinutes }) : t('mods.timeIn.hoursAndMinutes', { hours: diffHours, minutes: diffMinutes })
	}

	const isNew = (dateString: string): boolean => {
		const itemDate = new Date(dateString)
		const diffTime = Math.abs(currentTime.getTime() - itemDate.getTime())
		return (diffTime / (1000 * 60 * 60)) <= 72
	}

	const getSource = (downloadLinks: string[]): string => {
		if (!downloadLinks || downloadLinks.length === 0) return 'Unknown'

		try {
			const url = new URL(downloadLinks[0])
			const hostname = url.hostname.replace('www.', '')
			return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1)
		} catch {
			return 'Unknown'
		}
	}

	const getGradient = (title: string): string => {
		const gradients = [
			'from-cyan-500/20 to-blue-500/20',
			'from-purple-500/20 to-pink-500/20',
			'from-green-500/20 to-emerald-500/20',
			'from-orange-500/20 to-red-500/20',
			'from-indigo-500/20 to-purple-500/20',
			'from-yellow-500/20 to-orange-500/20',
		]
		const index = title.charCodeAt(0) % gradients.length
		return gradients[index]
	}

	useEffect(() => {
		let filtered = mods.filter(item =>
			!searchQuery ||
			item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.resumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.autor.toLowerCase().includes(searchQuery.toLowerCase())
		)

		filtered.sort((a, b) => {
			const diff = new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
			return sortBy === 'newest' ? diff : -diff
		})

		setFilteredMods(filtered)
		setDisplayCount(5)
	}, [searchQuery, sortBy, mods])

	const highlightText = (text: string, query: string) => {
		if (!query) return text
		const parts = text.split(new RegExp(`(${query})`, 'gi'))
		return parts.map((part, index) =>
			part.toLowerCase() === query.toLowerCase()
				? <mark key={index} className="bg-yellow-400 text-[#0b0d12] px-1 rounded">{part}</mark>
				: part
		)
	}

	return (
		<>
			<SEO {...seoConfig} canonical={getCanonicalUrl()} />
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('mods.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('mods.breadcrumbs.mods'), url: getCanonicalUrl() }
					]
				}}
			/>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					<div className="max-w-5xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('mods.breadcrumbs.home')}</a>
							<span>›</span>
							<span className="text-white">{t('mods.breadcrumbs.mods')}</span>
						</div>
					</div>

					<div className="max-w-5xl mx-auto mb-12">
						<h1 className="text-5xl font-bold text-white mb-4">
							{t('mods.title')} <span className="text-[#00d2ff]">{t('mods.titleHighlight')}</span>
						</h1>
						<p className="text-gray-400 text-lg mb-4">{t('mods.description')}</p>

						{!loading && (
							<div className="flex flex-wrap items-center gap-3">
								<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-sm font-medium">
									<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
									<span>{mods.length} {t('mods.available')}</span>
								</div>

								{lastCronRun && !isNaN(lastCronRun.getTime()) && (
									<div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
										</svg>
										<span>{t('mods.lastUpdate')}: {getTimeAgo(lastCronRun.toISOString())}</span>
									</div>
								)}

								<div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
									<span>{t('mods.nextUpdate')}: {getNextRefresh()}</span>
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

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[...Array(12)].map((_, index) => <ModsSkeleton key={index} />)}
							</div>
						</div>
					) : (
						<>
							<div className="max-w-5xl mx-auto mb-8 space-y-4">
								<div className="relative">
									<input
										type="text"
										placeholder={t('mods.searchPlaceholder')}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
									/>
									<svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
									</svg>

									<img
										src="/Mod.png"
										alt="Goblin browsing mods"
										className="absolute -top-28 right-4 w-32 h-auto z-20 pointer-events-none select-none -scale-x-100 hidden lg:block"
									/>
								</div>

								<div className="flex items-center gap-3 flex-wrap">
									<span className="text-gray-400 text-sm font-medium">{t('mods.sortBy')}:</span>

									{['newest', 'oldest'].map((sort) => (
										<button
											key={sort}
											onClick={() => handleSortChange(sort)}
											disabled={sorting}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${sortBy === sort ? 'bg-[#00d2ff] text-[#0b0d12]' : 'bg-white/5 text-gray-400 hover:bg-white/10'} ${sorting ? 'opacity-50 cursor-not-allowed' : ''}`}
										>
											{t(`mods.sortOptions.${sort}`)}
										</button>
									))}

									{sorting && (
										<span className="inline-flex items-center gap-2 text-[#00d2ff] text-sm">
											<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
											{t('mods.sorting')}
										</span>
									)}
								</div>

								<div className="text-gray-400 text-sm">
									{t('mods.showing')} {Math.min(displayCount, filteredMods.length)} {t('mods.of')} {filteredMods.length} {t('mods.results')}
								</div>
							</div>

							{sorting ? (
								<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{[...Array(12)].map((_, index) => <ModsSkeleton key={index} />)}
								</div>
							) : (
								<div className="max-w-5xl mx-auto">
									{filteredMods.length === 0 ? (
										<div className="text-center text-gray-400 py-12">
											<svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
											</svg>
											<p className="text-xl">{t('mods.noResults')}</p>
										</div>
									) : (
										<>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
												<article className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl overflow-hidden hover:border-[#00d2ff]/50 transition-all duration-300 h-[420px] flex flex-col items-center justify-center cursor-not-allowed opacity-60">
													<div className="text-center p-6">
														<svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
														</svg>
														<h3 className="text-xl font-bold text-white mb-2">{t('mods.addMod.title')}</h3>
														<p className="text-gray-400 text-sm mb-4">{t('mods.addMod.description')}</p>
														<span className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-full text-xs font-medium">
															<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
																<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
															</svg>
															<span>{t('mods.addMod.comingSoon')}</span>
														</span>
													</div>
												</article>

												{filteredMods.slice(0, displayCount).map((item, index) => (
													<article
														key={index}
														className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] hover:scale-[1.02] transition-all duration-300 group cursor-pointer h-[420px] flex flex-col animate-fadeIn"
														style={{ animationDelay: `${(index + 1) * 30}ms` }}
														onClick={() => handleModDownload(item.links_descarga[0])}
													>
														<div className={`aspect-video bg-gradient-to-br ${getGradient(item.titulo)} relative overflow-hidden`}>
															<div className="absolute inset-0 flex items-center justify-center">
																<div className="text-6xl font-bold text-white/10">
																	{item.titulo.charAt(0).toUpperCase()}
																</div>
															</div>

															<div className="absolute top-3 left-3 flex gap-2">
																{isNew(item.fecha_publicacion) && (
																	<span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
																		{t('mods.new')}
																	</span>
																)}
															</div>
														</div>

														<div className="p-4 flex flex-col flex-1">
															<h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#00d2ff] transition">
																{highlightText(item.titulo, searchQuery)}
															</h3>

															<p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
																{highlightText(item.resumen, searchQuery)}
															</p>

															<div className="space-y-2 mb-3">
																<div className="flex items-center gap-2 text-xs text-gray-400">
																	<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
																	</svg>
																	<span className="truncate">{item.autor}</span>
																</div>
																<div className="flex items-center gap-2 text-xs text-gray-400">
																	<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
																	</svg>
																	<span>{formatDate(item.fecha_publicacion)}</span>
																</div>
																<div className="flex items-center gap-2 text-xs text-gray-400">
																	<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
																	</svg>
																	<span className="truncate">{getSource(item.links_descarga)}</span>
																</div>
															</div>

															<div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
																<div className="flex items-center text-[#00d2ff] font-medium text-sm group-hover:text-[#e5c100] transition">
																	<span>{t('mods.download')}</span>
																	<span className="ml-1">→</span>
																</div>

																<ShareButton title={item.titulo} text={item.resumen} url={item.links_descarga[0]} />
															</div>
														</div>
													</article>
												))}
											</div>

											{displayCount < filteredMods.length && (
												<div className="text-center py-8">
													<button
														onClick={() => setDisplayCount(prev => prev + 6)}
														className="bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] font-bold px-8 py-3 rounded-xl transition cursor-pointer"
													>
														{t('mods.loadMore')}
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
						aria-label={t('mods.scrollTop')}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
						</svg>
					</button>
				)}

				<Footer />
			</div>
		</>
	)
}
