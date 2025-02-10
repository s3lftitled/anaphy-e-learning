import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

const Login = lazy(() => import('./pages/Authentication/Login'))
const Register = lazy(() => import('./pages/Authentication/Register'))
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'))
const Verification = lazy(() => import('./pages/Authentication/Verification'))
const Home = lazy(() => import('./pages/Home/Home'))
const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/home' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/verification/:email' element={<Verification />}/>
      </Routes>
    </Router>
  )
}

export default App
