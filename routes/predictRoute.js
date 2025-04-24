const express = require('express');
const router = express.Router();
const { runModelPrediction } = require('../controllers/predictController');

// Route: POST /api/predict
router.post('/', runModelPrediction);

module.exports = router;
