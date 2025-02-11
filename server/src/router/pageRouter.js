const express = require('express')
const router = express.Router()
const PageController = require('../controllers/pageController')

router.post('/v1/create-page/:lessonId', PageController.createPage)
router.post('/v1/create-multiple-pages/:lessonId', PageController.createMultiplePages)

module.exports = router