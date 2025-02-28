const express = require('express')
const router = express.Router()
const ClassController = require('../controllers/classController')

router.post('/v1/create-class/:userRole/:teacherId', ClassController.createClass)

module.exports = router