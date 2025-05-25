import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'
import './LearningComponentsStyles.css'

const TextToSpeech = ({ content, options = {} }) => {
  const [speechStatus, setSpeechStatus] = useState('stopped')
  const [voices, setVoices] = useState([])
  const [currentVoice, setCurrentVoice] = useState(null)
  const [rate, setRate] = useState(options.rate || 1.0)
  const [pitch, setPitch] = useState(options.pitch || 1.0)
  const [showSettings, setShowSettings] = useState(false)

  const utteranceRef = useRef(null)
  const isMountedRef = useRef(true)

  // Load voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      const englishVoices = availableVoices.filter(v => v.lang.startsWith('en-'))
      
      if (isMountedRef.current) {
        setVoices(englishVoices)

        // Set default voice
        const preferredVoice = englishVoices.find(v => 
          v.name.includes('Natural') || 
          v.name.includes('Google') || 
          v.name.includes('Wavenet')
        ) || englishVoices[0]

        setCurrentVoice(preferredVoice)
      }
    }

    // Load voices immediately if available
    loadVoices()
    
    // Set up voice change listener
    const handleVoicesChanged = () => {
      loadVoices()
    }
    
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)

    return () => {
      isMountedRef.current = false
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      window.speechSynthesis.cancel()
    }
  }, [])

  // Extract text from content
  const extractTextFromContent = useCallback((content) => {
    if (typeof content === 'string') {
      // If it's already a string, check if it contains HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      return tempDiv.textContent || tempDiv.innerText || content
    }
    return String(content)
  }, [])

  // Start speech
  const startSpeech = useCallback(() => {
    if (!content) return

    // Cancel any existing speech first
    window.speechSynthesis.cancel()

    const text = extractTextFromContent(content)
    if (!text.trim()) return

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch

    // Set selected voice
    if (currentVoice) {
      utterance.voice = currentVoice
    }

    // Set up event listeners
    utterance.onstart = () => {
      console.log('Speech started')
      if (isMountedRef.current) {
        setSpeechStatus('playing')
      }
    }

    utterance.onend = () => {
      console.log('Speech ended')
      if (isMountedRef.current) {
        setSpeechStatus('stopped')
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech error:', event)
      if (isMountedRef.current) {
        setSpeechStatus('stopped')
      }
    }

    utterance.onpause = () => {
      console.log('Speech paused')
      if (isMountedRef.current) {
        setSpeechStatus('paused')
      }
    }

    utterance.onresume = () => {
      console.log('Speech resumed')
      if (isMountedRef.current) {
        setSpeechStatus('playing')
      }
    }

    utteranceRef.current = utterance
    
    // Set status to playing immediately for better UX
    setSpeechStatus('playing')
    
    // Speak the utterance
    window.speechSynthesis.speak(utterance)
  }, [content, extractTextFromContent, rate, pitch, currentVoice])

  // Pause speech
  const pauseSpeech = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setSpeechStatus('paused')
    }
  }, [])

  // Resume speech
  const resumeSpeech = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setSpeechStatus('playing')
    }
  }, [])

  // Stop speech
  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeechStatus('stopped')
  }, [])

  // Monitor speech synthesis state
  useEffect(() => {
    const checkSpeechState = () => {
      if (!window.speechSynthesis.speaking && speechStatus === 'playing') {
        setSpeechStatus('stopped')
      }
    }

    const interval = setInterval(checkSpeechState, 100)
    
    return () => {
      clearInterval(interval)
    }
  }, [speechStatus])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      isMountedRef.current = false
    }
  }, [content])

  // Render control buttons
  const renderControlButtons = () => {
    switch (speechStatus) {
      case 'stopped':
        return (
          <button 
            onClick={startSpeech} 
            className="control-button start-button"
            aria-label="Start speech"
          >
            <Play size={20} />
          </button>
        )
      case 'playing':
        return (
          <div className="button-group">
            <button 
              onClick={pauseSpeech} 
              className="control-button pause-button"
              aria-label="Pause speech"
            >
              <Pause size={20} />
            </button>
            <button 
              onClick={stopSpeech} 
              className="control-button stop-button"
              aria-label="Stop speech"
            >
              <Square size={20} />
            </button>
          </div>
        )
      case 'paused':
        return (
          <div className="button-group">
            <button 
              onClick={resumeSpeech} 
              className="control-button resume-button"
              aria-label="Resume speech"
            >
              <Play size={20} />
            </button>
            <button 
              onClick={stopSpeech} 
              className="control-button stop-button"
              aria-label="Stop speech"
            >
              <Square size={20} />
            </button>
          </div>
        )
      default:
        return null
    }
  }

  // Render settings panel
  const renderSettingsPanel = () => {
    if (!showSettings) return null

    return (
      <div className="settings-panel">
        {/* Voice Selection */}
        <div className="setting-group">
          <label className="setting-label">
            Voice
          </label>
          <select 
            value={currentVoice?.name || ''}
            onChange={(e) => {
              const selected = voices.find(v => v.name === e.target.value)
              setCurrentVoice(selected)
            }}
            className="voice-select"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Rate Control */}
        <div className="setting-group">
          <label className="setting-label">
            Speech Rate: {rate.toFixed(1)}x
          </label>
          <input 
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="range-input"
          />
        </div>

        {/* Pitch Control */}
        <div className="setting-group">
          <label className="setting-label">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input 
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="range-input"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="text-to-speech-container">
      <div className={`controls-header ${showSettings ? 'with-settings' : ''}`}>
        {/* Speech Control Buttons */}
        <div className="button-group">
          {renderControlButtons()}
        </div>

        {/* Settings Toggle */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="settings-toggle"
          aria-label={showSettings ? "Hide settings" : "Show settings"}
        >
          {showSettings ? <ChevronUp size={20} /> : <Settings size={20} />}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel-wrapper">
          {renderSettingsPanel()}
        </div>
      )}

      {/* Status indicator */}
      <div className="status-indicator">
        Status: <span className={`status-text status-${speechStatus}`}>
          {speechStatus.charAt(0).toUpperCase() + speechStatus.slice(1)}
        </span>
      </div>
    </div>
  )
}

export default TextToSpeech
