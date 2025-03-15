import { useState, useEffect } from 'react'
import { Home, Plus, Mail, User, Trash2, AlertCircle } from 'lucide-react'
import FloatingHomeButton from '../../components/FloatingHomeButton/FloatingHomeButton'
import api from '../../utils/api'
import './TeacherManagement.css'

const TeacherManagement = () => {
  const [email, setEmail] = useState('')
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showAddConfirmation, setShowAddConfirmation] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await api.get('teacher-management/api/v1/fetch-teachers')
      console.log(response)
      if (response.status === 200) {
        setTeachers(response.data.teachers)
        console.log(teachers)
      }
    } catch (error) {
      // ignore error  
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email) {
      // Show confirmation before adding
      setShowAddConfirmation(true)
    }
  }

  const confirmAddTeacher = async () => {
    setShowAddConfirmation(false)
    setLoading(true)
    try {
      // Call the backend API to create the teacher account
      const response = await api.post('teacher-management/api/v1/create-teacher', { email })

      console.log(response)
      
      // If successful, add the teacher to the list and reset the email input
      if (response.status === 201) {
        setTeachers([...teachers, response.data.teacher])
        setEmail('')
        setError('')  // Clear any previous errors
      }
    } catch (err) {
      setError('Error creating teacher account. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher)
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = async () => {
    if (teacherToDelete) {
      try {
        const response = await api.delete(`teacher-management/api/v1/delete-teacher/${teacherToDelete._id}`)
        
        if (response.status === 200) {
          // Update the UI by filtering out the deleted teacher
          setTeachers(teachers.filter(teacher => teacher._id !== teacherToDelete._id))
        }
      } catch (err) {
        setError('Error deleting teacher account. Please try again later.')
      }
    }
    // Close the confirmation dialog
    setShowDeleteConfirmation(false)
    setTeacherToDelete(null)
  }

  return (
    <>
      <div className="admin-container">
        {/* Navigation */}
        <nav className="admin-nav">
          <div className="nav-content">
            <div className="logo">
              <Home size={24} />
              <span>Admin Dashboard</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="admin-content">
          <div className="content-header">
            <h1>Teacher Account Management</h1>
          </div>

          {/* Add Teacher Form */}
          <div className="add-teacher-section">
            <div className="form-container">
              <h2>Add New Teacher</h2>
              <form onSubmit={handleSubmit} className="add-teacher-form">
                <div className="input-group">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    placeholder="Enter teacher's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="add-button" disabled={loading}>
                  {loading ? 'Adding...' : <><Plus size={20} /> Add Teacher</>}
                </button>
              </form>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>

          {/* Teachers List */}
          <div className="teachers-list-section">
            <h2>Teacher Accounts</h2>
            <div className="table-container">
              <table className="teachers-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  { teachers.length === 0 ? ( 
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>No teachers available</td>
                    </tr>
                  ) : ( 
                    teachers.map(teacher => (
                      <tr key={teacher.id}>
                        <td>
                          <div className="teacher-email">
                            <User size={16} />
                            {teacher.email}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${teacher.status.toLowerCase()}`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td>{new Date(teacher.createdAt).toLocaleString()}</td>
                        <td>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteClick(teacher)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="modal-overlay">
              <div className="confirmation-modal">
                <div className="modal-header">
                  <AlertCircle size={24} className="alert-icon" />
                  <h3>Confirm Deletion</h3>
                </div>
                <div className="modal-content">
                  <p>Are you sure you want to delete this teacher account?</p>
                  <p className="modal-email">{teacherToDelete?.email}</p>
                </div>
                <div className="modal-actions">
                  <button className="cancel-button" onClick={() => setShowDeleteConfirmation(false)}>
                    Cancel
                  </button>
                  <button className="confirm-button delete" onClick={confirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Confirmation Modal */}
          {showAddConfirmation && (
            <div className="modal-overlay">
              <div className="confirmation-modal">
                <div className="modal-header">
                  <Mail size={24} className="mail-icon" />
                  <h3>Confirm Addition</h3>
                </div>
                <div className="modal-content">
                  <p>Are you sure you want to add this teacher?</p>
                  <p className="modal-email">{email}</p>
                </div>
                <div className="modal-actions">
                  <button className="cancel-button" onClick={() => setShowAddConfirmation(false)}>
                    Cancel
                  </button>
                  <button className="confirm-button add" onClick={confirmAddTeacher}>
                    Add Teacher
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <FloatingHomeButton />
      </div>
    </>
  )
}

export default TeacherManagement