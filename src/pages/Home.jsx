import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useApp } from '../context/AppContext'
import '../styles/home.css'

// Landing page: welcome banner, featured courses, and quick call-to-actions.
const Home = () => {
  const { courses, loadingCourses, isAuthenticated } = useApp()
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    // Show the first 3 courses with the most available seats as "featured".
    if (courses.length) {
      const sorted = [...courses].sort((a, b) => b.availableSeats - a.availableSeats)
      setFeatured(sorted.slice(0, 3))
    }
  }, [courses])

  return (
    <div>
      {/* Welcome Banner */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-logo">CR</div>
          <h1>Welcome to the Course Registration Portal</h1>
          <p>
            Browse available courses, register in a few clicks, and manage your academic
            journey — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-outline">
                Student Login
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="page container">
        <div className="page-header">
          <h1>Featured Courses</h1>
          <p>A few popular courses with the most seats currently available.</p>
        </div>

        {loadingCourses ? (
          <LoadingSpinner label="Loading featured courses..." />
        ) : (
          <div className="grid grid-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <div className="home-view-all">
          <Link to="/courses" className="btn btn-outline">
            View All Courses
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
