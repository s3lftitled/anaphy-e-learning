const QuizModel = require('../models/quiz.model')
const LessonModel = require('../models/lesson.model')
const HTTP_STATUS = require('../constants/httpConstants')
const { appAssert } = require('../utils/appAssert')
const { validateRequiredParams } = require('../utils/paramsValidator')
const validator = require('validator')
const mongoose = require('mongoose')


const createQuizService = async (title, description, timeLimit, passingScore, questions, lessonId, order) => {
  try {
    // Validate required parameters
    validateRequiredParams({ title, passingScore, questions, lessonId })
    
    // Sanitize inputs
    const sanitizedTitle = validator.trim(validator.escape(title))
    const sanitizedDescription = description ? validator.trim(validator.escape(description)) : ''
    
    // Validate lessonId format
    appAssert(
      mongoose.Types.ObjectId.isValid(lessonId),
      'Invalid Lesson ID',
      HTTP_STATUS.BAD_REQUEST
    )
    
    // Check if lesson exists
    const lesson = await LessonModel.findById(lessonId)
    appAssert(lesson, 'Lesson not found', HTTP_STATUS.BAD_REQUEST)
    
    // Validate each question
    appAssert(
      Array.isArray(questions) && questions.length > 0,
      'At least one question is required',
      HTTP_STATUS.BAD_REQUEST
    )
    
    const processedQuestions = questions.map((question, index) => {
      // Validate question fields
      appAssert(
        question.questionText && question.questionType && question.correctAnswer !== undefined,
        `Question ${index + 1} is missing required fields`,
        HTTP_STATUS.BAD_REQUEST
      )
      
      // Process question based on type
      const processedQuestion = {
        questionText: validator.trim(validator.escape(question.questionText)),
        questionType: question.questionType,
        points: question.points || 1,
        rationale: question.rationale ? validator.trim(validator.escape(question.rationale)) : ''
      }
      
      // Validate and process question type specific fields
      switch (question.questionType) {
        case 'multiple-choice':
          // Validate options exist
          appAssert(
            Array.isArray(question.options) && question.options.length > 0,
            `Question ${index + 1} requires options for multiple-choice type`,
            HTTP_STATUS.BAD_REQUEST
          )
          
          // Sanitize options
          processedQuestion.options = question.options.map(option => 
            validator.trim(validator.escape(option))
          )
          
          // Validate correctAnswer for multiple-choice
          if (Array.isArray(question.correctAnswer)) {
            // Multiple correct answers
            appAssert(
              question.correctAnswer.every(answer => 
                typeof answer === 'number' && 
                answer >= 0 && 
                answer < processedQuestion.options.length
              ),
              `Question ${index + 1} has invalid correct answer indices`,
              HTTP_STATUS.BAD_REQUEST
            )
            processedQuestion.correctAnswer = question.correctAnswer
          } else if (typeof question.correctAnswer === 'number') {
            // Single correct answer
            appAssert(
              question.correctAnswer >= 0 && 
              question.correctAnswer < processedQuestion.options.length,
              `Question ${index + 1} has invalid correct answer index`,
              HTTP_STATUS.BAD_REQUEST
            )
            processedQuestion.correctAnswer = question.correctAnswer;
          } else {
            throw new Error(`Question ${index + 1} has invalid correct answer format`);
          }
          break
          
        case 'true-false':
          // For true-false, correctAnswer should be a boolean
          appAssert(
            typeof question.correctAnswer === 'boolean',
            `Question ${index + 1} requires a boolean correct answer for true-false type`,
            HTTP_STATUS.BAD_REQUEST
          )
          processedQuestion.correctAnswer = question.correctAnswer;
          break;
          
        case 'matching':
          // For matching, correctAnswer should be an object mapping keys to values
          appAssert(
            typeof question.correctAnswer === 'object' && 
            !Array.isArray(question.correctAnswer) &&
            question.correctAnswer !== null,
            `Question ${index + 1} requires an object for matching type correct answers`,
            HTTP_STATUS.BAD_REQUEST
          )
          
          // Ensure the matching options are provided
          appAssert(
            Array.isArray(question.options) && question.options.length > 0,
            `Question ${index + 1} requires options for matching type`,
            HTTP_STATUS.BAD_REQUEST
          )
          
          // Sanitize options
          processedQuestion.options = question.options.map(option => 
            validator.trim(validator.escape(option))
          )
          
          // Validate all keys in correctAnswer refer to valid options
          const matchingKeys = Object.keys(question.correctAnswer)
          const matchingValues = Object.values(question.correctAnswer)
          
          appAssert(
            matchingKeys.length > 0,
            `Question ${index + 1} matching pairs cannot be empty`,
            HTTP_STATUS.BAD_REQUEST
          )
          
          // Ensure all keys and values are strings (after sanitization)
          const sanitizedMatching = {}
          matchingKeys.forEach(key => {
            const sanitizedKey = validator.trim(validator.escape(key))
            const sanitizedValue = validator.trim(validator.escape(question.correctAnswer[key]))
            sanitizedMatching[sanitizedKey] = sanitizedValue
          })
          
          processedQuestion.correctAnswer = sanitizedMatching
          break
          
        default:
          throw new Error(`Question ${index + 1} has an unsupported question type: ${question.questionType}`)
      }
      
      return processedQuestion
    })
    
    // Create new quiz with processed questions
    const newQuiz = new QuizModel({
      title: sanitizedTitle,
      description: sanitizedDescription,
      timeLimit: timeLimit || null,
      passingScore,
      questions: processedQuestions
    })
    
    // Save the quiz
    await newQuiz.save()
    
    // Add quiz to lesson content
    lesson.content.push({
      type: 'QuizModel',
      contentId: newQuiz._id,
      order: order || lesson.content.length + 1
    })
    
    // Save the updated lesson
    await lesson.save()
    
    return newQuiz
  } catch (error) {
    throw error
  }
}


module.exports = {
  createQuizService,
}