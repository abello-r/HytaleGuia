const express = require('express');
const router = express.Router();
const bugsController = require('../controllers/bugsController');

router.get('/all', bugsController.getAllBugs);

module.exports = router;