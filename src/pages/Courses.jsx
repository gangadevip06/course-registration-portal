import { useEffect, useMemo, useState } from 'react'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useApp } from '../context/AppContext'
import { getDepartments } from '../services/courseService'
import '../styles/courses.css'

// Courses listing page: search, filter by department, and sort by name.
const Courses = () => {
  const { courses, loadingCourses } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [department, setDepartment] = useState('All')
  const [sortOrder, setSortOrder] = useState('asc')
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    setDepartments(getDepartments())
  }, [courses])

  // useMemo recalculates the filtered/sorted list only when a dependency changes.
  const filteredCourses = useMemo(() => {
    let result = [...courses]

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term) ||
          c.instructor.toLowerCase().includes(term)
      )
    }

    if (department !== 'All') {
      result = result.filter((c) => c.department === department)
    }

    result.sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    )

    return result
  }, [courses, searchTerm, department, sortOrder])

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Available Courses</h1>
        <p>Search, filter, and register for courses that match your interests.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="course-filters card">
        <input
          type="text"
          className="form-control"
          placeholder="Search by course name, ID, or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-control"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="All">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          className="form-control"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort: Name (A-Z)</option>
          <option value="desc">Sort: Name (Z-A)</option>
        </select>
      </div>

      {loadingCourses ? (
        <LoadingSpinner label="Loading courses..." />
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>Try adjusting your search term or department filter.</p>
        </div>
      ) : (
        <>
          <p className="course-result-count">{filteredCourses.length} course(s) found</p>
          <div className="grid grid-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Courses
