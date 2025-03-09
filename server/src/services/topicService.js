const HTTP_STATUS = require('../constants/httpConstants')
const TopicModel = require('../models/topic.model')
const { appAssert } = require('../utils/appAssert')
const { validateRequiredParams } = require('../utils/paramsValidator')
const validator = require('validator')
const mongoose = require('mongoose')

const createTopicService = async (name, description) => {
  try {
    // Validate required parameters
    validateRequiredParams({ name, description })

    appAssert(
      name.length < 80,
      'Topic name cant be longer than 30 characters',
      HTTP_STATUS.BAD_REQUEST
    )

    appAssert(
      description.length < 600,
      'Topic description cant be longer than 600 characters',
      HTTP_STATUS.BAD_REQUEST
    )

    // Sanitize inputs
    const sanitizedName = validator.trim(validator.escape(name))
    const sanitizedDescription = validator.trim(validator.escape(description))

    // Now you can safely use the sanitized inputs
    const topic = new TopicModel({
      name: sanitizedName,
      description: sanitizedDescription
    })

    await topic.save()
    return topic
  } catch (error) {
    throw error
  }
}

const fetchAllTopicsService = async () => {
  try {
    const topics = await TopicModel.find({})

    const allTopics = topics.map(topic => ({
      _id: topic._id,
      name: topic.name,
      description: topic.description
    }))

    return allTopics
  } catch (error) {
    throw error
  }
}

const fetchTopicService = async (topicId) => {
  try {
    validateRequiredParams(topicId)

    appAssert(
      mongoose.Types.ObjectId.isValid(topicId),
      'Invalid topic ID',
      HTTP_STATUS.BAD_REQUEST
    )

    const topic = await TopicModel.findById(topicId)

    appAssert(
      topic,
      'Topic not found',
      HTTP_STATUS.NOT_FOUND
    )

    return {
      name: topic.name,
      description: topic.description,
      lessons: topic.lessons,
      exam: topic.exam
    }
  } catch (error){
    throw error
  }
}

const fetchTopicLessonsService = async (topicId) => {
  try {
    validateRequiredParams(topicId)

    appAssert(
      mongoose.Types.ObjectId.isValid(topicId),
      'Invalid topic ID',
      HTTP_STATUS.BAD_REQUEST
    )

    const topic = await TopicModel.findById(topicId).populate('lessons', '_id title')

    appAssert(topic, 'Topic is not found', HTTP_STATUS.NOT_FOUND)

    const topicLessons = topic.lessons.map(({ _id, title }) => ({ _id, title }))

    return topicLessons
  } catch (error) {
    throw error
  }
}

module.exports = {
 createTopicService,
 fetchAllTopicsService,
 fetchTopicService,
 fetchTopicLessonsService,
}
