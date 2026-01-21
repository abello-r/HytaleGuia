const path = require('path');
const { getLatestFile, folderExists } = require('../utils/fileReader');

const BASE_PATH = process.env.WORKERS_PATH || '/app/Workers_N8n';

exports.getLatestTrending = async (req, res) => {
  try {
    console.log('📂 Searching for files in:', BASE_PATH);

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

    // Fetch latest files from each folder
    const [blogsData, bugsData, modsData] = await Promise.all([
      blogsExist ? getLatestFile(blogsPath, 'hytale_news_') : null,
      bugsExist ? getLatestFile(bugsPath, 'hytale_bugs_') : null,
      modsExist ? getLatestFile(modsPath, 'hytale_mods_') : null
    ]);

    // Format response - ensure we return arrays
    const response = {
      success: true,
      data: {
        blogs: blogsData ? [blogsData] : [],
        bugs: bugsData ? [bugsData] : [],
        mods: modsData ? [modsData] : []
      },
      timestamp: new Date().toISOString()
    };

    console.log('✅ Trending data retrieved successfully');
    res.json(response);

  } catch (error) {
    console.error('❌ Error in getLatestTrending:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error retrieving trending data',
      message: error.message 
    });
  }
};

// Debug endpoint to list available files
exports.listAvailableFiles = async (req, res) => {
  try {
    const fs = require('fs').promises;
    
    const blogsPath = path.join(BASE_PATH, 'Blogs');
    const bugsPath = path.join(BASE_PATH, 'Bugs');
    const modsPath = path.join(BASE_PATH, 'Mods');

    const [blogsFiles, bugsFiles, modsFiles] = await Promise.all([
      fs.readdir(blogsPath).catch(() => []),
      fs.readdir(bugsPath).catch(() => []),
      fs.readdir(modsPath).catch(() => [])
    ]);

    res.json({
      success: true,
      basePath: BASE_PATH,
      folders: {
        blogs: {
          path: blogsPath,
          files: blogsFiles,
          count: blogsFiles.length
        },
        bugs: {
          path: bugsPath,
          files: bugsFiles,
          count: bugsFiles.length
        },
        mods: {
          path: modsPath,
          files: modsFiles,
          count: modsFiles.length
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error listing files:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error listing files',
      message: error.message 
    });
  }
}
