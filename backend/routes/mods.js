const express = require('express');
const router = express.Router();
const modsController = require('../controllers/modsController');

// Get all mods
router.get('/all', modsController.getAllMods);

module.exports = router;