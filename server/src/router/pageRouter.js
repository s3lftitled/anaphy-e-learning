const express = require('express')
const router = express.Router()
const PageController = require('../controllers/pageController')
const { verifyToken } = require('../middlewares/jsonWebTokens')

router.post('/v1/create-page/:lessonId', verifyToken, PageController.createPage)
router.post('/v1/create-multiple-pages/:lessonId', verifyToken, PageController.createMultiplePages)

module.exports = router