import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HelpSidebar from '../../components/HelpSidebarComponent/Help'
import SettingsSidebar from '../../components/Settings/Settings'
import { Home, HelpCircle, Settings, Users, BookOpen, BookOpenCheck, GraduationCap, LayoutDashboard, AlertTriangle } from 'lucide-react'
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
            onClick={() => handleNavigation('/home', 'home')}
          >
            <Home size={20} />
            <span className="sidebar-tooltip">Home</span>
          </button>
          
          { user.role  === 'student'  &&   
            <button 
              className={`sidebar-button ${activeSidebarItem === 'classes' ? 'active' : ''}`}
              onClick={() => handleNavigation('/student-classes', 'classes')}
            >
              <GraduationCap size={20} />
              <span className="sidebar-tooltip">Classes</span>
            </button>
          }
          
          { user.role === 'teacher' &&  
            <button 
              className={`sidebar-button ${activeSidebarItem === 'teacher-dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigation('/teacher-dashboard', 'teacher-dashboard')}
            >
              <BookOpen size={20} />
              <span className="sidebar-tooltip">Teacher Dashboard</span>
            </button>
          }
          
          { user.role === 'admin'  &&  
            <>
              <button 
                className={`sidebar-button ${activeSidebarItem === 'admin-dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigation('/admin-dashboard', 'admin-dashboard')}
              >
                <LayoutDashboard size={20} />
                <span className="sidebar-tooltip">Admin Dashboard</span>
              </button>
              <button 
                className={`sidebar-button ${activeSidebarItem === 'teacher-management' ? 'active' : ''}`}
                onClick={() => handleNavigation('/teacher-management', 'teacher-management')}
              >
                <Users size={20} />
                <span className="sidebar-tooltip">Teacher Management</span>
              </button>
              <button 
                className={`sidebar-button ${activeSidebarItem === 'issue-fetching' ? 'active' : ''}`}
                onClick={() => handleNavigation('/issues', 'issue-fetching')}
              >
                <AlertTriangle size={20} />
                <span className="sidebar-tooltip">Issue Fetching</span>
              </button>
            </>
          }

          <button 
            className={`sidebar-button ${activeSidebarItem === 'e-learning' ? 'active' : ''}`}
            onClick={() => handleNavigation('/e-learning', 'e-learning')}
          >
            <BookOpenCheck size={20} />
            <span className="sidebar-tooltip">E-Learning</span>
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
          { user.role === 'student' && 
            <button 
              className={`mobile-nav-button ${activeSidebarItem === 'classes' ? 'active' : ''}`}
              onClick={() => handleNavigation('/student-classes', 'classes')}
            >
              <GraduationCap size={20} />
              <span className="mobile-nav-label">Classes</span>
            </button>
          }
          
          { user.role === 'teacher' &&
            <button 
              className={`mobile-nav-button ${activeSidebarItem === 'teacher-dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigation('/teacher-dashboard', 'teacher-dashboard')}
            >
              <BookOpen size={20} />
              <span className="mobile-nav-label">Dashboard</span>
            </button>
          }
          
          { user.role === 'admin' && 
            <>
              <button 
                className={`mobile-nav-button ${activeSidebarItem === 'admin-dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigation('/admin-dashboard', 'admin-dashboard')}
              >
                <LayoutDashboard size={20} />
                <span className="mobile-nav-label">Admin</span>
              </button>
              <button 
                className={`mobile-nav-button ${activeSidebarItem === 'teacher-management' ? 'active' : ''}`}
                onClick={() => handleNavigation('/teacher-management', 'teacher-management')}
              >
                <Users size={20} />
                <span className="mobile-nav-label">Teachers</span>
              </button>
              <button 
                className={`mobile-nav-button ${activeSidebarItem === 'issue-fetching' ? 'active' : ''}`}
                onClick={() => handleNavigation('/issues', 'issue-fetching')}
              >
                <AlertTriangle size={20} />
                <span className="mobile-nav-label">Issues</span>
              </button>
            </>
          }

          <button 
            className={`mobile-nav-button ${activeSidebarItem === 'e-learning' ? 'active' : ''}`}
            onClick={() => handleNavigation('/e-learning', 'e-learning')}
          >
            <BookOpenCheck size={20} />
            <span className="mobile-nav-label">E-Learning</span>
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