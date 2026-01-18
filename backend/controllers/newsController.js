const path = require('path');
const { getLatestFile, folderExists } = require('../utils/fileReader');
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
          total: 0
        }
      });
    }

    // Read all files in Blogs folder
    const files = await fs.readdir(blogsPath);
    const jsonFiles = files
      .filter(file => file.startsWith('hytale_news_') && file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first

    // Read and parse all news files
    const allNews = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(blogsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        
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

    res.json({
      success: true,
      data: {
        news: allNews,
        total: allNews.length
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
