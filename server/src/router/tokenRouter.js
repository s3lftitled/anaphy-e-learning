const express = require('express')
const router = express.Router()
const TokenController = require('../controllers/tokenController')

router.post('/refresh', TokenController.refreshAccessToken)

module.exports = router