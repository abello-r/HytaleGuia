const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
	authorId: { type: String, required: true },
	authorName: { type: String, required: true },
	authorImage: { type: String, default: null },
	content: { type: String, required: true, maxlength: 1000 },
	createdAt: { type: Date, default: Date.now },
})

const guideSchema = new mongoose.Schema({
	slug: { 
		type: String, 
		required: true, 
		unique: true,
		index: true 
	},
	title: { 
		type: String, 
		required: true,
		maxlength: 150 
	},
	description: { 
		type: String, 
		required: true,
		maxlength: 300 
	},
	content: { 
		type: String, 
		required: true,
		maxlength: 50000 
	},
	category: { 
		type: String, 
		required: true,
		enum: ['crafteo', 'combate', 'construccion', 'exploracion', 'mods', 'otros']
	},
	tags: [{ type: String, maxlength: 30 }],
	coverImage: { type: String, default: null },
	images: [{ type: String }],
	
	author: {
		id: { type: String, required: true, index: true },
		name: { type: String, required: true },
		image: { type: String, default: null },
	},
	
	stats: {
		views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		comments: { type: Number, default: 0 },
	},
	
	viewedBy: [{ type: String }],
	likedBy: [{ type: String }],
	comments: [commentSchema],
	
	status: { 
		type: String, 
		enum: ['draft', 'published', 'hidden'],
		default: 'published'
	},
	
	publishedAt: { type: Date, default: Date.now },
}, { 
	timestamps: true,
	collection: 'Guides'
})

guideSchema.index({ title: 'text', description: 'text', tags: 'text' })
guideSchema.index({ 'stats.likes': -1 })
guideSchema.index({ 'stats.views': -1 })
guideSchema.index({ publishedAt: -1 })

guideSchema.statics.generateSlug = async function(title) {
	let slug = title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.substring(0, 80)
	
	const existing = await this.findOne({ slug })
	if (existing) {
		slug = `${slug}-${Date.now().toString(36)}`
	}
	
	return slug
}

guideSchema.statics.getPopular = function(limit = 10) {
	return this.find({ status: 'published' })
		.sort({ 'stats.likes': -1, 'stats.views': -1 })
		.limit(limit)
		.select('-content -comments -likedBy -viewedBy')
}

guideSchema.statics.getRecent = function(limit = 10) {
	return this.find({ status: 'published' })
		.sort({ publishedAt: -1 })
		.limit(limit)
		.select('-content -comments -likedBy -viewedBy')
}

guideSchema.statics.getByCategory = function(category, limit = 20) {
	return this.find({ status: 'published', category })
		.sort({ publishedAt: -1 })
		.limit(limit)
		.select('-content -comments -likedBy -viewedBy')
}

guideSchema.methods.registerView = function(visitorId) {
	if (!visitorId) {
		this.stats.views += 1
		return true
	}
	
	if (!this.viewedBy.includes(visitorId)) {
		this.viewedBy.push(visitorId)
		this.stats.views += 1
		return true
	}
	return false
}

guideSchema.methods.toggleLike = function(userId) {
	const index = this.likedBy.indexOf(userId)
	if (index === -1) {
		this.likedBy.push(userId)
		this.stats.likes += 1
		return { liked: true, likes: this.stats.likes }
	} else {
		this.likedBy.splice(index, 1)
		this.stats.likes -= 1
		return { liked: false, likes: this.stats.likes }
	}
}

guideSchema.methods.addComment = function(authorId, authorName, authorImage, content) {
	this.comments.push({ authorId, authorName, authorImage, content })
	this.stats.comments = this.comments.length
	return this.comments[this.comments.length - 1]
}

guideSchema.methods.removeComment = function(commentId, userId) {
	const comment = this.comments.id(commentId)
	if (!comment) return false
	if (comment.authorId !== userId && this.author.id !== userId) return false
	
	comment.deleteOne()
	this.stats.comments = this.comments.length
	return true
}

module.exports = mongoose.model('Guide', guideSchema)
