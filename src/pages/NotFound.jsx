import { Link } from 'react-router-dom'

// Fallback page shown for unmatched routes.
const NotFound = () => {
  return (
    <div className="page container">
      <div className="empty-state">
        <h3>404 — Page Not Found</h3>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
