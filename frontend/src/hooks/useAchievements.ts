import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';

interface Achievement {
	unlocked: boolean;
	unlockedAt: string | null;
	progress: number;
}

interface AchievementsData {
	achievements: Record<string, Achievement>;
	stats: {
		totalUnlocked: number;
		lastUnlocked: string;
	};
}

interface UseAchievementsReturn {
	achievements: Record<string, Achievement> | null;
	stats: AchievementsData['stats'] | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	trackAction: (action: string) => Promise<string[]>;
	unlockAchievement: (achievementId: string) => Promise<boolean>;
}

export function useAchievements(): UseAchievementsReturn {
	const { user, isLoaded } = useUser();
	const [achievements, setAchievements] = useState<Record<string, Achievement> | null>(null);
	const [stats, setStats] = useState<AchievementsData['stats'] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAchievements = useCallback(async () => {
		if (!user?.id) return;

		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/achievements/${user.id}`);
			const result = await response.json();

			if (result.success) {
				setAchievements(result.data.achievements);
				setStats(result.data.stats);
			} else {
				setError(result.error);
			}
		} catch (err) {
			setError('Error al cargar logros');
			console.error('Error fetching achievements:', err);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	useEffect(() => {
		if (isLoaded && user?.id) {
			fetchAchievements();
		} else if (isLoaded && !user) {
			setLoading(false);
			setAchievements(null);
			setStats(null);
		}
	}, [isLoaded, user?.id, fetchAchievements]);

	const trackAction = useCallback(async (action: string): Promise<string[]> => {
		if (!user?.id) return [];

		try {
			const response = await fetch(`/api/achievements/${user.id}/track`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action }),
			});

			const result = await response.json();

			if (result.success) {
				setAchievements(result.data.achievements);
				setStats(result.data.stats);
				return result.data.newlyUnlocked || [];
			}
		} catch (err) {
			console.error('Error tracking action:', err);
		}

		return [];
	}, [user?.id]);

	const unlockAchievement = useCallback(async (achievementId: string): Promise<boolean> => {
		if (!user?.id) return false;

		try {
			const response = await fetch(`/api/achievements/${user.id}/unlock/${achievementId}`, {
				method: 'POST',
			});

			const result = await response.json();

			if (result.success) {
				await fetchAchievements();
				return result.data.wasUnlocked;
			}
		} catch (err) {
			console.error('Error unlocking achievement:', err);
		}

		return false;
	}, [user?.id, fetchAchievements]);

	return {
		achievements,
		stats,
		loading,
		error,
		refetch: fetchAchievements,
		trackAction,
		unlockAchievement,
	};
}

export function useTrackAchievement() {
	const { trackAction } = useAchievements();

	return {
		trackModDownload: () => trackAction('mod_downloaded'),
		trackNewsRead: () => trackAction('news_read'),
		trackBugReport: () => trackAction('bug_reported'),
		trackComment: () => trackAction('comment_created'),
		trackDiscordJoin: () => trackAction('discord_joined'),
	};
}
