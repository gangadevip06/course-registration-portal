import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/registrationModal.css'

// Modal shown when a student clicks "Register" on a course. Pre-fills their
// profile details but requires them to confirm (or correct) them before the
// registration is finalized — matching a real registration form's flow.
const RegistrationModal = () => {
  const { registrationModalCourse, closeRegistrationModal, registerCourse, user } = useApp()

  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: '',
    year: '1st Year',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill from the logged-in student's profile whenever the modal opens.
  useEffect(() => {
    if (registrationModalCourse && user) {
      setFormData({
        name: user.name || '',
        registerNumber: user.registerNumber || '',
        department: user.department || '',
        year: user.year || '1st Year',
        email: user.email || ''
      })
      setErrors({})
    }
  }, [registrationModalCourse, user])

  if (!registrationModalCourse) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.name.trim()) newErrors.name = 'Name is required.'
    if (!formData.registerNumber.trim()) newErrors.registerNumber = 'Register number is required.'
    if (!formData.department.trim()) newErrors.department = 'Department is required.'
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const success = registerCourse(registrationModalCourse.id, formData)
    setSubmitting(false)

    if (success) {
      closeRegistrationModal()
    }
  }

  return (
    <div className="modal-overlay" onClick={closeRegistrationModal}>
      <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={closeRegistrationModal}
          aria-label="Close"
        >
          &times;
        </button>

        <h2>Confirm Your Registration</h2>
        <p className="modal-subtitle">
          Registering for <strong>{registrationModalCourse.name}</strong> (
          {registrationModalCourse.id}). Please confirm your details below.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-number">Register Number</label>
              <input
                id="reg-number"
                name="registerNumber"
                className="form-control"
                value={formData.registerNumber}
                onChange={handleChange}
              />
              {errors.registerNumber && <p className="form-error">{errors.registerNumber}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="reg-year">Year</label>
              <select
                id="reg-year"
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
            <label htmlFor="reg-department">Department</label>
            <input
              id="reg-department"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <p className="form-error">{errors.department}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Confirm & Register'}
            </button>
            <button type="button" className="btn btn-outline" onClick={closeRegistrationModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrationModal
