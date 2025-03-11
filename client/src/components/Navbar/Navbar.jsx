import { useState } from 'react'
import { Search, User } from 'lucide-react'

const Navbar = ({ user }) => { 
  const [searchActive, setSearchActive] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <span className="logo-text">Logo</span>
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
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.name} 
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <User size={18} />
              </div>
            )}
          </div>
          <span className="user-name">{user?.name}</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar