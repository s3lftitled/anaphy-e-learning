// services/progressService.js
const UserProgressModel = require('../models/userprogress.model')
const TopicModel = require('../models/topic.model')
const validator = require('validator')
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const HTTP_STATUS = require('../constants/httpConstants')

const saveUserProgressService = async (userId, topicId, lessonId, contentId) => {
  try {
    validateRequiredParams(userId, topicId, lessonId, contentId)
    
    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(topicId), 'Invalid topic ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(lessonId), 'Invalid lesson ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(contentId), 'Invalid content ID format', HTTP_STATUS.BAD_REQUEST)

    // Find existing progress or create new one
    let userProgress = await UserProgressModel.findOne({ 
      user: userId, 
      topic: topicId 
    })

    if (!userProgress) {
      userProgress = new UserProgressModel({
        user: userId,
        topic: topicId,
        currentLesson: lessonId,
        lastViewed: {
          contentId,
          topicId,
          lessonId,
          timestamp: new Date()
        }
      })
    } else {
      // Update lastViewed data
      userProgress.currentLesson = lessonId
      userProgress.lastViewed = {
        contentId,
        topicId,
        lessonId,
        timestamp: new Date()
      }
    }

    await userProgress.save()
    return true
  } catch (error) {
    throw error
  }
}

const completeContentService = async (userId, topicId, lessonId, contentId, contentType) => {
  try {
    validateRequiredParams(userId, topicId, lessonId, contentId, contentType)
    
    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(topicId), 'Invalid topic ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(lessonId), 'Invalid lesson ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(contentId), 'Invalid content ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(['page', 'quiz'].includes(contentType), 'Invalid content type', HTTP_STATUS.BAD_REQUEST)

    // Find existing progress or create new one
    let userProgress = await UserProgressModel.findOne({ 
      user: userId, 
      topic: topicId 
    })

    if (!userProgress) {
      userProgress = new UserProgressModel({
        user: userId,
        topic: topicId,
        currentLesson: lessonId,
        lastViewed: {
          contentId,
          topicId,
          lessonId,
          timestamp: new Date()
        },
        completedContent: [{
          contentType,
          contentId,
          topicId,
          lessonId,
          completedAt: new Date()
        }]
      })
    } else {
      // Check if content is already marked as completed
      const contentCompleted = userProgress.completedContent.some(
        content => content.contentId.toString() === contentId.toString()
      )

      // Add to completed content if not already completed
      if (!contentCompleted) {
        userProgress.completedContent.push({
          contentType,
          contentId,
          topicId,
          lessonId,
          completedAt: new Date()
        })
      }

      // Update lastViewed
      userProgress.currentLesson = lessonId
      userProgress.lastViewed = {
        contentId,
        topicId,
        lessonId,
        timestamp: new Date()
      }
    }

    await userProgress.save();
    return true
  } catch (error) {
    throw error
  }
}

const getUserProgressService = async (userId) => {
  try {
    validateRequiredParams(userId)
    
    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    // Get all user progress records
    const allProgress = await UserProgressModel.find({ user: userId })
      .lean()

    // Calculate total progress across all topics
    const result = {
      lastViewed: null,
      topicsProgress: [],
      overallProgress: 0,
      quizResults: []
    }

    // Find the most recent lastViewed
    let mostRecentTimestamp = new Date(0)
    
    for (const progress of allProgress) {
      if (progress.quizResults && progress.quizResults.length > 0) {
        result.quizResults.push(...progress.quizResults)
      }

      if (progress.lastViewed && progress.lastViewed.timestamp) {
        const timestamp = new Date(progress.lastViewed.timestamp)
        if (timestamp > mostRecentTimestamp) {
          mostRecentTimestamp = timestamp
          result.lastViewed = progress.lastViewed
        }
      }
    }

    // Get all topics for content count
    const topics = await TopicModel.find().populate({
      path: 'lessons',
      populate: {
        path: 'content'
      }
    }).lean()

    // Map topics to their content counts
    const topicContentCounts = {}
    let totalContentCount = 0
    
    topics.forEach(topic => {
      let count = 0;
      if (topic.lessons) {
        topic.lessons.forEach(lesson => {
          if (lesson.content) {
            count += lesson.content.length
          }
        })
      }
      topicContentCounts[topic._id.toString()] = count
      totalContentCount += count
    })

    // Calculate progress for each topic
    let totalCompleted = 0
    
    for (const progress of allProgress) {
      const topicId = progress.topic.toString();
      const totalContent = topicContentCounts[topicId] || 0
      const completedCount = progress.completedContent.length
      
      totalCompleted += completedCount
      
      const percentComplete = totalContent > 0 
        ? Math.round((completedCount / totalContent) * 100) 
        : 0;
        
      result.topicsProgress.push({
        topicId,
        completedCount,
        totalContent,
        percentComplete
      })
    }

    // Calculate overall progress percentage
    result.overallProgress = totalContentCount > 0 
      ? Math.round((totalCompleted / totalContentCount) * 100) 
      : 0

    return result
  } catch (error) {
    throw error
  }
}

