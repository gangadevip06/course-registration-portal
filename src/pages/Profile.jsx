import { useState } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/profile.css'

// Displays student profile info and allows inline editing.
const Profile = () => {
  const { user, editProfile, registeredCourseIds } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    department: user.department,
    year: user.year,
    email: user.email
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.name.trim()) newErrors.name = 'Name is required.'
    if (!formData.department.trim()) newErrors.department = 'Department is required.'
    if (!formData.year.trim()) newErrors.year = 'Year is required.'
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    editProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      department: user.department,
      year: user.year,
      email: user.email
    })
    setErrors({})
    setIsEditing(false)
  }

  return (
    <div className="page container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and manage your personal information.</p>
      </div>

      <div className="card profile-card">
        <div className="profile-avatar">{user.name.charAt(0)}</div>

        {!isEditing ? (
          <>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span>Student Name</span>
                <strong>{user.name}</strong>
              </div>
              <div className="profile-info-item">
                <span>Register Number</span>
                <strong>{user.registerNumber}</strong>
              </div>
              <div className="profile-info-item">
                <span>Department</span>
                <strong>{user.department}</strong>
              </div>
              <div className="profile-info-item">
                <span>Year</span>
                <strong>{user.year}</strong>
              </div>
              <div className="profile-info-item">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div className="profile-info-item">
                <span>Courses Registered</span>
                <strong>{registeredCourseIds.length}</strong>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Student Name</label>
              <input
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label>Register Number</label>
              <input className="form-control" value={user.registerNumber} disabled />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
              />
              {errors.department && <p className="form-error">{errors.department}</p>}
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
              {errors.year && <p className="form-error">{errors.year}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="profile-form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile
