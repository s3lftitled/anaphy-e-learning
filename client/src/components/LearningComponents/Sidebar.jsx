import React from 'react'
import ProgressRing from './ProgressRing'
import { SquareChevronLeft, SquareChevronRight, LockIcon } from 'lucide-react'

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

  // Determine if a lesson is accessible based on previous lesson completion
  const isLessonAccessible = (topicId, lessonIndex) => {
    // First lesson of any topic is always accessible
    if (lessonIndex === 0) return true;
    
    // Find the topic
    const topic = topics.find(t => t._id === topicId);
    if (!topic || !topic.lessons || topic.lessons.length === 0) return false;
    
    // Get the previous lesson
    const prevLesson = topic.lessons[lessonIndex - 1];
    if (!prevLesson || !prevLesson.content) return false;
    
    // Check if all content in the previous lesson is completed
    return prevLesson.content.every(page => isContentCompleted(page._id));
  }

  // Determine if a page is accessible based on previous page completion
  const isPageAccessible = (lessonId, pageIndex) => {
    // First page of any lesson is always accessible
    if (pageIndex === 0) return true;
    
    // Find the current topic and lesson
    const topic = topics.find(t => t.lessons && t.lessons.some(l => l._id === lessonId));
    if (!topic) return false;
    
    const lesson = topic.lessons.find(l => l._id === lessonId);
    if (!lesson || !lesson.content) return false;
    
    // Sort the content by order
    const sortedContent = [...lesson.content].sort((a, b) => a.order - b.order);
    
    // Check if the previous page is completed
    return isContentCompleted(sortedContent[pageIndex - 1]._id);
  }

  return (
    <div className={`learning-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarExpanded ? <SquareChevronLeft size={35} strokeWidth={2.5}  /> : <SquareChevronRight size={35} strokeWidth={2.5}  />}
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
                  {topic.lessons.map((lesson, lessonIndex) => {
                    const lessonAccessible = isLessonAccessible(topic._id, lessonIndex);
                    
                    return (
                      <li 
                        key={lesson._id} 
                        className={`
                          ${currentLesson && lesson._id === currentLesson._id ? 'active' : ''}
                          ${!lessonAccessible ? 'locked' : ''}
                        `}
                      >
                        <div 
                          className={`lesson-header ${!lessonAccessible ? 'disabled' : ''}`}
                          onClick={() => lessonAccessible && handleLessonClick(lesson)}
                        >
                          <span>{lesson.title}</span>
                          {!lessonAccessible ? (
                            <LockIcon size={16} className="lock-icon" />
                          ) : (
                            <span className="icon">{expandedLesson === lesson._id ? '−' : '+'}</span>
                          )}
                        </div>
                        
                        {expandedLesson === lesson._id && lesson.content && lessonAccessible && (
                          <ul className="pages-list">
                            {[...lesson.content]
                              .sort((a, b) => a.order - b.order)
                              .map((page, pageIndex) => {
                                const pageAccessible = isPageAccessible(lesson._id, pageIndex);
                                
                                return (
                                  <li 
                                    key={page._id}
                                    className={`
                                      ${currentPage && page._id === currentPage._id ? 'active' : ''}
                                      ${isContentCompleted(page._id) ? 'completed' : ''}
                                      ${!pageAccessible ? 'locked' : ''}
                                    `}
                                    onClick={() => pageAccessible && handlePageClick(page)}
                                  >
                                    {isContentCompleted(page._id) ? (
                                      <span className="completion-indicator">✓</span>
                                    ) : !pageAccessible ? (
                                      <LockIcon size={14} className="lock-icon" />
                                    ) : null}
                                    <span className={!pageAccessible ? 'disabled-text' : ''}>
                                      {page.contentId.title}
                                    </span>
                                  </li>
                                );
                              })
                            }
                          </ul>
                        )}
                      </li>
                    );
                  })}
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
