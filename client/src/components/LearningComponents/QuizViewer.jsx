import { useState, useEffect } from 'react'
import './LearningComponentsStyles.css'

const QuizViewer = ({ quiz, onComplete, userProgress, updateUserProgress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1) 
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit * 60 || 0)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  const [previousAttempt, setPreviousAttempt] = useState(null)

  // Check if the user has already completed this quiz
  useEffect(() => {
    console.log(userProgress.quizResults, quiz)
    if (userProgress && userProgress.quizResults, quiz) {
      const existingResult = userProgress.quizResults.find(
        result => result.quiz === quiz._id
      )
      
      if (existingResult) {
        setPreviousAttempt(existingResult)
      }

      console.log(previousAttempt)
    }
  }, [userProgress, quiz])

  // Timer effect - only start when quiz actually begins (not during intro)
  useEffect(() => {
    if (!quiz?.timeLimit || quizSubmitted || showResults || currentQuestionIndex === -1) return
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [quiz, quizSubmitted, showResults, currentQuestionIndex])

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({ ...answers, [questionIndex]: value })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
    const calculatedResults = calculateScore()
    setResults(calculatedResults)
    setShowResults(true)
  
    // Save results to user's progress
    if (updateUserProgress && userProgress && quiz._id) {
      // Ensure we have a quizResults array
      const updatedQuizResults = userProgress.quizResults || []
  
      // Create properly structured quiz result object
      const quizResult = {
        quiz: quiz._id,
        score: calculatedResults.score,
        passed: calculatedResults.passed,
        percentage: calculatedResults.percentage,
        totalPoints: calculatedResults.totalPoints,
        completedAt: new Date()
      }
  
      // Check if this quiz was already taken
      const existingResultIndex = updatedQuizResults.findIndex(
        result => result.quiz && (
          // Handle both string IDs and object IDs
          result.quiz.toString() === quiz._id.toString() ||
          (typeof result.quiz === 'object' && result.quiz._id && result.quiz._id.toString() === quiz._id.toString())
        )
      )
  
      if (existingResultIndex >= 0) {
        // Update existing result and increment attempts
        quizResult.attempts = (updatedQuizResults[existingResultIndex].attempts || 0) + 1;
        updatedQuizResults[existingResultIndex] = quizResult
      } else {
        // Add new result
        updatedQuizResults.push(quizResult)
      }
  
      // Also update completedContent to track quiz completion
      const updatedCompletedContent = userProgress.completedContent || []
  
      // Check if this quiz completion is already recorded
      const existingContentIndex = updatedCompletedContent.findIndex(
        content => content.contentId && (
          content.contentId.toString() === quiz._id.toString() ||
          (typeof content.contentId === 'object' && content.contentId._id &&
            content.contentId._id.toString() === quiz._id.toString())
        ) && content.contentType === 'quiz'
      )
  
      // Only add to completedContent if passed and not already there
      if (existingContentIndex === -1 && calculatedResults.passed) {
        updatedCompletedContent.push({
          contentType: 'quiz',
          contentId: quiz._id,
          topicId: quiz.topicId, // Ensure this is available in the quiz object
          lessonId: quiz.lessonId, // Ensure this is available in the quiz object
          completedAt: new Date()
        })
      }
  
      // Update user progress with complete data
      const updatedProgress = {
        user: userProgress.user, // Include user ID
        topic: userProgress.topic, // Include topic ID
        currentLesson: userProgress.currentLesson, // Include currentLesson if needed
        quizResults: updatedQuizResults,
        completedContent: updatedCompletedContent,
        lastViewed: userProgress.lastViewed // Include lastViewed if needed
      }
  
      // Call hook's update function
      updateUserProgress(updatedProgress)
    }
  
    if (onComplete) {
      onComplete(calculatedResults)
    }
  }

  const calculateScore = () => {
    let score = 0
    let totalPoints = 0
    
    quiz.questions.forEach((question, index) => {
      totalPoints += question.points
      
      if (question.questionType === 'matching') {
        // For matching questions, calculate partial credit
        const userMatches = answers[index] || {}
        const correctMatches = question.correctAnswer
        let matchScore = 0
        
        Object.keys(correctMatches).forEach(key => {
          if (userMatches[key] === correctMatches[key]) {
            matchScore += 1
          }
        })
        
        // Calculate percentage of correct matches and apply to points
        if (Object.keys(correctMatches).length > 0) {
          const matchPercentage = matchScore / Object.keys(correctMatches).length
          score += matchPercentage * question.points
        }
      } else if (question.questionType === 'true-false') {
        // For true/false questions, compare boolean values directly
        const userAnswer = answers[index]
        // Make sure we're comparing booleans to booleans
        if (userAnswer === question.correctAnswer) {
          score += question.points
        }
      } else {
        // For multiple choice
        if (answers[index] === question.correctAnswer) {
          score += question.points
        }
      }
    })
    
    const percentage = (score / totalPoints) * 100
    const passed = percentage >= quiz.passingScore
    
    return { score, totalPoints, percentage, passed }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="quiz-error">Quiz data not available</div>
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const questionNumber = currentQuestionIndex + 1
  const totalQuestions = quiz.questions.length
  const isLastQuestion = questionNumber === totalQuestions

  const renderQuestion = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.questionType) {
      case 'multiple-choice':
        return (
          <div className="question-container">
            <h3 dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} />
            <div className="options-container">
              {currentQuestion.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option-label">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={optionIndex}
                    checked={answers[currentQuestionIndex] === optionIndex}
                    onChange={() => handleAnswerChange(currentQuestionIndex, optionIndex)}
                    disabled={showResults}
                  />
                  <span dangerouslySetInnerHTML={{ __html: option }} />
                </label>
              ))}
            </div>
          </div>
        )
      
      case 'true-false':
        return (
          <div className="question-container">
            <h3 dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} />
            <div className="options-container">
              <label className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value="true"
                  checked={answers[currentQuestionIndex] === true}
                  onChange={() => handleAnswerChange(currentQuestionIndex, true)}
                  disabled={showResults}
                />
                <span>True</span>
              </label>
              <label className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value="false"
                  checked={answers[currentQuestionIndex] === false}
                  onChange={() => handleAnswerChange(currentQuestionIndex, false)}
                  disabled={showResults}
                />
                <span>False</span>
              </label>
            </div>
          </div>
        )
      
      case 'matching':
        const matchOptions = Object.keys(currentQuestion.correctAnswer || {})
        const matchValues = Object.values(currentQuestion.correctAnswer || {})
        
        return (
          <div className="question-container">
            <h3 dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} />
            
            <div className="matching-container">
              {matchOptions.map((option, optionIndex) => {
                const userAnswers = answers[currentQuestionIndex] || {}
                
                return (
                  <div key={optionIndex} className="matching-pair">
                    <div className="matching-key">{option}</div>
                    <select
                      value={userAnswers[option] || ''}
                      onChange={(e) => {
                        const newMatchAnswers = { ...(answers[currentQuestionIndex] || {}) }
                        newMatchAnswers[option] = e.target.value
                        handleAnswerChange(currentQuestionIndex, newMatchAnswers)
                      }}
                      disabled={showResults}
                      className="matching-select"
                    >
                      <option value="">-- Select an answer --</option>
                      {matchValues.map((value, valueIndex) => (
                        <option key={valueIndex} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          </div>
        )
      
      default:
        return <div>Unsupported question type</div>
    }
  }

  const renderResults = () => {
    const { score, totalPoints, percentage, passed } = results || {}
    
    return (
      <div className="quiz-results">
        <h2>Quiz Results</h2>
        <div className="score-container">
          <p>Your score: {score.toFixed(1)} out of {totalPoints} points ({percentage.toFixed(1)}%)</p>
          <p className={passed ? "passed-message" : "failed-message"}>
            {passed ? "Congratulations! You passed the quiz." : "You didn't meet the passing score. Review the material and try again."}
          </p>
        </div>
        
        <div className="questions-review">
          <h3>Review Questions</h3>
          {quiz.questions.map((question, index) => {
            let isCorrect = false;
            
            if (question.questionType === 'matching') {
              isCorrect = Object.keys(question.correctAnswer).every(
                key => (answers[index] || {})[key] === question.correctAnswer[key]
              );
            } else if (question.questionType === 'true-false') {
              isCorrect = answers[index] === question.correctAnswer;
            } else {
              isCorrect = answers[index] === question.correctAnswer;
            }
            
            return (
              <div key={index} className={`review-question ${isCorrect ? 'correct' : 'incorrect'}`}>
                <h4 dangerouslySetInnerHTML={{ __html: `Question ${index + 1}: ${question.questionText}` }} />
                
                {question.questionType === 'multiple-choice' && (
                  <div className="review-answer">
                    <p>Your answer: {
                      answers[index] !== undefined
                        ? question.options[answers[index]]
                        : 'No answer provided'
                    }</p>
                    <p>Correct answer: {question.options[question.correctAnswer]}</p>
                  </div>
                )}
                
                {question.questionType === 'true-false' && (
                  <div className="review-answer">
                    <p>Your answer: {
                      answers[index] !== undefined
                        ? answers[index].toString()
                        : 'No answer provided'
                    }</p>
                    <p>Correct answer: {question.correctAnswer.toString()}</p>
                  </div>
                )}
                
                {question.questionType === 'matching' && (
                  <div className="review-answer">
                    <h5>Your matches:</h5>
                    <ul>
                      {Object.keys(question.correctAnswer).map(key => (
                        <li key={key} className={
                          (answers[index] || {})[key] === question.correctAnswer[key] 
                            ? 'match-correct' 
                            : 'match-incorrect'
                        }>
                          {key} → {(answers[index] || {})[key] || 'No match selected'}
                          {(answers[index] || {})[key] !== question.correctAnswer[key] && 
                            ` (Correct: ${question.correctAnswer[key]})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="question-rationale">
                  <strong>Explanation:</strong> {question.rationale}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderPreviousResults = () => {
    if (!previousAttempt || !previousAttempt.score || !previousAttempt.totalPoints || !previousAttempt.percentage) {
      return null
    }
    
    return (
      <div className="previous-results">
        <h3>Previous Quiz Attempt</h3>
        <div className="previous-score">
          <p>Score: {previousAttempt.score.toFixed(1)} out of {previousAttempt.totalPoints} points ({previousAttempt.percentage.toFixed(1)}%)</p>
          <p className={previousAttempt.passed ? "passed-message" : "failed-message"}>
            {previousAttempt.passed ? "Passed" : "Not Passed"}
          </p>
          {previousAttempt.completedAt && (
            <p>Completed on: {formatDate(previousAttempt.completedAt)}</p>
          )}
        </div>
      </div>
    )
  }

  const renderQuizIntro = () => (
    <div className="quiz-intro">
      <p>{quiz.description}</p>
      <div className="quiz-meta">
        <p><strong>Time limit:</strong> {quiz.timeLimit} minutes</p>
        <p><strong>Passing score:</strong> {quiz.passingScore}%</p>
        <p><strong>Total questions:</strong> {quiz.questions.length}</p>
      </div>
      
      {previousAttempt ? (
        renderPreviousResults()
      ) : (
        <button className="start-quiz-btn" onClick={() => setCurrentQuestionIndex(0)}>
          Start Quiz
        </button>
      )}
    </div>
  )

  const renderProgressBar = () => {
    const progress = (questionNumber / totalQuestions) * 100
    return (
      <div className="quiz-progress-container">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="quiz-progress-text">
          Question {questionNumber} of {totalQuestions}
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-viewer">
      {currentQuestionIndex === -1 ? (
        renderQuizIntro()
      ) : showResults ? (
        renderResults()
      ) : (
        <>
          <div className="quiz-header">
            <h2>{quiz.title}</h2>
            {quiz.timeLimit > 0 && (
              <div className="timer-container">
                Time remaining: {formatTime(timeLeft)}
              </div>
            )}
          </div>
          
          {renderProgressBar()}
          {renderQuestion()}
          
          <div className="quiz-navigation">
            <button
              className="nav-button"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            
            {isLastQuestion ? (
              <button
                className="submit-button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length < totalQuestions}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                className="nav-button"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default QuizViewer