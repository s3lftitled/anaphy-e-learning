const LessonModel = require('../models/lesson.model')
const TopicModel = require('../models/topic.model')
const HTTP_STATUS = require('../constants/httpConstants')
const { appAssert } = require('../utils/appAssert')
const { validateRequiredParams } = require('../utils/paramsValidator')
const validator = require('validator')
const mongoose = require('mongoose')
const logger = require('../logger/logger')

const createLessonService = async (title, topicId, description, order) => {
  try {
    validateRequiredParams({ title, topicId, description, order })

    // Sanitize inputs
    const sanitizedTitle = validator.trim(validator.escape(title))
    const sanitizedDescription = validator.trim(validator.escape(description))

    appAssert(
      mongoose.Types.ObjectId.isValid(topicId),
      'Invalid topic ID',
      HTTP_STATUS.BAD_REQUEST
    )

    // Check if the topic exists
    const topic = await TopicModel.findById(topicId)
    appAssert(topic, 'Topic not found', HTTP_STATUS.NOT_FOUND)

    const newLesson = new LessonModel({
      title: sanitizedTitle,
      topic: topicId, // Topic ID of Circulatory System
      description: sanitizedDescription,
      content: [], // No pages or quizzes yet
      order: order
    })

    await newLesson.save()

    // Add lesson to topic lessons array
    topic.lessons.push(newLesson._id)
    await topic.save()

    return newLesson
  } catch (error) {
    throw error
  }
}

const fetchLessonPages = async (lessonId, page = 1, limit = 5) => {
  try {
    validateRequiredParams({ lessonId })

    appAssert(
      mongoose.Types.ObjectId.isValid(lessonId),
      'Invalid lesson ID',
      HTTP_STATUS.BAD_REQUEST
    )

    // Convert page and limit to numbers and ensure they're valid
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    if (page < 1 || limit < 1) {
      throw new Error("Page and limit must be greater than 0.")
    }

    // Calculate skip value
    const skip = (page - 1) * limit

    // Find the lesson and paginate the content array using $slice
    const lesson = await LessonModel.findById(lessonId)
      .populate({
        path: 'content.contentId',
        model: 'PageModel',
      })
      .select({
        content: { $slice: [skip, limit] } // This will properly paginate the content array
      })

    appAssert(lesson, 'Lesson not found', HTTP_STATUS.NOT_FOUND)

    // Calculate the total number of pages
    const totalContent = await LessonModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId.createFromHexString(lessonId) } },
      { $project: { contentCount: { $size: "$content" } } },
    ])
    
    const totalPagesCount = totalContent[0] ? Math.ceil(totalContent[0].contentCount / limit) : 0

    return {
      pages: lesson.content,
      totalPages: totalPagesCount,
      currentPage: page,
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  createLessonService,
  fetchLessonPages
}