import { useEffect, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '@clerk/clerk-react'
import { useAchievementsContext } from '../context/AchievementsContext'

interface AchievementsModalProps {
	isOpen: boolean
	onClose: () => void
}

interface LeaderboardEntry {
	clerkUserId: string
	userInfo?: {
		username: string | null
		imageUrl: string | null
	}
	stats: { totalUnlocked: number }
}

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

const achievementOrder = ['early_adopter', 'first_comment', 'mod_hunter', 'bug_reporter', 'news_reader', 'community_member']

const requiredProgress: Record<string, number> = {
	early_adopter: 1,
	first_comment: 1,
	mod_hunter: 5,
	bug_reporter: 1,
	news_reader: 10,
	community_member: 1,
}

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
	const { t } = useTranslation()
	const { user } = useUser()
	const { achievements, stats, loading } = useAchievementsContext()
	const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard'>('achievements')
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
	const [leaderboardLoading, setLeaderboardLoading] = useState(false)
	const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => { document.body.style.overflow = '' }
	}, [isOpen])

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) onClose()
		}
		window.addEventListener('keydown', handleEsc)
		return () => window.removeEventListener('keydown', handleEsc)
	}, [isOpen, onClose])

	useEffect(() => {
		if (isOpen && activeTab === 'leaderboard') {
			fetchLeaderboard()
		}
	}, [isOpen, activeTab])

	const fetchLeaderboard = async () => {
		setLeaderboardLoading(true)
		try {
			const response = await fetch('/api/achievements/leaderboard?limit=10')
			const result = await response.json()
			if (result.success && Array.isArray(result.data)) {
				setLeaderboard(result.data)
			}
		} catch (error) {
			console.error('Error fetching leaderboard:', error)
		} finally {
			setLeaderboardLoading(false)
		}
	}

	if (!isOpen) return null

	const totalAchievements = achievementOrder.length
	const unlockedCount = stats?.totalUnlocked || 0
	const progressPercentage = (unlockedCount / totalAchievements) * 100

	const getTooltipPosition = (index: number) => {
		const isBottomRow = index >= 3
		return isBottomRow ? 'bottom-full mb-2' : 'top-full mt-2'
	}

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

			<div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
				<div className="p-5 border-b border-white/10">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{user && (
								<img
									src={user.imageUrl}
									alt={user.fullName || 'User'}
									className="w-10 h-10 rounded-xl"
								/>
							)}
							<div>
								<h2 className="text-lg font-semibold text-white">{t('achievements.title')}</h2>
								<div className="flex items-center gap-2 mt-1">
									<div className="flex-1 h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
										<div 
											className="h-full bg-[#00d2ff] rounded-full transition-all"
											style={{ width: `${progressPercentage}%` }}
										/>
									</div>
									<span className="text-xs text-gray-400">{unlockedCount}/{totalAchievements}</span>
								</div>
							</div>
						</div>
						<button
							onClick={onClose}
							className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center cursor-pointer group"
						>
							<svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<div className="flex gap-1 mt-4 bg-white/5 p-1 rounded-lg">
						<button
							onClick={() => setActiveTab('achievements')}
							className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition cursor-pointer ${
								activeTab === 'achievements' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
							}`}
						>
							{t('achievements.tabs.achievements')}
						</button>
						<button
							onClick={() => setActiveTab('leaderboard')}
							className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition cursor-pointer ${
								activeTab === 'leaderboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
							}`}
						>
							{t('achievements.tabs.leaderboard')}
						</button>
					</div>
				</div>

				<div className="p-5 h-[350px] overflow-y-auto overflow-x-hidden">
					{activeTab === 'achievements' ? (
						loading ? (
							<div className="grid grid-cols-3 gap-3">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
								))}
							</div>
						) : (
							<div className="grid grid-cols-3 gap-3">
								{achievementOrder.map((achievementId, index) => {
									const achievement = achievements?.[achievementId]
									const isUnlocked = achievement?.unlocked || false
									const progress = achievement?.progress || 0
									const required = requiredProgress[achievementId]
									const showProgress = !isUnlocked && required > 1
									const isHovered = hoveredAchievement === achievementId

									return (
										<div
											key={achievementId}
											className="relative"
											onMouseEnter={() => setHoveredAchievement(achievementId)}
											onMouseLeave={() => setHoveredAchievement(null)}
										>
											<div
												className={`aspect-square flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
													isUnlocked
														? 'bg-[#00d2ff]/10 border-[#00d2ff]/30'
														: 'bg-white/5 border-white/10 opacity-40'
												}`}
											>
												<div className={isUnlocked ? 'text-[#00d2ff]' : 'text-gray-500'}>
													{achievementIcons[achievementId]}
												</div>
												<span className={`text-[11px] text-center font-medium mt-2 leading-tight ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
													{t(`achievements.items.${achievementId}.name`)}
												</span>
												{showProgress && (
													<div className="w-full mt-2">
														<div className="h-1 bg-white/10 rounded-full overflow-hidden">
															<div 
																className="h-full bg-[#00d2ff]/50 rounded-full"
																style={{ width: `${Math.min((progress / required) * 100, 100)}%` }}
															/>
														</div>
														<span className="text-[9px] text-gray-500 mt-0.5 block text-center">{progress}/{required}</span>
													</div>
												)}
												{isUnlocked && (
													<div className="absolute top-1 right-1 w-4 h-4 bg-[#00d2ff] rounded-full flex items-center justify-center">
														<svg className="w-2.5 h-2.5 text-[#0b0d12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
														</svg>
													</div>
												)}
											</div>

											{isHovered && (
												<div className={`absolute left-1/2 -translate-x-1/2 ${getTooltipPosition(index)} z-[200] px-3 py-2 bg-[#1a1d24] border border-white/20 rounded-lg text-xs text-gray-300 whitespace-nowrap shadow-xl`}>
													{t(`achievements.items.${achievementId}.description`)}
												</div>
											)}
										</div>
									)
								})}
							</div>
						)
					) : (
						<div className="space-y-2 h-full">
							{leaderboardLoading ? (
								[...Array(6)].map((_, i) => (
									<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
										<div className="w-6 h-6 bg-white/10 rounded" />
										<div className="w-8 h-8 bg-white/10 rounded-lg" />
										<div className="flex-1">
											<div className="h-3 w-20 bg-white/10 rounded" />
										</div>
									</div>
								))
							) : !Array.isArray(leaderboard) || leaderboard.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-gray-500">
									<svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
									</svg>
									<p className="text-sm">{t('achievements.leaderboard.empty')}</p>
								</div>
							) : (
								leaderboard.map((entry, index) => {
									const isCurrentUser = entry.clerkUserId === user?.id
									const rankColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400']
									const displayName = isCurrentUser 
										? t('achievements.leaderboard.you')
										: entry.userInfo?.username || `${t('achievements.leaderboard.user')} ${index + 1}`

									return (
										<div
											key={entry.clerkUserId}
											className={`flex items-center gap-3 p-3 rounded-xl transition ${
												isCurrentUser ? 'bg-[#00d2ff]/10 border border-[#00d2ff]/30' : 'bg-white/5'
											}`}
										>
											<span className={`w-6 text-center font-bold ${index < 3 ? rankColors[index] : 'text-gray-500'}`}>
												{index + 1}
											</span>
											{entry.userInfo?.imageUrl ? (
												<img 
													src={entry.userInfo.imageUrl} 
													alt={displayName}
													className="w-8 h-8 rounded-lg object-cover"
												/>
											) : (
												<div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-gray-400">
													{(entry.userInfo?.username || '??').slice(0, 2).toUpperCase()}
												</div>
											)}
											<div className="flex-1">
												<p className={`text-sm font-medium ${isCurrentUser ? 'text-[#00d2ff]' : 'text-white'}`}>
													{displayName}
												</p>
											</div>
											<span className="text-sm text-gray-400">
												{entry.stats.totalUnlocked} {t('achievements.leaderboard.unlocked')}
											</span>
										</div>
									)
								})
							)}
						</div>
					)}
				</div>

				<div className="p-4 border-t border-white/10">
					<p className="text-xs text-gray-500 text-center">{t('achievements.hint')}</p>
				</div>
			</div>
		</div>
	)
}
