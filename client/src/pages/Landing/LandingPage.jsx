import { useRef } from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
  // Create refs for each section
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)

  // Function to scroll to a section
  const scrollToSection = (elementRef) => {
    elementRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='landing-container'>
      <div className="scrollable-page">
      {/* Navigation Bar */}
      <div className="landing-nav-bar">
        <button 
          className="landing-nav-link" 
          onClick={() => scrollToSection(homeRef)}
        >
          Home
        </button>
        <button 
          className="landing-nav-link" 
          onClick={() => scrollToSection(aboutRef)}
        >
          About
        </button>
        <button 
          className="landing-nav-link" 
          onClick={() => scrollToSection(contactRef)}
        >
          Contact
        </button>
        <Link className="landing-nav-login" to="/login">Login</Link>
      </div>

      {/* Landing Page Section */}
      <section ref={homeRef} id="home" className="landing-section">
        <div className="container">
          <img src='1stpage.png' alt="Background" />
        </div>

        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>

        <div className="hero-content">
          <h1 className="title-interactive">INTERACTIVE</h1>
          <h1 className="title-human">HUMAN</h1>
          <h1 className="title-anatomy">ANATOMY</h1>
          <hr className="divider" />
          <h3 className="subtitle">Enhance the educational experience for nursing students</h3>
        </div>
      </section>

      {/* About Us Section */}
      <section ref={aboutRef} id="about" className="about-section">
        <div className="aboutus">
          <h1>About Us</h1>
          <h2>Description</h2>
        </div>

        <div className="sdg-container"> 
          <div className="sdg-3">
            <h2>SDG 3</h2>
            <h3>Description</h3>
          </div>
          <div className="sdg-4">
            <h2>SDG 4</h2>
            <h3>Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.</h3>
          </div>
          <div className="sdg-9">
            <h2>SDG 9</h2>
            <h3>Description</h3>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section ref={contactRef} id="contact" className="contact-section">
        <h1 className="section-title">Our Team</h1>
        <div className="contact-container">
          <div className="card">
            <div className="imageWrapper">
              <img className="contact-image" src="" alt="John Lino" />
            </div>
            <h2 className="member-name">Demonteverde, John Lino Javien</h2>
            <h3 className="position">Leader/Backend Developer</h3>

            <div className="social-icons">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img className="twitter-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon.svg" alt="Twitter" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img className="facebook-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon-1.svg" alt="Facebook" />
              </a>
            </div>
          </div>

          <div className="card">
            <div className="imageWrapper">
              <img className="contact-image" src="" alt="Jashua Bautista" />
            </div>
            <h2 className="member-name">Obina, Jashua Bautista</h2>
            <h3 className="position">Backend Developer</h3>

            <div className="social-icons">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img className="twitter-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon.svg" alt="Twitter" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img className="facebook-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon-1.svg" alt="Facebook" />
              </a>
            </div>
          </div>

          <div className="card">
            <div className="imageWrapper">
              <img className="contact-image" src="" alt="Frances June" />
            </div>
            <h2 className="member-name">Ortiguero, Frances June</h2>
            <h3 className="position">Designer/Frontend Developer</h3>
            <div className="social-icons">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img className="twitter-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon.svg" alt="Twitter" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img className="facebook-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon-1.svg" alt="Facebook" />
              </a>
            </div>
          </div>

          <div className="card">
            <div className="imageWrapper">
              <img className="contact-image" src='Chrystal.jpg' alt="Ma. Chrystal" />
            </div>
            <h2 className="member-name">Fucio, Ma. Chrystal Yvone Rabago</h2>
            <h3 className="position">Designer/Frontend Developer</h3>
            <div className="social-icons">
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img className="twitter-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon.svg" alt="Twitter" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img className="facebook-icon" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/Icon-1.svg" alt="Facebook" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  )
}

export default LandingPage