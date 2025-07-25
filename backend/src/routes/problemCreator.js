
const express = require('express');
const problemRouter = express.Router();
const {createProblem , solvedProblemByUser , submittedProblem , fetchAllProblem , fetchProblemById, deleteProblem , updateProblem, getUserStats } = require('../controllers/userProblem')
const adminMiddleware = require('../middleware/adminMiddleware')
const userMiddleware = require('../middleware/userMiddleware')
const submissionRateLimiter = require('../middleware/submissionRateLimiter')

problemRouter.post('/create',adminMiddleware,createProblem);
problemRouter.delete('/delete/:id', adminMiddleware , deleteProblem);
problemRouter.put('/update/:id', adminMiddleware , updateProblem);
problemRouter.get('/user/stats', userMiddleware, getUserStats);

problemRouter.get('/problemById/:id',userMiddleware, fetchProblemById);
problemRouter.get('/allProblems',userMiddleware,fetchAllProblem);
problemRouter.get('/problemSolvedByUser', userMiddleware, solvedProblemByUser);
problemRouter.get('/submittedProblem/:pid',userMiddleware , submissionRateLimiter, submittedProblem)

module.exports = problemRouter;
