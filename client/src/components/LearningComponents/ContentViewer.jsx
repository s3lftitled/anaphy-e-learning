import { useState } from 'react'
import TextToSpeech from './TextToSpeech'
import ContentMedia from './ContentMedia'
import NavigationButtons from './NavigationButtons'
import QuizViewer from './QuizViewer'
import './LearningComponentsStyles.css'

const ContentViewer = ({
  currentTopic,
  currentLesson,
  currentPage,
  handlePrevPage,
  handleNextPage,
  isContentCompleted,
  markContentAsCompleted,
  userProgress,
  updateUserProgress,
}) => {
  const [quizResults, setQuizResults] = useState(null)

  if (!currentPage) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <h2>Select a lesson to begin</h2>
          <p>Choose a topic and lesson from the sidebar to start learning</p>
        </div>
      </div>
    )
  }

  const handleQuizComplete = (results) => {
    setQuizResults(results)
    if (results.passed && !isContentCompleted(currentPage._id)) {
      markContentAsCompleted(currentPage._id)
    }
  }

  const isQuiz = currentPage.type === 'QuizModel'

  return (
    <div className="main-content">
      <div className="content-container">
        <div className="content-header">
          <h1>{currentPage.contentId.title}</h1>
          <div className="breadcrumbs">
            <span>{currentTopic && currentTopic.name}</span>
            <span> &gt; </span>
            <span>{currentLesson && currentLesson.title}</span>
            <span> &gt; </span>
            <span>{currentPage.contentId.title}</span>
          </div>
          {!isQuiz && <TextToSpeech content={currentPage.contentId.content} />}
        </div>

        {isQuiz ? (
          <QuizViewer 
            quiz={currentPage.contentId} 
            onComplete={handleQuizComplete}
            userProgress={userProgress} // Pass this prop
            updateUserProgress={updateUserProgress} // Pass this prop
          />
        ) : (
          <>
            <div className="content-body" dangerouslySetInnerHTML={{ __html: currentPage.contentId.content }} />
            <ContentMedia content={currentPage.contentId} />
          </>
        )}

        <NavigationButtons
          currentPage={currentPage}
          isCompleted={isContentCompleted(currentPage._id) || (quizResults && quizResults.passed)}
          onPrevious={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  )
}

export default ContentViewer