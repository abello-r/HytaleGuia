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
    const jsonFiles = files
      .filter(file => file.startsWith('hytale_mods_') && file.endsWith('.json'))
      .sort()
      .reverse();

    const allMods = [];
    let lastCronRun = null;

    // The most recent file indicates when the last cron execution was
    if (jsonFiles.length > 0) {
      const newestFile = jsonFiles[0];
      const dateMatch = newestFile.match(/hytale_mods_(\d{4}-\d{2}-\d{2})\.json/);
      
      if (dateMatch && dateMatch[1]) {
        const fileDate = dateMatch[1]; // "2026-01-19"
        
        try {
          // Get current time in Europe/Madrid timezone
          const nowInSpain = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
          const now = new Date(nowInSpain);
          const fileDateTime = new Date(fileDate);
          
          // If the file is from today, use the last cron hour
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
            // If the file is from another day, assume it was at 23:00 Spain time
            lastCronRun = new Date(`${fileDate}T23:00:00+01:00`).toISOString();
          }
        } catch (error) {
          console.error('Error parsing file date:', error);
        }
      }
    }

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(modsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        let data = JSON.parse(content);

        if (Array.isArray(data) && data.length > 0) {
          data = data[0];
        }

        if (data.mods && Array.isArray(data.mods)) {
          data.mods.forEach(mod => {
            allMods.push({
              ...mod,
              fileDate: file.replace('hytale_mods_', '').replace('.json', '')
            });
          });
        }
      } catch (error) {
        console.error(`Error reading file ${file}:`, error.message);
      }
    }

    allMods.sort((a, b) => {
      const dateA = new Date(a.fecha_publicacion);
      const dateB = new Date(b.fecha_publicacion);
      return dateB - dateA;
    });

    console.log(`🧩 Loaded ${allMods.length} mods from ${jsonFiles.length} files`);
    console.log(`⏰ Last cron run: ${lastCronRun || 'Unknown'}`);

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
