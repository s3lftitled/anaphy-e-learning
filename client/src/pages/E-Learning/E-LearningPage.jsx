import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/LearningComponents/Sidebar'
import ContentViewer from '../../components/LearningComponents/ContentViewer'
import LoadingIndicator from '../../components/LearningComponents/LoadingIndicator'
import ErrorMessage from '../../components/LearningComponents/ErrorMessage'
import FloatingHomeButton from '../../components/FloatingHomeButton/FloatingHomeButton'
import { useLearningData } from '../../hooks/useLearningData'
import { useProgressTracking } from '../../hooks/useProgressTracking'
import { useNavigation } from '../../hooks/useNavigation'

const ELearningPage = () => {
  const { user } = useUser()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  
  const {
    topics,
    currentTopic,
    setCurrentTopic,
    currentLesson,
    setCurrentLesson,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
  } = useLearningData(user)
  
  const {
    completedContent,
    markContentAsCompleted,
    calculateProgress,
    userProgress,
    updateUserProgress,
  } = useProgressTracking(user, currentTopic, currentLesson, currentPage)
  
  const {
    expandedTopic,
    expandedLesson,
    handleTopicClick,
    handleLessonClick,
    handlePageClick,
    handleNextPage,
    handlePrevPage,
  } = useNavigation(
    topics, 
    currentTopic, 
    setCurrentTopic,
    currentLesson,
    setCurrentLesson,
    currentPage,
    setCurrentPage,
    markContentAsCompleted,
  )

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  if (isLoading) return <LoadingIndicator />
  if (error) return <ErrorMessage message={error} />

  const progress = calculateProgress()

  return (
    <>
      <Navbar user={user} />
      <div className="e-learning-page">
        <Sidebar
          topics={topics}
          currentTopic={currentTopic}
          currentLesson={currentLesson}
          currentPage={currentPage}
          expandedTopic={expandedTopic}
          expandedLesson={expandedLesson}
          sidebarExpanded={sidebarExpanded}
          completedContent={completedContent}
          progress={progress}
          handleTopicClick={handleTopicClick}
          handleLessonClick={handleLessonClick}
          handlePageClick={handlePageClick}
          toggleSidebar={toggleSidebar}
        />
        
        <ContentViewer
          currentTopic={currentTopic}
          currentLesson={currentLesson}
          currentPage={currentPage}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          isContentCompleted={contentId => completedContent.includes(contentId)}
          markContentAsCompleted={markContentAsCompleted}
          userProgress={userProgress} 
          updateUserProgress={updateUserProgress} 
        />

        <FloatingHomeButton />
      </div>
    </>
  )
}

export default ELearningPage