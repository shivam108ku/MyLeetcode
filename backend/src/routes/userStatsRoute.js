const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware')
const getUSerStats = require('../controllers/userStats')
const {getUserGraphData, getDailyLeaderboard} = require('../controllers/getUserGraphData')


router.get('/stats', userMiddleware,getUSerStats)
router.get('/graph', userMiddleware, getUserGraphData);
router.get('/daily', getDailyLeaderboard);


module.exports = router;