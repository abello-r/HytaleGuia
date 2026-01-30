import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useUser } from '@clerk/clerk-react'
import AchievementToast from '../components/AchievementToast'

interface Achievement {
	unlocked: boolean
	unlockedAt: string | null
	progress: number
}

interface AchievementsContextType {
	achievements: Record<string, Achievement> | null
	stats: { totalUnlocked: number; lastUnlocked: string } | null
	loading: boolean
	trackAction: (action: string) => Promise<void>
	refetch: () => Promise<void>
}

const AchievementsContext = createContext<AchievementsContextType | null>(null)

export function AchievementsProvider({ children }: { children: ReactNode }) {
	const { user, isLoaded } = useUser()
	const [achievements, setAchievements] = useState<Record<string, Achievement> | null>(null)
	const [stats, setStats] = useState<{ totalUnlocked: number; lastUnlocked: string } | null>(null)
	const [loading, setLoading] = useState(false)
	const [toastAchievement, setToastAchievement] = useState<string | null>(null)

	const fetchAchievements = useCallback(async () => {
		if (!user?.id) return

		try {
			setLoading(true)
			const response = await fetch(`/api/achievements/${user.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userInfo: {
						username: user.username || user.firstName || 'Usuario',
						imageUrl: user.imageUrl,
					}
				}),
			})
			const result = await response.json()

			if (result.success) {
				setAchievements(result.data.achievements)
				setStats(result.data.stats)
			}
		} catch (err) {
			console.error('Error fetching achievements:', err)
		} finally {
			setLoading(false)
		}
	}, [user?.id, user?.username, user?.firstName, user?.imageUrl])

	useEffect(() => {
		if (isLoaded && user?.id) {
			fetchAchievements()
		}
	}, [isLoaded, user?.id, fetchAchievements])

	const trackAction = useCallback(async (action: string) => {
		if (!user?.id) return

		try {
			const response = await fetch(`/api/achievements/${user.id}/track`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action,
					userInfo: {
						username: user.username || user.firstName || 'Usuario',
						imageUrl: user.imageUrl,
					}
				}),
			})

			const result = await response.json()

			if (result.success) {
				setAchievements(result.data.achievements)
				setStats(result.data.stats)

				if (result.data.newlyUnlocked?.length > 0) {
					setToastAchievement(result.data.newlyUnlocked[0])
				}
			}
		} catch (err) {
			console.error('Error tracking action:', err)
		}
	}, [user?.id, user?.username, user?.firstName, user?.imageUrl])

	return (
		<AchievementsContext.Provider value={{ achievements, stats, loading, trackAction, refetch: fetchAchievements }}>
			{children}
			<AchievementToast 
				achievementId={toastAchievement} 
				onClose={() => setToastAchievement(null)} 
			/>
		</AchievementsContext.Provider>
	)
}

export function useAchievementsContext() {
	const context = useContext(AchievementsContext)
	if (!context) {
		throw new Error('useAchievementsContext must be used within AchievementsProvider')
	}
	return context
}

export function useTrackAchievement() {
	const { trackAction } = useAchievementsContext()

	return {
		trackModDownload: () => trackAction('mod_downloaded'),
		trackNewsRead: () => trackAction('news_read'),
		trackBugReport: () => trackAction('bug_reported'),
		trackComment: () => trackAction('comment_created'),
		trackDiscordJoin: () => trackAction('discord_joined'),
	}
}
