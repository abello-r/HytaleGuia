const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Get all news
router.get('/all', newsController.getAllNews);

module.exports = router;