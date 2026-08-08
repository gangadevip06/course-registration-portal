import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import RegistrationModal from './components/RegistrationModal'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import MyCourses from './pages/MyCourses'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Root application component. Defines the route table and global layout.
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected routes — require login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      {/* Registration confirmation modal (collects/confirms student details) */}
      <RegistrationModal />

      {/* Global toast notification container */}
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </>
  )
}

export default App
