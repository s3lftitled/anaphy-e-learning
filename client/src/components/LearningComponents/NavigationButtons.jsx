import './LearningComponentsStyles.css'

const NavigationButtons = ({ isCompleted, onPrevious, onNext }) => {
  return (
    <div className="navigation-buttons">
      <button onClick={onPrevious}>Previous</button>
      <button 
        onClick={onNext}
        className={isCompleted ? 'completed-btn' : ''}
      >
        {isCompleted ? 'Next' : 'Complete & Continue'}
      </button>
    </div>
  )
}

export default NavigationButtons