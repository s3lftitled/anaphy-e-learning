const UserActivityModel = require('../models/user-activity.model')

// Query for daily active users
const getDailyActiveUsersService = async (date = new Date()) => {
  try {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    return await UserActivityModel.countDocuments({
      lastLogin: { $gte: startOfDay, $lte: endOfDay }
    })
  } catch (error) {
    throw error
  }
}

// Query for weekly active users
const getWeeklyActiveUsersService = async (date = new Date()) => {
  try {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Go to beginning of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Go to end of week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999)
    
    return await UserActivityModel.countDocuments({
      lastLogin: { $gte: startOfWeek, $lte: endOfWeek }
    })
  } catch (error) {
    throw error
  }
}

// Query for monthly active users
const getMonthlyActiveUsersService = async (date = new Date()) => {
  try {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return await UserActivityModel.countDocuments({
      lastLogin: { $gte: startOfMonth, $lte: endOfMonth }
    })
  } catch (error) {
    throw error
  }
}

const getHistoricalUserActivityService = async (days = 7) => {
  try {
    const today = new Date()
    const results = []
    
    // For each day in the requested range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      
      // Get the day name (Mon, Tue, Wed, etc.)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      // Get data for this specific day
      const dailyCount = await getDailyActiveUsersService(date)
      const weeklyCount = await getWeeklyActiveUsersService(date)
      const monthlyCount = await getMonthlyActiveUsersService(date)
      
      results.push({
        name: dayName,
        daily: dailyCount,
        weekly: weeklyCount,
        monthly: monthlyCount,
        date: date.toISOString().split('T')[0] // YYYY-MM-DD format
      })
    }
    
    return results
  } catch (error) {
    throw error
  }
}

module.exports = {
  getDailyActiveUsersService,
  getMonthlyActiveUsersService,
  getWeeklyActiveUsersService,
  getHistoricalUserActivityService,
}