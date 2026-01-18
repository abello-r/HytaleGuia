const fs = require('fs').promises;
const path = require('path');

/**
 * Obtains the latest JSON file from a folder based on a prefix
 * @param {string} folderPath - Path to the folder
 * @param {string} prefix - Prefix of the file (e.g. 'hytale_news_')
 * @returns {Promise<Object|null>} - Parsed JSON content or null if not found/error
 */
async function getLatestFile(folderPath, prefix) {
  try {
    const files = await fs.readdir(folderPath);
    
    // Filter files by prefix and .json extension
    const jsonFiles = files
      .filter(file => file.startsWith(prefix) && file.endsWith('.json'))
      .sort()
      .reverse(); // The most recent first (sorted by date in filename)
    
    if (jsonFiles.length === 0) {
      console.log(`⚠️ Not found files with prefix "${prefix}" in ${folderPath}`);
      return null;
    }
    
    const latestFile = jsonFiles[0];
    const filePath = path.join(folderPath, latestFile);
    
    console.log(`📄 Reading: ${latestFile}`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
    
  } catch (error) {
    console.error(`❌ Error reading ${folderPath}:`, error.message);
    return null;
  }
}

/**
 * Checks if a folder exists
 * @param {string} folderPath - Path to the folder
 * @returns {Promise<boolean>}
 */
async function folderExists(folderPath) {
  try {
    const stats = await fs.stat(folderPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

module.exports = {
  getLatestFile,
  folderExists
};
