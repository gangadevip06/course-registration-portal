import studentsData from '../data/students.json'
import adminsData from '../data/admins.json'

const AUTH_KEY = 'crp_auth_user'
const REGISTERED_STUDENTS_KEY = 'crp_registered_students'

const simulateDelay = (data, ms = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

// Students who sign up through the Register page are stored here
// (separate from the seed data in students.json).
const getRegisteredStudents = () => {
  const raw = localStorage.getItem(REGISTERED_STUDENTS_KEY)
  return raw ? JSON.parse(raw) : []
}

const saveRegisteredStudents = (students) => {
  localStorage.setItem(REGISTERED_STUDENTS_KEY, JSON.stringify(students))
}

/**
 * Student sign-up. Creates a new student account in local storage.
 * Throws if an account with the same email already exists.
 */
export const signup = async (studentData) => {
  await simulateDelay(null, 700)

  const cleanData = {
    ...studentData,
    email: studentData.email.trim().toLowerCase(),
    password: studentData.password.trim()
  }

  const registered = getRegisteredStudents()
  const allStudents = [...studentsData, ...registered]

  const alreadyExists = allStudents.some(
    (s) => s.email.toLowerCase() === cleanData.email
  )
  if (alreadyExists) {
    throw new Error('An account with this email already exists. Please login instead.')
  }

  const newStudent = { ...cleanData, role: 'student' }
  saveRegisteredStudents([...registered, newStudent])
  return newStudent
}

/**
 * Login. Checks admin credentials first, then seed + self-registered students.
 * Returns the authenticated user (with a `role` field) on success.
 * Email and password are trimmed before comparison so accidental leading/
 * trailing spaces (common with copy-paste or browser autofill) don't cause
 * a false "invalid credentials" error.
 */
export const login = async (email, password) => {
  await simulateDelay(null, 700)

  const cleanEmail = email.trim().toLowerCase()
  const cleanPassword = password.trim()

  const adminMatch = adminsData.find(
    (a) => a.email.toLowerCase() === cleanEmail && a.password === cleanPassword
  )
  if (adminMatch) {
    const { password: _pw, ...safeUser } = adminMatch
    const userWithRole = { ...safeUser, role: 'admin' }
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithRole))
    return userWithRole
  }

  const registered = getRegisteredStudents()
  const allStudents = [...studentsData, ...registered]
  const studentMatch = allStudents.find(
    (s) => s.email.toLowerCase() === cleanEmail && s.password === cleanPassword
  )
  if (studentMatch) {
    const { password: _pw, ...safeUser } = studentMatch
    const userWithRole = { ...safeUser, role: 'student' }
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithRole))
    return userWithRole
  }

  throw new Error('Invalid email or password. Please try again.')
}

export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
}

export const getCurrentUser = () => {
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? JSON.parse(raw) : null
}

export const updateCurrentUser = (updatedFields) => {
  const current = getCurrentUser()
  if (!current) return null
  const updated = { ...current, ...updatedFields }
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
  return updated
}

export const isAuthenticated = () => !!getCurrentUser()
