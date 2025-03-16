import { useState } from 'react'
import api from '../../utils/api'
import { X, Send } from 'lucide-react'
import './Help.css'

const HelpSidebar = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'Bug Report', // Default to bug report
    title: '',
    description: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Using a private axios instance
      const response = await api.post('issues/api/v1/submit-issue', formData)

      if (response.status === 201) {
        // Reset form after successful submission
        setFormData({
          type: 'Bug Report',
          title: '',
          description: '',
          email: ''
        })
        
        setSubmitStatus({
          type: 'success',
          message: 'Your ticket has been submitted successfully!'
        })
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setSubmitStatus({
        type: 'error',
        message: error.response.data.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`help-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="help-sidebar-header">
        <h2>Help & Support</h2>
        <button className="help-close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="help-sidebar-content">
        <form onSubmit={handleSubmit} className="help-form">
          <div className="help-form-group">
            <label htmlFor="type">Issue Type</label>
            <select 
              id="type" 
              name="type" 
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Question">Question</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="help-form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              placeholder="Brief summary of your issue"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="help-form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="Please provide details about your issue..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
          
          <div className="help-form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Your email for follow-up"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button-help"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            {!isSubmitting && <Send size={16} className="send-icon" />}
          </button>
          
          {submitStatus && (
            <div className={`status-message-help ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default HelpSidebar