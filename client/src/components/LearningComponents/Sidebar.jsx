// components/Sidebar.jsx
import React from 'react'
import ProgressRing from './ProgressRing'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Sidebar = ({
  topics,
  currentTopic,
  currentLesson,
  currentPage,
  expandedTopic,
  expandedLesson,
  sidebarExpanded,
  completedContent,
  progress,
  handleTopicClick,
  handleLessonClick,
  handlePageClick,
  toggleSidebar
}) => {
  const isContentCompleted = (contentId) => {
    return completedContent.includes(contentId)
  }

  return (
    <div className={`learning-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </div>
      
      <div className="sidebar-content">
        <h3>Course Content</h3>
        <ul className="topics-list">
          {topics.map(topic => (
            <li key={topic._id} className={currentTopic && topic._id === currentTopic._id ? 'active' : ''}>
              <div 
                className="topic-header"
                onClick={() => handleTopicClick(topic)}
              >
                <span>{topic.name}</span>
                <span className="icon">{expandedTopic === topic._id ? '−' : '+'}</span>
              </div>
              
              {expandedTopic === topic._id && topic.lessons && (
                <ul className="lessons-list">
                  {topic.lessons.map(lesson => (
                    <li key={lesson._id} className={currentLesson && lesson._id === currentLesson._id ? 'active' : ''}>
                      <div 
                        className="lesson-header"
                        onClick={() => handleLessonClick(lesson)}
                      >
                        <span>{lesson.title}</span>
                        <span className="icon">{expandedLesson === lesson._id ? '−' : '+'}</span>
                      </div>
                      
                      {expandedLesson === lesson._id && lesson.content && (
                        <ul className="pages-list">
                          {[...lesson.content]
                            .sort((a, b) => a.order - b.order)
                            .map(page => (
                              <li 
                                key={page._id}
                                className={`
                                  ${currentPage && page._id === currentPage._id ? 'active' : ''}
                                  ${isContentCompleted(page._id) ? 'completed' : ''}
                                `}
                                onClick={() => handlePageClick(page)}
                              >
                                {isContentCompleted(page._id) && <span className="completion-indicator">✓</span>}
                                {page.contentId.title}
                              </li>
                            ))
                          }
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="progress-container">
          <ProgressRing progress={progress} />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
