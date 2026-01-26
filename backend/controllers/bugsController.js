const path = require('path');
const { folderExists } = require('../utils/fileReader');
const fs = require('fs').promises;

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

exports.getAllBugs = async (req, res) => {
	try {
		const bugsPath = path.join(BASE_PATH, 'Bugs');

		const exists = await folderExists(bugsPath);
		if (!exists) {
			return res.json({
				success: true,
				data: {
					bugs: [],
					total: 0,
					lastCronRun: null
				}
			});
		}

		const files = await fs.readdir(bugsPath);
		const mainFile = 'hytale_bugs.json';
		const mainFilePath = path.join(bugsPath, mainFile);
		
		let allBugs = [];
		let lastCronRun = null;

		try {
			const fileExists = files.includes(mainFile);
			
			if (fileExists) {
				let content = await fs.readFile(mainFilePath, 'utf-8');
				
				content = content
					.replace(/^\uFEFF/, '')
					.replace(/^\uFFFE/, '')
					.replace(/^\xEF\xBB\xBF/, '')
					.trim();
				
				const data = JSON.parse(content);

				if (Array.isArray(data) && data.length > 0 && data[0].bugs) {
					allBugs = data[0].bugs.map(bug => ({
						...bug,
						fileDate: new Date().toISOString().split('T')[0]
					}));

					const stats = await fs.stat(mainFilePath);
					const fileTime = new Date(stats.mtime);
					const nowInSpain = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
					const now = new Date(nowInSpain);
					const fileInSpain = new Date(fileTime.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));

					if (fileInSpain.toDateString() === now.toDateString()) {
						const hours = now.getHours();
						let cronHour = 5;

						if (hours >= 23) cronHour = 23;
						else if (hours >= 20) cronHour = 20;
						else if (hours >= 15) cronHour = 15;
						else if (hours >= 10) cronHour = 10;
						else if (hours >= 5) cronHour = 5;

						const fileDate = fileInSpain.toISOString().split('T')[0];
						lastCronRun = new Date(`${fileDate}T${cronHour.toString().padStart(2, '0')}:00:00+01:00`).toISOString();
					} else {
						const fileDate = fileInSpain.toISOString().split('T')[0];
						lastCronRun = new Date(`${fileDate}T23:00:00+01:00`).toISOString();
					}
				}
			}
		} catch (error) {
			console.error(`Error reading ${mainFile}:`, error.message);
		}

		allBugs.sort((a, b) => {
			const dateA = new Date(a.fecha_actualizacion);
			const dateB = new Date(b.fecha_actualizacion);
			return dateB - dateA;
		});

		res.json({
			success: true,
			data: {
				bugs: allBugs,
				total: allBugs.length,
				lastCronRun: lastCronRun
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Error in getAllBugs:', error);
		res.status(500).json({
			success: false,
			error: 'Error fetching all bugs',
			message: error.message
		});
	}
};