// App.jsx
import React from 'react'
import { Home } from 'lucide-react'
import './Home.css';

const Homepage = () => {
  const topics = [
    "Skeletal System",
    "Muscular System",
    "Nervous System",
    "Cardiovascular System",
    "Respiratory System"
  ]

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">Logo</div>
          <div className="search-container">
            <input type="search" placeholder="Search..." className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </nav>

      <aside className="sidebar">
        <button className="sidebar-button">
          <Home />
        </button>
        <button className="sidebar-button">
          📚
        </button>
      </aside>

      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Interactive Human<br />
            Anatomy
          </h1>
          <img src="skull rin.png" alt="Skull" className='skull-icon'/>
        </div>

        <div className="topics-grid">
          {topics.map((topic, index) => (
            <div key={index} className="topic-card">
              {topic}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Homepage