const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Guide = require('../models/Guide')
const UserAchievements = require('../models/UserAchievements')
const { shouldUnlock, ACHIEVEMENTS_CONFIG } = require('../config/achievements')

const uploadDir = path.join(__dirname, '../../uploads/guides')
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`
		cb(null, uniqueName)
	}
})

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		cb(null, allowed.includes(file.mimetype))
	}
})

async function trackAchievement(userId, action) {
	try {
		let userAchievements = await UserAchievements.findOne({ clerkUserId: userId })
		if (!userAchievements) {
			userAchievements = await UserAchievements.create({ clerkUserId: userId })
		}

		const unlocked = []
		for (const [achievementId, config] of Object.entries(ACHIEVEMENTS_CONFIG)) {
			if (config.trigger === action) {
				const achievement = userAchievements.achievements[achievementId]
				if (achievement && !achievement.unlocked) {
					achievement.progress += 1
					if (shouldUnlock(achievementId, achievement.progress)) {
						achievement.unlocked = true
						achievement.unlockedAt = new Date()
						unlocked.push(achievementId)
					}
				}
			}
		}

		if (unlocked.length > 0) {
			await userAchievements.save()
		}
		return unlocked
	} catch (error) {
		console.error('Error tracking achievement:', error)
		return []
	}
}

router.post('/upload', upload.single('image'), (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ success: false, error: 'No file uploaded' })
		}
		res.json({ success: true, data: { url: `/uploads/guides/${req.file.filename}` } })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.get('/', async (req, res) => {
	try {
		const { category, sort = 'recent', search, limit = 20, page = 1 } = req.query
		const skip = (parseInt(page) - 1) * parseInt(limit)
		let query = { status: 'published' }
		if (category && category !== 'all') query.category = category

		const searchQuery = search ? {
			...query,
			$or: [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ tags: { $regex: search, $options: 'i' } }
			]
		} : query

		const sortOption = sort === 'popular' ? { 'stats.likes': -1 } : { publishedAt: -1 }
		const guides = await Guide.find(searchQuery).sort(sortOption).skip(skip).limit(parseInt(limit)).select('-content -comments -likedBy')
		const total = await Guide.countDocuments(searchQuery)

		res.json({ success: true, data: { guides, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.get('/featured', async (req, res) => {
	try {
		const popular = await Guide.getPopular(6)
		res.json({ success: true, data: popular })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.get('/user/:userId', async (req, res) => {
	try {
		const guides = await Guide.find({ 'author.id': req.params.userId }).sort({ publishedAt: -1 }).select('-content -comments -likedBy')
		res.json({ success: true, data: guides })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.get('/:slug', async (req, res) => {
	try {
		const { slug } = req.params
		const { userId, visitorId } = req.query
		const guide = await Guide.findOne({ slug })

		if (!guide) return res.status(404).json({ success: false, error: 'Guide not found' })
		if (guide.status !== 'published' && guide.author.id !== userId) {
			return res.status(404).json({ success: false, error: 'Guide not found' })
		}

		guide.registerView(userId || visitorId)
		await guide.save()

		res.json({
			success: true,
			data: {
				...guide.toObject(),
				isLiked: userId ? guide.likedBy.includes(userId) : false,
				isOwner: userId === guide.author.id,
				likedBy: undefined,
				viewedBy: undefined
			}
		})
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.post('/', async (req, res) => {
	try {
		const { title, description, content, category, tags, coverImage, images, author } = req.body
		if (!author?.id) return res.status(401).json({ success: false, error: 'Authentication required' })
		if (!title || !description || !content || !category) {
			return res.status(400).json({ success: false, error: 'Missing required fields' })
		}

		const guide = await Guide.create({
			slug: await Guide.generateSlug(title),
			title, description, content, category,
			tags: tags || [],
			coverImage,
			images: images || [],
			author,
			publishedAt: new Date()
		})

		res.status(201).json({ success: true, data: guide })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.put('/:slug', async (req, res) => {
	try {
		const { slug } = req.params
		const { title, description, content, category, tags, coverImage, images, userId } = req.body
		const guide = await Guide.findOne({ slug })

		if (!guide) return res.status(404).json({ success: false, error: 'Guide not found' })
		if (guide.author.id !== userId) return res.status(403).json({ success: false, error: 'Not authorized' })

		if (title && title !== guide.title) {
			guide.title = title
			guide.slug = await Guide.generateSlug(title)
		}
		if (description) guide.description = description
		if (content) guide.content = content
		if (category) guide.category = category
		if (tags) guide.tags = tags
		if (coverImage !== undefined) guide.coverImage = coverImage
		if (images !== undefined) guide.images = images

		await guide.save()
		res.json({ success: true, data: guide })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.delete('/:slug', async (req, res) => {
	try {
		const { slug } = req.params
		const { userId } = req.body
		const guide = await Guide.findOne({ slug })

		if (!guide) return res.status(404).json({ success: false, error: 'Guide not found' })
		if (guide.author.id !== userId) return res.status(403).json({ success: false, error: 'Not authorized' })

		await guide.deleteOne()
		res.json({ success: true, message: 'Guide deleted' })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.post('/:slug/like', async (req, res) => {
	try {
		const { slug } = req.params
		const { userId } = req.body
		if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' })

		const guide = await Guide.findOne({ slug })
		if (!guide) return res.status(404).json({ success: false, error: 'Guide not found' })

		const wasLiked = guide.likedBy.includes(userId)
		const result = guide.toggleLike(userId)
		await guide.save()

		let unlockedAchievements = []
		if (!wasLiked && result.liked) {
			unlockedAchievements = await trackAchievement(userId, 'guide_liked')
		}

		res.json({ success: true, data: { ...result, unlockedAchievements } })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.post('/:slug/comments', async (req, res) => {
	try {
		const { slug } = req.params
		const { userId, userName, userImage, content } = req.body
		if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' })
		if (!content?.trim()) return res.status(400).json({ success: false, error: 'Comment content required' })

		const guide = await Guide.findOne({ slug })
		if (!guide) return res.status(404).json({ success: false, error: 'Guide not found' })

		const comment = guide.addComment(userId, userName, userImage, content.trim())
		await guide.save()

		const unlockedAchievements = await trackAchievement(userId, 'comment_created')

		res.status(201).json({ success: true, data: { ...comment, unlockedAchievements } })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.delete('/:slug/comments/:commentId', async (req, res) => {
	try {
		const { slug, commentId } = req.params
		const { userId } = req.body
		if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' })

		const guide = await Guide.findOne({ slug })
		if (!guide) return res.status(404).json({ success: false, error: 'Guide not found' })

		const removed = guide.removeComment(commentId, userId)
		if (!removed) return res.status(403).json({ success: false, error: 'Not authorized or comment not found' })

		await guide.save()
		res.json({ success: true, message: 'Comment deleted' })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

router.get('/categories/stats', async (req, res) => {
	try {
		const stats = await Guide.aggregate([
			{ $match: { status: 'published' } },
			{ $group: { _id: '$category', count: { $sum: 1 } } }
		])
		res.json({ success: true, data: stats.reduce((acc, item) => { acc[item._id] = item.count; return acc }, {}) })
	} catch (error) {
		res.status(500).json({ success: false, error: error.message })
	}
})

module.exports = router
