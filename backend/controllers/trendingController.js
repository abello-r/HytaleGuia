const path = require('path');
const fs = require('fs').promises;

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

async function findLatestFile(directory, prefix) {
	try {
		const files = await fs.readdir(directory);
		const matchingFiles = files.filter(file => file.startsWith(prefix) && file.endsWith('.json'));

		if (matchingFiles.length === 0) return null;

		const filesWithStats = await Promise.all(
			matchingFiles.map(async (file) => {
				const filePath = path.join(directory, file);
				const stats = await fs.stat(filePath);
				return { file, mtime: stats.mtime };
			})
		);

		filesWithStats.sort((a, b) => b.mtime - a.mtime);
		return path.join(directory, filesWithStats[0].file);
	} catch (error) {
		return null;
	}
}

async function readJSONFile(filePath) {
	try {
		let content = await fs.readFile(filePath, 'utf-8');
		content = content
			.replace(/^\uFEFF/, '')
			.replace(/^\uFFFE/, '')
			.replace(/^\xEF\xBB\xBF/, '')
			.trim();
		return JSON.parse(content);
	} catch (error) {
		return null;
	}
}

function calculateLastCronRun() {
	const now = new Date();
	const hours = now.getHours();
	const cronHours = [5, 10, 15, 20, 23];
	
	let lastCronHour = cronHours[cronHours.length - 1];
	for (let i = cronHours.length - 1; i >= 0; i--) {
		if (hours >= cronHours[i]) {
			lastCronHour = cronHours[i];
			break;
		}
	}
	
	const lastCron = new Date(now);
	lastCron.setHours(lastCronHour, 0, 0, 0);
	
	if (hours < cronHours[0]) {
		lastCron.setDate(lastCron.getDate() - 1);
	}
	
	return lastCron.toISOString();
}

exports.getLatestTrending = async (req, res) => {
	try {
		const blogsPath = path.join(BASE_PATH, 'Blogs');
		const bugsPath = path.join(BASE_PATH, 'Bugs');
		const modsPath = path.join(BASE_PATH, 'Mods');

		const newsFile = await findLatestFile(blogsPath, 'hytale_news');
		const bugsFile = await findLatestFile(bugsPath, 'hytale_bugs');
		const modsFile = await findLatestFile(modsPath, 'hytale_mods');

		let blogs = [];
		let bugs = [];
		let mods = [];

		if (newsFile) {
			const newsData = await readJSONFile(newsFile);
			if (newsData) blogs = Array.isArray(newsData) ? newsData : [newsData];
		}

		if (bugsFile) {
			const bugsData = await readJSONFile(bugsFile);
			if (bugsData) bugs = Array.isArray(bugsData) ? bugsData : [bugsData];
		}

		if (modsFile) {
			const modsData = await readJSONFile(modsFile);
			if (modsData) mods = Array.isArray(modsData) ? modsData : [modsData];
		}

		const lastCronRun = calculateLastCronRun();

		res.json({
			success: true,
			data: {
				blogs,
				bugs,
				mods,
				lastCronRun
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Error in getLatestTrending:', error);
		res.status(500).json({
			success: false,
			message: 'Error fetching trending data',
			error: error.message
		});
	}
};

exports.listAvailableFiles = async (req, res) => {
	try {
		const blogsPath = path.join(BASE_PATH, 'Blogs');
		const bugsPath = path.join(BASE_PATH, 'Bugs');
		const modsPath = path.join(BASE_PATH, 'Mods');

		const blogsFiles = await fs.readdir(blogsPath);
		const bugsFiles = await fs.readdir(bugsPath);
		const modsFiles = await fs.readdir(modsPath);

		res.json({
			success: true,
			files: {
				blogs: blogsFiles.filter(f => f.endsWith('.json')),
				bugs: bugsFiles.filter(f => f.endsWith('.json')),
				mods: modsFiles.filter(f => f.endsWith('.json'))
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
};