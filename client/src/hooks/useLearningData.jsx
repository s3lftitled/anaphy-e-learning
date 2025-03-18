import { useState, useEffect } from 'react'
import usePrivateApi from './usePrivateApi'

export const useLearningData = (user) => {
  const [topics, setTopics] = useState([])
  const [currentTopic, setCurrentTopic] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [currentPage, setCurrentPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const privateAxios = usePrivateApi()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch topics
        const topicsResponse = await privateAxios.get('topics/api/v1/fetch-topic-contents', {}, {
          withCredentials: true
        })
        const topicsData = topicsResponse.data
        setTopics(topicsData.topic || [])

        if (user && user.id) {
          try {
            console.log(`Fetching progress for user: ${user.id}`)
            const progressResponse = await privateAxios.get(`progress/api/v1/get-progress/${user.id}`, {}, {
              withCredentials: true
            })
            const progressData = progressResponse.data
            
            // Set initial content based on last viewed
            if (progressData.progress && progressData.progress.lastViewed) {
              const lastViewed = progressData.progress.lastViewed
              
              // Find the topic, lesson, and page from the last viewed data
              if (topicsData.topic && topicsData.topic.length > 0) {
                const lastTopic = topicsData.topic.find(t => t._id === lastViewed.topicId)
                if (lastTopic) {
                  setCurrentTopic(lastTopic)
                  
                  const lastLesson = lastTopic.lessons.find(l => l._id === lastViewed.lessonId)
                  if (lastLesson) {
                    setCurrentLesson(lastLesson)
                    
                    const lastContent = lastLesson.content.find(c => c._id === lastViewed.contentId)
                    if (lastContent) {
                      setCurrentPage(lastContent)
                    } else if (lastLesson.content && lastLesson.content.length > 0) {
                      const sortedContent = [...lastLesson.content].sort((a, b) => a.order - b.order)
                      setCurrentPage(sortedContent[0])
                    }
                  }
                }
              }
            } else {
              setDefaultContent(topicsData.topic)
            }
          } catch (err) {
            console.error('Error fetching user progress:', err)
            setError('Failed to load your progress: ' + err.message)
            // Still set default content if there's an error with progress
            setDefaultContent(topicsData.topic)
          }
        } else {
          // Set default content if user is not logged in
          setDefaultContent(topicsData.topic)
        }
      } catch (err) {
        console.error('Error fetching topics:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  // Helper function to set default content
  const setDefaultContent = (topics) => {
    if (topics && topics.length > 0) {
      setCurrentTopic(topics[0])
      
      if (topics[0].lessons && topics[0].lessons.length > 0) {
        setCurrentLesson(topics[0].lessons[0])
        
        if (topics[0].lessons[0].content && topics[0].lessons[0].content.length > 0) {
          const sortedContent = [...topics[0].lessons[0].content].sort((a, b) => a.order - b.order)
          setCurrentPage(sortedContent[0])
        }
      }
    }
  }

  // Save progress when page changes
  useEffect(() => {
    const saveProgress = async () => {
      if (user && user.id && currentTopic && currentLesson && currentPage) {
        try {
          // Save user progress
          await privateAxios.post('progress/api/v1/save-progress', {
            userId: user.id,
            topicId: currentTopic._id,
            lessonId: currentLesson._id,
            contentId: currentPage._id
          }, { withCredentials: true })
        } catch (err) {
          console.error('Error saving progress:', err)
        }
      }
    }
    
    // Add a small delay to avoid too many rapid requests
    const timer = setTimeout(() => {
      saveProgress()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [currentPage, user, currentTopic, currentLesson])

  return {
    topics,
    setTopics,
    currentTopic,
    setCurrentTopic,
    currentLesson,
    setCurrentLesson,
    currentPage,
    setCurrentPage,
    isLoading,
    error
  }
}