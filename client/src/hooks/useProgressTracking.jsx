import { useState, useEffect } from 'react'
import usePrivateApi from './usePrivateApi'

export const useProgressTracking = (user, currentTopic, currentLesson, currentPage) => {
  const [userProgress, setUserProgress] = useState(null)
  const [completedContent, setCompletedContent] = useState([])
  const privateAxios = usePrivateApi()

  // Fetch user progress data
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user || !user.id) return
      
      try {
        const progressResponse = await privateAxios.get(`progress/api/v1/get-progress/${user.id}`, {}, {
          withCredentials: true
        })
        const progressData = progressResponse.data
        setUserProgress(progressData.progress)
        
        // Extract completed content IDs
        const completedIds = []
        if (progressData.progress && progressData.progress.topicsProgress) {
          // Use Promise.all to fetch all topic progresses in parallel
          const topicProgressPromises = progressData.progress.topicsProgress.map(
            topicProgress => privateAxios.get(`progress/api/v1/get-progress/${user.id}/${topicProgress.topicId}`, {}, {
              withCredentials: true
            })
          )
          
          const topicProgressResults = await Promise.all(topicProgressPromises)
          
          topicProgressResults.forEach(response => {
            const topicDetail = response.data.progress
            if (topicDetail && topicDetail.completedContent) {
              topicDetail.completedContent.forEach(item => {
                completedIds.push(item.contentId)
              })
            }
          })
        }
        setCompletedContent(completedIds)
      } catch (err) {
        console.error('Error fetching user progress details:', err)
      }
    }
    
    fetchUserProgress()
  }, [user])

  const updateUserProgress = async (updatedProgress) => {
    if (!user || !user.id) return
    
    try {      
      // Make API call to update progress
      await privateAxios.post(`progress/api/v1/update-progress/${user.id}`, {
        quizResults: updatedProgress.quizResults
      }, { withCredentials: true })
    
      await privateAxios.post(`user/api/v1/record-quiz-score/${user.id}`, { 
        quizResults: updatedProgress.quizResults
      }, { withCredentials: true })
    } catch (err) {
      console.error('Error updating user progress:', err)
      console.error('Error details:', err.response ? err.response.data : err.message)
    }
  }

  const markContentAsCompleted = async (contentId) => {
    if (user && user.id && currentTopic && currentLesson && contentId) {
      try {
        // Only mark as completed if not already completed
        if (!completedContent.includes(contentId)) {
          const response = await privateAxios.post('progress/api/v1/complete-content', {
            userId: user.id,
            topicId: currentTopic._id,
            lessonId: currentLesson._id,
            contentId: contentId,
            contentType: 'page'
          }, { withCredentials: true })
          
          if (response.status === 200) {
            // Update local completed content list
            setCompletedContent(prev => [...prev, contentId])
          }
        }
      } catch (err) {
        console.error('Error marking content as completed:', err)
      }
    }
  }

  // Calculate progress based on the user's progress data
  const calculateProgress = () => {
    if (userProgress && userProgress.overallProgress !== undefined) {
      return userProgress.overallProgress
    }
    
    // Fallback to calculating based on current position
    if (!currentTopic || !currentLesson || !currentPage) return 0
    
    const allLessons = currentTopic.lessons || []
    if (allLessons.length === 0) return 0
    
    let totalPages = 0
    let completedPages = 0
    
    // Count all pages up to current
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i]
      const sortedContent = [...(lesson.content || [])].sort((a, b) => a.order - b.order)
      
      totalPages += sortedContent.length
      
      if (lesson._id === currentLesson._id) {
        // Current lesson - count pages up to current page
        const currentPageIndex = sortedContent.findIndex(p => p._id === currentPage._id)
        completedPages += currentPageIndex + 1
        break
      } else if (i < allLessons.findIndex(l => l._id === currentLesson._id)) {
        // Previous lessons - count all pages
        completedPages += sortedContent.length
      }
    }
    
    return totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0
  }

  return {
    userProgress,
    setUserProgress,
    completedContent,
    markContentAsCompleted,
    calculateProgress,
    updateUserProgress,
  }
}
