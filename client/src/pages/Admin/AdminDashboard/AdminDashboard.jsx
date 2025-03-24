import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts'
import './AdminDashboard.css'
import FloatingHomeButton from '../../../components/FloatingHomeButton/FloatingHomeButton'

const UserActivityDashboard = () => {
  const [activeUsersData, setActiveUsersData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    history: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Page title
    document.title = `AnaphyVerse - User Activity Dashboard`
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        const [dailyResponse, weeklyResponse, monthlyResponse, historyResponse] = await Promise.all([
          api.get('user-activities/api/v1/get-daily-active-users'),
          api.get('user-activities/api/v1/get-weekly-active-users'),
          api.get('user-activities/api/v1/get-monthly-active-users'),
          api.get('user-activities/api/v1/get-historical-user-activity?days=7')
        ])
        
        setActiveUsersData({
          daily: dailyResponse.data.dailyActiveUsers,
          weekly: weeklyResponse.data.weeklyActiveUsers,
          monthly: monthlyResponse.data.monthlyActiveUsers,
          history: historyResponse.data.history
        })
      } catch (err) {
        setError('Failed to fetch active users data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchData()
    // Set up interval to refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 300000)
    
    // Clean up on unmount
    return () => clearInterval(intervalId)
  }, [])
  
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>User Activity Dashboard</h1>
          <div className="title-underline"></div>
        </div>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'trends' ? 'active' : ''} 
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon daily-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>Daily Active Users</h3>
                <p className="stat-value">{activeUsersData.daily.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon weekly-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>Weekly Active Users</h3>
                <p className="stat-value">{activeUsersData.weekly.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon monthly-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-info">
                <h3>Monthly Active Users</h3>
                <p className="stat-value">{activeUsersData.monthly.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h2>User Activity Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeUsersData.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="daily" name="Daily Users" fill="#4fc3f7" />
                <Bar dataKey="weekly" name="Weekly Users" fill="#1a5a80" />
                <Bar dataKey="monthly" name="Monthly Users" fill="#0c4160" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="chart-container">
          <h2>User Activity Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activeUsersData.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="daily" name="Daily Users" stroke="#4fc3f7" strokeWidth={2} />
              <Line type="monotone" dataKey="weekly" name="Weekly Users" stroke="#1a5a80" strokeWidth={2} />
              <Line type="monotone" dataKey="monthly" name="Monthly Users" stroke="#0c4160" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <FloatingHomeButton />
    </div>
  )
}

export default UserActivityDashboard