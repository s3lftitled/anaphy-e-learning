const PageModel = require('../models/page.model')
const LessonModel = require('../models/lesson.model')
const HTTP_STATUS = require('../constants/httpConstants')
const { appAssert } = require('../utils/appAssert')
const { validateRequiredParams } = require('../utils/paramsValidator')
const validator = require('validator')
const mongoose = require('mongoose')

const createPageService = async(title, content, lessonId, link, order) => {
  try {
    validateRequiredParams({ title, content, link })

    const sanitizedTitle = validator.trim(validator.escape(title))
    const sanitizedContent = validator.trim(validator.escape(content))
    const sanitizedLink =  validator.trim(validator.escape(link))

    appAssert(
      mongoose.Types.ObjectId.isValid(lessonId),
      'Invalid Lesson ID',
      HTTP_STATUS.BAD_REQUEST
    )

    const lesson = await LessonModel.findById(lessonId)
    appAssert(lesson, 'Lesson not found', HTTP_STATUS.BAD_REQUEST)

    const newPage = new PageModel({
      title: sanitizedTitle,
      content: sanitizedContent,
      link: sanitizedLink
    })

    await newPage.save()

    lesson.content.push({type: 'page', contentId: newPage._id, order: order})

    await lesson.save()
  } catch (error) {
    throw error
  }
}

const createPagesService = async (pages, lessonId) => {
  try {
    // Validate lessonId before processing
    appAssert(
      mongoose.Types.ObjectId.isValid(lessonId),
      'Invalid Lesson ID',
      HTTP_STATUS.BAD_REQUEST
    )

    const lesson = await LessonModel.findById(lessonId)
    appAssert(lesson, 'Lesson not found', HTTP_STATUS.BAD_REQUEST)

    // Sanitize and create all pages concurrently
    const pagePromises = pages.map(({ title, content, link, order }) => {
      // Validate the required parameters
      validateRequiredParams({ title, content, link, order })

      // Sanitize inputs
      const sanitizedTitle = validator.trim(validator.escape(title))
      const sanitizedContent = validator.trim(validator.escape(content))

      // Create the new page object
      const newPage = new PageModel({
        title: sanitizedTitle,
        content: sanitizedContent,
        link: link
      })

      // Save the page and return its promise
      return newPage.save().then(savedPage => {
        // Add the new page to the lesson's content array
        lesson.content.push({ type: 'page', contentId: savedPage._id, order })
      })
    })

    // Wait for all page creation promises to resolve
    await Promise.all(pagePromises)

    // Save the updated lesson with the new pages
    await lesson.save()

    return { message: 'Pages created successfully' }
  } catch (error) {
    throw error
  }
}


module.exports = {
  createPageService,
  createPagesService,
}
