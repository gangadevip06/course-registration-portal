import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { useApp } from '../context/AppContext'
import { getCourseById } from '../services/courseService'
import '../styles/courseDetails.css'

// Shows full details for a single course, with register/drop actions.
const CourseDetails = () => {
  const { courseId } = useParams()
  const { courses, registeredCourseIds, openRegistrationModal, dropCourse } = useApp()

  const [baseCourse, setBaseCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch static description/prerequisites once; live seat count comes from context.
  useEffect(() => {
    setLoading(true)
    getCourseById(courseId).then((data) => {
      setBaseCourse(data)
      setLoading(false)
    })
  }, [courseId])

  if (loading) {
    return (
      <div className="page container">
        <LoadingSpinner label="Loading course details..." />
      </div>
    )
  }

  if (!baseCourse) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h3>Course not found</h3>
          <p>The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  // Merge live seat data from context (keeps seats in sync after register/drop).
  const liveCourse = courses.find((c) => c.id === courseId) || baseCourse
  const isRegistered = registeredCourseIds.includes(courseId)
  const seatsFull = liveCourse.availableSeats === 0

  return (
    <div className="page container">
      <Link to="/courses" className="course-details-back">
        &larr; Back to Courses
      </Link>

      <div className="card course-details-card">
        <div className="course-details-header">
          <div>
            <span className="badge badge-info">{liveCourse.id}</span>
            <h1>{liveCourse.name}</h1>
            <p className="course-details-dept">{liveCourse.department}</p>
          </div>

          {isRegistered ? (
            <button className="btn btn-danger" onClick={() => dropCourse(courseId)}>
              Drop Course
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={seatsFull}
              onClick={() => openRegistrationModal(liveCourse)}
            >
              {seatsFull ? 'No Seats Available' : 'Register for this Course'}
            </button>
          )}
        </div>

        <div className="course-details-grid">
          <div className="course-details-info">
            <h3>Description</h3>
            <p>{liveCourse.description}</p>

            <h3>Prerequisites</h3>
            <p>{liveCourse.prerequisites}</p>
          </div>

          <div className="course-details-stats">
            <div className="detail-stat">
              <span>Instructor</span>
              <strong>{liveCourse.instructor}</strong>
            </div>
            <div className="detail-stat">
              <span>Duration</span>
              <strong>{liveCourse.duration}</strong>
            </div>
            <div className="detail-stat">
              <span>Credits</span>
              <strong>{liveCourse.credits}</strong>
            </div>
            <div className="detail-stat">
              <span>Seats Available</span>
              <strong>
                {liveCourse.availableSeats} / {liveCourse.totalSeats}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails
