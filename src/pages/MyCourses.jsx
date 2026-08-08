import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useApp } from '../context/AppContext'

// Displays all courses the student is currently registered for.
const MyCourses = () => {
  const { registeredCourses, loadingCourses } = useApp()

  return (
    <div className="page container">
      <div className="page-header">
        <h1>My Courses</h1>
        <p>Manage the courses you're currently registered for.</p>
      </div>

      {loadingCourses ? (
        <LoadingSpinner label="Loading your courses..." />
      ) : registeredCourses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses registered yet</h3>
          <p>Browse the course catalog and register for courses that interest you.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-3">
          {registeredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses
