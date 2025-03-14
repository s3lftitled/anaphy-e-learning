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
const ConfirmationForm = lazy(() => import('./components/Confirmation/ConfirmationForm'))
const TeacherClassPage = lazy(() => import('./pages/Class/TeacherClassPage'))
const TeacherDashboard = lazy(() => import('./pages/Class/TeacherDashboard'))
const PersistLogin = lazy(() => import('./components/PersistLogin'))
const CreateTopic = lazy(() => import('./pages/Content/CreateTopic.jsx'))
const CreateLesson = lazy(() => import('./pages/Content/CreateLesson.jsx'))
const CreateMultiplePages = lazy(() => import('./pages/Content/CreateMultiplePages.jsx'))
const ELearningPage = lazy(() => import('./pages/E-Learning/E-LearningPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'))

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
            <Route path='/create-topic' element={<CreateTopic/>} />
            <Route path='/create-lesson' element={<CreateLesson/>} />
            <Route path='/create-multiple-pages' element={<CreateMultiplePages/>} />
            <Route path='/*' element={<NotFound />} />
            <Route 
              element={
                <AppProvider>
                  <UserProvider>
                    <PersistLogin />
                  </UserProvider>
                </AppProvider>
              }
            >
              <Route path='/e-learning' element={<ELearningPage />} />
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
