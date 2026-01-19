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

    if (jsonFiles.length > 0) {
      const newestFile = jsonFiles[0];
      const dateMatch = newestFile.match(/hytale_mods_(\d{4}-\d{2}-\d{2})\.json/);
      
      if (dateMatch && dateMatch[1]) {
        const fileDate = dateMatch[1]; // "2026-01-19"
        
        try {
          // Obtener la hora actual para determinar qué hora del cron fue
          const now = new Date();
          const hours = now.getHours();
          
          // Determinar qué ejecución del cron fue (9, 12 o 18)
          let cronHour = 9;
          if (hours >= 18) cronHour = 18;
          else if (hours >= 12) cronHour = 12;
          else if (hours >= 9) cronHour = 9;
          else {
            // Si es antes de las 9 AM, asumimos que el último fue ayer a las 18
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            lastCronRun = new Date(`${fileDate}T18:00:00Z`).toISOString();
          }
          
          if (!lastCronRun) {
            // Crear timestamp con la hora del cron correspondiente
            lastCronRun = new Date(`${fileDate}T${cronHour.toString().padStart(2, '0')}:00:00Z`).toISOString();
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
      const dateA = new Date(a.fileDate);
      const dateB = new Date(b.fileDate);
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