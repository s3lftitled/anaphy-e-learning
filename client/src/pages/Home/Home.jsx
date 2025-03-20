import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AnatomyChatbot from '../../components/ChatbotComponent/Chatbot'
import './Home.css'
import { useUser } from '../../context/UserContext'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'

const Homepage = () => {
  const topics = [
    { 
      name: "Skeletal System", 
      backgroundImage: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTIzM3djYWl6bTNnajlxeTl3cm83YWJ1ZnBnazZrMnc0OGQ1Ym1ucSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4VEAg0IWR7gNa/giphy.gif",
      backgroundPosition: '50% 10%',
      backgroundSize: '150%',
      textColor: 'white',
      modelSrc: "https://human.biodigital.com/viewer/?id=62dI&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1nqy&paid=o_18063d15",
      slug: "skeletal"
    },
    { 
      name: "Muscular System",
      backgroundImage: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWp4Z2NybXk4NmR1Nnd6bTMwbWIwbDdrOGVwMWMzeDZiM3k1eGZ5YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C5gocDBDRdJ6g/giphy.gif",
      backgroundPosition: '50% 5%',
      backgroundSize: '150%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dN&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1nrf&paid=o_18063d15"
    },
    { 
      name: "Nervous System",
      backgroundImage: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDR0cXIycDRtanpmNmxtYndkYjlieGR6dHZwM2psZnM3dXF0amZybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3nSGQ045gEvvQFRm/giphy.gif",
      backgroundPosition: '50% 50%',
      backgroundSize: '150%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dO&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1nrs&paid=o_18063d15",
      slug: "nervous"
    },
    { 
      name: "Cardiovascular System",
      backgroundImage: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGo4a2k3NTRpYTh4NGs1NmNna25wdXJoOHJqdm1wMWFia25zNDN2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yeUxljCJjH1rW/giphy.gif",
      backgroundPosition: '50% 50%',
      backgroundSize: '120%',
      textColor: 'white',
      modelSrc: "https://human.biodigital.com/viewer/?id=62TW&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1lvI&paid=o_18063d15",
      slug: "cardiovascular"
    },
    { 
      name: "Respiratory System",
      backgroundImage: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXBuY2ttNzlhMGppeDVvcjRjazB3dTdlcWVoY3htdXFqeW85OWF4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g7teYpDDWjP7q/giphy.gif",
      backgroundPosition: '50% 30%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dP&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1ns0&paid=o_18063d15",
      slug: "respiratory"
    },
    {  
      name: "Digestive System",
      backgroundImage: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWl0azdkMXVkdGUzeWZiMzVjMzBzbGtramJsbXBya2xocmRrMG5ycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lckhIaarcbT20CXRDo/giphy.gif",
      backgroundPosition: '50% 30%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dQ&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1ns5&paid=o_18063d15",
      slug: "digestive"
    },
    { 
      name: "Endocrine System",
      backgroundImage: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG5sNWF2cWo5enR6ODVoMXVlZDA4eHJuYnYxdGN2NHF0ajkxNHJ4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LyaGVgxlGYHrW2Do1A/giphy.gif",
      backgroundPosition: '50% 20%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dW&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1nsJ&paid=o_18063d15",
      slug: "endocrine"
    },
    { 
      name: "Immune System",
      backgroundImage: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWZsbDgwYXgycTVwZWc0NHd3aXQ2YTRtOG03MzRrcXJ5bWNlY2Z1bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oGRFxviWGwk77MfE4/giphy.gif",
      backgroundPosition: '50% 30%',
      backgroundSize: '130%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dW&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1nsJ&paid=o_18063d15",
      slug: "immune"
    }
  ]
  
  const { user } = useUser()
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return
    
    setIsScrolling(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.classList.add('grabbing')
  }

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return
    
    setIsScrolling(false)
    scrollContainerRef.current.classList.remove('grabbing')
  }

  const handleMouseMove = (e) => {
    if (!isScrolling || !scrollContainerRef.current) return
    
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTopicClick = (topic) => {
    // Navigate to the model view page with the selected topic
    navigate(`/system/${topic.slug}`, { 
      state: { 
        topic: topic 
      } 
    })
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseUp)
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [isScrolling])
 
  return (
    <div className="homepage">
      <AnatomyChatbot />
      <Navbar user={user}/>
      <Sidebar user={user}/>
      
      <main className="main-content">
        <div className="hero-section">
          <div className="head-content">
            <h1 className="home-title">
              Interactive Human<br />
              <span className="hero-highlight">Anatomy</span>
            </h1>
            <p className="hero-subtitle">Explore the human body through our interactive e-learning</p>
          </div>
          <div className="hero-image">
            <img src="hero-skull.png" alt="Skull" className="skull-icon" />
            <div className="pulse-effect"></div>
          </div>
        </div>
        
        <h2 className="section-title">Body Systems</h2>
        
        <div className="topics-container-wrapper">
          <div 
            className="topics-container" 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            <div className="topics-grid">
              {topics.map((topic, index) => (
                <div 
                  key={index} 
                  className="topic-card"
                  style={{
                    backgroundImage: `url(${topic.backgroundImage})`,
                    backgroundSize: topic.backgroundSize || 'cover',
                    backgroundPosition: topic.backgroundPosition || 'center',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="topic-overlay" />
                  <div className="topic-info">
                    <h3 className="topic-title" style={{color: topic.textColor || 'white'}}>{topic.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Homepage