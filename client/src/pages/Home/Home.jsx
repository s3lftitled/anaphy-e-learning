import { useState, useEffect } from 'react'
import AnatomyChatbot from '../../components/ChatbotComponent/Chatbot'
import './Home.css'
import { useUser } from '../../context/UserContext'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'

const Homepage = () => {
  const topics = [
    { name: "Skeletal System", icon: "🦴" },
    { name: "Muscular System", icon: "💪" },
    { name: "Nervous System", icon: "🧠" },
    { name: "Cardiovascular System", icon: "❤️" },
    { name: "Respiratory System", icon: "🫁" }
  ]
  
  const { user } = useUser()
 
  return (
    <div className="homepage">
      <AnatomyChatbot />
      <Navbar user={user}/>
      <Sidebar user={user}/>
      
      <main className="main-content">
        <div className="hero-section">
          <div className="head-content">
            <h1 className="home-title">
              Interactive Human<br />
              <span className="hero-highlight">Anatomy</span>
            </h1>
            <p className="hero-subtitle">Explore the human body through our interactive e-learning</p>
          </div>
          <div className="hero-image">
            <img src="hero-skull.png" alt="Skull" className="skull-icon" />
            <div className="pulse-effect"></div>
          </div>
        </div>
        
        <h2 className="section-title">Body Systems</h2>
        
        <div className="topics-grid">
          {topics.map((topic, index) => (
            <div key={index} className="topic-card">
              <div className="topic-icon">{topic.icon}</div>
              <div className="topic-info">
                <h3 className="topic-title">{topic.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Homepage