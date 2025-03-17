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
    <h1>ABOUT US</h1>
    <p className="about-description">
      This project will help nursing students at Panpacific University 
      develop their understanding of human anatomy and physiology, by 
      aligning with several Sustainable Development Goals such as SDG 
      3: Good Health and Well-Being, SDG 4: Quality Education, and SDG 
      9: Industry, Innovation and Infrastructure.
    </p>
  </div>

  {/* Bubbles */}
  <div className="bubble" style={{ width: '100px', height: '100px', top: '10%', left: '5%' }}></div>
  <div className="bubble" style={{ width: '150px', height: '150px', top: '20%', right: '10%' }}></div>
  <div className="bubble" style={{ width: '120px', height: '120px', bottom: '15%', left: '20%' }}></div>

  <div className="sdg-container"> 
    <div className="sdg-card">
      <div className="sdg-icon">
        <img src="Sdg3.png" alt="Health Icon" className="sdg-icon-img" />
      </div>
      <h2>SDG 3: GOOD HEALTH AND WELL-BEING</h2>
      <div className="sdg-description">
        <p>The project directly contributes to this by assisting with the 
        development of future nurses, who are going to be important in 
        the provision of health services in the future</p>
      </div>
    </div>
    
    <div className="sdg-card">
      <div className="sdg-icon">
        <img src="sdg4.png" alt="Education Icon" className="sdg-icon-img" />
      </div>
      <h2>SDG 4: QUALITY EDUCATION</h2>
      <div className="sdg-description">
        <p>Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.</p>
      </div>
    </div>
    
    <div className="sdg-card">
      <div className="sdg-icon">
        <img src="sdg9.png" alt="Innovation Icon" className="sdg-icon-img" />
      </div>
      <h2>SDG 9: INDUSTRY, INNOVATION AND INFRASTRUCTURE</h2>
      <div className="sdg-description">
        <p>Using technology and innovation to enhance educational outcomes and prepare students for future healthcare challenges.</p>
      </div>
    </div>
  </div>
</section>
      {/* Contact Us Section */}
      <section ref={contactRef} id="contact" className="contact-section">
        <h1 className="contact-section-title">Our Team</h1>
        <div className="contact-container">
          <div className="card">
            <div className="imageWrapper">
              <img className="contact-image" src="" alt="John Lino" />
            </div>
            <h2 className="member-name">Demonteverde, John Lino Javien</h2>
            <h3 className="position">Lead Developer</h3>

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
              <img className="contact-image" src="june.jpg" alt="Frances June" />
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
              <img className="contact-image" src='chrystal.jpg' alt="Ma. Chrystal" />
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

