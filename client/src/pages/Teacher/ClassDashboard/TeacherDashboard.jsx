import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { getUserInitials } from '../../../utils/getUserInitials'
import { useUser } from '../../../context/UserContext'
import './TeacherDashboard.css'
import usePrivateApi from '../../../hooks/usePrivateApi'
import FloatingHomeButton from '../../../components/FloatingHomeButton/FloatingHomeButton'
import useAuth from '../../../hooks/useAuth'

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
  const { setAuth } = useAuth()
  const { refetchUser } = useUser()
  
  // New state for announcements and join requests
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false)
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false)
  const [showJoinRequestsModal, setShowJoinRequestsModal] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementContent, setAnnouncementContent] = useState('')
  const [showGradesModal, setShowGradesModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentGrades, setStudentGrades] = useState(null)
  const [gradesLoading, setGradesLoading] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailStudent, setEmailStudent] = useState(null)
  const navigate = useNavigate()
  
  // New state for Remove Student confirmation modal
  const [showRemoveStudentModal, setShowRemoveStudentModal] = useState(false)
  const [studentToRemove, setStudentToRemove] = useState(null)

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
      const response = await privateAxios.post(`class/api/v1/invite-student/${user.id}/${activeClass.id}`, {studentEmail: inviteEmail}, {
        withCredentials: true
      })

      if (response.status === 201) {
        const studentData = response?.data?.studentData
        
        // Update the local state with the newly invited student
        const newStudent = {
          id: studentData._id,
          name: studentData.name,
          email: studentData.email,
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
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
          alert('Too many requests. Please try again after 5 minutes')
        } else {
          alert(error.response.data?.message || 'An error occurred. Please try again.')
        }
      } else if (error.request) {
        console.error("Error request:", error.request)
        alert('Request was made but no response was received. Please check your connection.')
      } else {
        console.error("Error message:", error.message)
        alert(`Error: ${error.message || 'An unknown error occurred'}`)
      }
    }
  }

  const handleLogout = async () => {
    try {
      const response = await privateAxios.delete('auth/api/v1/log-out')

      if (response.status === 200) {
        setAuth({ accessToken: null})
        refetchUser()
        navigate('/login')
      }
    } catch (error) {
      alert('Error logging out')
    }
  }

  // New functions for announcements and join requests
  const fetchAnnouncements = async () => {
    if (!activeClass) return

    try {
      const response = await privateAxios.get(`/class/api/v1/fetch-announcements/${activeClass.id}`, {
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

      // Update join requests list
      setJoinRequests(joinRequests.filter(req => req.student._id !== requestId))
    } catch (error) {
      console.error(`Error ${action}ing join request:`, error)
      alert(`Failed to ${action} student. Please try again.`)
    }
  }

  // Function to fetch and show student grades
  const handleViewGrades = async (studentName, studentEmail) => {
    setSelectedStudent({ name: studentName, email: studentEmail })
    setGradesLoading(true)
    setShowGradesModal(true)
    
    try {
      // Replace with your actual API endpoint
      const response = await privateAxios.get(`user/api/v1/fetch-student-grades/${studentEmail}`, {
        withCredentials: true
      })
      
      setStudentGrades(response.data.grades)
      setGradesLoading(false)
    } catch (error) {
      console.error("Error fetching student grades:", error)
      setGradesLoading(false)
      alert("Failed to load student grades. Please try again.")
    }
  }

  // Updated Remove Student functions
  const showRemoveConfirmation = (student) => {
    setStudentToRemove(student)
    setShowRemoveStudentModal(true)
  }

  const handleRemoveStudent = async () => {
    if (!studentToRemove || !activeClass) return
    
    try {
      const response = await privateAxios.delete(`class/api/v1/remove-student/${activeClass.id}/${studentToRemove.id}`, {
        withCredentials: true
      })

      if (response.status === 200 || response.status === 204) {
        // Update state by removing the student
        const updatedStudents = activeClass.students.filter(
          student => student.id !== studentToRemove.id
        )
        
        // Update active class
        const updatedClass = {
          ...activeClass,
          students: updatedStudents
        }
        
        // Update classes array
        const updatedClasses = classes.map(c => 
          c.id === activeClass.id ? updatedClass : c
        )
        
        setClasses(updatedClasses)
        setActiveClass(updatedClass)
        
        // Close modal and reset
        setShowRemoveStudentModal(false)
        setStudentToRemove(null)
        
        alert("Student removed successfully!")
      } else {
        throw new Error(`API returned status ${response.status}`)
      }
    } catch (error) {
      console.error("Error removing student:", error)
      alert("Failed to remove student. Please try again.")
    }
  }

  const handleEmailStudent = (student) => {
    setEmailStudent(student)
    setSubject('')
    setMessage('')
    setShowEmailModal(true)
  }

  const handleSendEmail = async (e) => {
    e.preventDefault()
    if (!emailStudent || !subject || !message) return
    
    try {
      const response = await privateAxios.post(`/user/api/v1/send-message-to-student/${user.id}/${emailStudent.id}`, {
        subject,
        message
      }, {
        withCredentials: true
      })
      
      if (response.status === 200) {
        alert("Message sent successfully!")
        setShowEmailModal(false)
      } else {
        throw new Error(`API returned status ${response.status}`)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send message. Please try again.")
    }
  }

  // Function to calculate average grade
  const calculateAverageGrade = (grades) => {
    if (!grades || grades.length === 0) return 0
    
    const totalPercentage = grades.reduce((sum, grade) => sum + grade.percentage, 0)
    return (totalPercentage / grades.length).toFixed(1)
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
          <button className="new-class-btn" onClick={() => window.location.href = '/create-class-page'}>+</button>
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
          <button className="sidebar-btn" onClick={handleLogout}>Sign Out</button>
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
                          <button 
                            className="action-icon view-btn" 
                            title="View Grades"
                            onClick={() => handleViewGrades(student.name, student.email)}
                          >
                            📊
                          </button>
                          <button 
                              className="action-icon email-btn" 
                              title="Contact Student"
                              onClick={() => handleEmailStudent(student)}
                            >
                              ✉️
                          </button>
                          <button 
                            className="action-icon remove-btn" 
                            title="Remove Student"
                            onClick={() => showRemoveConfirmation(student)}
                          >
                            ❌
                          </button>
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

      {/* Student Grades Modal */}
      {showGradesModal && (
        <div className="modal-overlay">
          <div className="modal student-grades-modal">
            <div className="modal-header">
              <h2>{selectedStudent?.name}'s Grades</h2>
              <button className="close-btn" onClick={() => setShowGradesModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {gradesLoading ? (
                <div className="grades-loading">Loading grades...</div>
              ) : studentGrades && studentGrades?.length > 0 ? (
                <>
                  <div className="grades-summary">
                    <div className="grade-average-card">
                      <div className="grade-average-value">
                        {calculateAverageGrade(studentGrades)}%
                      </div>
                      <div className="grade-average-label">Average Score</div>
                    </div>
                    <div className="grades-summary-details">
                      <div className="summary-item">
                        <span className="summary-label">Total Quizzes:</span>
                        <span className="summary-value">{studentGrades.length}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Passed:</span>
                        <span className="summary-value">
                          {studentGrades.filter(grade => grade.passed).length}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Failed:</span>
                        <span className="summary-value">
                          {studentGrades.filter(grade => !grade.passed).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grades-list">
                    <h3>Assessment History</h3>
                    <div className="grades-table">
                      <div className="grades-table-header">
                        <div className="grades-col quiz-title">Quiz</div>
                        <div className="grades-col score">Score</div>
                        <div className="grades-col percentage">Percentage</div>
                        <div className="grades-col status">Status</div>
                        <div className="grades-col date">Date</div>
                      </div>
                      <div className="grades-table-body">
                        {studentGrades.map(grade => (
                          <div key={grade._id} className="grades-table-row">
                            <div className="grades-col quiz-title">{grade.quiz.title}</div>
                            <div className="grades-col score">
                              {grade.score} / {grade.totalPoints}
                            </div>
                            <div className="grades-col percentage">
                              {grade.percentage.toFixed(1)}%
                            </div>
                            <div className={`grades-col status ${grade.passed ? 'passed' : 'failed'}`}>
                              {grade.passed ? 'Passed' : 'Failed'}
                            </div>
                            <div className="grades-col date">
                              {new Date(grade.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-grades">
                  <p>No grades available for this student.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowGradesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Student Confirmation Modal */}
      {showRemoveStudentModal && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <div className="modal-header">
              <h2>Remove Student</h2>
              <button className="close-btn" onClick={() => setShowRemoveStudentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="confirmation-message">
                Are you sure you want to remove <strong>{studentToRemove?.name}</strong> from this class?
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => setShowRemoveStudentModal(false)}
              >
                Cancel
              </button>
              <button 
                className="danger-btn" 
                onClick={handleRemoveStudent}
              >
                Remove Student
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Email Student Modal */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Contact {emailStudent?.name}</h2>
              <button className="close-btn" onClick={() => setShowEmailModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSendEmail}>
                <div className="form-group">
                  <label>Subject:</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message:</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    rows="5"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowEmailModal(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Floating home button */}
      <FloatingHomeButton />
    </div>
  )
}

export default TeacherDashboard