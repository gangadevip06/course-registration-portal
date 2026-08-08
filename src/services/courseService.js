import coursesData from '../data/courses.json'

const EXTRA_COURSES_KEY = 'crp_extra_courses'

const simulateDelay = (data, ms = 600) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

// Courses added by an admin at runtime are stored separately from the
// seed data in courses.json, since that file can't be written to from
// the browser. The two lists are merged when reading.
const getExtraCourses = () => {
  const raw = localStorage.getItem(EXTRA_COURSES_KEY)
  return raw ? JSON.parse(raw) : []
}

const saveExtraCourses = (courses) => {
  localStorage.setItem(EXTRA_COURSES_KEY, JSON.stringify(courses))
}

/**
 * Fetch all available courses (seed data + any admin-added courses).
 */
export const getCourses = () => {
  return simulateDelay([...coursesData, ...getExtraCourses()])
}

/**
 * Fetch a single course by its ID.
 */
export const getCourseById = (courseId) => {
  const all = [...coursesData, ...getExtraCourses()]
  const course = all.find((c) => c.id === courseId)
  return simulateDelay(course || null, 400)
}

/**
 * Get a unique, sorted list of departments for filter dropdowns.
 */
export const getDepartments = () => {
  const all = [...coursesData, ...getExtraCourses()]
  const departments = [...new Set(all.map((c) => c.department))]
  return departments.sort()
}

/**
 * Admin action: add a new course. Throws if the course ID is already in use.
 */
export const addCourse = (course) => {
  const all = [...coursesData, ...getExtraCourses()]
  if (all.some((c) => c.id.toLowerCase() === course.id.toLowerCase())) {
    throw new Error(`Course ID "${course.id}" is already in use. Please choose a unique ID.`)
  }
  const extras = getExtraCourses()
  saveExtraCourses([...extras, course])
  return course
}

/**
 * Admin action: remove a course. Only admin-added (extra) courses can be
 * removed — the original seed catalog in courses.json is left untouched.
 */
export const deleteCourse = (courseId) => {
  const extras = getExtraCourses()
  saveExtraCourses(extras.filter((c) => c.id !== courseId))
}

/**
 * Returns true if a course was added by an admin at runtime
 * (as opposed to being part of the original seed catalog).
 */
export const isExtraCourse = (courseId) => {
  return getExtraCourses().some((c) => c.id === courseId)
}
