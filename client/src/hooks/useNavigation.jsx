import { useState, useEffect } from 'react'

export const useNavigation = (
  topics, 
  currentTopic, 
  setCurrentTopic,
  currentLesson,
  setCurrentLesson,
  currentPage,
  setCurrentPage,
  markContentAsCompleted,
  completedContent,
) => {
  const [expandedTopic, setExpandedTopic] = useState(currentTopic?._id || null)
  const [expandedLesson, setExpandedLesson] = useState(currentLesson?._id || null)
  // Add a state to track manual collapses
  const [manuallyCollapsed, setManuallyCollapsed] = useState({
    topics: new Set(),
    lessons: new Set()
  })

  useEffect(() => {
    // Only expand automatically if the item hasn't been manually collapsed
    if (currentLesson && currentLesson._id && 
        currentLesson._id !== expandedLesson && 
        !manuallyCollapsed.lessons.has(currentLesson._id)) {
      setExpandedLesson(currentLesson._id)
    }
    
    if (currentTopic && currentTopic._id && 
        currentTopic._id !== expandedTopic && 
        !manuallyCollapsed.topics.has(currentTopic._id)) {
      setExpandedTopic(currentTopic._id)
    }
  }, [currentLesson, currentTopic])  // Remove expandedTopic and expandedLesson from dependencies

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

  const handleTopicClick = (topic, isCollapseAction = false) => {
    if (isCollapseAction || expandedTopic === topic._id) {
      // If collapsing, track this as a manual collapse
      if (expandedTopic === topic._id) {
        setExpandedTopic(null)
        setManuallyCollapsed(prev => ({
          ...prev,
          topics: new Set([...prev.topics, topic._id])
        }))
      } else {
        // If expanding, remove from manually collapsed set
        setExpandedTopic(topic._id)
        setManuallyCollapsed(prev => {
          const newTopics = new Set([...prev.topics])
          newTopics.delete(topic._id)
          return { ...prev, topics: newTopics }
        })
      }
      return
    }
    
    // If navigating away from a page, mark it as completed
    if (currentPage) {
      markContentAsCompleted(currentPage._id)
    }
    
    // Navigate to the topic
    setCurrentTopic(topic)
    setExpandedTopic(topic._id)
    // Remove from manually collapsed when navigating to it
    setManuallyCollapsed(prev => {
      const newTopics = new Set([...prev.topics])
      newTopics.delete(topic._id)
      return { ...prev, topics: newTopics }
    })
    
    if (topic.lessons && topic.lessons.length > 0) {
      // Get the first lesson
      const firstLesson = topic.lessons[0]
      setCurrentLesson(firstLesson)
      setExpandedLesson(firstLesson._id)
      
      if (firstLesson.content && firstLesson.content.length > 0) {
        const sortedContent = [...firstLesson.content].sort((a, b) => a.order - b.order)
        setCurrentPage(sortedContent[0])
      } else {
        setCurrentPage(null)
      }
    } else {
      setCurrentLesson(null)
      setCurrentPage(null)
    }
  }

  const handleLessonClick = (lesson, isCollapseAction = false) => {
    // Find the topic this lesson belongs to
    const topic = topics.find(t => 
      t.lessons && t.lessons.some(l => l._id === lesson._id)
    );
    
    if (!topic) return;
    
    // Find the lesson index to check if it's accessible
    const lessonIndex = topic.lessons.findIndex(l => l._id === lesson._id);
    
    // Check if lesson is accessible before proceeding
    if (!isCollapseAction && !isLessonAccessible(topic._id, lessonIndex)) {
      return; // Don't proceed if locked
    }
    
    if (isCollapseAction || expandedLesson === lesson._id) {
      // If collapsing, track this as a manual collapse
      if (expandedLesson === lesson._id) {
        setExpandedLesson(null)
        setManuallyCollapsed(prev => ({
          ...prev,
          lessons: new Set([...prev.lessons, lesson._id])
        }))
      } else {
        // If expanding, remove from manually collapsed set
        setExpandedLesson(lesson._id)
        setManuallyCollapsed(prev => {
          const newLessons = new Set([...prev.lessons])
          newLessons.delete(lesson._id)
          return { ...prev, lessons: newLessons }
        })
      }
      return
    }
    
    // If navigating away from a page, mark it as completed
    if (currentPage) {
      markContentAsCompleted(currentPage._id)
    }
    
    // Navigate to the lesson
    setCurrentLesson(lesson)
    setExpandedLesson(lesson._id)
    // Remove from manually collapsed when navigating to it
    setManuallyCollapsed(prev => {
      const newLessons = new Set([...prev.lessons])
      newLessons.delete(lesson._id)
      return { ...prev, lessons: newLessons }
    })
    
    if (lesson.content && lesson.content.length > 0) {
      const sortedContent = [...lesson.content].sort((a, b) => a.order - b.order)
      setCurrentPage(sortedContent[0])
    } else {
      setCurrentPage(null)
    }
  }

  const handlePageClick = (page) => {
    // Find the lesson this page belongs to
    const topic = topics.find(t => 
      t.lessons && t.lessons.some(l => 
        l.content && l.content.some(p => p._id === page._id)
      )
    );
    
    if (!topic) return;
    
    const lesson = topic.lessons.find(l => 
      l.content && l.content.some(p => p._id === page._id)
    );
    
    if (!lesson) return;
    
    // Sort the content by order
    const sortedContent = [...lesson.content].sort((a, b) => a.order - b.order);
    
    // Find the page index to check if it's accessible
    const pageIndex = sortedContent.findIndex(p => p._id === page._id);
    
    // Check if page is accessible
    if (!isPageAccessible(lesson._id, pageIndex)) {
      return; // Don't proceed if locked
    }
    
    // If navigating away from a page, mark it as completed
    if (currentPage) {
      markContentAsCompleted(currentPage._id)
    }
    
    // Set the current page
    setCurrentPage(page)
  }

  const handleNextPage = () => {
    if (!currentLesson || !currentLesson.content) return
    
    // Mark current page as completed
    if (currentPage) {
      markContentAsCompleted(currentPage._id)
    }
    
    const sortedContent = [...currentLesson.content].sort((a, b) => a.order - b.order)
    const currentIndex = sortedContent.findIndex(p => p._id === currentPage._id)
    
    if (currentIndex < sortedContent.length - 1) {
      // Check if the next page is accessible
      if (isPageAccessible(currentLesson._id, currentIndex + 1)) {
        // Move to next page in the same lesson
        setCurrentPage(sortedContent[currentIndex + 1])
      }
    } else {
      // Move to next lesson if available
      if (currentTopic && currentTopic.lessons) {
        const currentLessonIndex = currentTopic.lessons.findIndex(l => l._id === currentLesson._id)
        
        if (currentLessonIndex < currentTopic.lessons.length - 1) {
          const nextLesson = currentTopic.lessons[currentLessonIndex + 1]
          
          // Check if the next lesson is accessible
          if (isLessonAccessible(currentTopic._id, currentLessonIndex + 1)) {
            setCurrentLesson(nextLesson)
            setExpandedLesson(nextLesson._id)
            // Remove from manually collapsed when navigating to it
            setManuallyCollapsed(prev => {
              const newLessons = new Set([...prev.lessons])
              newLessons.delete(nextLesson._id)
              return { ...prev, lessons: newLessons }
            })
            
            if (nextLesson.content && nextLesson.content.length > 0) {
              const nextLessonContent = [...nextLesson.content].sort((a, b) => a.order - b.order)
              setCurrentPage(nextLessonContent[0])
            }
          }
        }
      }
    }
  }

  const handlePrevPage = () => {
    if (!currentLesson || !currentLesson.content) return
    
    // Mark current page as completed
    if (currentPage) {
      markContentAsCompleted(currentPage._id)
    }
    
    const sortedContent = [...currentLesson.content].sort((a, b) => a.order - b.order)
    const currentIndex = sortedContent.findIndex(p => p._id === currentPage._id)
    
    if (currentIndex > 0) {
      // Move to previous page in the same lesson
      setCurrentPage(sortedContent[currentIndex - 1])
    } else {
      // Move to previous lesson if available
      if (currentTopic && currentTopic.lessons) {
        const currentLessonIndex = currentTopic.lessons.findIndex(l => l._id === currentLesson._id)
        
        if (currentLessonIndex > 0) {
          const prevLesson = currentTopic.lessons[currentLessonIndex - 1]
          setCurrentLesson(prevLesson)
          setExpandedLesson(prevLesson._id)
          // Remove from manually collapsed when navigating to it
          setManuallyCollapsed(prev => {
            const newLessons = new Set([...prev.lessons])
            newLessons.delete(prevLesson._id)
            return { ...prev, lessons: newLessons }
          })
          
          if (prevLesson.content && prevLesson.content.length > 0) {
            const prevLessonContent = [...prevLesson.content].sort((a, b) => a.order - b.order)
            setCurrentPage(prevLessonContent[prevLessonContent.length - 1])
          }
        }
      }
    }
  }

  return {
    expandedTopic,
    expandedLesson,
    handleTopicClick,
    handleLessonClick,
    handlePageClick,
    handleNextPage,
    handlePrevPage,
    isLessonAccessible,
    isPageAccessible,
  }
}