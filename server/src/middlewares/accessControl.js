require('dotenv').config

/**
 * Roles available within the system.
 * @readonly
 * @enum {string}
 */
const ROLES = {
  /** Lowest level access */
  LEVEL_1: process.env.ROLE_LEVEL_1,
  /** Intermediate level access */
  LEVEL_2: process.env.ROLE_LEVEL_2,
  /** Highest level access */
  LEVEL_3: process.env.ROLE_LEVEL_3,
}

/**
 * Middleware function to check if the user's role has permission to access a route.
 * @param {Array<string>} allowedRoles - Array of roles allowed to access the route.
 * @returns {Function} - Middleware function to be used in route handlers.
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Extract user's role from decoded token attached to request
    const userRole = req.user?.role
    
    // Handle undefined user role
    if (!userRole) {
      return res.status(403).json({ 
        msg: 'Access denied. Authentication required.',
        code: 'UNAUTHORIZED_ACCESS' 
      })
    }
    
    // Check if user's role is included in allowedRoles array
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        msg: 'Access denied. Insufficient privileges.',
        code: 'INSUFFICIENT_PRIVILEGES' 
      })
    }
    
    // Continue to the next middleware if user's role is allowed
    next()
  }
}

module.exports = { checkRole, ROLES }