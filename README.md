# 🎓 Course Registration Portal

A modern, responsive **Course Registration Portal** built with **React.js (Vite)**. Students can browse available courses, register for them, track their registrations, and manage their profile — all powered by local JSON data (no backend required).

---

## 📌 Project Overview

The Course Registration Portal simulates a real-world academic registration system. It allows students to:

- Log in with a dummy authentication system
- Browse a catalog of 15+ courses with search, filter, and sort
- View detailed course information
- Register for and drop courses, with live seat tracking
- View and edit their profile
- Reach out via a contact form

The project is built to demonstrate clean React architecture (hooks, context, reusable components, protected routes) and is fully prepared for CI/CD deployment via **Jenkins**.

---

## ✨ Features

- 🏠 **Home Page** — welcome banner, featured courses, navigation, footer
- 📝 **Register Page** — student sign-up (creates a new account, stored locally)
- 🔐 **Login Page** — role-based dummy authentication (student or admin), with a link to sign up
- 📊 **Dashboard** — stats (total/registered courses, credits) + quick nav
- 📚 **Courses Page** — search bar, department filter, sort by name
- 📄 **Course Details Page** — full course info with register/drop actions
- 📖 **My Courses Page** — view & drop registered courses
- 👤 **Profile Page** — view and edit student information
- 🛠️ **Admin Dashboard** — admin-only page to add new courses to the catalog and remove ones they've added
- ℹ️ **About Page** — project description
- ✉️ **Contact Page** — validated contact form
- 🔄 **Registration Rules** — must be logged in to register, no duplicate registration, live seat counts, success/error toasts
- 📱 **Fully Responsive** — mobile-first, works on all screen sizes
- ⏳ **Loading Spinners** & **Toast Notifications** throughout
- 🛡️ **Protected Routes** — Dashboard, My Courses, and Profile require a student login; Admin Dashboard requires an admin login

### Login → Register → Admin Flow

This project intentionally mirrors a real registration system's flow:

1. **New students sign up** on the **Register** page (`/register`) — this creates an account (stored in the browser's local storage, since there's no backend).
2. **Everyone logs in** on the **Login** page (`/login`) before doing anything account-specific. Clicking "Register" or "Drop Course" on any course while logged out redirects you to Login first, with an error toast explaining why.
3. **Students**, once logged in, can browse `/courses`. Clicking **Register** opens a confirmation form pre-filled with their profile details (name, register number, department, year, email) — they confirm or edit these before the registration is finalized. Seats update live and duplicate registration is blocked. **Dropping** a course also requires being logged in as the student who registered for it — registrations are tracked per student account, not shared globally.
4. **Admins** log in with an admin account and are taken to `/admin`, the **Admin Dashboard**, where they can add new courses (ID, name, department, instructor, credits, duration, seats, description, prerequisites) that immediately appear in the student-facing catalog.

---

## 🛠️ Tech Stack

| Category         | Technology                  |
|-------------------|------------------------------|
| Framework         | React.js (Vite)              |
| Routing           | React Router DOM             |
| HTTP Client       | Axios (configured for future backend use) |
| Styling           | Custom CSS (design system with CSS variables) |
| Notifications     | react-toastify               |
| Data              | Local JSON (no backend)      |
| State Management  | React Context API + Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) |
| CI/CD             | Jenkins (Declarative Pipeline & Freestyle) |

---

## 📁 Folder Structure

```
course-registration-portal/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CourseCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── QuickNavCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── MyCourses.jsx
│   │   ├── Profile.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── context/
│   │   └── AppContext.jsx    # Global state: auth, courses, registrations, admin actions
│   ├── data/
│   │   ├── courses.json      # 15+ sample courses (seed data)
│   │   ├── students.json     # Seed student credentials
│   │   └── admins.json       # Seed admin credentials
│   ├── services/
│   │   ├── api.js            # Axios instance
│   │   ├── authService.js    # Login/signup/logout/profile logic
│   │   └── courseService.js  # Course fetching + admin add/remove helpers
│   ├── styles/                # Component & page-specific CSS
│   ├── assets/
│   ├── App.jsx                # Route definitions
│   └── main.jsx                # App entry point
├── index.html
├── vite.config.js
├── package.json
├── Jenkinsfile                 # Declarative pipeline
├── .eslintrc.cjs
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd course-registration-portal

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Demo Login Credentials

| Role    | Email                 | Password    |
|---------|------------------------|-------------|
| Student | student@nec.edu.in     | student123  |
| Student | demo@nec.edu.in         | demo1234    |
| Admin   | admin@nec.edu.in        | admin123    |

Or click **"Autofill Student Demo"** / **"Autofill Admin Demo"** on the Login page. New students can also create their own account via **Register** (`/register`).

---

## 📦 Production Build

```bash
npm run build
```

This generates an optimized static build inside the **`dist/`** folder.

To preview the production build locally:

```bash
npm run preview
```

---

## 🧩 Jenkins CI/CD Setup

### Option A — Freestyle Job

1. Create a new **Freestyle project** in Jenkins.
2. Under **Source Code Management**, point it to this repository.
3. Under **Build Steps**, add an **"Execute shell"** step:

   ```bash
   npm install
   npm run build
   ```

4. Under **Post-build Actions**, add **"Archive the artifacts"** and set the files to archive:

   ```
   dist/**
   ```

5. Save and run the build.

### Option B — Pipeline Job (Declarative)

1. Create a new **Pipeline project** in Jenkins.
2. Under **Pipeline**, choose **"Pipeline script from SCM"** and point it to this repository (the `Jenkinsfile` is included at the project root).
3. Ensure a **NodeJS tool** named `NodeJS` is configured under **Manage Jenkins → Tools** (or update the `tools { nodejs '...' }` block in the `Jenkinsfile` to match your configured tool name).
4. Save and run the pipeline. It will execute the following stages:

   - **Checkout** — pulls source code from SCM
   - **Install Dependencies** — `npm install`
   - **Build React App** — `npm run build`
   - **Test** — placeholder test stage
   - **Archive Build** — archives `dist/**`
   - **Deploy** — placeholder deploy stage (customize for your target)
   - **Post actions** — prints a success/failure message

The full `Jenkinsfile` is included in the project root and ready to use as-is.

---

## 📸 Screenshots

> Add screenshots of your running application here.

| Page          | Screenshot                          |
|----------------|---------------------------------------|
| Home           | `screenshots/home.png`                |
| Login          | `screenshots/login.png`               |
| Dashboard      | `screenshots/dashboard.png`           |
| Courses        | `screenshots/courses.png`             |
| Course Details | `screenshots/course-details.png`      |
| My Courses     | `screenshots/my-courses.png`          |
| Profile        | `screenshots/profile.png`             |

---

## 🔮 Future Enhancements

- Connect to a real backend (Node/Express + database) via the pre-configured Axios instance
- Add real authentication (JWT-based) instead of dummy login
- Add course prerequisites validation (block registration if prerequisites aren't met)
- Add pagination/infinite scroll for large course catalogs
- Add unit and integration tests (Jest + React Testing Library) and wire them into the Jenkins "Test" stage
- Add Dockerfile and containerized deployment stage in Jenkins
- Add email notifications on registration/drop
- Add an admin panel for managing courses and seat capacities

---

## 📄 License

This project is provided for educational purposes as part of an academic course registration system demo.
