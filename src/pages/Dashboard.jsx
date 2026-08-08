import StatCard from '../components/StatCard'
import QuickNavCard from '../components/QuickNavCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useApp } from '../context/AppContext'
import '../styles/dashboard.css'

// Student dashboard: overview stats and quick navigation shortcuts.
const Dashboard = () => {
  const { user, courses, loadingCourses, registeredCourseIds } = useApp()

  if (loadingCourses) {
    return (
      <div className="page container">
        <LoadingSpinner label="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p>Here's a quick overview of your course registration activity.</p>
      </div>

      <div className="grid grid-3 dashboard-stats">
        <StatCard icon="📚" label="Total Available Courses" value={courses.length} color="primary" />
        <StatCard
          icon="✅"
          label="Registered Courses"
          value={registeredCourseIds.length}
          color="success"
        />
        <StatCard
          icon="🎓"
          label="Total Credits Enrolled"
          value={courses
            .filter((c) => registeredCourseIds.includes(c.id))
            .reduce((sum, c) => sum + c.credits, 0)}
          color="accent"
        />
      </div>

      <h2 className="dashboard-section-title">Quick Navigation</h2>
      <div className="grid grid-4 dashboard-quick-nav">
        <QuickNavCard
          to="/courses"
          icon="🔍"
          title="Browse Courses"
          description="Explore all available courses"
        />
        <QuickNavCard
          to="/my-courses"
          icon="📖"
          title="My Courses"
          description="View your registered courses"
        />
        <QuickNavCard
          to="/profile"
          icon="👤"
          title="My Profile"
          description="View and edit your profile"
        />
        <QuickNavCard
          to="/contact"
          icon="✉️"
          title="Contact Support"
          description="Get help from our team"
        />
      </div>
    </div>
  )
}

export default Dashboard
