import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUser, SignInButton } from '@clerk/clerk-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DiscordButton from '../components/DiscordButton'
import SEO from '../components/SEO'
import ShareButton from '../components/ShareButton'
import AchievementToast from '../components/AchievementToast'

interface Comment { _id: string; authorId: string; authorName: string; authorImage: string | null; content: string; createdAt: string }
interface Guide { _id: string; slug: string; title: string; description: string; content: string; category: string; tags: string[]; coverImage: string | null; images: string[]; author: { id: string; name: string; image: string | null }; stats: { views: number; likes: number; comments: number }; comments: Comment[]; isLiked: boolean; isOwner: boolean; publishedAt: string }
interface Toast { id: number; message: string; type: 'success' | 'error' }

const renderMarkdown = (text: string): string => {
	if (!text) return ''
	let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
	html = html
		.replace(/^### (.*$)/gm, '</p><h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/^## (.*$)/gm, '</p><h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/^# (.*$)/gm, '</p><h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-white"><em>$1</em></strong>')
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
		.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
		.replace(/___(.*?)___/g, '<strong class="font-bold text-white"><em>$1</em></strong>')
		.replace(/__(.*?)__/g, '<strong class="font-bold text-white">$1</strong>')
		.replace(/_(.*?)_/g, '<em class="italic text-gray-300">$1</em>')
		.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500">$1</del>')
		.replace(/```(\w*)\n([\s\S]*?)```/g, '</p><pre class="bg-black/30 border border-white/10 p-4 rounded-xl my-4 overflow-x-auto"><code class="text-sm font-mono text-[#00d2ff]">$2</code></pre><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/```([\s\S]*?)```/g, '</p><pre class="bg-black/30 border border-white/10 p-4 rounded-xl my-4 overflow-x-auto"><code class="text-sm font-mono text-[#00d2ff]">$1</code></pre><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-[#00d2ff] text-sm font-mono">$1</code>')
		.replace(/^&gt; (.*$)/gm, '</p><blockquote class="border-l-4 border-[#00d2ff]/50 pl-4 my-4 text-gray-300 italic bg-white/5 py-2 pr-4 rounded-r-lg">$1</blockquote><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/^---$/gm, '</p><hr class="border-white/10 my-8" /><p class="text-gray-300 leading-relaxed mb-4">').replace(/^\*\*\*$/gm, '</p><hr class="border-white/10 my-8" /><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-xl my-4 border border-white/10" loading="lazy" />')
		.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" class="text-[#00d2ff] hover:text-[#00b8e6] underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>')
		.replace(/^- (.*$)/gm, '<li class="ml-6 list-disc text-gray-300 mb-1">$1</li>')
		.replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc text-gray-300 mb-1">$1</li>')
		.replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal text-gray-300 mb-1">$1</li>')
		.replace(/(<li class="ml-6 list-disc[^>]*>.*<\/li>\n?)+/g, '</p><ul class="my-4 text-gray-300">$&</ul><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/(<li class="ml-6 list-decimal[^>]*>.*<\/li>\n?)+/g, '</p><ol class="my-4 text-gray-300">$&</ol><p class="text-gray-300 leading-relaxed mb-4">')
		.replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-4">').replace(/\n/g, '<br />')
	html = `<p class="text-gray-300 leading-relaxed mb-4">${html}</p>`
	return html.replace(/<p class="text-gray-300 leading-relaxed mb-4"><\/p>/g, '').replace(/<p class="text-gray-300 leading-relaxed mb-4"><br \/><\/p>/g, '').replace(/<p class="text-gray-300 leading-relaxed mb-4">\s*<\/p>/g, '')
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: number) => void }) {
	return (
		<div className="fixed bottom-24 right-8 z-[70] space-y-2">
			{toasts.map(toast => (
				<div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg animate-slideIn ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
					{toast.type === 'success' ? <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
					<span className="text-sm font-medium">{toast.message}</span>
					<button onClick={() => onRemove(toast.id)} className="ml-2 hover:opacity-70 cursor-pointer"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
				</div>
			))}
		</div>
	)
}

function ImageCarousel({ images, title }: { images: string[], title: string }) {
	const { t } = useTranslation()
	const [currentIndex, setCurrentIndex] = useState(0)
	if (images.length === 0) return null
	const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
	const goToNext = () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))

	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-8">
			<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
				<svg className="w-5 h-5 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
				{t('guides.detail.gallery')}
				<span className="text-sm text-gray-400 font-normal ml-auto">{currentIndex + 1} / {images.length}</span>
			</h3>
			<div className="relative group">
				<div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20 aspect-video">
					<img src={images[currentIndex]} alt={`${title} - ${currentIndex + 1}`} className="w-full h-full object-contain" loading="lazy" />
					{images.length > 1 && (
						<>
							<button onClick={goToPrevious} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 cursor-pointer" aria-label="Previous"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
							<button onClick={goToNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 cursor-pointer" aria-label="Next"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
						</>
					)}
				</div>
				{images.length > 1 && (
					<div className="flex items-center justify-center gap-2 mt-4">
						{images.map((_, index) => (<button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentIndex ? 'bg-[#00d2ff] w-6' : 'bg-white/20 hover:bg-white/40'}`} aria-label={`Go to slide ${index + 1}`} />))}
					</div>
				)}
				{images.length > 1 && images.length <= 6 && (
					<div className="flex items-center justify-center gap-2 mt-4">
						{images.map((img, index) => (<button key={index} onClick={() => setCurrentIndex(index)} className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${index === currentIndex ? 'border-[#00d2ff] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}><img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" /></button>))}
					</div>
				)}
			</div>
		</div>
	)
}

export default function GuideDetailPage() {
	const { slug } = useParams<{ slug: string }>()
	const { t, i18n } = useTranslation()
	const { user, isSignedIn } = useUser()
	const navigate = useNavigate()
	const currentLang = i18n.language || 'es'

	const [guide, setGuide] = useState<Guide | null>(null)
	const [loading, setLoading] = useState(true)
	const [isLiked, setIsLiked] = useState(false)
	const [likesCount, setLikesCount] = useState(0)
	const [commentText, setCommentText] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [readingTime, setReadingTime] = useState(0)
	const [readingProgress, setReadingProgress] = useState(0)
	const [showScrollTop, setShowScrollTop] = useState(false)
	const [toasts, setToasts] = useState<Toast[]>([])
	const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null)

	const addToast = (message: string, type: 'success' | 'error') => { const id = Date.now(); setToasts(prev => [...prev, { id, message, type }]); setTimeout(() => removeToast(id), 4000) }
	const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

	useEffect(() => { if (slug) fetchGuide() }, [slug, user?.id])

	const handleScroll = useCallback(() => {
		const scrollTop = window.scrollY
		const docHeight = document.documentElement.scrollHeight - window.innerHeight
		setReadingProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0)
		setShowScrollTop(scrollTop > 500)
	}, [])

	useEffect(() => { window.addEventListener('scroll', handleScroll, { passive: true }); return () => window.removeEventListener('scroll', handleScroll) }, [handleScroll])

	const estimateReadingTime = (text: string) => { const cleanText = (text || '').replace(/[#*`\[\]()_~-]/g, ' ').replace(/\s+/g, ' ').trim(); return cleanText ? Math.max(1, Math.round(cleanText.split(' ').length / 200)) : 0 }
	const getVisitorId = () => { let visitorId = localStorage.getItem('visitorId'); if (!visitorId) { visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(7)}`; localStorage.setItem('visitorId', visitorId) } return visitorId }

	const fetchGuide = async () => {
		setLoading(true)
		try {
			const visitorId = getVisitorId()
			const params = new URLSearchParams({ ...(user?.id && { userId: user.id }), visitorId })
			const response = await fetch(`/api/guides/${slug}?${params}`)
			const result = await response.json()
			if (result.success) { setGuide(result.data); setIsLiked(result.data.isLiked); setLikesCount(result.data.stats.likes); setReadingTime(estimateReadingTime(result.data.content || '')) }
			else navigate('/guias')
		} catch { navigate('/guias') }
		finally { setLoading(false) }
	}

	const handleLike = async () => {
		if (!isSignedIn || !user?.id) return
		try {
			const response = await fetch(`/api/guides/${slug}/like`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
			const result = await response.json()
			if (result.success) {
				setIsLiked(result.data.liked)
				setLikesCount(result.data.likes)
				if (result.data.unlockedAchievements?.length > 0) {
					setUnlockedAchievement(result.data.unlockedAchievements[0])
				}
			}
		} catch (error) { console.error('Error toggling like:', error) }
	}

	const handleComment = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isSignedIn || !user || !commentText.trim() || !guide) return
		setSubmitting(true)
		try {
			const response = await fetch(`/api/guides/${slug}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, userName: user.username || user.firstName || 'Usuario', userImage: user.imageUrl, content: commentText.trim() }) })
			const result = await response.json()
			if (result.success) {
				const newComment = { _id: result.data._id, authorId: result.data.authorId, authorName: result.data.authorName, authorImage: result.data.authorImage, content: result.data.content, createdAt: result.data.createdAt }
				setGuide({ ...guide, comments: [...guide.comments, newComment], stats: { ...guide.stats, comments: guide.stats.comments + 1 } })
				setCommentText('')
				addToast(t('guides.toast.commentAdded'), 'success')
				if (result.data.unlockedAchievements?.length > 0) {
					setUnlockedAchievement(result.data.unlockedAchievements[0])
				}
			} else addToast(t('guides.toast.commentError'), 'error')
		} catch { addToast(t('guides.toast.commentError'), 'error') }
		finally { setSubmitting(false) }
	}

	const handleDeleteComment = async (commentId: string) => {
		if (!user?.id || !guide) return
		try {
			const response = await fetch(`/api/guides/${slug}/comments/${commentId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
			const result = await response.json()
			if (result.success) { setGuide({ ...guide, comments: guide.comments.filter(c => c._id !== commentId), stats: { ...guide.stats, comments: guide.stats.comments - 1 } }); addToast(t('guides.toast.commentDeleted'), 'success') }
			else addToast(t('guides.toast.deleteError'), 'error')
		} catch { addToast(t('guides.toast.deleteError'), 'error') }
	}

	const handleDeleteGuide = async () => {
		if (!user?.id) return
		setDeleting(true)
		try {
			const response = await fetch(`/api/guides/${slug}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
			const result = await response.json()
			if (result.success) navigate('/guias')
		} catch (error) { console.error('Error deleting guide:', error) }
		finally { setDeleting(false); setShowDeleteModal(false) }
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString), now = new Date()
		const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
		if (diffDays === 0) return t('guides.detail.today')
		if (diffDays === 1) return t('guides.detail.yesterday')
		if (diffDays < 7) return t('guides.detail.daysAgo', { count: diffDays })
		if (diffDays < 30) return t('guides.detail.weeksAgo', { count: Math.floor(diffDays / 7) })
		const locales: Record<string, string> = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', it: 'it-IT', pt: 'pt-PT' }
		return date.toLocaleDateString(locales[currentLang] || 'es-ES', { day: 'numeric', month: 'short', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
	}

	const formatTimeAgo = (dateString: string) => {
		const diffMs = new Date().getTime() - new Date(dateString).getTime()
		const diffMins = Math.floor(diffMs / 60000), diffHours = Math.floor(diffMins / 60), diffDays = Math.floor(diffHours / 24)
		if (diffDays > 0) return `${diffDays}d`
		if (diffHours > 0) return `${diffHours}h`
		if (diffMins > 0) return `${diffMins}m`
		return t('guides.comments.justNow')
	}

	const getCanonicalUrl = () => `https://hytaleguia.com/guias/${slug}`
	const scrollToComments = () => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })
	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

	if (loading) {
		return (
			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header /><DiscordButton />
				<main className="flex-1 container mx-auto px-4 py-24">
					<div className="max-w-5xl mx-auto">
						<div className="mb-6"><div className="h-5 w-64 bg-white/10 rounded animate-pulse" /></div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 animate-pulse">
							<div className="flex gap-2 mb-4"><div className="h-6 w-20 bg-white/10 rounded-full" /><div className="h-6 w-16 bg-white/10 rounded-full" /></div>
							<div className="h-10 w-3/4 bg-white/10 rounded mb-3" /><div className="h-5 w-full bg-white/10 rounded mb-6" />
							<div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/10 rounded-full" /><div className="space-y-2"><div className="h-4 w-24 bg-white/10 rounded" /><div className="h-3 w-20 bg-white/10 rounded" /></div></div>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse"><div className="space-y-3"><div className="h-4 bg-white/10 rounded w-full" /><div className="h-4 bg-white/10 rounded w-full" /><div className="h-4 bg-white/10 rounded w-5/6" /></div></div>
					</div>
				</main>
				<Footer />
			</div>
		)
	}

	if (!guide) return null

	return (
		<>
			<SEO title={`${guide.title} - HytaleGuía`} description={guide.description} keywords={guide.tags.join(', ')} canonical={getCanonicalUrl()} ogType="article" />
			<ToastContainer toasts={toasts} onRemove={removeToast} />
			<AchievementToast achievementId={unlockedAchievement} onClose={() => setUnlockedAchievement(null)} />

			<div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-white/5">
				<div className="h-full bg-gradient-to-r from-[#00d2ff] to-[#00d2ff]/70 transition-all duration-150 ease-out" style={{ width: `${readingProgress}%` }} />
				<div className={`absolute top-2 transition-all duration-300 ${readingProgress > 0 && readingProgress < 100 ? 'opacity-100' : 'opacity-0'}`} style={{ left: `${Math.min(readingProgress, 95)}%` }}>
					<div className="bg-[#0b0d12]/90 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 whitespace-nowrap">{Math.round(readingTime * (1 - readingProgress / 100))} min {t('guides.detail.remaining')}</div>
				</div>
			</div>

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header /><DiscordButton />
				<main className="flex-1 container mx-auto px-4 py-24">
					<div className="max-w-5xl mx-auto">
						<div className="mb-6">
							<div className="flex items-center gap-2 text-sm text-gray-400">
								<Link to="/" className="hover:text-[#00d2ff] transition cursor-pointer">{t('guides.breadcrumbs.home')}</Link><span>›</span>
								<Link to="/guias" className="hover:text-[#00d2ff] transition cursor-pointer">{t('guides.breadcrumbs.guides')}</Link><span>›</span>
								<span className="text-white truncate max-w-[300px]">{guide.title}</span>
							</div>
						</div>

						<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
							{guide.coverImage && (<div className="absolute inset-0"><img src={guide.coverImage} alt={guide.title} className="w-full h-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-b from-[#0b0d12]/60 via-[#0b0d12]/80 to-[#0b0d12]" /></div>)}
							<div className="relative p-6 md:p-8">
								{guide.isOwner && (
									<div className="absolute top-4 right-4 flex items-center gap-2">
										<Link to={`/guias/${slug}/editar`} className="p-2 text-gray-300 hover:text-[#00d2ff] bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer" title={t('guides.edit')}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></Link>
										<button onClick={() => setShowDeleteModal(true)} className="p-2 text-gray-300 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition cursor-pointer" title={t('guides.delete')}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
									</div>
								)}
								<div className="flex flex-wrap items-center gap-2 mb-4">
									<span className="bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-medium px-3 py-1 rounded-full">{t(`guides.categories.${guide.category}`)}</span>
									{guide.tags.slice(0, 3).map(tag => (<span key={tag} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-full">#{tag}</span>))}
								</div>
								<h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">{guide.title}</h1>
								<p className="text-gray-300 text-lg mb-6 max-w-3xl">{guide.description}</p>
								<div className="flex flex-wrap items-center justify-between gap-4">
									<div className="flex items-center gap-3">
										{guide.author.image ? <img src={guide.author.image} alt={guide.author.name} className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-semibold">{guide.author.name.charAt(0)}</div>}
										<div><p className="text-white font-medium">{guide.author.name}</p><p className="text-sm text-gray-400">{formatDate(guide.publishedAt)}</p></div>
									</div>
									<div className="flex flex-wrap items-center gap-3">
										<div className="flex items-center gap-2 text-sm">
											<span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5"><svg className="w-4 h-4 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{readingTime} min</span>
											<span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5"><svg className="w-4 h-4 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>{guide.stats.views}</span>
											<button onClick={scrollToComments} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5 hover:bg-white/10 hover:border-[#00d2ff]/30 transition cursor-pointer"><svg className="w-4 h-4 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>{guide.stats.comments}</button>
										</div>
										<div className="flex items-center gap-2">
											<ShareButton title={guide.title} text={guide.description} url={getCanonicalUrl()} />
											{isSignedIn ? (
												<button onClick={handleLike} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition cursor-pointer border ${isLiked ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'}`}><svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>{likesCount}</button>
											) : (
												<SignInButton mode="modal"><button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition cursor-pointer border bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>{likesCount}</button></SignInButton>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
							<div className="min-w-0">
								<article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 mb-8"><div className="max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content) }} /></article>
								{guide.images?.length > 0 && <ImageCarousel images={guide.images} title={guide.title} />}

								<section id="comments-section" className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
									<h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><svg className="w-5 h-5 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>{t('guides.comments.title')} ({guide.stats.comments})</h2>
									{isSignedIn ? (
										<form onSubmit={handleComment} className="mb-6">
											<div className="flex gap-3">
												<img src={user?.imageUrl} alt={user?.firstName || 'User'} className="w-10 h-10 rounded-full shrink-0" />
												<div className="flex-1 min-w-0">
													<textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t('guides.comments.placeholder')} rows={3} maxLength={1000} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition resize-none" />
													<div className="flex items-center justify-between mt-2">
														<span className="text-xs text-gray-400">{commentText.length}/1000</span>
														<button type="submit" disabled={!commentText.trim() || submitting} className="px-4 py-2 bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0d12] font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{submitting ? t('guides.comments.sending') : t('guides.comments.send')}</button>
													</div>
												</div>
											</div>
										</form>
									) : (
										<div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center mb-6">
											<p className="text-gray-300 mb-3">{t('guides.comments.loginRequired')}</p>
											<SignInButton mode="modal"><button className="px-4 py-2 bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0d12] font-semibold rounded-xl transition cursor-pointer">{t('guides.comments.login')}</button></SignInButton>
										</div>
									)}
									{guide.comments.length === 0 ? (
										<p className="text-gray-400 text-center py-6">{t('guides.comments.empty')}</p>
									) : (
										<div className="space-y-4">
											{guide.comments.map(comment => (
												<div key={comment._id} className="flex gap-3 p-4 rounded-xl border border-white/10 bg-black/10">
													{comment.authorImage ? <img src={comment.authorImage} alt={comment.authorName} className="w-10 h-10 rounded-full shrink-0" /> : <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-semibold shrink-0">{comment.authorName.charAt(0)}</div>}
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between gap-2 mb-1">
															<div className="flex items-center gap-2 min-w-0"><span className="font-medium text-white truncate">{comment.authorName}</span><span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span></div>
															{(user?.id === comment.authorId || user?.id === guide.author.id) && (<button onClick={() => handleDeleteComment(comment._id)} className="text-gray-400 hover:text-red-400 transition cursor-pointer p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>)}
														</div>
														<p className="text-gray-200 whitespace-pre-wrap break-words">{comment.content}</p>
													</div>
												</div>
											))}
										</div>
									)}
								</section>
							</div>

							<aside className="lg:sticky lg:top-24 h-fit space-y-6">
								<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
									<div className="grid grid-cols-2 gap-3 mb-4">
										<div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center"><p className="text-2xl font-bold text-white">{likesCount}</p><p className="text-xs text-gray-400">{t('guides.likes')}</p></div>
										<div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center"><p className="text-2xl font-bold text-white">{guide.stats.views}</p><p className="text-xs text-gray-400">{t('guides.detail.views')}</p></div>
									</div>
									<div className="grid grid-cols-2 gap-2">
										{isSignedIn ? (
											<button onClick={handleLike} className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer border ${isLiked ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'bg-white/5 text-gray-100 border-white/10 hover:bg-white/10'}`}><svg className={`w-5 h-5 shrink-0 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg><span className="text-sm">{t('guides.like')}</span></button>
										) : (
											<SignInButton mode="modal"><button className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer border bg-white/5 text-gray-100 border-white/10 hover:bg-white/10"><svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg><span className="text-sm">{t('guides.like')}</span></button></SignInButton>
										)}
										<button onClick={() => { if (navigator.share) navigator.share({ title: guide.title, text: guide.description, url: getCanonicalUrl() }); else { navigator.clipboard.writeText(getCanonicalUrl()); addToast(t('guides.toast.linkCopied'), 'success') } }} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer border bg-white/5 text-gray-100 border-white/10 hover:bg-white/10"><svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg><span className="text-sm">{t('guides.share')}</span></button>
									</div>
								</div>
								<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5"><div className="min-h-[250px] flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/10"><p className="text-xs text-gray-500">{t('guides.detail.adSpace')}</p></div></div>
								<Link to="/guias" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:bg-white/10 hover:border-[#00d2ff]/30 transition cursor-pointer">
									<div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/20 flex items-center justify-center group-hover:bg-[#00d2ff]/20 transition"><svg className="w-5 h-5 text-[#00d2ff] group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></div>
									<div><p className="text-white font-medium group-hover:text-[#00d2ff] transition">{t('guides.backToGuides')}</p><p className="text-xs text-gray-400">{t('guides.detail.exploreMore')}</p></div>
								</Link>
							</aside>
						</div>
					</div>
				</main>
				<Footer />

				{showScrollTop && (<button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-[#00d2ff] hover:bg-[#00a8cc] text-[#0b0d12] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 cursor-pointer" aria-label={t('guides.scrollTop')}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></button>)}

				{showDeleteModal && (
					<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
						<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
						<div className="relative bg-[#1a1d24] border border-white/10 rounded-2xl p-6 max-w-md w-full">
							<h3 className="text-xl font-bold text-white mb-3">{t('guides.deleteModal.title')}</h3>
							<p className="text-gray-300 mb-6">{t('guides.deleteModal.message')}</p>
							<div className="flex justify-end gap-3">
								<button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-300 hover:text-white transition cursor-pointer">{t('guides.deleteModal.cancel')}</button>
								<button onClick={handleDeleteGuide} disabled={deleting} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer">{deleting ? t('guides.deleteModal.deleting') : t('guides.deleteModal.confirm')}</button>
							</div>
						</div>
					</div>
				)}
			</div>
			<style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } } .animate-slideIn { animation: slideIn 0.3s ease-out; }`}</style>
		</>
	)
}
