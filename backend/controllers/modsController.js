const path = require('path');
const { folderExists } = require('../utils/fileReader');
const fs = require('fs').promises;

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

exports.getAllMods = async (req, res) => {
	try {
		const modsPath = path.join(BASE_PATH, 'Mods');

		const exists = await folderExists(modsPath);
		if (!exists) {
			return res.json({
				success: true,
				data: {
					mods: [],
					total: 0,
					lastCronRun: null
				}
			});
		}

		const files = await fs.readdir(modsPath);
		const mainFile = 'hytale_mods.json';
		const mainFilePath = path.join(modsPath, mainFile);
		
		let allMods = [];
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

				if (Array.isArray(data) && data.length > 0 && data[0].mods) {
					allMods = data[0].mods.map(mod => ({
						...mod,
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

		allMods.sort((a, b) => {
			const dateA = new Date(a.fecha_publicacion);
			const dateB = new Date(b.fecha_publicacion);
			return dateB - dateA;
		});

		res.json({
			success: true,
			data: {
				mods: allMods,
				total: allMods.length,
				lastCronRun: lastCronRun
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Error in getAllMods:', error);
		res.status(500).json({
			success: false,
			error: 'Error fetching all mods',
			message: error.message
		});
	}
};