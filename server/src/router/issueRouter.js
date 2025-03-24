const express = require('express')
const router = express.Router()
const IssueController = require('../controllers/issueController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/submit-issue', verifyToken, IssueController.submitIssue)
router.get('/v1/fetch-issues', IssueController.fetchIssues)
router.put('/v1/resolve-issue/:issueId', IssueController.resolveIssue)
router.post('/v1/contact-issue/:issueId', IssueController.contactUser)

module.exports = router