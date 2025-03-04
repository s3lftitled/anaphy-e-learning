import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './TeacherDashboard.css'
import usePrivateApi from '../../hooks/usePrivateApi'

const TeacherDashboard = () => {
  // State for classes data
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeClass, setActiveClass] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { user } = useUser()
  const [error, setError] = useState(null)
  const privateAxios = usePrivateApi()

  // Fetch classes data from API
  useEffect(() => {
    if (user) {
      fetchClasses()
    }
  }, [user])

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
        assignments: cls.assignments || 0,
        announcements: cls.announcements || 0
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
          <img src={user.avatar} alt={user.name} className="teacher-avatar" />
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
          <button className="sidebar-btn">Settings</button>
          <button className="sidebar-btn">Help</button>
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
                        <div className="col-status">
                          <span className={`status-badge ${getStatusClass(student.status)}`}>
                            {student.status}
                          </span>
                        </div>
                        <div className="col-activity">
                          {student.lastActive || 'Never'}
                        </div>
                        <div className="col-actions">
                          <button className="row-action-btn" onClick={() => window.location.href = `/student/${student.id}/progress`}>
                            <span className="action-icon">📊</span>
                          </button>
                          <button className="row-action-btn" onClick={() => window.location.href = `/student/${student.id}/message`}>
                            <span className="action-icon">✉️</span>
                          </button>
                          <button className="row-action-btn danger" onClick={() => handleRemoveStudent(student.id)}>
                            <span className="action-icon">❌</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No students match your search criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-dashboard">
            <h2>No Class Selected</h2>
            <p>Please select a class from the sidebar or create a new class to get started.</p>
          </div>
        )}
      </div>
      
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="invite-modal">
            <div className="modal-header">
              <h2>Invite Students</h2>
              <button className="close-modal-btn" onClick={() => setShowInviteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Invite students to join your class. You can send an invitation directly to their email.</p>
              
              <form onSubmit={handleInviteStudent}>
                <div className="form-group">
                  <label>Student Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter student email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-divider">
                  <span>OR</span>
                </div>
                
                <div className="class-code-info">
                  <p>Share this class code with your students:</p>
                  <div className="code-display">
                    <span>{activeClass.code}</span>
                    <button 
                      type="button"
                      className="copy-code-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(activeClass.code);
                        alert('Class code copied to clipboard!');
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="send-invite-btn">
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherDashboard