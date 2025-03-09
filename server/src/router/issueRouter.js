const express = require('express')
const router = express.Router()
const IssueController = require('../controllers/issueController')

router.post('/v1/submit-issue', IssueController.submitIssue)

module.exports = router