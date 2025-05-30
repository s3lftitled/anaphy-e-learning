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
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute.jsx'))
const UnauthorizedPage = lazy(() => import('./pages/Unauthorized/Unauthorized.jsx'))
const ForgotPassword = lazy(() => import('./pages/Authentication/ForgotPassword/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/Authentication/ResetPassword/ResetPassword.jsx'))

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
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
            <Route path='/*' element={<NotFound />} />
            <Route path='/confirm-teacher-account' element={<ConfirmationForm />} />

            <Route 
              element={
                <AppProvider>
                  <UserProvider>
                    <PersistLogin />
                  </UserProvider>
                </AppProvider>
              }
            >
              <Route element={<ProtectedRoute allowedRoles={'admin'} /> }>
                <Route path='/issues' element={<Issues />} />
                <Route path='/teacher-management' element={<TeacherManagement />} />
                <Route path='/admin-dashboard' element={<AdminDashboard/>} />
                <Route path='/create-topic' element={<CreateTopic/>} />
                <Route path='/create-lesson' element={<CreateLesson/>} />
                <Route path='/create-multiple-pages' element={<CreateMultiplePages/>} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={'teacher'} />}>
                <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
                <Route path='/create-class-page' element={<CreateClassPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={'student'} />}>
                <Route path='/student-classes' element={<StudentClass />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['admin', 'student', 'teacher']} />}>
                <Route path='/e-learning' element={<ELearningPage />} />
                <Route path='/home' element={<Homepage />} />        
                <Route path="/system/:slug" element={<SystemModelPage />} />
                <Route path='/unauthorized' element={<UnauthorizedPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
        </AuthProvider>
      </Router>
  )
}

export default App
