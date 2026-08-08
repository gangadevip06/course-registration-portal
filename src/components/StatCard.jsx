import '../styles/statCard.css'

// Small stat display used on the Dashboard (e.g., total courses, registered count).
const StatCard = ({ icon, label, value, color = 'primary' }) => {
  return (
    <div className="card stat-card">
      <div className={`stat-icon stat-icon-${color}`}>{icon}</div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  )
}

export default StatCard
