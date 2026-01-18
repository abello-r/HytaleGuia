const path = require('path');
const { getLatestFile, folderExists } = require('../utils/fileReader');

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

exports.getLatestTrending = async (req, res) => {
  try {
    console.log('📂 Buscando archivos en:', BASE_PATH);

    // Check if folders exist
    const blogsPath = path.join(BASE_PATH, 'Blogs');
    const bugsPath = path.join(BASE_PATH, 'Bugs');
    const modsPath = path.join(BASE_PATH, 'Mods');

    const [blogsExist, bugsExist, modsExist] = await Promise.all([
      folderExists(blogsPath),
      folderExists(bugsPath),
      folderExists(modsPath)
    ]);

    if (!blogsExist || !bugsExist || !modsExist) {
      console.warn('⚠️ Some folders do not exist:', {
        blogs: blogsExist,
        bugs: bugsExist,
        mods: modsExist
      });
    }

    const [blogs, bugs, mods] = await Promise.all([
      blogsExist ? getLatestFile(blogsPath, 'hytale_news_') : null,
      bugsExist ? getLatestFile(bugsPath, 'hytale_bugs_') : null,
      modsExist ? getLatestFile(modsPath, 'hytale_mods_') : null
    ]);

    res.json({
      success: true,
      data: {
        blogs: blogs || [],
        bugs: bugs || [],
        mods: mods || []
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in getLatestTrending:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error retrieving trending data',
      message: error.message 
    });
  }
};

// Endpoint debug
exports.listAvailableFiles = async (req, res) => {
  try {
    const fs = require('fs').promises;
    
    const [blogsFiles, bugsFiles, modsFiles] = await Promise.all([
      fs.readdir(path.join(BASE_PATH, 'Blogs')).catch(() => []),
      fs.readdir(path.join(BASE_PATH, 'Bugs')).catch(() => []),
      fs.readdir(path.join(BASE_PATH, 'Mods')).catch(() => [])
    ]);

    res.json({
      basePath: BASE_PATH,
      files: {
        blogs: blogsFiles,
        bugs: bugsFiles,
        mods: modsFiles
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
