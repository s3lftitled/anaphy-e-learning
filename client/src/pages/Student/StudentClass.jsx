import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Book, 
  Clock, 
  MessageSquare, 
  User, 
  AlertCircle, 
  ChevronLeft,
  Users,
  Calendar,
  Hash,
  Mail,
  Check,
  X
} from 'lucide-react'
import './StudentClass.css'
import usePrivateApi from '../../hooks/usePrivateApi'
import { useUser } from '../../context/UserContext'

const StudentClass = () => {
  const [userClasses, setUserClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const privateAxios = usePrivateApi()
  const { user } = useUser()
  
  // Fetch user's classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true)
      try {
        const response = await privateAxios.get(`class/api/v1/fetch-joined-classes/${user.id}`)

        if (response.status === 200) {
          setUserClasses(response.data.joinedClasses)
        }
      } catch (error) {
        console.error('Error fetching classes:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchClasses()
  }, [user, privateAxios])
  
  // Fetch user's class invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      setLoadingInvitations(true)
      try {
        const response = await privateAxios.get(`class/api/v1/fetch-class-invites/${user.id}`)
        
        if (response.status === 200) {
          setInvitations(response.data.studentInvitations)
        }
      } catch (error) {
        console.error('Error fetching class invitations:', error)
      } finally {
        setLoadingInvitations(false)
      }
    }
    
    fetchInvitations()
  }, [user, privateAxios])
  
  // Search for a class by code
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return
    
    setSearching(true)
    setSearchError('')
    setSearchResult(null)
    
    try {
      const response = await privateAxios.get("class/api/v1/search-class", {
        params: { classCode: searchCode }
      }, { withCredentials: true })
      
      if (response) {
        setSearchResult(response.data.searchedClass)
      } else {
        setSearchError(`No class found with code: ${searchCode}`)
      }
    } catch (error) {
      setSearchError(error.response.data.message || 'Error searching for class')
    } finally {
      setSearching(false)
    }
  }
  
  // Join a class
  const handleJoinClass = async () => {
    if (!searchResult) return
    
    try {
      const response = await privateAxios.post(
        `class/api/v1/join-class/${user?.id}/`, 
        { classCode: searchResult.classCode }, 
        { withCredentials: true }
      )
      
      if (response.status === 200) {
        // Show success toast instead of alert
        const updatedClasses = await privateAxios.get(`class/api/v1/fetch-joined-classes/${user.id}`)
        setUserClasses(updatedClasses.data.joinedClasses)
        alert('Request sent to the teacher')
        setSearchResult(null)
        setSearchCode('')
      }
    } catch (error) {
      setSearchError(error.response.data.message || 'Error joining class')
    }
  }
  
  // Handle invitation response (accept/reject)
  const handleInvitationResponse = async (invitationId, action) => {
    try {
      let endpoint
      let method
      
      // Choose the appropriate endpoint based on action
      if (action === 'accept') {
        method = 'put'
        endpoint = `class/api/v1/accept-invite/${user.id}/${invitationId}`
      } else if (action === 'reject') {
        method = 'delete'
        endpoint = `class/api/v1/reject-invite/${user.id}/${invitationId}`
      } else {
        throw new Error('Invalid action specified')
      }

      console.log(method)
      
      const response = await privateAxios[method](
        endpoint, {},
        { withCredentials: true }
      )
      
      if (response.status === 200) {
        // Refresh invitations list
        const updatedInvitations = await privateAxios.get(`class/api/v1/fetch-class-invites/${user.id}`)
        setInvitations(updatedInvitations.data.studentInvitations)
        
        // If accepted, refresh classes list
        if (action === 'accept') {
          const updatedClasses = await privateAxios.get(`class/api/v1/fetch-joined-classes/${user.id}`)
          setUserClasses(updatedClasses.data.joinedClasses)
        }
        
        alert(`Invitation ${action === 'accept' ? 'accepted' : 'rejected'} successfully`)
      }
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error)
      alert(`Error ${action}ing invitation. Please try again.`)
    }
  }

  // View class details
  const handleViewClass = async (classItem) => {
    setSelectedClass(classItem)
    setLoadingAnnouncements(true)
    
    try {
      const response = await privateAxios.get(`class/api/v1/fetch-announcements/${classItem._id}`)

      if (response.status === 200) {
        setAnnouncements(response.data.announcements)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoadingAnnouncements(false)
    }
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options)
  }
  
  // Get timeago string
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  // Back to classes listing
  const handleBackToClasses = () => {
    setSelectedClass(null)
    setAnnouncements([])
  }

  return (
    <div className="classes-page">
      <main className="classes-content">
        <div className="join-class-section">
          <h2><Users size={20} /> Join a Class</h2>
          <form onSubmit={handleSearch} className="class-search-form">
            <div className="search-input-container">
              <input 
                type="text" 
                placeholder="Enter class code (e.g., MATH303 or PHYS101)" 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="class-search-input"
              />
              <button type="submit" className="search-button" disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
                {!searching && <Search size={16} />}
              </button>
            </div>
          </form>
          
          {searchError && (
            <div className="search-error">
              <AlertCircle size={16} />
              <span>{searchError}</span>
            </div>
          )}
          
          {searchResult && (
            <div className="search-result">
              <div className="search-result-class" style={{ borderLeftColor: searchResult.color || '#8b5cf6' }}>
                <div>
                  <h3>{searchResult.className}</h3>
                  <p>Teacher: {searchResult.classTeacher}</p>
                  <p>Code: {searchResult.classCode}</p>
                </div>
                <button onClick={handleJoinClass} className="join-button">Join Class</button>
              </div>
            </div>
          )}
        </div>
        
        {selectedClass ? (
          // Class Detail View
          <div className="class-detail-container">
            <div className="class-detail-header">
              <button className="back-button" onClick={handleBackToClasses}>
                <ChevronLeft size={16} /> Back to Classes
              </button>
              <h1>{selectedClass?.name}</h1>
              <p className="class-code"><Hash size={14} /> {selectedClass?.code}</p>
            </div>
            
            <div className="class-detail-body">
              <div className="class-info-section">
                <div className="info-card">
                  <div className="info-card-header">
                    <User size={20} />
                    <h3>Teacher</h3>
                  </div>
                  <p>{selectedClass.teacher.name}</p>
                </div>
                
                <div className="info-card">
                  <div className="info-card-header">
                    <Book size={20} />
                    <h3>Description</h3>
                  </div>
                  <p>{selectedClass?.description || "No description available."}</p>
                </div>
                
                {selectedClass?.joinedDate && (
                  <div className="info-card">
                    <div className="info-card-header">
                      <Calendar size={20} />
                      <h3>Joined Date</h3>
                    </div>
                    <p>{new Date(selectedClass?.joinedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              <div className="announcements-section">
                <div className="section-header">
                  <MessageSquare size={20} />
                  <h2>Announcements</h2>
                </div>
                
                {loadingAnnouncements ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading announcements...</p>
                  </div>
                ) : announcements.length > 0 ? (
                  <div className="announcements-list">
                    {announcements.map(announcement => (
                      <div key={announcement.id} className="announcement-card">
                        <div className="announcement-header">
                          <h3>{announcement.title}</h3>
                          <span className="announcement-date">{getTimeAgo(announcement.createdAt)}</span>
                        </div>
                        <div className="announcement-details">
                        <div className="announcement-content">{announcement.message}</div>
                          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                            {formatDate(announcement.createdAt)}
                          </span>
                        </div>
                       
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <AlertCircle size={28} />
                    <p>No announcements yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Classes Listing View
          <>
            <div className="classes-header">
              <h1>My Classes</h1>
            </div>
            
            {/* Class Invitations Section */}
            <div className="invitations-section">
              <h2><Mail size={20} /> Class Invitations</h2>
              {loadingInvitations ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading invitations...</p>
                </div>
              ) : invitations && invitations.length > 0 ? (
                <div className="invitations-list">
                  {invitations.map(invitation => (
                    <div key={invitation._id} className="invitation-card">
                      <div className="invitation-details">
                        <h3>{invitation.classId.name}</h3>
                        <p><Hash size={14} /> {invitation.classCode}</p>
                        <p><Clock size={14} /> Invited {getTimeAgo(invitation.invitedAt)}</p>
                      </div>
                      <div className="invitation-actions">
                        <button 
                          className="accept-button"
                          onClick={() => handleInvitationResponse(invitation.classId._id, 'accept')}
                        >
                          <Check size={16} /> Accept
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => handleInvitationResponse(invitation.classId._id, 'reject')}
                        >
                          <X size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Mail size={28} />
                  <p>No pending class invitations.</p>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your classes...</p>
              </div>
            ) : (
              <div className="classes-container">
                {userClasses.length > 0 ? (
                  <>
                    <h2><Book size={20} /> Joined Classes</h2>
                    <div className="classes-grid">
                      {userClasses.map(classItem => (
                        <div 
                          key={classItem._id} 
                          className="class-card" 
                          onClick={() => handleViewClass(classItem)}
                        >
                          <div className="class-card-header" style={{ backgroundColor: classItem.color || 'var(--primary)' }}>
                            <h3 className="class-name">{classItem.name}</h3>
                            <p className="class-teacher"><User size={14} /> {classItem.teacher.name}</p>
                          </div>
                          <div className="class-card-body">
                            <p className="class-description">
                              {classItem.description || "No description available for this class."}
                            </p>
                            <div className="class-meta">
                              <span className="class-code"><Hash size={14} /> {classItem.code}</span>
                              <span className="joined-date"><Calendar size={14} /> {new Date(classItem.joinedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="no-classes-message">
                    <AlertCircle size={48} />
                    <h2>You haven't joined any classes yet</h2>
                    <p>Search for a class code above to join a class</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default StudentClass