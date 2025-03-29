const express = require('express')
const router = express.Router()
const IssueController = require('../controllers/issueController')
const { verifyToken } = require('../middlewares/jsonWebTokens')
const { checkRole, ROLES } = require('../middlewares/accessControl')

router.post('/v1/submit-issue', verifyToken, IssueController.submitIssue)
router.get('/v1/fetch-issues', verifyToken, checkRole([ROLES.LEVEL_3]), IssueController.fetchIssues)
router.put('/v1/resolve-issue/:issueId', verifyToken, checkRole([ROLES.LEVEL_3]), IssueController.resolveIssue)
router.post('/v1/contact-issue/:issueId', verifyToken, checkRole([ROLES.LEVEL_3]), IssueController.contactUser)

module.exports = router