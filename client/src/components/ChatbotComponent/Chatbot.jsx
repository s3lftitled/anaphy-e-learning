import { useState, useRef, useEffect } from 'react'
import './Chatbot.css'

const AnatomyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your Anatomy AI Assistant. Ask me any questions about human anatomy, body systems, or medical terminology.", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const groqApiKey = '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'

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

  const callGroqApi = async (userMessage) => {
    if (!groqApiKey) {
      return "API key is missing. Please provide a valid Groq API key.";
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
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
    e.preventDefault();
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
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || inputValue.trim() === ''}>
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