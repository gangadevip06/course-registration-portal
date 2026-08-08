import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getCourses,
  addCourse as addCourseService,
  deleteCourse as deleteCourseService
} from '../services/courseService'
import {
  login as loginService,
  signup as signupService,
  logout as logoutService,
  getCurrentUser,
  updateCurrentUser
} from '../services/authService'

const AppContext = createContext(null)

// Registrations are stored per student account, keyed by email, so one
// student's registrations never leak into another student's session.
const REGISTRATIONS_MAP_KEY = 'crp_registrations_by_user'

const loadRegistrationsMap = () => {
  const raw = localStorage.getItem(REGISTRATIONS_MAP_KEY)
  return raw ? JSON.parse(raw) : {}
}

const saveRegistrationsMap = (map) => {
  localStorage.setItem(REGISTRATIONS_MAP_KEY, JSON.stringify(map))
}

const getRegistrationsFor = (email) => {
  if (!email) return []
  const map = loadRegistrationsMap()
  return map[email] || []
}

const setRegistrationsFor = (email, ids) => {
  if (!email) return
  const map = loadRegistrationsMap()
  map[email] = ids
  saveRegistrationsMap(map)
}

// Seats are a shared pool across every student, so on load we subtract
// one seat for every registration on record, regardless of which
// student account it belongs to.
const applySeatAdjustments = (rawCourses) => {
  const map = loadRegistrationsMap()
  const counts = {}
  Object.values(map).forEach((ids) => {
    ids.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1
    })
  })
  return rawCourses.map((course) => ({
    ...course,
    availableSeats: Math.max(course.availableSeats - (counts[course.id] || 0), 0)
  }))
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser())
  const [courses, setCourses] = useState([])
  const [registeredCourseIds, setRegisteredCourseIds] = useState(() =>
    getRegistrationsFor(getCurrentUser()?.email)
  )
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [registrationModalCourse, setRegistrationModalCourse] = useState(null)
  const navigate = useNavigate()

  // Load courses once on mount, applying seat adjustments for every
  // registration on record (across all student accounts).
  useEffect(() => {
    let isMounted = true
    setLoadingCourses(true)
    getCourses().then((data) => {
      if (!isMounted) return
      setCourses(applySeatAdjustments(data))
      setLoadingCourses(false)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const loggedInUser = await loginService(email, password)
    setUser(loggedInUser)
    // Load this specific student's own registrations (empty array for admins).
    setRegisteredCourseIds(getRegistrationsFor(loggedInUser.email))
    return loggedInUser
  }, [])

  const signup = useCallback(async (studentData) => {
    const newStudent = await signupService(studentData)
    return newStudent
  }, [])

  const logout = useCallback(() => {
    logoutService()
    setUser(null)
    setRegisteredCourseIds([])
    setRegistrationModalCourse(null)
    toast.info('You have been logged out.')
  }, [])

  const editProfile = useCallback((fields) => {
    const updated = updateCurrentUser(fields)
    setUser(updated)
    toast.success('Profile updated successfully!')
  }, [])

  // Opens the "confirm your details" modal for a course. Requires login,
  // blocks admins, and blocks courses that are already full or already
  // registered — the modal itself only appears once those checks pass.
  const openRegistrationModal = useCallback(
    (course) => {
      if (!user) {
        toast.error('Please login to register for a course.')
        navigate('/login')
        return
      }
      if (user.role === 'admin') {
        toast.error('Admin accounts cannot register for courses.')
        return
      }
      if (registeredCourseIds.includes(course.id)) {
        toast.error('You are already registered for this course.')
        return
      }
      if (course.availableSeats <= 0) {
        toast.error('No seats available for this course.')
        return
      }
      setRegistrationModalCourse(course)
    },
    [user, registeredCourseIds, navigate]
  )

  const closeRegistrationModal = useCallback(() => setRegistrationModalCourse(null), [])

  // Registration Rule: must be logged in as a student, cannot register
  // twice, and seats decrease by 1 on success. `studentDetails` is the
  // confirmed/edited info collected from the registration modal.
  const registerCourse = useCallback(
    (courseId, studentDetails) => {
      if (!user) {
        toast.error('Please login to register for a course.')
        navigate('/login')
        return false
      }
      if (user.role === 'admin') {
        toast.error('Admin accounts cannot register for courses.')
        return false
      }
      if (registeredCourseIds.includes(courseId)) {
        toast.error('You are already registered for this course.')
        return false
      }

      const course = courses.find((c) => c.id === courseId)
      if (!course) {
        toast.error('Course not found.')
        return false
      }
      if (course.availableSeats <= 0) {
        toast.error('No seats available for this course.')
        return false
      }

      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, availableSeats: c.availableSeats - 1 } : c
        )
      )
      const updatedIds = [...registeredCourseIds, courseId]
      setRegisteredCourseIds(updatedIds)
      setRegistrationsFor(user.email, updatedIds)

      // Persist any edits made to the student's details during registration.
      if (studentDetails) {
        editProfile(studentDetails)
      }

      toast.success(`Successfully registered for ${course.name}!`)
      return true
    },
    [courses, registeredCourseIds, user, navigate, editProfile]
  )

  // Registration Rule: must be logged in to drop a course, and dropping
  // increases seats by 1.
  const dropCourse = useCallback(
    (courseId) => {
      if (!user) {
        toast.error('Please login to drop a course.')
        navigate('/login')
        return false
      }
      if (!registeredCourseIds.includes(courseId)) {
        toast.error('You are not registered for this course.')
        return false
      }

      const course = courses.find((c) => c.id === courseId)

      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, availableSeats: c.availableSeats + 1 } : c
        )
      )
      const updatedIds = registeredCourseIds.filter((id) => id !== courseId)
      setRegisteredCourseIds(updatedIds)
      setRegistrationsFor(user.email, updatedIds)
      toast.info(`Dropped ${course ? course.name : 'course'}.`)
      return true
    },
    [courses, registeredCourseIds, user, navigate]
  )

  // Admin action: add a new course to the catalog.
  const addCourse = useCallback((courseInput) => {
    try {
      const newCourse = {
        ...courseInput,
        availableSeats: courseInput.totalSeats
      }
      addCourseService(newCourse)
      setCourses((prev) => [...prev, newCourse])
      toast.success(`Course "${newCourse.name}" added successfully!`)
      return true
    } catch (err) {
      toast.error(err.message)
      return false
    }
  }, [])

  // Admin action: remove a course that was added at runtime.
  const removeCourse = useCallback((courseId) => {
    deleteCourseService(courseId)
    setCourses((prev) => prev.filter((c) => c.id !== courseId))
    toast.info('Course removed from the catalog.')
  }, [])

  const value = {
    user,
    login,
    signup,
    logout,
    editProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    courses,
    loadingCourses,
    registeredCourseIds,
    registeredCourses: courses.filter((c) => registeredCourseIds.includes(c.id)),
    registerCourse,
    dropCourse,
    addCourse,
    removeCourse,
    registrationModalCourse,
    openRegistrationModal,
    closeRegistrationModal
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook for consuming the app context
export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return ctx
}
