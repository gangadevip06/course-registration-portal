import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/navbar.css'

// Main site navigation. Shows different links depending on auth state and role.
const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ]

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/courses', label: 'Courses' },
    { to: '/my-courses', label: 'My Courses' },
    { to: '/profile', label: 'Profile' }
  ]

  const adminLinks = [{ to: '/admin', label: 'Manage Courses' }]

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-logo">CR</span>
          <span className="brand-text">Course Registration Portal</span>
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated &&
            (isAdmin ? adminLinks : studentLinks).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}

          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-username">
                Hi, {user.name.split(' ')[0]}
                {isAdmin && <span className="badge badge-info navbar-role-badge">Admin</span>}
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-user">
              <Link to="/register" className="btn btn-outline btn-sm" onClick={closeMenu}>
                Register
              </Link>
              <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu}>
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
