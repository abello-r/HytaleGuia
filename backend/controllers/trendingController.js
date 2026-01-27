const path = require('path');
const fs = require('fs').promises;

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

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

exports.getLatestTrending = async (req, res) => {
	try {
		const newsPath = path.join(BASE_PATH, 'News', 'hytale_news.json');
		const bugsPath = path.join(BASE_PATH, 'Bugs', 'hytale_bugs.json');
		const modsPath = path.join(BASE_PATH, 'Mods', 'hytale_mods.json');

		let blogs = [];
		let bugs = [];
		let mods = [];

		// Read news
		const newsData = await readJSONFile(newsPath);
		if (newsData && Array.isArray(newsData) && newsData[0]?.news) {
			blogs = [{
				output: {
					noticias: newsData[0].news.map(article => ({
						titulo: article.title,
						resumen: article.content_text,
						fecha: article.date_published,
						fuente: article.authors?.[0]?.name || 'Unknown',
						url: article.url
					}))
				}
			}];
		}

		// Read bugs
		const bugsData = await readJSONFile(bugsPath);
		if (bugsData) bugs = Array.isArray(bugsData) ? bugsData : [bugsData];

		// Read mods
		const modsData = await readJSONFile(modsPath);
		if (modsData) mods = Array.isArray(modsData) ? modsData : [modsData];

		res.json({
			success: true,
			data: {
				blogs,
				bugs,
				mods,
				lastCronRun: null
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
		const newsPath = path.join(BASE_PATH, 'News');
		const bugsPath = path.join(BASE_PATH, 'Bugs');
		const modsPath = path.join(BASE_PATH, 'Mods');

		const newsFiles = await fs.readdir(newsPath);
		const bugsFiles = await fs.readdir(bugsPath);
		const modsFiles = await fs.readdir(modsPath);

		res.json({
			success: true,
			files: {
				news: newsFiles.filter(f => f.endsWith('.json')),
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