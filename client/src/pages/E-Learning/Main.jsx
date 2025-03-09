import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext'
import Navbar from '../../components/Navbar/Navbar';
import api from '../../utils/api'
import './styles.css';

const ELearningPage = () => {
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef(null);
  const { user } = useUser()

  // Fetch all topics
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('topics/api/v1/fetch-topic-contents');
        const data = await response.data
        setTopics(data.topic || [])
        
        // Set default selections if topics exist
        if (data.topic && data.topic.length > 0) {
          setCurrentTopic(data.topic[0]);
          
          if (data.topic[0].lessons && data.topic[0].lessons.length > 0) {
            setCurrentLesson(data.topic[0].lessons[0]);
            
            if (data.topic[0].lessons[0].content && data.topic[0].lessons[0].content.length > 0) {
              // Sort content by order
              const sortedContent = [...data.topic[0].lessons[0].content].sort((a, b) => a.order - b.order);
              setCurrentPage(sortedContent[0]);
            }
          }
          
          setExpandedTopic(data.topic[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopics();
  }, []);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Stop speech when navigating to a new page
  useEffect(() => {
    stopSpeech();
  }, [currentPage]);

  const handleTopicClick = (topic) => {
    setCurrentTopic(topic);
    
    if (expandedTopic === topic._id) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topic._id);
      
      if (topic.lessons && topic.lessons.length > 0) {
        setCurrentLesson(topic.lessons[0]);
        
        if (topic.lessons[0].content && topic.lessons[0].content.length > 0) {
          const sortedContent = [...topic.lessons[0].content].sort((a, b) => a.order - b.order);
          setCurrentPage(sortedContent[0]);
        } else {
          setCurrentPage(null);
        }
      } else {
        setCurrentLesson(null);
        setCurrentPage(null);
      }
    }
  };

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    
    if (expandedLesson === lesson._id) {
      setExpandedLesson(null);
    } else {
      setExpandedLesson(lesson._id);
      
      if (lesson.content && lesson.content.length > 0) {
        const sortedContent = [...lesson.content].sort((a, b) => a.order - b.order);
        setCurrentPage(sortedContent[0]);
      } else {
        setCurrentPage(null);
      }
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (!currentLesson || !currentLesson.content) return;
    
    const sortedContent = [...currentLesson.content].sort((a, b) => a.order - b.order);
    const currentIndex = sortedContent.findIndex(p => p._id === currentPage._id);
    
    if (currentIndex < sortedContent.length - 1) {
      // Move to next page in the same lesson
      setCurrentPage(sortedContent[currentIndex + 1]);
    } else {
      // Move to next lesson if available
      if (currentTopic && currentTopic.lessons) {
        const currentLessonIndex = currentTopic.lessons.findIndex(l => l._id === currentLesson._id);
        
        if (currentLessonIndex < currentTopic.lessons.length - 1) {
          const nextLesson = currentTopic.lessons[currentLessonIndex + 1];
          setCurrentLesson(nextLesson);
          setExpandedLesson(nextLesson._id);
          
          if (nextLesson.content && nextLesson.content.length > 0) {
            const nextLessonContent = [...nextLesson.content].sort((a, b) => a.order - b.order);
            setCurrentPage(nextLessonContent[0]);
          }
        }
      }
    }
  };

  const handlePrevPage = () => {
    if (!currentLesson || !currentLesson.content) return;
    
    const sortedContent = [...currentLesson.content].sort((a, b) => a.order - b.order);
    const currentIndex = sortedContent.findIndex(p => p._id === currentPage._id);
    
    if (currentIndex > 0) {
      // Move to previous page in the same lesson
      setCurrentPage(sortedContent[currentIndex - 1]);
    } else {
      // Move to previous lesson if available
      if (currentTopic && currentTopic.lessons) {
        const currentLessonIndex = currentTopic.lessons.findIndex(l => l._id === currentLesson._id);
        
        if (currentLessonIndex > 0) {
          const prevLesson = currentTopic.lessons[currentLessonIndex - 1];
          setCurrentLesson(prevLesson);
          setExpandedLesson(prevLesson._id);
          
          if (prevLesson.content && prevLesson.content.length > 0) {
            const prevLessonContent = [...prevLesson.content].sort((a, b) => a.order - b.order);
            setCurrentPage(prevLessonContent[prevLessonContent.length - 1]);
          }
        }
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Text-to-speech functions
  const extractTextFromHTML = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const startSpeech = () => {
    if (!currentPage || !currentPage.contentId.content) return;
    
    // Stop any ongoing speech
    stopSpeech();
    
    // Extract text from HTML content
    const textToRead = extractTextFromHTML(currentPage.contentId.content);
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Configure speech options
    utterance.rate = 1.0;  // Normal speaking rate
    utterance.pitch = 1.0; // Normal pitch
    
    // Event handlers
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    // Store reference to current utterance
    speechSynthesisRef.current = utterance;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      startSpeech();
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!currentTopic || !currentLesson || !currentPage) return 0;
    
    const allLessons = currentTopic.lessons || [];
    if (allLessons.length === 0) return 0;
    
    let totalPages = 0;
    let completedPages = 0;
    
    // Count all pages up to current
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      const sortedContent = [...(lesson.content || [])].sort((a, b) => a.order - b.order);
      
      totalPages += sortedContent.length;
      
      if (lesson._id === currentLesson._id) {
        // Current lesson - count pages up to current page
        const currentPageIndex = sortedContent.findIndex(p => p._id === currentPage._id);
        completedPages += currentPageIndex + 1;
        break;
      } else if (i < allLessons.findIndex(l => l._id === currentLesson._id)) {
        // Previous lessons - count all pages
        completedPages += sortedContent.length;
      }
    }
    
    return totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;
  };

  const progress = calculateProgress();

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <Navbar user={user} />
      <div className="e-learning-page">
        <div className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarExpanded ? '←' : '→'}
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
                                    className={currentPage && page._id === currentPage._id ? 'active' : ''}
                                    onClick={() => handlePageClick(page)}
                                  >
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
            <div className="progress-ring">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle
                  className="progress-ring-circle-bg"
                  stroke="#e6e6e6"
                  strokeWidth="4"
                  fill="transparent"
                  r="16"
                  cx="20"
                  cy="20"
                />
                <circle
                  className="progress-ring-circle"
                  stroke="#0c4160"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 16} ${2 * Math.PI * 16}`}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - progress / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  r="16"
                  cx="20"
                  cy="20"
                />
              </svg>
              <span className="progress-text">{progress}%</span>
            </div>
          </div>
          </div>
        </div>
        
        <div className="main-content">
          {currentPage ? (
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
                <button 
                  className={`text-to-speech-button ${isSpeaking ? 'speaking' : ''}`}
                  onClick={toggleSpeech}
                  aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
                  title={isSpeaking ? "Stop reading" : "Read aloud"}
                >
                  {isSpeaking ? 'Stop Voice' : 'Read Aloud'}
                </button>
              </div>
              
              <div className="content-body" dangerouslySetInnerHTML={{ __html: currentPage.contentId.content }} />
              
              {currentPage.contentId.link && (
                <div className="content-iframe">
                  <iframe
                    src={currentPage.contentId.link}
                    frameBorder="0"
                    allowFullScreen
                    title={currentPage.contentId.title}
                  />
                </div>
              )}
              
              {currentPage.contentId.images && currentPage.contentId.images.length > 0 && (
                <div className="content-images">
                  {currentPage.contentId.images.map((img, index) => (
                    <img key={index} src={img} alt={`${currentPage.contentId.title} - image ${index + 1}`} />
                  ))}
                </div>
              )}
              
              {currentPage.contentId.videos && currentPage.contentId.videos.length > 0 && (
                <div className="content-videos">
                  {currentPage.contentId.videos.map((video, index) => (
                    <video key={index} controls>
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              )}
              
              <div className="navigation-buttons">
                <button onClick={handlePrevPage}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <h2>Select a lesson to begin</h2>
              <p>Choose a topic and lesson from the sidebar to start learning</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ELearningPage;