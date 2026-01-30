import { useEffect, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'

interface AchievementToastProps {
	achievementId: string | null
	onClose: () => void
}

const TOAST_DURATION = 5000

const achievementIcons: Record<string, JSX.Element> = {
	early_adopter: (
		<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
		</svg>
	),
	first_comment: (
		<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
		</svg>
	),
	mod_hunter: (
		<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
			<path d="M21 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM11 13H6v-2h5v2zm7 0h-5v-2h5v2z"/>
		</svg>
	),
	bug_reporter: (
		<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
			<path d="M19 8h-1.81a5.99 5.99 0 0 0-1.82-2.43l1.92-1.92-1.41-1.41-2.2 2.2a5.86 5.86 0 0 0-3.36 0l-2.2-2.2-1.41 1.41 1.92 1.92A5.99 5.99 0 0 0 6.81 8H5v2h1.09a6.08 6.08 0 0 0 0 4H5v2h1.81c.45.72 1.01 1.34 1.67 1.85L7 19.33V22h2v-2.12c.61.18 1.25.3 1.91.35V22h2v-1.77a6.03 6.03 0 0 0 1.91-.35V22h2v-2.67l-1.48-1.48A5.96 5.96 0 0 0 17.19 16H19v-2h-1.09a6.08 6.08 0 0 0 0-4H19V8zm-7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
		</svg>
	),
	news_reader: (
		<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
			<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H5v-2h7v2zm5-4H5v-2h12v2zm0-4H5V7h12v2z"/>
		</svg>
	),
	community_member: (
		<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
			<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
		</svg>
	),
}

export default function AchievementToast({ achievementId, onClose }: AchievementToastProps) {
	const { t } = useTranslation()
	const [isVisible, setIsVisible] = useState(false)
	const [progress, setProgress] = useState(100)

	useEffect(() => {
		if (achievementId) {
			setIsVisible(true)
			setProgress(100)

			const startTime = Date.now()
			const interval = setInterval(() => {
				const elapsed = Date.now() - startTime
				const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100)
				setProgress(remaining)

				if (remaining <= 0) {
					clearInterval(interval)
					setIsVisible(false)
					setTimeout(onClose, 300)
				}
			}, 50)

			return () => clearInterval(interval)
		}
	}, [achievementId, onClose])

	if (!achievementId) return null

	return (
		<div
			className={`fixed top-4 right-4 z-[150] transition-all duration-300 ${
				isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
			}`}
		>
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl min-w-[300px]">
				<div className="p-4 flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-[#00d2ff]/20 backdrop-blur-sm border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
						{achievementIcons[achievementId]}
					</div>
					<div className="flex-1">
						<p className="text-xs text-[#00d2ff] font-medium mb-1">
							{t('achievements.newUnlock')}
						</p>
						<p className="text-white font-bold">
							{t(`achievements.items.${achievementId}.name`)}
						</p>
					</div>
					<button
						onClick={() => { setIsVisible(false); setTimeout(onClose, 300) }}
						className="text-white/40 hover:text-white transition cursor-pointer p-1"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="h-1 bg-white/5">
					<div 
						className="h-full bg-gradient-to-r from-[#00d2ff] to-[#0099cc] transition-all duration-50 ease-linear"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</div>
	)
}
