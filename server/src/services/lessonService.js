const LessonModel = require('../models/lesson.model')
const TopicModel = require('../models/topic.model')
const HTTP_STATUS = require('../constants/httpConstants')
const { appAssert } = require('../utils/appAssert')
const { validateRequiredParams } = require('../utils/paramsValidator')
const validator = require('validator')
const mongoose = require('mongoose')

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

module.exports = {
  createLessonService
}