import { useState, useEffect } from 'react'
import { Home, HelpCircle, Search, User, Settings } from 'lucide-react'
import AnatomyChatbot from '../../components/ChatbotComponent/Chatbot'
import HelpSidebar from '../../components/HelpSidebarComponent/Help'
import './Home.css'
import { useUser } from '../../context/UserContext'
import Navbar from '../../components/Navbar/Navbar'

const Homepage = () => {
  const topics = [
    { name: "Skeletal System", icon: "🦴" },
    { name: "Muscular System", icon: "💪" },
    { name: "Nervous System", icon: "🧠" },
    { name: "Cardiovascular System", icon: "❤️" },
    { name: "Respiratory System", icon: "🫁" }
  ];
  
  const { user } = useUser();
  const [searchActive, setSearchActive] = useState(false)
  const [activeSidebarItem, setActiveSidebarItem] = useState('home')
  const [helpSidebarOpen, setHelpSidebarOpen] = useState(false)
  
  // Toggle help sidebar when help button is clicked
  const toggleHelpSidebar = () => {
    setHelpSidebarOpen(!helpSidebarOpen)
    setActiveSidebarItem('help')
  }

  // Close help sidebar when clicking elsewhere
  useEffect(() => {
    if (activeSidebarItem !== 'help') {
      setHelpSidebarOpen(false);
    }
  }, [activeSidebarItem]);

  return (
    <div className="homepage">
      <AnatomyChatbot />
      <Navbar user={user}/>
      
      <aside className="sidebar">
        <div className="sidebar-top">
          <button 
            className={`sidebar-button ${activeSidebarItem === 'home' ? 'active' : ''}`}
            onClick={() => setActiveSidebarItem('home')}
          >
            <Home size={20} />
            <span className="sidebar-tooltip">Home</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <button 
            className={`sidebar-button ${activeSidebarItem === 'help' ? 'active' : ''}`}
            onClick={toggleHelpSidebar}
          >
            <HelpCircle size={20} />
            <span className="sidebar-tooltip">Help</span>
          </button>
          <button 
            className={`sidebar-button ${activeSidebarItem === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSidebarItem('settings')}
          >
            <Settings size={20} />
            <span className="sidebar-tooltip">Settings</span>
          </button>
        </div>
      </aside>
      
      {/* Help Sidebar */}
      <HelpSidebar 
        isOpen={helpSidebarOpen} 
        onClose={() => {
          setHelpSidebarOpen(false)
          setActiveSidebarItem('home')
        }} 
      />
      
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