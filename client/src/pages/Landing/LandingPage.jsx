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

        <div class="sdg-container">
          <div class="sdg-3">
            <div class="sdg-icon sdg3-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                <path fill="#FF5252" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                <path fill="white" d="M13.5 7c-1.1 0-2 .9-2 2h-2c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2h.5v3h2v-3h1v5h2v-5h.5c1.1 0 2-.9 2-2s-.9-2-2-2z" opacity="0.7"/>
              </svg>
            </div>
            <h2>SDG 3</h2>
            <h3>Ensure healthy lives and promote well-being for all at all ages.</h3>
          </div>
          <div class="sdg-4">
            <div class="sdg-icon sdg4-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                <path fill="#4CAF50" d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                <path fill="white" d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99zm0 5c.88 0 1.73.09 2.5.26V14.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.3-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99z" opacity="0.8"/>
              </svg>
            </div>
            <h2>SDG 4</h2>
            <h3>Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.</h3>
          </div>
          <div class="sdg-9">
            <div class="sdg-icon sdg9-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                <path fill="#FF9800" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12h-3v3h-2v-3H8v-2h3V8h2v5h3v2z"/>
                <path fill="#FFC107" d="M15 9h-2V6h-2v3H8v2h3v3h2v-3h3z" opacity="0.5"/>
                <path fill="white" d="M11 18h2v-3h3v-2h-3v-3h-2v3H8v2h3z" opacity="0.8"/>
              </svg>
            </div>
            <h2>SDG 9</h2>
            <h3>Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.</h3>
          </div>
          </div>
      </section>

      {/* Contact Us Section */}
      <section ref={contactRef} id="contact" className="contact-section">
        <h1 className="section-title">Our Team</h1>
        <div className="contact-container">
          <div className="card">
            <div className="imageWrapper">
              <img className="contact-image" src="ems.jpg" alt="John Lino" />
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