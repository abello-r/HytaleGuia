const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema({
	unlocked: { type: Boolean, default: false },
	unlockedAt: { type: Date, default: null },
	progress: { type: Number, default: 0 },
})

const userAchievementsSchema = new mongoose.Schema({
	clerkUserId: { 
		type: String, 
		required: true, 
		unique: true,
		index: true 
	},
	userInfo: {
		username: { type: String, default: null },
		imageUrl: { type: String, default: null },
	},
	achievements: {
		early_adopter: { type: achievementSchema, default: () => ({ unlocked: true, unlockedAt: new Date() }) },
		first_comment: { type: achievementSchema, default: () => ({}) },
		mod_hunter: { type: achievementSchema, default: () => ({}) },
		bug_reporter: { type: achievementSchema, default: () => ({}) },
		news_reader: { type: achievementSchema, default: () => ({}) },
		community_member: { type: achievementSchema, default: () => ({}) },
	},
	stats: {
		totalUnlocked: { type: Number, default: 1 },
		lastUnlocked: { type: Date, default: Date.now },
	}
}, { 
	timestamps: true,
	collection: 'UserAchievements'
})

userAchievementsSchema.pre('save', function(next) {
	const achievements = this.achievements
	let count = 0
	let lastDate = null

	Object.values(achievements.toObject()).forEach(a => {
		if (a.unlocked) {
			count++
			if (!lastDate || (a.unlockedAt && a.unlockedAt > lastDate)) {
				lastDate = a.unlockedAt
			}
		}
	})

	this.stats.totalUnlocked = count
	if (lastDate) this.stats.lastUnlocked = lastDate
	next()
})

userAchievementsSchema.methods.unlockAchievement = function(achievementId) {
	if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
		this.achievements[achievementId].unlocked = true
		this.achievements[achievementId].unlockedAt = new Date()
		return true
	}
	return false
}

userAchievementsSchema.methods.incrementProgress = function(achievementId, amount = 1) {
	if (this.achievements[achievementId]) {
		this.achievements[achievementId].progress += amount
		return this.achievements[achievementId].progress
	}
	return 0
}

userAchievementsSchema.methods.updateUserInfo = function(username, imageUrl) {
	this.userInfo.username = username
	this.userInfo.imageUrl = imageUrl
}

userAchievementsSchema.statics.getLeaderboard = function(limit = 10) {
	return this.find()
		.sort({ 'stats.totalUnlocked': -1 })
		.limit(limit)
		.select('clerkUserId userInfo stats.totalUnlocked')
}

userAchievementsSchema.statics.getAchievementStats = async function(achievementId) {
	const total = await this.countDocuments()
	const unlocked = await this.countDocuments({ [`achievements.${achievementId}.unlocked`]: true })
	return {
		total,
		unlocked,
		percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0
	}
}

module.exports = mongoose.model('UserAchievements', userAchievementsSchema)
