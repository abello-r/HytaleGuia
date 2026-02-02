const ACHIEVEMENTS_CONFIG = {
	early_adopter: {
		id: 'early_adopter',
		requiredProgress: 1,
		autoUnlock: true,
	},
	first_comment: {
		id: 'first_comment',
		requiredProgress: 1,
		trigger: 'comment_created',
	},
	first_like: {
		id: 'first_like',
		requiredProgress: 1,
		trigger: 'guide_liked',
	},
	mod_hunter: {
		id: 'mod_hunter',
		requiredProgress: 5,
		trigger: 'mod_downloaded',
	},
	bug_reporter: {
		id: 'bug_reporter',
		requiredProgress: 1,
		trigger: 'bug_reported',
	},
	news_reader: {
		id: 'news_reader',
		requiredProgress: 10,
		trigger: 'news_read',
	},
	community_member: {
		id: 'community_member',
		requiredProgress: 1,
		trigger: 'discord_joined',
	},
}

const shouldUnlock = (achievementId, currentProgress) => {
	const config = ACHIEVEMENTS_CONFIG[achievementId]
	if (!config) return false
	return currentProgress >= config.requiredProgress
}

const getAllAchievementIds = () => Object.keys(ACHIEVEMENTS_CONFIG)
const getAchievementConfig = (achievementId) => ACHIEVEMENTS_CONFIG[achievementId]

module.exports = {
	ACHIEVEMENTS_CONFIG,
	shouldUnlock,
	getAllAchievementIds,
	getAchievementConfig,
}
