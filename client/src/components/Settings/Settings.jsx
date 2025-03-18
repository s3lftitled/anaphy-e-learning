import { useState, useRef } from 'react'
import usePrivateApi from '../../hooks/usePrivateApi'
import { X, Save, Upload, User, Key } from 'lucide-react'
import './Settings.css'

const SettingsSidebar = ({ isOpen, onClose, userData }) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [ base64Image, setBase64Image ] = useState('')
  const privateAxios = usePrivateApi()
  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    profilePicture: userData?.profilePicture || null,
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [previewImage, setPreviewImage] = useState(userData?.profilePicture || null)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const convertToBase64 = (e) => {
    const file = e.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        setBase64Image(reader.result)
      }

      reader.onerror = (error) => {
        console.error("Error reading file:", error)
      }
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await privateAxios.put(`user/api/v1/update-profile/${userData.id}`, {
        newName: profileData.name,
        base64Image: base64Image || null,
      }, { withCredentials: true })

      if (response.status === 200) {
        setSubmitStatus({
          type: 'success',
          message: 'Profile updated successfully!'
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred while updating your profile'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSubmitStatus({
        type: 'error',
        message: 'New password and confirmation do not match'
      })
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await privateAxios.put(`user/api/v1/change-password/${userData.id}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        newPasswordConfirmation: passwordData.confirmPassword 
      },{ withCredentials: true })

      if (response.status === 200) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        
        setSubmitStatus({
          type: 'success',
          message: 'Password updated successfully!'
        })
      }
    } catch (error) {
      console.error('Error updating password:', error)
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred while updating your password'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`settings-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="settings-sidebar-header">
        <h2>Settings</h2>
        <button className="settings-close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="settings-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} />
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Key size={16} />
          Security
        </button>
      </div>
      
      <div className="settings-sidebar-content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="settings-form">
            <div className="profile-picture-container">
              <div 
                className="profile-picture"
                onClick={handleImageClick}
              >
                {base64Image ? (
                  <img src={base64Image} alt="Profile" />
                ) : userData.profilePicture ? (
                  <img src={userData.profilePicture} alt="Profile" />
                ) : (
                  <div className="profile-placeholder">
                    <User size={40} />
                  </div>
                )}
                <div className="upload-overlay">
                  <Upload size={20} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={convertToBase64}
              />
              <p className="upload-text">Click to upload new picture</p>
            </div>
            
            <div className="settings-form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="settings-form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={profileData.email}
                disabled
                className="disabled-input"
              />
              <p className="field-note">Email cannot be changed</p>
            </div>
            
            <button 
              type="submit" 
              className="submit-button-settings"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
              {!isSubmitting && <Save size={16} className="save-icon" />}
            </button>
          </form>
        )}
        
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <div className="settings-form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                name="currentPassword" 
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="settings-form-group">
              <label htmlFor="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                name="newPassword" 
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
              <p className="field-note">Minimum 6 characters</p>
            </div>
            
            <div className="settings-form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button-settings"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
              {!isSubmitting && <Save size={16} className="save-icon" />}
            </button>
          </form>
        )}
        
        {submitStatus && (
          <div className={`status-message-settings ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsSidebar