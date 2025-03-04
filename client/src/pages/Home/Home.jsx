import { useState, useEffect } from 'react'
import { Home, BookOpen, Search, User } from 'lucide-react'
import './Home.css'
import { useUser } from '../../context/UserContext'

const Homepage = () => {
  const topics = [
    { name: "Skeletal System", icon: "🦴" },
    { name: "Muscular System", icon: "💪" },
    { name: "Nervous System", icon: "🧠" },
    { name: "Cardiovascular System", icon: "❤️" },
    { name: "Respiratory System", icon: "🫁" }
  ]

  const { user } = useUser()
  const [searchActive, setSearchActive] = useState(false)


  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-text">LOGO</span>
            <div className="logo-underline"></div>
          </div>
          
          <div className={`search-container ${searchActive ? 'active' : ''}`}>
            <Search className="search-icon" size={18} onClick={() => setSearchActive(!searchActive)} />
            <input 
              type="search" 
              placeholder="Search anatomy topics..." 
              className="search-input" 
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
            />
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <span className="user-name">{user?.name}</span>
          </div>
        </div>
      </nav>

      <aside className="sidebar">
        <div className="sidebar-top">
          <button className="sidebar-button active">
            <Home size={20} />
            <span className="sidebar-tooltip">Home</span>
          </button>
          <button className="sidebar-button">
            <BookOpen size={20} />
            <span className="sidebar-tooltip">Library</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Interactive Human<br />
              <span className="hero-highlight">Anatomy</span>
            </h1>
            <p className="hero-subtitle">Explore the human body through our interactive e-learning</p>
          </div>
          <div className="hero-image">
            <img src="skull rin.png" alt="Skull" className="skull-icon" />
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