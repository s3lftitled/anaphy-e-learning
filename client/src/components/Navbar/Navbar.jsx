import { useState, useEffect } from 'react'
import { Search, User, ChevronDown } from 'lucide-react'
import './Navbar.css'

const Navbar = ({ user }) => { 
  const [searchActive, setSearchActive] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  
  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!user?.name) return ''
    return user.name.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [])

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <span className="logo-text">Logo</span>
          <div className="logo-underline"></div>
        </div>
        
        <div className={`search-container ${searchActive ? 'active' : ''}`}>
          <Search className="search-icon" size={18} />
          <input
            type="search"
            placeholder="Search anatomy topics..."
            className="search-input"
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
          />
        </div>
        
        <div 
          className="user-profile"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
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
                  {user.name ? getUserInitials() : <User size={16} />}
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
              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Settings</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout">Sign out</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar