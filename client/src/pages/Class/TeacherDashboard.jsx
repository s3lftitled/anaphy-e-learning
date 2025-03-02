import { useState, useEffect } from 'react'
import './TeacherDashboard.css'

const TeacherDashboard = () => {
  // State for classes data
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeClass, setActiveClass] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data for teacher profile
  const teacher = {
    name: "Jane Smith",
    subject: "Anaphy",
    avatar: "/api/placeholder/150/150"
  }

  // Fetch classes data (simulated)
  useEffect(() => {
    // This would be an API call in production
    const fetchClasses = async () => {
      try {
        // Simulating API delay
        setTimeout(() => {
          const mockClasses = [
            {
              id: '1',
              name: 'Anaphy 101',
              code: 'CLASS452789',
              createdAt: '2025-02-15',
              students: [
                { id: '101', name: 'Alex Johnson', email: 'alex@example.com', status: 'joined', lastActive: '2025-02-28' },
                { id: '102', name: 'Maria Garcia', email: 'maria@example.com', status: 'joined', lastActive: '2025-02-27' },
                { id: '103', name: 'James Wilson', email: 'james@example.com', status: 'invited', lastActive: null },
                { id: '104', name: 'Sarah Lee', email: 'sarah@example.com', status: 'joined', lastActive: '2025-03-01' },
              ],
              assignments: 3,
              announcements: 2
            },
            {
              id: '2',
              name: 'Anaphy 103',
              code: 'CLASS789123',
              createdAt: '2025-01-10',
              students: [
                { id: '201', name: 'Thomas Brown', email: 'thomas@example.com', status: 'joined', lastActive: '2025-02-25' },
                { id: '202', name: 'Emma Davis', email: 'emma@example.com', status: 'joined', lastActive: '2025-02-29' },
                { id: '203', name: 'Michael Chen', email: 'michael@example.com', status: 'joined', lastActive: '2025-02-28' },
              ],
              assignments: 5,
              announcements: 1
            },
            {
              id: '3',
              name: 'Anaphy 102',
              code: 'CLASS364851',
              createdAt: '2025-02-20',
              students: [
                { id: '301', name: 'Sophia Rodriguez', email: 'sophia@example.com', status: 'joined', lastActive: '2025-02-26' },
                { id: '302', name: 'Noah Martin', email: 'noah@example.com', status: 'rejected', lastActive: null },
                { id: '303', name: 'Olivia Thompson', email: 'olivia@example.com', status: 'invited', lastActive: null },
              ],
              assignments: 1,
              announcements: 3
            }
          ]

          setClasses(mockClasses)
          setActiveClass(mockClasses[0])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching classes:", error)
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const handleClassSelect = (classData) => {
    setActiveClass(classData)
  }

  const handleInviteStudent = (e) => {
    e.preventDefault()
    if (!inviteEmail) return

    // This would be an API call in production
    const newStudent = {
      id: `${Math.floor(Math.random() * 1000)}`,
      name: inviteEmail.split('@')[0], // Just for mock data
      email: inviteEmail,
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

  const stats = getClassStats();

  if (loading) {
    return (
      <div className="dashboard-container loading-container">
        <div className="spinner-container">
          <div className="dashboard-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="teacher-profile">
          <img src={teacher.avatar} alt={teacher.name} className="teacher-avatar" />
          <div className="teacher-info">
            <h3>{teacher.name}</h3>
            <p>{teacher.subject} Teacher</p>
          </div>
        </div>
        
        <div className="sidebar-divider"></div>
        
        <div className="sidebar-header">
          <h3>My Classes</h3>
          <button className="new-class-btn">+</button>
        </div>
        
        <div className="classes-list">
          {classes.map(cls => (
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
          ))}
        </div>
        
        <div className="sidebar-footer">
          <button className="sidebar-btn">Settings</button>
          <button className="sidebar-btn">Help</button>
        </div>
      </div>
      
      <div className="dashboard-main">
        {activeClass && (
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
                <button className="action-btn">Assignments</button>
                <button className="action-btn">Materials</button>
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
              <div className="stat-card">
                <div className="stat-value">{activeClass.assignments}</div>
                <div className="stat-label">Assignments</div>
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
                          <button className="row-action-btn">
                            <span className="action-icon">📊</span>
                          </button>
                          <button className="row-action-btn">
                            <span className="action-icon">✉️</span>
                          </button>
                          <button className="row-action-btn danger">
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