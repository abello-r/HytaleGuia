import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DiscordButton from '../components/DiscordButton'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import { getSEOConfig } from '../utils/seoConfig'

interface Guide {
	_id: string
	slug: string
	title: string
	description: string
	category: string
	tags: string[]
	coverImage: string | null
	author: {
		id: string
		name: string
		image: string | null
	}
	stats: {
		views: number
		likes: number
		comments: number
	}
	publishedAt: string
}

interface GuidesResponse {
	success: boolean
	data: {
		guides: Guide[]
		total: number
		page: number
		totalPages: number
	}
}

const CATEGORIES = ['all', 'crafteo', 'combate', 'construccion', 'exploracion', 'mods', 'otros']

function GuideSkeleton() {
	return (
		<div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse h-[420px]">
			<div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800" />
			<div className="p-4 space-y-3">
				<div className="flex gap-2">
					<div className="bg-gray-700 h-5 w-16 rounded-full" />
					<div className="bg-gray-700 h-5 w-20 rounded-full" />
				</div>
				<div className="bg-gray-700 h-6 w-3/4 rounded" />
				<div className="space-y-2">
					<div className="bg-gray-700 h-4 w-full rounded" />
					<div className="bg-gray-700 h-4 w-full rounded" />
					<div className="bg-gray-700 h-4 w-2/3 rounded" />
				</div>
			</div>
		</div>
	)
}

function PopularRibbon() {
	return (
		<div className="absolute -right-[25px] top-[12px] z-10">
			<div className="bg-gradient-to-r from-[#00d2ff] to-[#0099cc] text-white text-xs font-black px-10 py-1.5 rotate-45 shadow-lg">
				TOP
			</div>
		</div>
	)
}

