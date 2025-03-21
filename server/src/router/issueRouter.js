const express = require('express')
const router = express.Router()
const IssueController = require('../controllers/issueController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/submit-issue', verifyToken, IssueController.submitIssue)
router.get('/v1/fetch-issues', IssueController.fetchIssues)

module.exports = router