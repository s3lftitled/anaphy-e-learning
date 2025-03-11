import { useState, useEffect } from 'react'

export const useNavigation = (
  topics, 
  currentTopic, 
  setCurrentTopic,
  currentLesson,
  setCurrentLesson,
  currentPage,
  setCurrentPage,
  markContentAsCompleted
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
      setCurrentLesson(topic.lessons[0])
      setExpandedLesson(topic.lessons[0]._id)
      
      if (topic.lessons[0].content && topic.lessons[0].content.length > 0) {
        const sortedContent = [...topic.lessons[0].content].sort((a, b) => a.order - b.order)
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
    // If navigating away from a page, mark it as completed
    if (currentPage) {
      markContentAsCompleted(currentPage._id)
    }
    
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
      // Move to next page in the same lesson
      setCurrentPage(sortedContent[currentIndex + 1])
    } else {
      // Move to next lesson if available
      if (currentTopic && currentTopic.lessons) {
        const currentLessonIndex = currentTopic.lessons.findIndex(l => l._id === currentLesson._id)
        
        if (currentLessonIndex < currentTopic.lessons.length - 1) {
          const nextLesson = currentTopic.lessons[currentLessonIndex + 1]
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
  }
}