import './LearningComponentsStyles.css'

const ProgressRing = ({ progress }) => {
  return (
    <div className="progress-ring">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle
          className="progress-ring-circle-bg"
          stroke="#e6e6e6"
          strokeWidth="4"
          fill="transparent"
          r="16"
          cx="20"
          cy="20"
        />
        <circle
          className="progress-ring-circle"
          stroke="#0c4160"
          strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 16} ${2 * Math.PI * 16}`}
          strokeDashoffset={2 * Math.PI * 16 * (1 - progress / 100)}
          strokeLinecap="round"
          fill="transparent"
          r="16"
          cx="20"
          cy="20"
        />
      </svg>
      <span className="progress-text">{progress}%</span>
    </div>
  )
}

export default ProgressRing