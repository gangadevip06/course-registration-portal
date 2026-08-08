import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/courseCard.css'

// Reusable card used on Home (featured), Courses, and My Courses pages.
// Reads registration state and actions directly from context so every
// page shows consistent, login-aware behavior without prop drilling.
const CourseCard = ({ course, showActions = true }) => {
  const { registeredCourseIds, openRegistrationModal, dropCourse } = useApp()

  const isRegistered = registeredCourseIds.includes(course.id)
  const seatsLow = course.availableSeats > 0 && course.availableSeats <= 5
  const seatsFull = course.availableSeats === 0

  return (
    <div className="card course-card">
      <div className="course-card-top">
        <span className="badge badge-info">{course.id}</span>
        {isRegistered && <span className="badge badge-success">Registered</span>}
        {!isRegistered && seatsFull && <span className="badge badge-danger">Full</span>}
        {!isRegistered && seatsLow && <span className="badge badge-warning">Few Seats</span>}
      </div>

      <h3 className="course-card-title">{course.name}</h3>
      <p className="course-card-dept">{course.department}</p>

      <ul className="course-card-meta">
        <li><strong>Instructor:</strong> {course.instructor}</li>
        <li><strong>Credits:</strong> {course.credits}</li>
        <li><strong>Duration:</strong> {course.duration}</li>
        <li><strong>Seats:</strong> {course.availableSeats}/{course.totalSeats}</li>
      </ul>

      {showActions && (
        <div className="course-card-actions">
          <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">
            View Details
          </Link>
          {isRegistered ? (
            <button className="btn btn-danger btn-sm" onClick={() => dropCourse(course.id)}>
              Drop Course
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              disabled={seatsFull}
              onClick={() => openRegistrationModal(course)}
            >
              {seatsFull ? 'No Seats' : 'Register'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseCard
