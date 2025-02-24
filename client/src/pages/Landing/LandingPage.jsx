import { Link } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <>
    <div className='landing-page'>
      <div className="container">
          <img src='1stpage.png' />
        </div>

        <div className="landing-nav">
          <Link className="nav-link" href="">Home</Link>
          <Link className="nav-link" href="">About</Link>
          <Link className="nav-link" href="">Contact</Link>
          <Link className="landing-login" to="/login">Login</Link>
        </div>

        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>

        <h1 className="interato"> INTERACTIVE </h1>
        <h1 className="humato"> HUMAN</h1>
        <h1 className="anato"> ANATOMY </h1>
        <hr>
        </hr>
        <h3> Enhance the educational experience for nursing students </h3>
      </div>
    </>
  )
}

export default LandingPage