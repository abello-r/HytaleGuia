const path = require('path');
const { folderExists } = require('../utils/fileReader');
const fs = require('fs').promises;

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

exports.getAllBugs = async (req, res) => {
	try {
		const bugsPath = path.join(BASE_PATH, 'Bugs');

		// Check if folder exists
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

		// Read all files in Bugs folder
		const files = await fs.readdir(bugsPath);
		const jsonFiles = files
			.filter(file => file.startsWith('hytale_bugs_') && file.endsWith('.json'))
			.sort()
			.reverse(); // Most recent first

		const allBugs = [];
		let lastCronRun = null;

		// The most recent file indicates when the last cron execution was
		if (jsonFiles.length > 0) {
			const newestFile = jsonFiles[0];
			const dateMatch = newestFile.match(/hytale_bugs_(\d{4}-\d{2}-\d{2})\.json/);

			if (dateMatch && dateMatch[1]) {
				const fileDate = dateMatch[1];

				try {
					const nowInSpain = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
					const now = new Date(nowInSpain);
					const fileDateTime = new Date(fileDate);

					if (fileDateTime.toDateString() === now.toDateString()) {
						const hours = now.getHours();
						let cronHour = 5;

						if (hours >= 23) cronHour = 23;
						else if (hours >= 20) cronHour = 20;
						else if (hours >= 15) cronHour = 15;
						else if (hours >= 10) cronHour = 10;
						else if (hours >= 5) cronHour = 5;

						lastCronRun = new Date(`${fileDate}T${cronHour.toString().padStart(2, '0')}:00:00+01:00`).toISOString();
					} else {
						lastCronRun = new Date(`${fileDate}T23:00:00+01:00`).toISOString();
					}
				} catch (error) {
					console.error('Error parsing file date:', error);
				}
			}
		}

		// Read and parse all bugs files
		for (const file of jsonFiles) {
			try {
				const filePath = path.join(bugsPath, file);
				const content = await fs.readFile(filePath, 'utf-8');
				let data = JSON.parse(content);

				console.log(`📄 Processing ${file}:`, {
					isArray: Array.isArray(data),
					keys: Object.keys(data),
					hasOutput: !!data.output,
					hasBugs: data.output ? !!data.output.bugs : false
				});

				// Handle array format: [{ output: { bugs: [...] } }]
				if (Array.isArray(data) && data.length > 0) {
					data = data[0];
				}

				// Extract bugs from the file
				if (data.output && data.output.bugs && Array.isArray(data.output.bugs)) {
					data.output.bugs.forEach(bug => {
						allBugs.push({
							...bug,
							fileDate: file.replace('hytale_bugs_', '').replace('.json', '')
						});
					});
				} else {
					console.warn(`⚠️ Unexpected structure in ${file}:`, data);
				}
			} catch (error) {
				console.error(`❌ Error reading file ${file}:`, error.message);
			}
		}

		// Sort by date (most recent first)
		allBugs.sort((a, b) => {
			const dateA = new Date(a.fecha_actualizacion || a.fileDate);
			const dateB = new Date(b.fecha_actualizacion || b.fileDate);
			return dateB - dateA;
		});

		console.log(`🐛 Loaded ${allBugs.length} bugs from ${jsonFiles.length} files`);
		console.log(`⏰ Last cron run: ${lastCronRun || 'Unknown'}`);

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
		console.error('❌ Error in getAllBugs:', error);
		res.status(500).json({
			success: false,
			error: 'Error fetching all bugs',
			message: error.message
		});
	}
};
