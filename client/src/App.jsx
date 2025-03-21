import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext.jsx'
import { AppProvider } from './context/UserContext.jsx'
import './App.css'

const Login = lazy(() => import('./pages/Authentication/Login/Login'))
const Register = lazy(() => import('./pages/Authentication/Registration/Register'))
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'))
const Verification = lazy(() => import('./pages/Authentication/Verification/Verification'))
const Homepage = lazy(() => import('./pages/Home/Home'))
const TeacherManagement = lazy(() => import('./pages/Admin/TeacherManagement/TeacherManagement.jsx'))
const ConfirmationForm = lazy(() => import('./components/Confirmation/ConfirmationForm'))
const CreateClassPage = lazy(() => import('./pages/Teacher/CreateClass/CreateClass.jsx'))
const TeacherDashboard = lazy(() => import('./pages/Teacher/ClassDashboard/TeacherDashboard.jsx'))
const PersistLogin = lazy(() => import('./components/PersistLogin'))
const CreateTopic = lazy(() => import('./pages/Content/CreateTopic.jsx'))
const CreateLesson = lazy(() => import('./pages/Content/CreateLesson.jsx'))
const CreateMultiplePages = lazy(() => import('./pages/Content/CreateMultiplePages.jsx'))
const ELearningPage = lazy(() => import('./pages/E-Learning/E-LearningPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard/AdminDashboard.jsx'))
const SystemModelPage =  lazy(() => import('./pages/Home/SystemModel.jsx'))
const StudentClass = lazy(() => import('./pages/Student/StudentClass.jsx'))
const Issues = lazy(() => import('./pages/Admin/IssuesPage/Issues.jsx'))

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
            <Route path='/admin-dashboard' element={<AdminDashboard/>} />
            <Route path="/system/:slug" element={<SystemModelPage />} />
            <Route path='/confirm-teacher-account' element={<ConfirmationForm />} />
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
              <Route path='/issues' element={<Issues />} />
              <Route path='/student-classes' element={<StudentClass />} />
              <Route path='/e-learning' element={<ELearningPage />} />
              <Route path='/home' element={<Homepage />} />
              <Route path='/teacher-management' element={<TeacherManagement />} />
              <Route path='/create-class-page' element={<CreateClassPage />} />
              <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
            </Route>
          </Routes>
        </Suspense>
        </AuthProvider>
      </Router>
  )
}

export default App
