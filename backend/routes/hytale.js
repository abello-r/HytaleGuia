const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.join(__dirname, '../cache/blog-images');
const CACHE_META = path.join(__dirname, '../cache/blog-meta.json');

async function ensureCacheDir() {
	try {
		await fs.access(CACHE_DIR);
	} catch {
		await fs.mkdir(CACHE_DIR, { recursive: true });
	}
}

async function loadCacheMeta() {
	try {
		const data = await fs.readFile(CACHE_META, 'utf8');
		return JSON.parse(data);
	} catch {
		return { currentSlug: null, imageFile: null };
	}
}

async function saveCacheMeta(slug, imageFile) {
	await ensureCacheDir();
	await fs.writeFile(CACHE_META, JSON.stringify({ currentSlug: slug, imageFile }, null, 2));
}

async function clearOldImages(keepFile) {
	try {
		const files = await fs.readdir(CACHE_DIR);
		for (const file of files) {
			if (file !== keepFile) {
				await fs.unlink(path.join(CACHE_DIR, file));
			}
		}
	} catch (error) {
		console.error('Error clearing old images:', error);
	}
}

async function downloadImage(s3Key, slug) {
	if (!s3Key) return null;

	try {
		await ensureCacheDir();
		const cacheMeta = await loadCacheMeta();

		if (cacheMeta.currentSlug === slug && cacheMeta.imageFile) {
			const cachedPath = path.join(CACHE_DIR, cacheMeta.imageFile);
			try {
				await fs.access(cachedPath);
				return `/api/hytale/image/${cacheMeta.imageFile}`;
			} catch {}
		}

		const hash = crypto.createHash('md5').update(s3Key).digest('hex');
		const ext = path.extname(s3Key) || '.png';
		const filename = `${hash}${ext}`;
		const filePath = path.join(CACHE_DIR, filename);

		const fetch = (await import('node-fetch')).default;

		const possibleUrls = [
			`https://cdn.hytale.com/${s3Key}`,
			`https://cdn.arcanitegames.ca/${s3Key}`,
			`https://hytale.com/m/variants/blog_cover/${s3Key}`,
		];

		for (const url of possibleUrls) {
			try {
				const response = await fetch(url, {
					headers: { 'User-Agent': 'HytaleGuia/1.0' },
					timeout: 10000
				});

				if (response.ok) {
					const buffer = await response.buffer();
					await fs.writeFile(filePath, buffer);
					await saveCacheMeta(slug, filename);
					await clearOldImages(filename);
					return `/api/hytale/image/${filename}`;
				}
			} catch (err) {}
		}

		return null;
	} catch (error) {
		return null;
	}
}

router.get('/image/:filename', async (req, res) => {
	try {
		const filePath = path.join(CACHE_DIR, req.params.filename);
		await fs.access(filePath);
		res.sendFile(filePath);
	} catch {
		res.status(404).json({ error: 'Image not found' });
	}
});

router.get('/blog/latest', async (req, res) => {
	try {
		const fetch = (await import('node-fetch')).default;
		
		const response = await fetch('https://hytale.com/api/blog/post/published?limit=1', {
			method: 'GET',
			headers: { 'User-Agent': 'HytaleGuia/1.0' }
		});

		if (!response.ok) {
			throw new Error(`Hytale API responded with ${response.status}`);
		}

		const data = await response.json();

		if (data && data.length > 0) {
			const post = data[0];
			
			let coverImageUrl = null;
			if (post.coverImage?.s3Key) {
				coverImageUrl = await downloadImage(post.coverImage.s3Key, post.slug);
			}
			
			const transformedPost = {
				slug: post.slug,
				title: post.title,
				coverImage: coverImageUrl,
				date: post.publishedAt,
				author: post.author || 'Hytale Team',
				excerpt: post.bodyExcerpt || ''
			};

			res.json({
				success: true,
				data: transformedPost
			});
		} else {
			res.json({
				success: false,
				message: 'No posts found'
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching Hytale blog',
			error: error.message
		});
	}
});

router.get('/status', async (req, res) => {
	try {
		const fetch = (await import('node-fetch')).default;
		
		const response = await fetch('https://hytale.com/api/status', {
			method: 'GET',
			headers: { 'User-Agent': 'HytaleGuia/1.0' }
		});

		const isOnline = response.ok && response.status === 200;

		res.json({
			success: true,
			data: {
				isOnline,
				lastChecked: new Date().toISOString()
			}
		});
	} catch (error) {
		res.json({
			success: true,
			data: {
				isOnline: false,
				lastChecked: new Date().toISOString()
			}
		});
	}
});

module.exports = router;
