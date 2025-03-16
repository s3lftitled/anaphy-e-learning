import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { getUserInitials } from '../../utils/getUserInitials'
import { useUser } from '../../context/UserContext'
import './TeacherDashboard.css'
import usePrivateApi from '../../hooks/usePrivateApi'
import FloatingHomeButton from '../../components/FloatingHomeButton/FloatingHomeButton'

const TeacherDashboard = () => {
  // State for classes data
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeClass, setActiveClass] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteMethod, setInviteMethod] = useState('email')
  const [inviteEmail, setInviteEmail] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { user } = useUser()
  const [error, setError] = useState(null)
  const privateAxios = usePrivateApi()
  
  // New state for announcements and join requests
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false)
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false)
  const [showJoinRequestsModal, setShowJoinRequestsModal] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementContent, setAnnouncementContent] = useState('')
  const navigate = useNavigate()

  // Fetch classes data from API
  useEffect(() => {
    if (user && user.id) {
      console.log(user)
      fetchClasses()
    }
  }, [user, user.id])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      
      // Replace with your actual API endpoint
      const response = await privateAxios.get(`class/api/v1/fetch-teacher-classes/${user.id}`, {}, { 
        withCredentials: true
      })
      
      const { classesDetails } = response.data
      
      // Transform the API response to match our component's expected structure
      const transformedClasses = classesDetails.map(cls => ({
        id: cls._id,
        name: cls.name,
        code: cls.code,
        createdAt: cls.createdAt || new Date().toISOString().split('T')[0], // Default if not provided
        students: cls.students.map(student => ({
          id: student._id,
          name: student.name,
          email: student.email,
          status: student.status,
          lastActive: student.lastActive || null
        })),
      }))
      
      setClasses(transformedClasses)
      
      // Set first class as active if available
      if (transformedClasses.length > 0) {
        setActiveClass(transformedClasses[0])
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching classes:", error)
      setError("Failed to load classes. Please try again later.")
      setLoading(false)
    }
  }

  const handleClassSelect = (classData) => {
    setActiveClass(classData)
  }

  const handleInviteStudent = async (e) => {
    e.preventDefault()
    if (!inviteEmail) return
    
    try {
      // Call API to invite student
      const response = await fetch(`/api/classes/${activeClass.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: inviteEmail })
      })
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const data = await response.json()
      
      // Update the local state with the newly invited student
      const newStudent = {
        id: data.student._id,
        name: data.student.name,
        email: data.student.email,
        status: 'invited',
        lastActive: null
      }

      // Update the active class with the new student
      const updatedClass = {
        ...activeClass,
        students: [...activeClass.students, newStudent]
      }

      // Update classes array
      const updatedClasses = classes.map(c => 
        c.id === activeClass.id ? updatedClass : c
      )

      setClasses(updatedClasses)
      setActiveClass(updatedClass)
      setInviteEmail('')
      setShowInviteModal(false)
    } catch (error) {
      console.error("Error inviting student:", error)
      alert("Failed to invite student. Please try again.")
    }
  }

  // New functions for announcements and join requests
  const fetchAnnouncements = async () => {
    if (!activeClass) return

    try {
      const response = await privateAxios.get(`/class/api/v1/fetch-announcements/${user.id}/${activeClass.id}`, {
        withCredentials: true
      })
      
      console.log(response)
      setAnnouncements(response.data.announcements || [])
      setShowAnnouncementsModal(true)
    } catch (error) {
      console.error("Error fetching announcements:", error)
      alert("Failed to load announcements. Please try again.")
    }
  }

  const fetchJoinRequests = async () => {
    if (!activeClass) return

    try {
      const response = await privateAxios.get(`/class/api/v1/fetch-pending-approvals/${activeClass.id}`, {
        withCredentials: true
      })

      setJoinRequests(response.data?.pendingApprovals || [])
      console.log(response.data?.pendingApprovals)
      setShowJoinRequestsModal(true)
    } catch (error) {
      console.error("Error fetching join requests:", error)
      alert("Failed to load join requests. Please try again.")
    }
  }

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    if (!announcementTitle || !announcementContent || !activeClass) return

    try {
      const response = await privateAxios.post(`/class/api/v1/create-class-announcement/${user.id}/${activeClass.id}`, {
        title: announcementTitle,
        message: announcementContent
      }, {
        withCredentials: true
      })
      
      if (response.status === 201) {
        // Update the active class with new announcement count
        const updatedClass = {
          ...activeClass,
          announcements: (activeClass.announcements || 0) + 1
        }

        // Update classes array
        const updatedClasses = classes.map(c => 
          c.id === activeClass.id ? updatedClass : c
        )

        setClasses(updatedClasses)
        setActiveClass(updatedClass)
        setAnnouncementTitle('')
        setAnnouncementContent('')
        setShowCreateAnnouncementModal(false)
        alert("Announcement created successfully!")
      }
    } catch (error) {
      console.error("Error creating announcement:", error)
      alert("Failed to create announcement. Please try again.")
    }
  }

  const handleJoinRequestAction = async (requestId, action) => {
    try {
      console.log(requestId)
      const studentId = requestId
      const classId = activeClass.id
      
      if (!studentId) {
        throw new Error("Student ID not found in request data")
      }
      
      if (action === 'accept') {
        await privateAxios.put(`/class/api/v1/accept-pending-approval/${classId}/${studentId}`, {}, {
          withCredentials: true
        })
      } else if (action === 'reject') {
        await privateAxios.delete(`/class/api/v1/reject-pending-approval/${classId}/${studentId}`, {
          withCredentials: true
        })
      }
      
      // Update join requests list
      setJoinRequests(joinRequests.filter(req => req.id !== requestId))
      
      // If accepted, update students list
      if (action === 'accept') {
        const acceptedStudent = joinRequests.find(req => req.id === requestId)
        if (acceptedStudent) {
          const newStudent = {
            id: acceptedStudent.studentId,
            name: acceptedStudent.studentName,
            email: acceptedStudent.studentEmail,
            status: 'joined',
            lastActive: null
          }
          
          // Update active class
          const updatedClass = {
            ...activeClass,
            students: [...activeClass.students, newStudent]
          }
          
          // Update classes array
          const updatedClasses = classes.map(c => 
            c.id === activeClass.id ? updatedClass : c
          )
          
          setClasses(updatedClasses)
          setActiveClass(updatedClass)
        }
      }
      
      alert(`Student ${action === 'accept' ? 'accepted' : 'rejected'} successfully!`)
    } catch (error) {
      console.error(`Error ${action}ing join request:`, error)
      alert(`Failed to ${action} student. Please try again.`)
    }
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'joined': return 'status-joined'
      case 'invited': return 'status-invited'
      case 'rejected': return 'status-rejected'
      default: return ''
    }
  }

  // Filter students based on search and status filter
  const filteredStudents = activeClass?.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesFilter
  }) || []

  // Calculate class statistics
  const getClassStats = () => {
    if (!activeClass) return { total: 0, joined: 0, invited: 0, rejected: 0 }
    
    const stats = {
      total: activeClass.students.length,
      joined: activeClass.students.filter(s => s.status === 'joined').length,
      invited: activeClass.students.filter(s => s.status === 'invited').length,
      rejected: activeClass.students.filter(s => s.status === 'rejected').length
    }
    
    return stats
  }

  const stats = getClassStats()

  if (error) {
    return <div className="error-container">{error}</div>
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="teacher-profile">
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
          <div className="teacher-info">
            <h3>{user.name}</h3>
            <p>Anatomy Teacher</p>
          </div>
        </div>
        
        <div className="sidebar-divider"></div>
        
        <div className="sidebar-header">
          <h3>My Classes</h3>
          <button className="new-class-btn" onClick={() => window.location.href = '/teacher-class-page'}>+</button>
        </div>
        
        <div className="classes-list">
          {classes.length > 0 ? (
            classes.map(cls => (
              <div 
                key={cls.id} 
                className={`class-item ${activeClass?.id === cls.id ? 'active' : ''}`}
                onClick={() => handleClassSelect(cls)}
              >
                <div className="class-item-icon">{cls.name.charAt(0)}</div>
                <div className="class-item-details">
                  <h4>{cls.name}</h4>
                  <p>{cls.students.length} students</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-classes">
              <p>No classes found. Create a new class to get started.</p>
            </div>
          )}
        </div>
        
        <div className="sidebar-footer">
          <button className="sidebar-btn">Sign Out</button>
        </div>
      </div>
      
      <div className="dashboard-main">
        {activeClass ? (
          <>
            <div className="dashboard-header">
              <div className="header-info">
                <h1>{activeClass.name}</h1>
                <div className="class-meta">
                  <span className="class-code">Class Code: {activeClass.code}</span>
                  <span className="class-date">Created: {activeClass.createdAt}</span>
                </div>
              </div>
              <div className="header-actions">
                <button 
                  className="action-btn view-announcements-btn"
                  onClick={fetchAnnouncements}
                >
                  View Announcements
                </button>
                <button 
                  className="action-btn create-announcement-btn"
                  onClick={() => setShowCreateAnnouncementModal(true)}
                >
                  Create Announcement
                </button>
                <button 
                  className="action-btn join-requests-btn"
                  onClick={fetchJoinRequests}
                >
                  Pending Approvals
                </button>
                <button 
                  className="invite-btn"
                  onClick={() => setShowInviteModal(true)}
                >
                  Invite Students
                </button>
              </div>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.joined}</div>
                <div className="stat-label">Active Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.invited}</div>
                <div className="stat-label">Pending Invites</div>
              </div>
            </div>
            
            <div className="students-section">
              <div className="section-header">
                <h2>Students</h2>
                <div className="filter-controls">
                  <div className="search-container">
                    <input 
                      type="text" 
                      placeholder="Search students..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                  </div>
                  <select 
                    className="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Students</option>
                    <option value="joined">Active</option>
                    <option value="invited">Invited</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="students-table">
                <div className="table-header">
                  <div className="col-name">Name</div>
                  <div className="col-email">Email</div>
                  <div className="col-status">Status</div>
                  <div className="col-activity">Last Activity</div>
                  <div className="col-actions">Actions</div>
                </div>
                
                <div className="table-body">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <div key={student.id} className="table-row">
                        <div className="col-name">{student.name}</div>
                        <div className="col-email">{student.email}</div>
                        <div className={`col-status ${getStatusClass(student.status)}`}>
                          {student.status}
                        </div>
                        <div className="col-activity">
                          {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'Never'}
                        </div>
                        <div className="col-actions">
                          <button className="action-icon view-btn">👁️</button>
                          <button className="action-icon email-btn">✉️</button>
                          <button className="action-icon remove-btn">❌</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-table">
                      <p>No students found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-dashboard">
            <h2>Welcome to Your Teacher Dashboard</h2>
            <p>Select a class from the sidebar or create a new class to get started.</p>
          </div>
        )}
      </div>
      
     {/* Invite Student Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Invite Students</h2>
              <button className="close-btn" onClick={() => setShowInviteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="invite-tabs">
                <button 
                  className={`invite-tab-btn ${inviteMethod === 'email' ? 'active' : ''}`}
                  onClick={() => setInviteMethod('email')}
                >
                  Via Email
                </button>
                <button 
                  className={`invite-tab-btn ${inviteMethod === 'code' ? 'active' : ''}`}
                  onClick={() => setInviteMethod('code')}
                >
                  Via Code
                </button>
              </div>
              
              {inviteMethod === 'email' ? (
                <form onSubmit={handleInviteStudent}>
                  <div className="form-group">
                    <label>Student Email:</label>
                    <input 
                      type="email" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter student email"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
                    <button type="submit" className="submit-btn">Send Invitation</button>
                  </div>
                </form>
              ) : (
                <div className="class-code-section">
                  <p className="code-instructions">Share this code with your students. They can join your class using this code.</p>
                  <div className="class-code-display">
                    <span>{activeClass.code}</span>
                    <button 
                      className="copy-btn" 
                      onClick={() => {navigator.clipboard.writeText(activeClass.code); alert('Code copied to clipboard!');}}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* View Announcements Modal */}
      {showAnnouncementsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Class Announcements</h2>
              <button className="close-btn" onClick={() => setShowAnnouncementsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {announcements.length > 0 ? (
                <div className="announcements-list">
                  {announcements.map(announcement => (
                    <div className="announcement-item">
                      <h3>{announcement.title}</h3>
                      <p className="announcement-date">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                      <p className="announcement-content">{announcement.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-announcements">
                  <p>No announcements have been made for this class yet.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowAnnouncementsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Announcement Modal */}
      {showCreateAnnouncementModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Announcement</h2>
              <button className="close-btn" onClick={() => setShowCreateAnnouncementModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateAnnouncement}>
                <div className="form-group">
                  <label>Title:</label>
                  <input 
                    type="text" 
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Content:</label>
                  <textarea 
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    placeholder="Enter announcement content"
                    rows="5"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowCreateAnnouncementModal(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Create Announcement</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Join Requests Modal */}
      {showJoinRequestsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Pending Join Requests</h2>
              <button className="close-btn" onClick={() => setShowJoinRequestsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {joinRequests.length > 0 ? (
                <div className="join-requests-list">
                  {joinRequests.map(request => (
                    <div key={request.student._id} className="join-request-item">
                      <div className="request-details">
                        <h3>{request.student.name}</h3>
                        <p>{request.student.email}</p>
                        <p className="request-date">Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="request-actions">
                        <button 
                          className="accept-btn"
                          onClick={() => handleJoinRequestAction(request.student._id, 'accept')}
                        >
                          Accept
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleJoinRequestAction(request.student._id, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-requests">
                  <p>No pending join requests for this class.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowJoinRequestsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <FloatingHomeButton />
    </div>
  )
}

export default TeacherDashboard