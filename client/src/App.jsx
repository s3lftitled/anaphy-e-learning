import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

const Login = lazy(() => import('./pages/Authentication/Login'))
const Register = lazy(() => import('./pages/Authentication/Register'))
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'))
const Verification = lazy(() => import('./pages/Authentication/Verification'))
const Homepage = lazy(() => import('./pages/Home/Home'))
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'))
const TeacherManagement = lazy(() => import('./pages/TeacherManagement/TeacherManagement'))
const ConfirmationForm = lazy(() => import('./components/ConfirmationForm'))

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<LandingPage />}/>
          <Route path='/home' element={<Homepage />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/verification/:email' element={<Verification />}/>
          <Route path='/teacher-management' element={<TeacherManagement/>}/>
          <Route path='/confirm-teacher-account' element={<ConfirmationForm/>}/>
          <Route path='/about-us' element={<AboutUs/>}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
