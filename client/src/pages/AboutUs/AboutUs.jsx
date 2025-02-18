import { Link } from 'react-router-dom'
import './AboutUs.css'

const AboutUs = () => {
    return (
      <>
        <div className='about-us-container'>
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
              <h3>Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.
              </h3>
            </div>
            <div className="sdg-9">
              <h2>SDG 9</h2>
              <h3>Description</h3>
            </div>
          </div>
        </div>
      </>
    )
}

export default AboutUs