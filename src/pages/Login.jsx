import { useState } from 'react'
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useApp } from '../context/AppContext'
import '../styles/login.css'

// Login page for both students and admins — the account's role determines
// where the user lands after signing in. Basic client-side validation and
// dummy authentication (see src/services/authService.js).
const Login = () => {
  const { login, isAuthenticated, isAdmin } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: location.state?.prefillEmail || '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Already logged in? Send them to the right place.
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const loggedInUser = await login(formData.email, formData.password)
      toast.success('Login successful! Welcome back.')

      const fallback = loggedInUser.role === 'admin' ? '/admin' : '/dashboard'
      const redirectTo = location.state?.from?.pathname || fallback
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.error(err.message)
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemoCredentials = () => {
    setErrors({})
    setFormData({ email: 'student@nec.edu.in', password: 'student123' })
  }

  const fillAdminCredentials = () => {
    setErrors({})
    setFormData({ email: 'admin@nec.edu.in', password: 'admin123' })
  }

  return (
    <div className="page login-page">
      <div className="container login-container">
        <div className="card login-card">
          <h1>Login</h1>
          <p className="login-subtitle">
            Sign in with your student or admin account to continue.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="you@nec.edu.in"
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {errors.form && <p className="form-error login-form-error">{errors.form}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="login-demo">
            <p>
              New student? <Link to="/register">Create an account</Link>
            </p>
            <p>Demo student: <strong>student@nec.edu.in / student123</strong></p>
            <button type="button" className="btn btn-outline btn-sm" onClick={fillDemoCredentials}>
              Autofill Student Demo
            </button>
            <p style={{ marginTop: 14 }}>
              Demo admin: <strong>admin@nec.edu.in / admin123</strong>
            </p>
            <button type="button" className="btn btn-outline btn-sm" onClick={fillAdminCredentials}>
              Autofill Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
