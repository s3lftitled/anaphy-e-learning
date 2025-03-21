import { useState, useEffect } from 'react';
import { AlertTriangle, Filter, Search, RefreshCw, ChevronDown, Clock, Mail } from 'lucide-react'
import usePrivateApi from '../../../hooks/usePrivateApi'
import './Issues.css'
import { privateAxios } from '../../../utils/api'

const Issues = () => {
  const [issues, setIssues] = useState([])
  const [filteredIssues, setFilteredIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [expandedIssue, setExpandedIssue] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const privateApi = usePrivateApi()

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
  }, [issues, searchTerm, filterType])

  // Handle refresh
  const handleRefresh = () => {
    fetchIssues()
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
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
            <button onClick={() => {setSearchTerm(''); setFilterType('All');}} className="reset-button">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="issues-list">
            {filteredIssues.map((issue) => (
              <div 
                key={issue._id}
                className={`issue-card ${expandedIssue === issue._id ? 'expanded' : ''}`}
                onClick={() => toggleExpand(issue._id)}
              >
                <div className="issue-card-header">
                  <div className="issue-info">
                    <div className={`issue-type ${getIssueTypeClass(issue.issueType)}`}>
                      {issue.issueType}
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
                      <button className="action-button resolve-button">
                        Resolve Issue
                      </button>
                      <button className="action-button contact-button">
                        Contact User
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
          <h4>Other</h4>
          <p>{issues.filter(issue => issue.issueType === 'Other').length}</p>
        </div>
      </div>
    </div>
  )
}

export default Issues