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
  const [teacherMgmtSidebarOpen, setTeacherMgmtSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Toggle help sidebar when help button is clicked
  const toggleHelpSidebar = () => {
    setSettingsSidebarOpen(false)
    setTeacherMgmtSidebarOpen(false)
    setHelpSidebarOpen(!helpSidebarOpen)
    setActiveSidebarItem('help')
  }
  
  // Toggle settings sidebar when settings button is clicked
  const toggleSettingsSidebar = () => {
    setHelpSidebarOpen(false)
    setTeacherMgmtSidebarOpen(false)
    setSettingsSidebarOpen(!settingsSidebarOpen)
    setActiveSidebarItem('settings')
  }

  // Close sidebars when clicking elsewhere
  useEffect(() => {
    if (activeSidebarItem !== 'help') {
      setHelpSidebarOpen(false);
    }
    if (activeSidebarItem !== 'settings') {
      setSettingsSidebarOpen(false)
    }
  }, [activeSidebarItem])

  return (
    <>
      <aside className="sidebar">
      <div className="sidebar-top">
        <button 
          className={`sidebar-button ${activeSidebarItem === 'home' ? 'active' : ''}`}
          onClick={() => setActiveSidebarItem('home')}
        >
          <Home size={20} />
          <span className="sidebar-tooltip">Home</span>
        </button>
        
        {/* Class Icon */}
        <button 
          className={`sidebar-button ${activeSidebarItem === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveSidebarItem('classes')}
        >
          <GraduationCap size={20} />
          <span className="sidebar-tooltip">Classes</span>
        </button>
        
        {/* Teacher Dashboard Icon */}
        <button 
          className='sidebar-button'
          onClick={() => navigate('/teacher-dashboard')}
        >
          <BookOpen size={20} />
          <span className="sidebar-tooltip">Teacher Dashboard</span>
        </button>
        
        {/* Admin Icon for Teacher Management */}
        <button 
          className='sidebar-button'
          onClick={() => navigate('/teacher-management')}
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