import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUser } from '@clerk/clerk-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DiscordButton from '../components/DiscordButton'
import SEO from '../components/SEO'
import Toast from '../components/Toast'
import MarkdownEditor from '../components/Markdowneditor'

const CATEGORIES = ['crafteo', 'combate', 'construccion', 'exploracion', 'mods', 'otros']
const MAX_CONTENT_LENGTH = 20000

export default function CreateGuidePage() {
	const { t } = useTranslation()
	const { user, isSignedIn } = useUser()
	const navigate = useNavigate()
	const fileInputRef = useRef<HTMLInputElement>(null)
	
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [content, setContent] = useState('')
	const [category, setCategory] = useState('')
	const [tags, setTags] = useState('')
	const [coverImage, setCoverImage] = useState('')
	const [images, setImages] = useState<string[]>([])
	const [submitting, setSubmitting] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

	useEffect(() => {
		if (!isSignedIn) {
			navigate('/guias')
		}
	}, [isSignedIn, navigate])

	if (!isSignedIn) return null

	const handleUpload = async (file: File) => {
		setUploading(true)
		try {
			const formData = new FormData()
			formData.append('image', file)
			
			const response = await fetch('/api/guides/upload', {
				method: 'POST',
				body: formData
			})
			
			const result = await response.json()
			if (result.success) {
				return result.data.url
			} else {
				setToast({ message: t('guides.editor.uploadError'), type: 'error' })
				return null
			}
		} catch (error) {
			console.error('Error uploading:', error)
			setToast({ message: t('guides.editor.uploadError'), type: 'error' })
			return null
		} finally {
			setUploading(false)
		}
	}

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		
		const url = await handleUpload(file)
		if (url) {
			setImages([...images, url])
		}
		
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		
		const url = await handleUpload(file)
		if (url) {
			setCoverImage(url)
		}
	}

	const removeImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		if (!title.trim() || !description.trim() || !content.trim() || !category) {
			setToast({ message: t('guides.editor.requiredFields'), type: 'error' })
			return
		}

		if (content.length > MAX_CONTENT_LENGTH) {
			setToast({ message: t('guides.editor.contentTooLong'), type: 'error' })
			return
		}
		
		setSubmitting(true)
		
		try {
			const response = await fetch('/api/guides', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim(),
					content: content.trim(),
					category,
					tags: tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5),
					coverImage: coverImage.trim() || null,
					images,
					author: {
						id: user?.id,
						name: user?.username || user?.firstName || 'Usuario',
						image: user?.imageUrl || null
					}
				})
			})
			
			const result = await response.json()
			
			if (result.success) {
				setToast({ message: t('guides.editor.publishSuccess'), type: 'success' })
				setTimeout(() => navigate(`/guias/${result.data.slug}`), 1500)
			} else {
				setToast({ message: result.error || t('guides.editor.error'), type: 'error' })
			}
		} catch (err) {
			console.error('Error creating guide:', err)
			setToast({ message: t('guides.editor.error'), type: 'error' })
		} finally {
			setSubmitting(false)
		}
	}

	const getCategoryGradient = (cat: string): string => {
		const gradients: Record<string, string> = {
			crafteo: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
			combate: 'from-red-500/20 to-rose-500/20 border-red-500/30',
			construccion: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
			exploracion: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
			mods: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
			otros: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
		}
		return gradients[cat] || ''
	}

	return (
		<>
			<SEO
				title={t('guides.editor.createTitle')}
				description={t('guides.editor.createDescription')}
			/>

			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}

			<div className="min-h-screen bg-[#0b0d12] flex flex-col">
				<Header />
				<DiscordButton />

				<main className="flex-1 container mx-auto px-4 py-24">
					{/* Breadcrumb */}
					<div className="max-w-5xl mx-auto mb-6">
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<Link to="/" className="hover:text-[#00d2ff] transition cursor-pointer">
								{t('guides.breadcrumbs.home')}
							</Link>
							<span>›</span>
							<Link to="/guias" className="hover:text-[#00d2ff] transition cursor-pointer">
								{t('guides.breadcrumbs.guides')}
							</Link>
							<span>›</span>
							<span className="text-white">{t('guides.editor.createTitle')}</span>
						</div>
					</div>

					{/* Header */}
					<div className="max-w-5xl mx-auto mb-8">
						<h1 className="text-4xl font-bold text-white mb-2">
							{t('guides.editor.createTitle')}
						</h1>
						<p className="text-gray-400">
							{t('guides.editor.createDescription')}
						</p>
					</div>

					{/* Form */}
					<div className="max-w-5xl mx-auto">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Basic Info Section */}
							<div className="bg-white/5 border border-white/10 rounded-2xl p-6">
								<h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
									<svg className="w-5 h-5 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									{t('guides.editor.basicInfo')}
								</h2>

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<div className="lg:col-span-2">
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('guides.editor.title')} *
										</label>
										<input
											type="text"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											maxLength={150}
											placeholder={t('guides.editor.titlePlaceholder')}
											className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition text-lg"
										/>
										<span className="text-xs text-gray-500 mt-1 block text-right">{title.length}/150</span>
									</div>

									<div className="lg:col-span-2">
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('guides.editor.description')} *
										</label>
										<textarea
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											maxLength={300}
											rows={2}
											placeholder={t('guides.editor.descriptionPlaceholder')}
											className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition resize-none"
										/>
										<span className="text-xs text-gray-500 mt-1 block text-right">{description.length}/300</span>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('guides.editor.tags')}
										</label>
										<input
											type="text"
											value={tags}
											onChange={(e) => setTags(e.target.value)}
											placeholder={t('guides.editor.tagsPlaceholder')}
											className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
										/>
										<span className="text-xs text-gray-500 mt-1 block">{t('guides.editor.tagsHint')}</span>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('guides.editor.category')} *
										</label>
										<div className="grid grid-cols-3 gap-2">
											{CATEGORIES.map((cat) => (
												<button
													key={cat}
													type="button"
													onClick={() => setCategory(cat)}
													className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer border ${
														category === cat
															? `bg-gradient-to-br ${getCategoryGradient(cat)} text-white`
															: 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
													}`}
												>
													{t(`guides.categories.${cat}`)}
												</button>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Content Section */}
							<div className="bg-white/5 border border-white/10 rounded-2xl p-6">
								<h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
									<svg className="w-5 h-5 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									{t('guides.editor.contentSection')}
								</h2>

								<MarkdownEditor
									value={content}
									onChange={setContent}
									maxLength={MAX_CONTENT_LENGTH}
									rows={20}
									placeholder={t('guides.editor.contentPlaceholder')}
								/>
							</div>

							{/* Images Section */}
							<div className="bg-white/5 border border-white/10 rounded-2xl p-6">
								<h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
									<svg className="w-5 h-5 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									{t('guides.editor.imagesSection')}
								</h2>

								<div className="space-y-6">
									{/* Cover Image */}
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('guides.editor.coverImage')}
										</label>
										<div className="flex gap-3">
											<input
												type="url"
												value={coverImage}
												onChange={(e) => setCoverImage(e.target.value)}
												placeholder="https://ejemplo.com/imagen.jpg"
												className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff] transition"
											/>
											<label className={`px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 transition cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
												</svg>
												<span className="hidden sm:inline">{t('guides.editor.upload')}</span>
												<input
													type="file"
													accept="image/*"
													onChange={handleCoverUpload}
													className="hidden"
													disabled={uploading}
												/>
											</label>
										</div>
										
										{coverImage && (
											<div className="mt-3 relative aspect-video max-w-md rounded-xl overflow-hidden bg-white/5">
												<img 
													src={coverImage} 
													alt="Preview" 
													className="w-full h-full object-cover"
													onError={(e) => e.currentTarget.style.display = 'none'}
												/>
												<button
													type="button"
													onClick={() => setCoverImage('')}
													className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/50 rounded-lg transition cursor-pointer"
												>
													<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
										)}
									</div>

									{/* Additional Images */}
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											{t('guides.editor.images')}
										</label>
										
										<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
											{images.map((img, index) => (
												<div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
													<img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
													<button
														type="button"
														onClick={() => removeImage(index)}
														className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/50 rounded-lg transition cursor-pointer"
													>
														<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
														</svg>
													</button>
												</div>
											))}
											
											<label className={`aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-[#00d2ff]/50 flex flex-col items-center justify-center cursor-pointer transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
												{uploading ? (
													<div className="w-6 h-6 border-2 border-[#00d2ff] border-t-transparent rounded-full animate-spin" />
												) : (
													<>
														<svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
														</svg>
														<span className="text-xs text-gray-500">{t('guides.editor.addImage')}</span>
													</>
												)}
												<input
													ref={fileInputRef}
													type="file"
													accept="image/*"
													onChange={handleFileSelect}
													className="hidden"
													disabled={uploading}
												/>
											</label>
										</div>
										<span className="text-xs text-gray-500 mt-2 block">{t('guides.editor.imagesHint')}</span>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-between">
								<button
									type="button"
									onClick={() => navigate('/guias')}
									className="px-6 py-3 text-gray-400 hover:text-white transition cursor-pointer flex items-center gap-2"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
									</svg>
									{t('guides.editor.cancel')}
								</button>
								<button
									type="submit"
									disabled={submitting || uploading}
									className="px-8 py-3 bg-[#00d2ff] hover:bg-[#00b8e6] text-[#0b0d12] font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
								>
									{submitting ? (
										<>
											<div className="w-5 h-5 border-2 border-[#0b0d12] border-t-transparent rounded-full animate-spin" />
											{t('guides.editor.publishing')}
										</>
									) : (
										<>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											{t('guides.editor.publish')}
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</main>

				<Footer />
			</div>
		</>
	)
}
