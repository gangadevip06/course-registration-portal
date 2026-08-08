import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useApp } from '../context/AppContext'
import '../styles/login.css'

// Student sign-up page. Creates a new account, then sends the student
// to the Login page to sign in — matching a standard register-then-login flow.
const Register = () => {
  const { signup, isAuthenticated } = useApp()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: '',
    year: '1st Year',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.name.trim()) newErrors.name = 'Full name is required.'
    if (!formData.registerNumber.trim()) newErrors.registerNumber = 'Register number is required.'
    if (!formData.department.trim()) newErrors.department = 'Department is required.'

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

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const { confirmPassword, ...studentData } = formData
      await signup(studentData)
      toast.success('Account created successfully! Please login to continue.')
      navigate('/login', { state: { prefillEmail: formData.email } })
    } catch (err) {
      toast.error(err.message)
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page login-page">
      <div className="container login-container">
        <div className="card login-card register-card">
          <h1>Student Registration</h1>
          <p className="login-subtitle">
            Create your account to browse and register for courses.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                className="form-control"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registerNumber">Register Number</label>
                <input
                  id="registerNumber"
                  name="registerNumber"
                  className="form-control"
                  placeholder="e.g. NEC22CS001"
                  value={formData.registerNumber}
                  onChange={handleChange}
                />
                {errors.registerNumber && <p className="form-error">{errors.registerNumber}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <select
                  id="year"
                  name="year"
                  className="form-control"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                className="form-control"
                placeholder="e.g. Computer Science and Engineering"
                value={formData.department}
                onChange={handleChange}
              />
              {errors.department && <p className="form-error">{errors.department}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="you@nec.edu.in"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            </div>

            {errors.form && <p className="form-error login-form-error">{errors.form}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="login-demo">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
