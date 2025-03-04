import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext.jsx'
import { AppProvider } from './context/UserContext.jsx'
import './App.css'

const Login = lazy(() => import('./pages/Authentication/Login'))
const Register = lazy(() => import('./pages/Authentication/Register'))
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'))
const Verification = lazy(() => import('./pages/Authentication/Verification'))
const Homepage = lazy(() => import('./pages/Home/Home'))
const TeacherManagement = lazy(() => import('./pages/TeacherManagement/TeacherManagement'))
const ConfirmationForm = lazy(() => import('./components/ConfirmationForm'))
const TeacherClassPage = lazy(() => import('./pages/Class/TeacherClassPage'))
const TeacherDashboard = lazy(() => import('./pages/Class/TeacherDashboard'))
const PersistLogin = lazy(() => import('./components/PersistLogin'))

const App = () => {
  return (
      <Router>
        <AuthProvider>
        <Suspense >
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/verification/:email' element={<Verification />} />
            <Route 
              element={
                <AppProvider>
                  <UserProvider>
                    <PersistLogin />
                  </UserProvider>
                </AppProvider>
              }
            >
              <Route path='/home' element={<Homepage />} />
              <Route path='/teacher-management' element={<TeacherManagement />} />
              <Route path='/confirm-teacher-account' element={<ConfirmationForm />} />
              <Route path='/teacher-class-page' element={<TeacherClassPage />} />
              <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
            </Route>
          </Routes>
        </Suspense>
        </AuthProvider>
      </Router>
  )
}

export default App
