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

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      isMountedRef.current = false;
      window.speechSynthesis.onvoiceschanged = null;
      
      // Ensure speech is stopped when component unmounts
      window.speechSynthesis.cancel();
    }
  }, [])

  // Extract text from content
  const extractTextFromContent = useCallback((content) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || ''
  }, [])

  // Initialize speech synthesis
  const initializeSpeech = useCallback((text) => {
    // Cancel any existing speech
    window.speechSynthesis.cancel()

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch

    // Set selected voice
    if (currentVoice) {
      utterance.voice = currentVoice
    }

    utteranceRef.current = utterance
    return utterance
  }, [rate, pitch, currentVoice])

  // Start speech
  const startSpeech = useCallback(() => {
    if (!content) return

    const text = extractTextFromContent(content)
    const utterance = initializeSpeech(text)

    utterance.onstart = () => {
      if (isMountedRef.current) {
        setSpeechStatus('playing')
      }
    }

    utterance.onend = () => {
      if (isMountedRef.current) {
        setSpeechStatus('stopped')
      }
    }

    window.speechSynthesis.speak(utterance)
  }, [content, extractTextFromContent, initializeSpeech])

  // Pause speech
  const pauseSpeech = useCallback(() => {
    if (speechStatus === 'playing') {
      window.speechSynthesis.pause()
      setSpeechStatus('paused')
    }
  }, [speechStatus])

  // Resume speech
  const resumeSpeech = useCallback(() => {
    if (speechStatus === 'paused') {
      window.speechSynthesis.resume()
      setSpeechStatus('playing')
    }
  }, [speechStatus])

  // Stop speech
  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeechStatus('stopped')
  }, [])

  // Add an effect to handle potential memory leaks and stop speech on unmount
  useEffect(() => {
    return () => {
      // Ensure speech is stopped when component unmounts
      window.speechSynthesis.cancel();
      isMountedRef.current = false;
    }
  }, [])

  // Render control buttons
  const renderControlButtons = () => {
    switch (speechStatus) {
      case 'stopped':
        return (
          <button 
            onClick={startSpeech} 
            className="start-button"
            aria-label="Start speech"
          >
            <Play size={24} />
          </button>
        );
      case 'playing':
        return (
          <div className="button-group">
            <button 
              onClick={pauseSpeech} 
              className="pause-button"
              aria-label="Pause speech"
            >
              <Pause size={24} />
            </button>
            <button 
              onClick={stopSpeech} 
              className="stop-button"
              aria-label="Stop speech"
            >
              <Square size={24} />
            </button>
          </div>
        );
      case 'paused':
        return (
          <div className="button-group">
            <button 
              onClick={resumeSpeech} 
              className="resume-button"
              aria-label="Resume speech"
            >
              <Play size={24} />
            </button>
            <button 
              onClick={stopSpeech} 
              className="stop-button"
              aria-label="Stop speech"
            >
              <Square size={24} />
            </button>
          </div>
        );
      default:
        return null
    }
  }

  // Render settings panel
  const renderSettingsPanel = () => {
    if (!showSettings) return null;

    return (
      <div className="settings-panel">
        {/* Voice Selection */}
        <div className="voice-selection">
          <label>
            Voice
          </label>
          <select 
            value={currentVoice?.name || ''}
            onChange={(e) => {
              const selected = voices.find(v => v.name === e.target.value);
              setCurrentVoice(selected);
            }}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Rate Control */}
        <div className="rate-control">
          <label>
            Speech Rate (Current: {rate.toFixed(1)}x)
          </label>
          <input 
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>

        {/* Pitch Control */}
        <div className="pitch-control">
          <label>
            Pitch (Current: {pitch.toFixed(1)})
          </label>
          <input 
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="text-to-speech-container">
      <div className="controls-header">
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
          {showSettings ? <ChevronUp size={24} /> : <Settings size={24} />}
        </button>
      </div>

      {/* Settings Panel */}
      {renderSettingsPanel()}
    </div>
  )
}

export default TextToSpeech