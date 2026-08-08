import { Link } from 'react-router-dom'
import '../styles/footer.css'

// Site-wide footer with quick links and contact info.
const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="brand-logo">CR</span>
            <span>Course Registration Portal</span>
          </div>
          <p className="footer-text">
            A simple, modern platform for students to discover, register, and manage
            their academic courses with ease.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>National Engineering College</li>
            <li>Kovilpatti, Tamil Nadu</li>
            <li>support@crportal.edu.in</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Course Registration Portal. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