const getUserTopicProgressService = async (userId, topicId) => {
  try {
    validateRequiredParams(userId, topicId)
    
    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)
    appAssert(validator.isMongoId(topicId), 'Invalid topic ID format', HTTP_STATUS.BAD_REQUEST)

    // Get user progress for the specified topic
    const progress = await UserProgressModel.findOne({ 
      user: userId, 
      topic: topicId 
    }).lean()

    // If no progress exists yet
    if (!progress) {
      return {
        topicId,
        completedContent: [],
        lastViewed: null,
        percentComplete: 0,
        completedCount: 0,
        totalContent: 0
      }
    }

    // Get topic with lessons and content
    const topic = await TopicModel.findById(topicId).populate({
      path: 'lessons',
      populate: {
        path: 'content'
      }
    }).lean()

    // Count total content in topic
    let totalContent = 0
    const lessonContentMap = {}
    
    if (topic && topic.lessons) {
      topic.lessons.forEach(lesson => {
        if (lesson.content) {
          lessonContentMap[lesson._id.toString()] = lesson.content.length
          totalContent += lesson.content.length
        }
      })
    }

    // Calculate percentage complete
    const completedCount = progress.completedContent.length;
    const percentComplete = totalContent > 0 
      ? Math.round((completedCount / totalContent) * 100) 
      : 0

    // Group completed content by lessons
    const completedByLesson = {}
    progress.completedContent.forEach(item => {
      // Skip items without lessonId
      if (!item.lessonId) {
        return
      }
      const lessonId = item.lessonId.toString()
      if (!completedByLesson[lessonId]) {
        completedByLesson[lessonId] = []
      }
      completedByLesson[lessonId].push(item)
    })

    // Calculate lesson progress
    const lessonProgress = topic && topic.lessons ? topic.lessons.map(lesson => {
      const lessonId = lesson._id.toString()
      const completed = completedByLesson[lessonId] || [];
      const total = lessonContentMap[lessonId] || 0
      const percent = total > 0 ? Math.round((completed.length / total) * 100) : 0
      
      return {
        lessonId,
        title: lesson.title,
        completedCount: completed.length,
        totalContent: total,
        percentComplete: percent
      }
    }) : []

    return {
      topicId,
      title: topic ? topic.name : '',
      completedContent: progress.completedContent,
      lastViewed: progress.lastViewed,
      percentComplete,
      completedCount,
      totalContent,
      lessonProgress,
    }
  } catch (error) {
    throw error
  }
}

const updateUserProgressService = async (userId, quizResults) => {
  try {
    validateRequiredParams(userId, quizResults)
    
    appAssert(validator.isMongoId(userId), 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST)

    // Find existing progress
    let userProgress = await UserProgressModel.findOne({ user: userId })

    // Update fields, including quizResults if provided
    if (quizResults) {
      // Check if quizResults is an array or single object
      if (Array.isArray(quizResults)) {
        // Add all new quiz results to the existing array
        userProgress.quizResults.push(...quizResults)
      } else {
        // Add the single quiz result to the existing array
        userProgress.quizResults.push(quizResults)
      }
    }

    await userProgress.save()
    return userProgress
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveUserProgressService,
  completeContentService,
  getUserProgressService,
  getUserTopicProgressService,
  updateUserProgressService,
}