const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controller/AnalyticsController');

router.get('/get', AnalyticsController.GetAnalyticsData);

module.exports = router;