export default function GuidesPage() {
	const { t, i18n } = useTranslation()
	const { isSignedIn } = useUser()
	const navigate = useNavigate()
	const currentLang = i18n.language || 'es'
	const seoConfig = getSEOConfig('/guias', currentLang)

	const [guides, setGuides] = useState<Guide[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [category, setCategory] = useState('all')
	const [sortBy, setSortBy] = useState('recent')
	const [total, setTotal] = useState(0)
	const [displayCount, setDisplayCount] = useState(5)
	const [categoryOpen, setCategoryOpen] = useState(false)
	const [mostPopularId, setMostPopularId] = useState<string | null>(null)
	const [showScrollTop, setShowScrollTop] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const getCanonicalUrl = () => {
		const base = 'https://hytaleguia.com'
		const path = 'guias'
		return currentLang === 'es' ? `${base}/${path}` : `${base}/${currentLang}/${path}`
	}

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setCategoryOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	useEffect(() => {
		const handleScroll = () => setShowScrollTop(window.scrollY > 500)
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		fetchGuides()
	}, [category, sortBy])

	const fetchGuides = async () => {
		setLoading(true)
		try {
			const params = new URLSearchParams({
				category,
				sort: sortBy,
				limit: '100',
				...(searchQuery && { search: searchQuery })
			})

			const response = await fetch(`/api/guides?${params}`)
			const result: GuidesResponse = await response.json()

			if (result.success) {
				setGuides(result.data.guides)
				setTotal(result.data.total)

				if (result.data.guides.length > 0) {
					const popular = [...result.data.guides].sort((a, b) => b.stats.likes - a.stats.likes)[0]
					setMostPopularId(popular._id)
				} else {
					setMostPopularId(null)
				}
			}
		} catch (error) {
			console.error('Error fetching guides:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
		e?.preventDefault?.()
		setDisplayCount(5)
		fetchGuides()
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const locales: Record<string, string> = {
			es: 'es-ES',
			en: 'en-US',
			fr: 'fr-FR',
			it: 'it-IT',
			pt: 'pt-PT'
		}
		return date.toLocaleDateString(locales[currentLang] || 'es-ES', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	}

	const getCategoryGradient = (cat: string): string => {
		const gradients: Record<string, string> = {
			crafteo: 'from-amber-500/20 to-orange-500/20',
			combate: 'from-red-500/20 to-rose-500/20',
			construccion: 'from-blue-500/20 to-cyan-500/20',
			exploracion: 'from-green-500/20 to-emerald-500/20',
			mods: 'from-purple-500/20 to-pink-500/20',
			otros: 'from-gray-500/20 to-slate-500/20'
		}
		return gradients[cat] || gradients.otros
	}

	const filteredGuides = guides.filter(
		guide =>
			!searchQuery ||
			guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
	)

	const popularGuide =
		mostPopularId ? filteredGuides.find(g => g._id === mostPopularId && g.stats.likes > 0) ?? null : null

	const guidesToRender = (() => {
		if (!popularGuide) return filteredGuides.slice(0, displayCount)
		const others = filteredGuides.filter(g => g._id !== popularGuide._id)
		const take = Math.max(displayCount - 1, 0)
		return [popularGuide, ...others.slice(0, take)]
	})()

	const shownCount = guidesToRender.length

	return (
		<>
			<SEO {...seoConfig} canonical={getCanonicalUrl()} />
			<StructuredData
				type="BreadcrumbList"
				data={{
					items: [
						{ name: t('guides.breadcrumbs.home'), url: 'https://hytaleguia.com' },
						{ name: t('guides.breadcrumbs.guides'), url: getCanonicalUrl() }
					]
				}}
			/>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					<div className="max-w-5xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<a href="/" className="hover:text-[#00d2ff] transition cursor-pointer">
								{t('guides.breadcrumbs.home')}
							</a>
							<span>›</span>
							<span className="text-white">{t('guides.breadcrumbs.guides')}</span>
						</div>
					</div>

					<div className="max-w-5xl mx-auto mb-12">
						<h1 className="text-5xl font-bold text-white mb-4">
							{t('guides.title')} <span className="text-[#00d2ff]">{t('guides.titleHighlight')}</span>
						</h1>
						<p className="text-gray-400 text-lg mb-4">{t('guides.description')}</p>

						{!loading && (
							<div className="inline-flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-sm font-medium">
								<span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse" />
								<span>
									{total} {t('guides.available')}
								</span>
							</div>
						)}
					</div>

					{loading ? (
						<div className="max-w-5xl mx-auto">
							<div className="mb-8 space-y-4">
								<div className="bg-white/5 border border-white/10 rounded-xl h-14 animate-pulse" />
								<div className="flex gap-3">
									<div className="bg-white/5 h-10 w-32 rounded-lg animate-pulse" />
									<div className="bg-white/5 h-10 w-40 rounded-lg animate-pulse" />
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[...Array(3)].map((_, i) => (
									<GuideSkeleton key={i} />
								))}
							</div>
						</div>
					) : (
						<>
							<div className="max-w-5xl mx-auto mb-8 space-y-4">
								<div className="relative">
									<input
										type="text"
										placeholder={t('guides.searchPlaceholder')}
										value={searchQuery}
										onChange={e => setSearchQuery(e.target.value)}
										onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
										className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
									/>
									<svg
										className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>

									<img
										src="/guia.png"
										alt="Guide mascot"
										className="absolute -top-32 right-4 w-36 h-auto z-20 pointer-events-none select-none hidden lg:block"
									/>
								</div>

								<div className="flex flex-wrap items-center gap-3">
									<div className="relative" ref={dropdownRef}>
										<button
											onClick={() => setCategoryOpen(!categoryOpen)}
											className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition cursor-pointer min-w-[160px] justify-between"
										>
											<span>{t(`guides.categories.${category}`)}</span>
											<svg
												className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
											</svg>
										</button>

										{categoryOpen && (
											<div className="absolute top-full left-0 mt-2 w-full bg-[#1a1d24] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl">
												{CATEGORIES.map(cat => (
													<button
														key={cat}
														onClick={() => {
															setCategory(cat)
															setCategoryOpen(false)
															setDisplayCount(5)
														}}
														className={`w-full px-4 py-2.5 text-left text-sm transition cursor-pointer ${
															category === cat ? 'bg-[#00d2ff]/20 text-[#00d2ff]' : 'text-gray-300 hover:bg-white/5'
														}`}
													>
														{t(`guides.categories.${cat}`)}
													</button>
												))}
											</div>
										)}
									</div>

									<div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
										<button
											onClick={() => setSortBy('recent')}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
												sortBy === 'recent' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
											}`}
										>
											{t('guides.sortOptions.recent')}
										</button>
										<button
											onClick={() => setSortBy('popular')}
											className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
												sortBy === 'popular' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
											}`}
										>
											{t('guides.sortOptions.popular')}
										</button>
									</div>
								</div>

								<div className="text-gray-400 text-sm">
									{t('guides.showing')} {shownCount} {t('guides.of')} {filteredGuides.length} {t('guides.results')}
								</div>
							</div>

							<div className="max-w-5xl mx-auto">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
									{isSignedIn ? (
										<article
											onClick={() => navigate('/guias/nueva')}
											className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl overflow-hidden hover:border-[#00d2ff]/50 transition-all duration-300 h-[420px] flex flex-col items-center justify-center cursor-pointer"
										>
											<div className="text-center p-6">
												<svg
													className="w-16 h-16 mx-auto mb-4 text-gray-500"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
												</svg>
												<h3 className="text-xl font-bold text-white mb-2">{t('guides.addGuide.title')}</h3>
												<p className="text-gray-400 text-sm mb-4">{t('guides.addGuide.description')}</p>
												<span className="inline-flex items-center gap-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] px-4 py-2 rounded-full text-xs font-medium">
													<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
														/>
													</svg>
													<span>{t('guides.addGuide.action')}</span>
												</span>
											</div>
										</article>
									) : (
										<SignInButton mode="modal">
											<article className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl overflow-hidden hover:border-[#00d2ff]/50 transition-all duration-300 h-[420px] flex flex-col items-center justify-center cursor-pointer">
												<div className="text-center p-6">
													<svg
														className="w-16 h-16 mx-auto mb-4 text-gray-500"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
													</svg>
													<h3 className="text-xl font-bold text-white mb-2">{t('guides.addGuide.title')}</h3>
													<p className="text-gray-400 text-sm mb-4">{t('guides.addGuide.loginRequired')}</p>
													<span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-xs font-medium">
														<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
															/>
														</svg>
														<span>{t('guides.addGuide.login')}</span>
													</span>
												</div>
											</article>
										</SignInButton>
									)}

									{filteredGuides.length === 0 ? (
										<div className="md:col-span-2 lg:col-span-2 text-center text-gray-400 py-12 bg-white/5 border border-white/10 rounded-xl h-[420px] flex flex-col items-center justify-center">
											<svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
												/>
											</svg>
											<p className="text-xl">{t('guides.noResults')}</p>
										</div>
									) : (
										guidesToRender.map((guide, index) => (
											<Link
												key={guide._id}
												to={`/guias/${guide.slug}`}
												className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] hover:scale-[1.02] transition-all duration-300 h-[420px] flex flex-col animate-fadeIn relative"
												style={{ animationDelay: `${(index + 1) * 30}ms` }}
											>
												{popularGuide?._id === guide._id && <PopularRibbon />}

												<div className={`aspect-video bg-gradient-to-br ${getCategoryGradient(guide.category)} relative overflow-hidden`}>
													{guide.coverImage ? (
														<img
															src={guide.coverImage}
															alt={guide.title}
															className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
														/>
													) : (
														<div className="absolute inset-0 flex items-center justify-center">
															<span className="text-6xl font-bold text-white/10">{guide.title.charAt(0).toUpperCase()}</span>
														</div>
													)}
													<div className="absolute top-3 left-3">
														<span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
															{t(`guides.categories.${guide.category}`)}
														</span>
													</div>
												</div>

												<div className="p-4 flex flex-col flex-1">
													<h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#00d2ff] transition">
														{guide.title}
													</h3>

													<p className="text-gray-400 text-sm mb-4 line-clamp-3">{guide.description}</p>

													<div className="space-y-2 mb-3">
														<div className="flex items-center gap-2 text-xs text-gray-400">
															{guide.author.image ? (
																<img src={guide.author.image} alt={guide.author.name} className="w-4 h-4 rounded-full" />
															) : (
																<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
																	/>
																</svg>
															)}
															<span className="truncate">{guide.author.name}</span>
														</div>
														<div className="flex items-center gap-2 text-xs text-gray-400">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
																/>
															</svg>
															<span>{formatDate(guide.publishedAt)}</span>
														</div>
													</div>

													<div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
														<div className="flex items-center gap-3 text-xs text-gray-500">
															<span className="flex items-center gap-1">
																<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
																	/>
																</svg>
																{guide.stats.views}
															</span>
															<span className="flex items-center gap-1">
																<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
																	/>
																</svg>
																{guide.stats.likes}
															</span>
															<span className="flex items-center gap-1">
																<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
																	/>
																</svg>
																{guide.stats.comments}
															</span>
														</div>
														<div className="flex items-center text-[#00d2ff] font-medium text-sm group-hover:text-[#e5c100] transition">
															<span>{t('guides.readMore')}</span>
															<span className="ml-1">→</span>
														</div>
													</div>
												</div>
											</Link>
										))
									)}
								</div>

								{filteredGuides.length > 0 && displayCount < filteredGuides.length && (
									<div className="text-center py-8">
										<button
											onClick={() => setDisplayCount(prev => prev + 6)}
											className="bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] font-bold px-8 py-3 rounded-xl transition cursor-pointer"
										>
											{t('guides.loadMore')}
										</button>
									</div>
								)}
							</div>
						</>
					)}
				</main>

				{showScrollTop && (
					<button
						onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						className="fixed bottom-8 right-8 bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
						aria-label={t('guides.scrollTop')}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
						</svg>
					</button>
				)}

				<Footer />
			</div>
		</>
	)
}
