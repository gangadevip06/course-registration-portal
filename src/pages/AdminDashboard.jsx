import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { isExtraCourse } from '../services/courseService'
import '../styles/adminDashboard.css'

const emptyForm = {
  id: '',
  name: '',
  department: '',
  instructor: '',
  credits: '',
  duration: '',
  totalSeats: '',
  description: '',
  prerequisites: 'None'
}

// Admin-only page for adding new courses to the catalog and removing
// ones added at runtime. The original seed catalog stays untouched.
const AdminDashboard = () => {
  const { user, courses, addCourse, removeCourse } = useApp()
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.id.trim()) newErrors.id = 'Course ID is required.'
    if (!formData.name.trim()) newErrors.name = 'Course name is required.'
    if (!formData.department.trim()) newErrors.department = 'Department is required.'
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor is required.'
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required.'
    if (!formData.description.trim()) newErrors.description = 'Description is required.'

    const credits = Number(formData.credits)
    if (!formData.credits || credits <= 0) newErrors.credits = 'Enter a valid credit value.'

    const seats = Number(formData.totalSeats)
    if (!formData.totalSeats || seats <= 0) newErrors.totalSeats = 'Enter a valid seat count.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const success = addCourse({
      ...formData,
      id: formData.id.trim().toUpperCase(),
      credits: Number(formData.credits),
      totalSeats: Number(formData.totalSeats)
    })
    setSubmitting(false)

    if (success) {
      setFormData(emptyForm)
      setErrors({})
    }
  }

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}. Add new courses to the catalog or remove ones you've added.</p>
      </div>

      <div className="admin-grid">
        {/* Add Course Form */}
        <div className="card admin-form-card">
          <h3>Add New Course</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id">Course ID</label>
                <input
                  id="id"
                  name="id"
                  className="form-control"
                  placeholder="e.g. CS110"
                  value={formData.id}
                  onChange={handleChange}
                />
                {errors.id && <p className="form-error">{errors.id}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="name">Course Name</label>
                <input
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Blockchain Basics"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  name="department"
                  className="form-control"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
                {errors.department && <p className="form-error">{errors.department}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="instructor">Instructor</label>
                <input
                  id="instructor"
                  name="instructor"
                  className="form-control"
                  placeholder="e.g. Dr. Jane Doe"
                  value={formData.instructor}
                  onChange={handleChange}
                />
                {errors.instructor && <p className="form-error">{errors.instructor}</p>}
              </div>
            </div>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label htmlFor="credits">Credits</label>
                <input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="4"
                  value={formData.credits}
                  onChange={handleChange}
                />
                {errors.credits && <p className="form-error">{errors.credits}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input
                  id="duration"
                  name="duration"
                  className="form-control"
                  placeholder="e.g. 10 Weeks"
                  value={formData.duration}
                  onChange={handleChange}
                />
                {errors.duration && <p className="form-error">{errors.duration}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="totalSeats">Total Seats</label>
                <input
                  id="totalSeats"
                  name="totalSeats"
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="50"
                  value={formData.totalSeats}
                  onChange={handleChange}
                />
                {errors.totalSeats && <p className="form-error">{errors.totalSeats}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="form-control"
                placeholder="What will students learn in this course?"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="prerequisites">Prerequisites</label>
              <input
                id="prerequisites"
                name="prerequisites"
                className="form-control"
                placeholder="e.g. Basic Programming Knowledge, or 'None'"
                value={formData.prerequisites}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Course'}
            </button>
          </form>
        </div>

        {/* Course Catalog Management */}
        <div className="card admin-list-card">
          <h3>Course Catalog ({courses.length})</h3>
          <div className="admin-course-list">
            {courses.map((course) => (
              <div key={course.id} className="admin-course-row">
                <div>
                  <span className="badge badge-info">{course.id}</span>
                  <p className="admin-course-name">{course.name}</p>
                  <p className="admin-course-meta">
                    {course.department} &middot; {course.availableSeats}/{course.totalSeats} seats
                  </p>
                </div>
                {isExtraCourse(course.id) ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeCourse(course.id)}
                  >
                    Remove
                  </button>
                ) : (
                  <span className="admin-seed-tag">Seed data</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
