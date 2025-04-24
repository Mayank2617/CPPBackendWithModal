const express = require('express');
const router = express.Router();
const { runModelPrediction } = require('../controllers/advisoryController');

// Route: POST /api/advisory
router.post('/', runModelPrediction);

module.exports = router;
