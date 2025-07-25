const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware')
const generateQuestion = require('../controllers/generateQuestion')
// const getUSerStats = require('../controllers/userStats')
// const getUserGraphData = require('../controllers/getUserGraphData')


// router.get('/stats', userMiddleware,getUSerStats)
// router.get('/graph', userMiddleware, getUserGraphData);
router.post('/question',userMiddleware,generateQuestion)

module.exports = router;