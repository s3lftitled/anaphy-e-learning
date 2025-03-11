import { useState, useEffect, useRef } from 'react'
import './LearningComponentsStyles.css'

const TextToSpeech = ({ content }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesisRef = useRef(null)

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeech()
    }
  }, [])

  // Stop speech when content changes
  useEffect(() => {
    stopSpeech()
  }, [content])

  // Extract text from HTML
  const extractTextFromHTML = (html) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  const startSpeech = () => {
    if (!content) return
    
    // Stop any ongoing speech
    stopSpeech()
    
    // Extract text from HTML content
    const textToRead = extractTextFromHTML(content)
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToRead)
    
    // Configure speech options
    utterance.rate = 1.0  // Normal speaking rate
    utterance.pitch = 1.0 // Normal pitch
    
    // Event handlers
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
    }
    
    // Store reference to current utterance
    speechSynthesisRef.current = utterance
    
    // Start speaking
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech()
    } else {
      startSpeech()
    }
  }

  return (
    <button 
      className={`text-to-speech-button ${isSpeaking ? 'speaking' : ''}`}
      onClick={toggleSpeech}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      {isSpeaking ? 'Stop Voice' : 'Read Aloud'}
    </button>
  )
}

export default TextToSpeech