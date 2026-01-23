const path = require('path');
const { folderExists } = require('../utils/fileReader');
const fs = require('fs').promises;

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

exports.getAllNews = async (req, res) => {
	try {
		const blogsPath = path.join(BASE_PATH, 'Blogs');

		// Check if folder exists
		const exists = await folderExists(blogsPath);
		if (!exists) {
			return res.json({
				success: true,
				data: {
					news: [],
					total: 0,
					lastCronRun: null
				}
			});
		}

		// Read all files in Blogs folder
		const files = await fs.readdir(blogsPath);
		const jsonFiles = files
			.filter(file => file.startsWith('hytale_news_') && file.endsWith('.json'))
			.sort()
			.reverse(); // Most recent first

		const allNews = [];
		let lastCronRun = null;

		// El archivo más reciente indica cuándo fue la última ejecución del cron
		if (jsonFiles.length > 0) {
			const newestFile = jsonFiles[0];
			const dateMatch = newestFile.match(/hytale_news_(\d{4}-\d{2}-\d{2})\.json/);

			if (dateMatch && dateMatch[1]) {
				const fileDate = dateMatch[1]; // "2026-01-19"

				try {
					// Get current time in Europe/Madrid timezone
					const nowInSpain = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
					const now = new Date(nowInSpain);
					const fileDateTime = new Date(fileDate);

					// Si el archivo es de hoy, usar la hora del último cron
					if (fileDateTime.toDateString() === now.toDateString()) {
						const hours = now.getHours();
						let cronHour = 5;

						// Determine which cron execution it was (5, 10, 15, 20, 23)
						if (hours >= 23) cronHour = 23;
						else if (hours >= 20) cronHour = 20;
						else if (hours >= 15) cronHour = 15;
						else if (hours >= 10) cronHour = 10;
						else if (hours >= 5) cronHour = 5;

						// Create the date in Europe/Madrid timezone
						lastCronRun = new Date(`${fileDate}T${cronHour.toString().padStart(2, '0')}:00:00+01:00`).toISOString();
					} else {
						// Si el archivo es de otro día, asumir que fue a las 23:00 Spain time
						lastCronRun = new Date(`${fileDate}T23:00:00+01:00`).toISOString();
					}
				} catch (error) {
					console.error('Error parsing file date:', error);
				}
			}
		}

		// Read and parse all news files
		for (const file of jsonFiles) {
			try {
				const filePath = path.join(blogsPath, file);
				const content = await fs.readFile(filePath, 'utf-8');
				let data = JSON.parse(content);

				// Handle array format: [{ output: { noticias: [...] } }]
				if (Array.isArray(data) && data.length > 0) {
					data = data[0]; // Get first element of array
				}

				// Extract news from the file
				if (data.output && data.output.noticias && Array.isArray(data.output.noticias)) {
					data.output.noticias.forEach(noticia => {
						allNews.push({
							...noticia,
							fileDate: file.replace('hytale_news_', '').replace('.json', '')
						});
					});
				}
			} catch (error) {
				console.error(`Error reading file ${file}:`, error.message);
			}
		}

		// Sort by date (most recent first)
		allNews.sort((a, b) => {
			const dateA = new Date(a.fecha || a.fileDate);
			const dateB = new Date(b.fecha || b.fileDate);
			return dateB - dateA;
		});

		console.log(`📰 Loaded ${allNews.length} news articles from ${jsonFiles.length} files`);
		console.log(`⏰ Last cron run: ${lastCronRun || 'Unknown'}`);

		res.json({
			success: true,
			data: {
				news: allNews,
				total: allNews.length,
				lastCronRun: lastCronRun
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Error in getAllNews:', error);
		res.status(500).json({
			success: false,
			error: 'Error fetching all news',
			message: error.message
		});
	}
};
