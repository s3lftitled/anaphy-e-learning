const PageModel = require('../models/page.model')
const LessonModel = require('../models/lesson.model')
const HTTP_STATUS = require('../constants/httpConstants')
const { appAssert } = require('../utils/appAssert')
const { validateRequiredParams } = require('../utils/paramsValidator')
const validator = require('validator')
const mongoose = require('mongoose')

const createPageService = async(title, content, lessonId, order) => {
  try {
    validateRequiredParams({ title, content })

    const sanitizedTitle = validator.trim(validator.escape(title))
    const sanitizedContent = validator.trim(validator.escape(content))

    appAssert(
      mongoose.Types.ObjectId.isValid(lessonId),
      'Invalid Lesson ID',
      HTTP_STATUS.BAD_REQUEST
    )

    const lesson = await LessonModel.findById(lessonId)
    appAssert(lesson, 'Lesson not found', HTTP_STATUS.BAD_REQUEST)

    const newPage = new PageModel({
      title: sanitizedTitle,
      content: sanitizedContent
    })

    await newPage.save()

    lesson.content.push({type: 'page', contentId: newPage._id, order: order})

    await lesson.save()
  } catch (error) {
    throw error
  }
}

module.exports = {
  createPageService
}
