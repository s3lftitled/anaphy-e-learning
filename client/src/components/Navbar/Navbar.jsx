import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, ChevronDown } from 'lucide-react'
import './Navbar.css'
import { getUserInitials } from '../../utils/getUserInitials'
import usePrivateApi from '../../hooks/usePrivateApi'
import useAuth from '../../hooks/useAuth'

const Navbar = ({ user }) => { 
  const [searchActive, setSearchActive] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const privateAxios = usePrivateApi()
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await privateAxios.delete('auth/api/v1/log-out')

      if (response.status === 200) {
        setAuth({ accessToken: null})
        navigate('/login')
      }
    } catch (error) {
      alert('Error logging out')
    }
  }

  return (
    <nav className="home-navbar">
      <div className="home-nav-content">
        <div className="logo">
          <span className="logo-text">ANATOMY</span>
          <div className="logo-underline"></div>
        </div>
        
        <div 
          className="user-profile"
          onClick={(e) => {
            e.stopPropagation()
            setShowDropdown(!showDropdown)
          }}
        >
          <div className="user-avatar-wrapper">
            <div className="user-status-indicator"></div>
            <div className="user-avatar">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.name || 'User profile'} 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user.name ? getUserInitials(user) : <User size={16} />}
                </div>
              )}
            </div>
          </div>
          
          <div className="user-info">
            <span className="user-name">{user?.name || 'Guest'}</span>
            <span className="user-role">{user?.role || 'Member'}</span>
          </div>
          
          <ChevronDown 
            size={16} 
            className={`dropdown-arrow ${showDropdown ? 'active' : ''}`} 
          />
          
          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-item logout" onClick={handleLogout}>Sign out</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar