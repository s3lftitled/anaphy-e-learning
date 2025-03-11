import TextToSpeech from './TextToSpeech'
import ContentMedia from './ContentMedia'
import NavigationButtons from './NavigationButtons'
import './LearningComponentsStyles.css'

const ContentViewer = ({
  currentTopic,
  currentLesson,
  currentPage,
  handlePrevPage,
  handleNextPage,
  isContentCompleted
}) => {
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
          <TextToSpeech content={currentPage.contentId.content} />
        </div>
        
        <div className="content-body" dangerouslySetInnerHTML={{ __html: currentPage.contentId.content }} />
        
        <ContentMedia content={currentPage.contentId} />
        
        <NavigationButtons
          currentPage={currentPage}
          isCompleted={isContentCompleted(currentPage._id)}
          onPrevious={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  )
}

export default ContentViewer