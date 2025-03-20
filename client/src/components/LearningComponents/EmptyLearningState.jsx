// EmptyLearningState.jsx
import { useNavigate } from 'react-router-dom'
import './LearningComponentsStyles.css'

const EmptyLearningState = () => {
  const navigate = useNavigate()

  const navigateToClasses = () => {
    navigate('/student-classes')
  }

  return (
    <div className="empty-learning-container">
      <div className="empty-learning-card">
        <div className="empty-learning-icon">📚</div>
        <h2 className="empty-learning-title">You need to join a class first to access our e-learning</h2>
        <p className="empty-learning-description">
          Enroll in a class to unlock a personalized learning experience with interactive content, 
          exercises, and assessments tailored to your educational journey.
        </p>
        <div className="empty-learning-actions">
          <button 
            className="empty-learning-btn-primary"
            onClick={() => navigateToClasses()}
          >
            Browse Available Classes
          </button>
        </div>
        <div className="empty-learning-help">
          <p>Need help choosing the right class? Contact our support team for personalized guidance.</p>
        </div>
      </div>
    </div>
  )
}

export default EmptyLearningState