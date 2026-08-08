import { useState } from 'react'
import { toast } from 'react-toastify'
import '../styles/contact.css'

// Contact form with client-side validation. Simulates a submission
// (no backend) and shows a toast notification on success.
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.name.trim()) newErrors.name = 'Name is required.'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    // Simulate a network request since there is no backend.
    setTimeout(() => {
      toast.success('Your message has been sent! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setSubmitting(false)
    }, 800)
  }

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Have a question or need help? Send us a message.</p>
      </div>

      <div className="contact-grid">
        <div className="card contact-form-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
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

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows="5"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <p className="form-error">{errors.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="card contact-info-card">
          <h3>Get in Touch</h3>
          <ul>
            <li>
              <span>📍</span>
              <div>
                <strong>Address</strong>
                <p>National Engineering College, Kovilpatti, Tamil Nadu</p>
              </div>
            </li>
            <li>
              <span>✉️</span>
              <div>
                <strong>Email</strong>
                <p>support@crportal.edu.in</p>
              </div>
            </li>
            <li>
              <span>📞</span>
              <div>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Contact
