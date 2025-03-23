const authService = require('../../../services/authService')
const UserModel = require('../../../models/user.model')
const TeacherModel = require('../../../models/teacher.model')
const PasswordUtil = require('../../../utils/passwordUtils')
const validator = require('validator')
const sanitizeHtml = require('sanitize-html')
const HTTP_STATUS = require('../../../constants/httpConstants')
const { generateTokens } = require('../../../middlewares/jsonWebTokens')

// Mock external dependencies
jest.mock('../../../models/user.model')
jest.mock('../../../models/teacher.model')
jest.mock('../../../utils/passwordUtils')
jest.mock('validator')
jest.mock('sanitize-html')
jest.mock('../../../middlewares/jsonWebTokens')

// Helper to mock the appAssert function if it's imported
jest.mock('../../../utils/appAssert', () => ({
  validateRequiredParams: jest.fn(),
  appAssert: jest.fn((condition, message, status) => {
    if (!condition) {
      const error = new Error(message)
      error.statusCode = status
      throw error
    }
  })
}))

// Mock updateUserActivity
jest.mock('../../../models/user-activity.model', () => ({
  findOneAndUpdate: jest.fn().mockResolvedValue(true)
}))

describe('logIn Function', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    validator.isEmail.mockReturnValue(true);
    sanitizeHtml.mockImplementation(val => val.trim())
    UserModel.findOne.mockResolvedValue(null)
    TeacherModel.findOne.mockResolvedValue(null)
    PasswordUtil.comparePassword.mockResolvedValue(true)
    generateTokens.mockReturnValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    })
  })

  test('should successfully log in a user', async () => {
    // Mock user data
    const mockUser = {
      _id: 'user123',
      email: 'user@example.com',
      password: 'hashedPassword',
      role: 'user'
    }

    // Setup mocks
    UserModel.findOne.mockResolvedValue(mockUser)
    
    // Execute the function
    const result = await authService.logIn('user@example.com', 'password123')

    // Assertions
    expect(validator.isEmail).toHaveBeenCalledWith('user@example.com')
    expect(sanitizeHtml).toHaveBeenCalledWith('user@example.com')
    expect(UserModel.findOne).toHaveBeenCalled()
    expect(TeacherModel.findOne).not.toHaveBeenCalled()
    expect(PasswordUtil.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword')
    
    // Check result structure
    expect(result).toEqual({
      user: mockUser,
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    })
  })

  test('should find teacher if user is not found', async () => {
    // Mock teacher data
    const mockTeacher = {
      _id: 'teacher123',
      email: 'teacher@example.com',
      password: 'hashedPassword',
      role: 'teacher'
    }

    // Setup mocks
    UserModel.findOne.mockResolvedValue(null)
    TeacherModel.findOne.mockResolvedValue(mockTeacher)
    
    // Execute the function
    const result = await authService.logIn('teacher@example.com', 'password123')

    // Assertions
    expect(UserModel.findOne).toHaveBeenCalled()
    expect(TeacherModel.findOne).toHaveBeenCalled()
    expect(result.user).toEqual(mockTeacher)
  })

  test('should throw error for invalid email format', async () => {
    // Mock invalid email validation
    validator.isEmail.mockReturnValue(false)
    
    // Execute and expect error
    await expect(authService.logIn('invalid-email', 'password123'))
      .rejects
      .toThrow('Invalid email format')
  })

  test('should throw error when no user is found', async () => {
    // Setup mocks to return no user
    UserModel.findOne.mockResolvedValue(null)
    TeacherModel.findOne.mockResolvedValue(null)
    
    // Execute and expect error
    await expect(authService.logIn('nonexistent@example.com', 'password123'))
      .rejects
      .toThrow('No user is associated with that email')
  })

  test('should throw error for incorrect password', async () => {
    // Mock user data
    const mockUser = {
      _id: 'user123',
      email: 'user@example.com',
      password: 'hashedPassword',
      role: 'user'
    }

    // Setup mocks
    UserModel.findOne.mockResolvedValue(mockUser)
    PasswordUtil.comparePassword.mockResolvedValue(false)
    
    // Execute and expect error
    await expect(authService.logIn('user@example.com', 'wrongpassword'))
      .rejects
      .toThrow('Incorrect password, please try again')
  })

  test('should sanitize email input', async () => {
    // Mock user data
    const mockUser = {
      _id: 'user123',
      email: 'user@example.com',
      password: 'hashedPassword',
      role: 'user'
    }

    // Setup mocks
    UserModel.findOne.mockResolvedValue(mockUser)
    sanitizeHtml.mockReturnValue('user@example.com')
    
    // Execute the function
    await authService.logIn(' user@example.com ', 'password123')

    // Verify sanitization
    expect(sanitizeHtml).toHaveBeenCalledWith('user@example.com')
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'user@example.com' })
  })
})