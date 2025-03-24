import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Filter, Search, RefreshCw, ChevronDown, Clock, Mail, Check, X } from 'lucide-react'
import usePrivateApi from '../../../hooks/usePrivateApi'
import './Issues.css'
import FloatingHomeButton from '../../../components/FloatingHomeButton/FloatingHomeButton'

const Issues = () => {
  const [issues, setIssues] = useState([])
  const [filteredIssues, setFilteredIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [expandedIssue, setExpandedIssue] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // New state variables for contact functionality
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactLoading, setContactLoading] = useState(false)
  const [contactError, setContactError] = useState(null)
  const [contactSuccess, setContactSuccess] = useState(false)
  const modalRef = useRef(null)
  
  const privateAxios = usePrivateApi()

  useEffect(() => {
    // Page title
    document.title = `AnaphyVerse - Issues`
  }, [])

  // Fetch issues from API
  const fetchIssues = async () => {
    try {
      setLoading(true)
      if (refreshing) setRefreshing(true)
      
      const response = await privateAxios.get('issues/api/v1/fetch-issues', {}, { withCredentials: true })
      
      // Sort issues by createdAt (newest first)
      const sortedIssues = [...response.data.issues].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      
      setIssues(sortedIssues)
      setFilteredIssues(sortedIssues)
      setError(null)
    } catch (err) {
      setError('Failed to fetch issues. Please try again later.')
      console.error('Error fetching issues:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchIssues()
  }, [])

  // Handle search and filtering
  useEffect(() => {
    let result = issues
    
    // Filter by type
    if (filterType !== 'All') {
      result = result.filter(issue => issue.issueType === filterType)
    }
    
    // Filter by status
    if (filterStatus !== 'All') {
      result = result.filter(issue => issue.status === filterStatus)
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(term) || 
        issue.description.toLowerCase().includes(term) ||
        issue.email.toLowerCase().includes(term)
      )
    }
    
    setFilteredIssues(result)
  }, [issues, searchTerm, filterType, filterStatus])

  // Handle refresh
  const handleRefresh = () => {
    fetchIssues()
  }
  
  // Handle resolving an issue
  const handleResolveIssue = async (issueId, e) => {
    e.stopPropagation() // Prevent card expansion when clicking resolve
    
    try {
      setIsLoading(true)
      await privateAxios.put(`issues/api/v1/resolve-issue/${issueId}`, {}, { withCredentials: true })
      
      // Update local state
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue._id === issueId 
            ? { ...issue, status: 'Resolved' } 
            : issue
        )
      )
      
      // Success notification could be added here
      
    } catch (err) {
      console.error('Error resolving issue:', err)
      // Error notification could be added here
    } finally {
      setIsLoading(false)
    }
  }

  // Format Date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }
    return new Date(dateString).toLocaleString(undefined, options);
  }

  // Toggle expanded issue
  const toggleExpand = (id) => {
    if (expandedIssue === id) {
      setExpandedIssue(null)
    } else {
      setExpandedIssue(id)
    }
  }

  // Get CSS class for issue type
  const getIssueTypeClass = (type) => {
    switch (type) {
      case 'Bug Report':
        return 'issue-type-bug';
      case 'Feature Request':
        return 'issue-type-feature'
      case 'Question':
        return 'issue-type-question'
      case 'Other':
        return 'issue-type-other'
      default:
        return ''
    }
  }

  // NEW FUNCTIONS FOR CONTACT FUNCTIONALITY

  // Handle opening contact modal
  const openContactModal = (issue, e) => {
    e.stopPropagation() // Prevent card expansion when clicking contact
    setSelectedIssue(issue)
    setContactSubject(`RE: ${issue.title}`)
    setContactMessage('')
    setContactError(null)
    setContactSuccess(false)
    setContactModalOpen(true)
  }

  // Handle closing contact modal
  const closeContactModal = () => {
    setContactModalOpen(false)
    setSelectedIssue(null)
    setContactSubject('')
    setContactMessage('')
    setContactError(null)
    setContactSuccess(false)
  }

  // Handle sending contact message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!contactSubject.trim() || !contactMessage.trim()) {
      setContactError('Please fill in both subject and message fields')
      return
    }

    try {
      setContactLoading(true)
      setContactError(null)
      
      await privateAxios.post(
        `issues/api/v1/contact-issue/${selectedIssue._id}`, 
        {
          subject: contactSubject,
          message: contactMessage
        }, 
        { withCredentials: true }
      )
      
      setContactSuccess(true)
      setContactMessage('')
      
      // Auto close after success
      setTimeout(() => {
        closeContactModal()
      }, 2000)
      
    } catch (err) {
      console.error('Error contacting user:', err)
      setContactError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setContactLoading(false)
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeContactModal()
      }
    }
    
    if (contactModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contactModalOpen])

  return (
    <div className="issue-fetching-container">
      <div className="issue-header">
        <div className="issue-title-section">
          <AlertTriangle size={24} />
          <h1>Issue Management</h1>
        </div>
        
        <div className="issue-actions">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter size={18} className="filter-icon" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Types</option>
              <option value="Bug Report">Bug Reports</option>
              <option value="Feature Request">Feature Requests</option>
              <option value="Question">Questions</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="filter-container status-filter">
            <Check size={18} className="filter-icon" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          
          <button 
            className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={18} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="issues-content-wrapper">
        {loading && !refreshing ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading issues...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <AlertTriangle size={48} />
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-button">Try Again</button>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="empty-container">
            <AlertTriangle size={48} />
            <p>No issues found matching your criteria.</p>
            <button onClick={() => {setSearchTerm(''); setFilterType('All'); setFilterStatus('All');}} className="reset-button">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="issues-list">
            {filteredIssues.map((issue) => (
              <div 
                key={issue._id}
                className={`issue-card ${expandedIssue === issue._id ? 'expanded' : ''} ${issue.status === 'Resolved' ? 'resolved' : ''}`}
                onClick={() => toggleExpand(issue._id)}
              >
                <div className="issue-card-header">
                  <div className="issue-info">
                    <div className="issue-labels">
                      <div className={`issue-type ${getIssueTypeClass(issue.issueType)}`}>
                        {issue.issueType}
                      </div>
                      <div className={`issue-status status-${issue.status.toLowerCase()}`}>
                        {issue.status}
                      </div>
                    </div>
                    <h3 className="issue-title">{issue.title}</h3>
                  </div>
                  <ChevronDown 
                    size={20}
                    className={`chevron-icon ${expandedIssue === issue._id ? 'rotated' : ''}`}
                  />
                </div>
                
                <div className="issue-meta">
                  <div className="issue-date">
                    <Clock size={16} />
                    <span>{formatDate(issue.createdAt)}</span>
                  </div>
                  <div className="issue-email">
                    <Mail size={16} />
                    <span>{issue.email}</span>
                  </div>
                </div>
                
                {expandedIssue === issue._id && (
                  <div className="issue-details">
                    <p className="issue-description">{issue.description}</p>
                    <div className="issue-actions-footer">
                      {issue.status === 'Pending' && (
                        <button 
                          className="action-button resolve-button"
                          onClick={(e) => handleResolveIssue(issue._id, e)}
                        >
                          <Check size={16} />
                          <span>{ isLoading ? 'Resolving' : 'Resolve Issue' }</span>
                        </button>
                      )}
                      <button 
                        className="action-button contact-button"
                        onClick={(e) => openContactModal(issue, e)}
                      >
                        <Mail size={16}/>
                        <span>Contact User</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="issue-stats">
        <div className="issues-stat-card">
          <h4>Total Issues</h4>
          <p>{issues.length}</p>
        </div>
        <div className="issues-stat-card">
          <h4>Bug Reports</h4>
          <p>{issues.filter(issue => issue.issueType === 'Bug Report').length}</p>
        </div>
        <div className="issues-stat-card">
          <h4>Feature Requests</h4>
          <p>{issues.filter(issue => issue.issueType === 'Feature Request').length}</p>
        </div>
        <div className="issues-stat-card">
          <h4>Questions</h4>
          <p>{issues.filter(issue => issue.issueType === 'Questions').length}</p>
        </div>
        <div className="issues-stat-card">
          <h4>Others</h4>
          <p>{issues.filter(issue => issue.issueType === 'Others').length}</p>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && selectedIssue && (
        <div className="contact-modal-overlay">
          <div className="contact-modal" ref={modalRef}>
            <div className="contact-modal-header">
              <h2>Contact User</h2>
              <button className="close-modal-button" onClick={closeContactModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="contact-modal-body">
              <div className="contact-recipient">
                <Mail size={16} />
                <span>To: {selectedIssue.email}</span>
              </div>
              
              <form onSubmit={handleSendMessage}>
                <div className="form-group">
                  <label htmlFor="contact-subject">Subject (max 50 characters):</label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    maxLength={50}
                    required
                    className="contact-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contact-message">Message:</label>
                  <textarea
                    id="contact-message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    rows={6}
                    className="contact-textarea"
                    placeholder="Enter your message here..."
                  />
                </div>
                
                {contactError && (
                  <div className="contact-error">
                    <AlertTriangle size={16} />
                    <span>{contactError}</span>
                  </div>
                )}
                
                {contactSuccess && (
                  <div className="contact-success">
                    <Check size={16} />
                    <span>Message sent successfully!</span>
                  </div>
                )}
                
                <div className="contact-modal-footer">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={closeContactModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="send-button"
                    disabled={contactLoading}
                  >
                    {contactLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <FloatingHomeButton />
    </div>
  )
}

export default Issues