import '../styles/about.css'

// Static informational page describing the portal.
const About = () => {
  return (
    <div className="page container">
      <div className="page-header">
        <h1>About the Portal</h1>
        <p>Learn more about what the Course Registration Portal offers.</p>
      </div>

      <div className="card about-card">
        <p>
          The <strong>Course Registration Portal</strong> is a modern web application built
          to simplify the way students discover, register for, and manage their academic
          courses. Designed with simplicity and usability in mind, the portal brings the
          entire registration workflow into a single, easy-to-navigate interface.
        </p>
        <p>
          Students can browse a catalog of available courses, filter by department, search
          by name or instructor, and view detailed information before registering. The
          portal enforces sensible registration rules — such as preventing duplicate
          registrations and automatically tracking seat availability — so the experience
          stays fair and transparent for everyone.
        </p>
        <p>
          Once registered, students can track all their enrolled courses from the{' '}
          <strong>My Courses</strong> page, drop courses they no longer wish to attend, and
          keep their profile information up to date.
        </p>

        <div className="about-features">
          <div className="about-feature">
            <h4>🎯 Simple &amp; Focused</h4>
            <p>A clean interface that puts course discovery and registration front and center.</p>
          </div>
          <div className="about-feature">
            <h4>⚡ Fast &amp; Responsive</h4>
            <p>Built with React and Vite for a snappy experience on any device.</p>
          </div>
          <div className="about-feature">
            <h4>🔒 Reliable Rules</h4>
            <p>Automatic seat tracking and duplicate-registration prevention keep data consistent.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
