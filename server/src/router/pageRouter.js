const express = require('express')
const router = express.Router()
const PageController = require('../controllers/pageController')
const { verifyToken } = require('../middlewares/jsonWebTokens')
const { checkRole, ROLES } = require('../middlewares/accessControl')

router.post('/v1/create-page/:lessonId', verifyToken, checkRole([ROLES.LEVEL_3]), PageController.createPage)
router.post('/v1/create-multiple-pages/:lessonId', verifyToken, checkRole([ROLES.LEVEL_3]), PageController.createMultiplePages)

module.exports = router