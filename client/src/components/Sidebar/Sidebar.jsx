import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HelpSidebar from '../../components/HelpSidebarComponent/Help'
import SettingsSidebar from '../../components/Settings/Settings'
import { Home, HelpCircle, Settings, Users, BookOpen, GraduationCap } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ user }) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('home')
  const [helpSidebarOpen, setHelpSidebarOpen] = useState(false)
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Toggle help sidebar when help button is clicked
  const toggleHelpSidebar = () => {
    setSettingsSidebarOpen(false)
    setHelpSidebarOpen(!helpSidebarOpen)
    setActiveSidebarItem('help')
  }
  
  // Toggle settings sidebar when settings button is clicked
  const toggleSettingsSidebar = () => {
    setHelpSidebarOpen(false)
    setSettingsSidebarOpen(!settingsSidebarOpen)
    setActiveSidebarItem('settings')
  }

  // Handle navigation
  const handleNavigation = (path, item) => {
    setActiveSidebarItem(item)
    if (path) navigate(path)
  }

  // Close sidebars when clicking elsewhere
  useEffect(() => {
    if (activeSidebarItem !== 'help') {
      setHelpSidebarOpen(false)
    }
    if (activeSidebarItem !== 'settings') {
      setSettingsSidebarOpen(false)
    }
  }, [activeSidebarItem])

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <button 
            className={`sidebar-button ${activeSidebarItem === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('/', 'home')}
          >
            <Home size={20} />
            <span className="sidebar-tooltip">Home</span>
          </button>
          
          <button 
            className={`sidebar-button ${activeSidebarItem === 'classes' ? 'active' : ''}`}
            onClick={() => handleNavigation('/classes', 'classes')}
          >
            <GraduationCap size={20} />
            <span className="sidebar-tooltip">Classes</span>
          </button>
          
          <button 
            className={`sidebar-button ${activeSidebarItem === 'teacher-dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('/teacher-dashboard', 'teacher-dashboard')}
          >
            <BookOpen size={20} />
            <span className="sidebar-tooltip">Teacher Dashboard</span>
          </button>
          
          <button 
            className={`sidebar-button ${activeSidebarItem === 'teacher-management' ? 'active' : ''}`}
            onClick={() => handleNavigation('/teacher-management', 'teacher-management')}
          >
            <Users size={20} />
            <span className="sidebar-tooltip">Teacher Management</span>
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
            onClick={toggleSettingsSidebar}
          >
            <Settings size={20} />
            <span className="sidebar-tooltip">Settings</span>
          </button>
        </div>
      </aside>
      
      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-content">
          <button 
            className={`mobile-nav-button ${activeSidebarItem === 'classes' ? 'active' : ''}`}
            onClick={() => handleNavigation('/classes', 'classes')}
          >
            <GraduationCap size={20} />
            <span className="mobile-nav-label">Classes</span>
          </button>
          
          <button 
            className={`mobile-nav-button ${activeSidebarItem === 'teacher-dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('/teacher-dashboard', 'teacher-dashboard')}
          >
            <BookOpen size={20} />
            <span className="mobile-nav-label">Dashboard</span>
          </button>
          
          <button 
            className={`mobile-nav-button ${activeSidebarItem === 'teacher-management' ? 'active' : ''}`}
            onClick={() => handleNavigation('/teacher-management', 'teacher-management')}
          >
            <Users size={20} />
            <span className="mobile-nav-label">Teachers</span>
          </button>
          
          <button 
            className={`mobile-nav-button ${activeSidebarItem === 'help' ? 'active' : ''}`}
            onClick={toggleHelpSidebar}
          >
            <HelpCircle size={20} />
            <span className="mobile-nav-label">Help</span>
          </button>
          
          <button 
            className={`mobile-nav-button ${activeSidebarItem === 'settings' ? 'active' : ''}`}
            onClick={toggleSettingsSidebar}
          >
            <Settings size={20} />
            <span className="mobile-nav-label">Settings</span>
          </button>
        </div>
      </nav>
      
      {/* Help Sidebar */}
      {helpSidebarOpen && (
        <HelpSidebar 
          isOpen={helpSidebarOpen} 
          onClose={() => {
            setHelpSidebarOpen(false)
            setActiveSidebarItem('home')
          }} 
        />
      )}
      
      {/* Settings Sidebar */}
      {settingsSidebarOpen && (
        <SettingsSidebar 
          isOpen={settingsSidebarOpen} 
          onClose={() => {
            setSettingsSidebarOpen(false)
            setActiveSidebarItem('home')
          }}
          userData={user}
        />
      )}
    </>
  )
}

export default Sidebar