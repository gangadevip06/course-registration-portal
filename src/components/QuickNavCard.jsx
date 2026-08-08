import { Link } from 'react-router-dom'
import '../styles/quickNavCard.css'

// Clickable navigation card used in the Dashboard's quick-links section.
const QuickNavCard = ({ to, icon, title, description }) => {
  return (
    <Link to={to} className="card quick-nav-card">
      <div className="quick-nav-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <span className="quick-nav-arrow">&rarr;</span>
    </Link>
  )
}

export default QuickNavCard
