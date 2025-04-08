import { useState, useRef, useEffect } from 'react'
import './Chatbot.css'

const AnatomyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your Anatomy AI Assistant. Ask me any questions about human anatomy, body systems, or medical terminology.", sender: 'bot' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [micPermission, setMicPermission] = useState('unknown') // 'unknown', 'granted', 'denied'
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Use environment variable or a secure backend service for API keys
  // This is a placeholder - in production, NEVER include API keys in client-side code
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

  // System message to restrict responses to anatomy-related questions
  const SYSTEM_MESSAGE = `You are an Anatomy AI Assistant, designed to assist with learning human anatomy.  

Format responses with proper spacing and line breaks using '\\n\\n' where necessary.  

You should ONLY answer questions related to anatomy, physiology, body systems, medical terminology, and directly related educational content.  

If a question is unrelated to anatomy or human biology, politely inform the user that you can only provide assistance with anatomy-related topics.  

Ensure responses are **concise yet accurate** with no more than 100 characters, making explanations clear and easy for students to understand.  

When relevant, suggest related anatomy topics for further exploration.`

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
  }

  const formatBoldText = (text) => {
    return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
  }
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const checkMicrophonePermission = () => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' })
        .then(permissionStatus => {
          setMicPermission(permissionStatus.state);
          permissionStatus.onchange = () => {
            setMicPermission(permissionStatus.state);
          };
        })
        .catch(error => {
          console.error('Permission check failed:', error);
        });
    }
  }

  const callGroqApi = async (userMessage) => {
    if (!API_KEY) {
      return "API key is missing. Please set up your API key in the environment variables.";
    }

    try {
      setIsLoading(true)
      
      // Ideally, this API call should be made through a secure backend service
      // to protect your API key
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192', // You can change the model as needed
          messages: [
            { role: 'system', content: SYSTEM_MESSAGE },
            ...messages.map(msg => ({
              role: msg.sender === 'bot' ? 'assistant' : 'user',
              content: msg.text
            })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      })

      const data = await response.json()
      
      if (data.error) {
        console.error('Groq API Error:', data.error);
        return "I'm having trouble connecting to my knowledge base. Please try again in a moment.";
      }
      
      return data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return "There was an error processing your request. Please try again later.";
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return

    const userMessage = inputValue.trim()
    
    // Add user message
    const newMessages = [...messages, { id: messages.length + 1, text: userMessage, sender: 'user' }]
    setMessages(newMessages)
    setInputValue('')

    // Add a temporary loading message
    const loadingId = newMessages.length + 1
    setMessages([...newMessages, { id: loadingId, text: '...', sender: 'bot', isLoading: true }])

    // Call Groq API
    const botResponse = await callGroqApi(userMessage)
    
    // Replace loading message with actual response
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === loadingId 
          ? { ...msg, text: formatBoldText(botResponse), isLoading: false } 
          : msg
      )
    )

    // Speak the response if voice is enabled
    if (voiceEnabled) {
      speakText(botResponse.replace(/\*/g, ''))
    }
  }

  // Initialize speech recognition - only called when needed, not on component mount
  const initSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsListening(false)
        // Slight delay to allow user to see what was transcribed
        setTimeout(() => {
          handleSubmit()
        }, 500)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        
        // User-friendly error message when permission is denied
        if (event.error === 'not-allowed') {
          setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: "I need permission to access your microphone. Please check your browser settings and try again.", 
            sender: 'bot' 
          }]);
          setMicPermission('denied');
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      console.error('Speech recognition not supported in this browser')
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Voice input is not supported in your browser. Please type your question instead.", 
        sender: 'bot' 
      }]);
    }
  }

  // Toggle speech recognition with permission handling
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
    } else {
      // Initialize speech recognition if not already done
      if (!recognitionRef.current) {
        initSpeechRecognition()
      }
      
      // Request microphone permission explicitly before starting
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          try {
            recognitionRef.current.start()
            setIsListening(true)
            setMicPermission('granted')
          } catch (error) {
            console.error('Error starting speech recognition:', error)
            setIsListening(false)
          }
        })
        .catch(error => {
          console.error('Microphone permission denied:', error)
          setIsListening(false)
          setMicPermission('denied')
          setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: "I need microphone permission to use voice input. Please allow access in your browser settings.", 
            sender: 'bot' 
          }]);
        });
    }
  }

  // Toggle voice output
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  // Text-to-speech function
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported in this browser')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    // Try to use a neutral, clear voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google US English') || 
      voice.name.includes('Microsoft Zira')
    )
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    
    window.speechSynthesis.speak(utterance)
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus on input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Initialize voice synthesis when component mounts
  // Note: Speech recognition is now initialized only on demand
  useEffect(() => {
    // Load voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
    
    // Check microphone permission status if applicable
    if (navigator.permissions && navigator.permissions.query) {
      checkMicrophonePermission();
    }
    
    return () => {
      // Cleanup
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Helper function to get mic button class
  const getMicButtonClass = () => {
    if (isListening) return 'mic-button listening';
    if (micPermission === 'denied') return 'mic-button denied';
    return 'mic-button';
  }

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-avatar-container">
              <svg className="chatbot-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="#55B8FF" strokeWidth="2" />
                <circle cx="8" cy="10" r="1.5" fill="#55B8FF" />
                <circle cx="16" cy="10" r="1.5" fill="#55B8FF" />
                <path d="M7 14C7 14 9 16 12 16C15 16 17 14 17 14" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" />
                <path d="M7.5 4V2" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" />
                <path d="M16.5 4V2" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Anatomy AI Assistant</h3>
            <div className="voice-controls">
              <button 
                className={`voice-toggle ${voiceEnabled ? 'active' : ''}`} 
                onClick={toggleVoice} 
                title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v18M8 8v8M16 8v8M4 10v4M20 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <button className="close-button" onClick={toggleChatbot}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === 'bot' && (
                  <div className="bot-avatar-small">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" fill="#05293f" stroke="#55B8FF" strokeWidth="1" />
                      <circle cx="8.5" cy="10" r="1.5" fill="#55B8FF" />
                      <circle cx="15.5" cy="10" r="1.5" fill="#55B8FF" />
                      <path d="M8 15C8 15 10 17 12 17C14 17 16 15 16 15" stroke="#55B8FF" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <div className={`message-bubble ${message.isLoading ? 'loading' : ''}`}>
                  {message.isLoading ? (
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: message.text }}></span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask about anatomy..."
              value={inputValue}
              onChange={handleInputChange}
              ref={inputRef}
              disabled={isLoading || isListening}
            />
            <button 
              type="button" 
              className={getMicButtonClass()}
              onClick={toggleListening}
              disabled={isLoading}
              title={micPermission === 'denied' ? "Microphone access denied" : "Voice input"}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="submit" disabled={isLoading || isListening || inputValue.trim() === ''}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
      <div className={`chatbot-button ${isOpen ? 'active' : ''}`} onClick={toggleChatbot}>
        {!isOpen && (
           <svg className="chatbot-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="#55B8FF" strokeWidth="2" />
            <circle cx="8" cy="10" r="1.5" fill="#55B8FF" />
            <circle cx="16" cy="10" r="1.5" fill="#55B8FF" />
            <path d="M7 14C7 14 9 16 12 16C15 16 17 14 17 14" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" />
            <path d="M7.5 4V2" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" />
            <path d="M16.5 4V2" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {isOpen && (
          <svg className="chatbot-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="#55B8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <div className="pulse-animation"></div>
      </div>
    </div>
  )
}

export default AnatomyChatbot