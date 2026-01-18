const express = require('express');
const router = express.Router();
const trendingController = require('../controllers/trendingController');

// Get trending items
router.get('/latest', trendingController.getLatestTrending);

// Endpoint debug
router.get('/files', trendingController.listAvailableFiles);

module.exports = router;
