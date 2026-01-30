const express = require('express')
const router = express.Router()
const UserAchievements = require('../models/UserAchievements')
const { shouldUnlock, ACHIEVEMENTS_CONFIG } = require('../config/achievements')

// GET /api/achievements/leaderboard
router.get('/leaderboard', async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 10
		const leaderboard = await UserAchievements.getLeaderboard(limit)

		res.json({
			success: true,
			data: leaderboard
		})
	} catch (error) {
		console.error('Error fetching leaderboard:', error)
		res.status(500).json({ success: false, error: error.message })
	}
})

// GET /api/achievements/stats/global
router.get('/stats/global', async (req, res) => {
	try {
		const stats = {}

		for (const achievementId of Object.keys(ACHIEVEMENTS_CONFIG)) {
			stats[achievementId] = await UserAchievements.getAchievementStats(achievementId)
		}

		res.json({
			success: true,
			data: stats
		})
	} catch (error) {
		console.error('Error fetching global stats:', error)
		res.status(500).json({ success: false, error: error.message })
	}
})

// POST /api/achievements/:userId - Get/create user achievements and update userInfo
router.post('/:userId', async (req, res) => {
	try {
		const { userId } = req.params
		const { userInfo } = req.body

		let userAchievements = await UserAchievements.findOne({ clerkUserId: userId })

		if (!userAchievements) {
			userAchievements = await UserAchievements.create({ 
				clerkUserId: userId,
				userInfo: userInfo || {}
			})
		} else if (userInfo) {
			userAchievements.userInfo = userInfo
			await userAchievements.save()
		}

		res.json({
			success: true,
			data: {
				achievements: userAchievements.achievements,
				stats: userAchievements.stats,
			}
		})
	} catch (error) {
		console.error('Error fetching achievements:', error)
		res.status(500).json({ success: false, error: error.message })
	}
})

// POST /api/achievements/:userId/track
router.post('/:userId/track', async (req, res) => {
	try {
		const { userId } = req.params
		const { action, userInfo } = req.body

		if (!action) {
			return res.status(400).json({ success: false, error: 'Action is required' })
		}

		let userAchievements = await UserAchievements.findOne({ clerkUserId: userId })

		if (!userAchievements) {
			userAchievements = await UserAchievements.create({ 
				clerkUserId: userId,
				userInfo: userInfo || {}
			})
		} else if (userInfo) {
			userAchievements.userInfo = userInfo
		}

		const unlockedAchievements = []

		for (const [achievementId, config] of Object.entries(ACHIEVEMENTS_CONFIG)) {
			if (config.trigger === action) {
				const achievement = userAchievements.achievements[achievementId]

				if (achievement.unlocked) continue

				achievement.progress += 1

				if (shouldUnlock(achievementId, achievement.progress)) {
					achievement.unlocked = true
					achievement.unlockedAt = new Date()
					unlockedAchievements.push(achievementId)
				}
			}
		}

		await userAchievements.save()

		res.json({
			success: true,
			data: {
				achievements: userAchievements.achievements,
				stats: userAchievements.stats,
				newlyUnlocked: unlockedAchievements,
			}
		})
	} catch (error) {
		console.error('Error tracking achievement:', error)
		res.status(500).json({ success: false, error: error.message })
	}
})

// POST /api/achievements/:userId/unlock/:achievementId
router.post('/:userId/unlock/:achievementId', async (req, res) => {
	try {
		const { userId, achievementId } = req.params

		if (!ACHIEVEMENTS_CONFIG[achievementId]) {
			return res.status(400).json({ success: false, error: 'Invalid achievement ID' })
		}

		let userAchievements = await UserAchievements.findOne({ clerkUserId: userId })

		if (!userAchievements) {
			userAchievements = await UserAchievements.create({ clerkUserId: userId })
		}

		const wasUnlocked = userAchievements.unlockAchievement(achievementId)
		await userAchievements.save()

		res.json({
			success: true,
			data: {
				achievementId,
				wasUnlocked,
				achievement: userAchievements.achievements[achievementId],
			}
		})
	} catch (error) {
		console.error('Error unlocking achievement:', error)
		res.status(500).json({ success: false, error: error.message })
	}
})

module.exports = router
