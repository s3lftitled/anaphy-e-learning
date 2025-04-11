import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AnatomyChatbot from '../../components/ChatbotComponent/Chatbot'
import './Home.css'
import { useUser } from '../../context/UserContext'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Homepage = () => {
  const topics = [
    { 
      name: "Skeletal System", 
      backgroundImage: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTIzM3djYWl6bTNnajlxeTl3cm83YWJ1ZnBnazZrMnc0OGQ1Ym1ucSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4VEAg0IWR7gNa/giphy.gif",
      backgroundPosition: '50% 10%',
      backgroundSize: '150%',
      textColor: 'white',
      modelSrc: "https://human.biodigital.com/viewer/?id=65M6&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VGy&paid=o_2bb445ae",
      slug: "skeletal",
      description: "The skeletal system provides structural support for the body, protects vital organs, and works with muscles to enable movement. Consisting of 206 bones in adults, it also produces blood cells in bone marrow and stores minerals like calcium and phosphorus. Each bone is a dynamic, living tissue that continuously rebuilds and reforms throughout life."
    },
    { 
      name: "Muscular System",
      backgroundImage: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWp4Z2NybXk4NmR1Nnd6bTMwbWIwbDdrOGVwMWMzeDZiM3k1eGZ5YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C5gocDBDRdJ6g/giphy.gif",
      backgroundPosition: '50% 5%',
      backgroundSize: '150%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=65MA&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VHk&paid=o_2bb445ae",
      slug: "muscular",
      description: "The muscular system comprises over 600 muscles that make up about 40% of body weight. These tissues contract to produce movement, maintain posture, stabilize joints, and generate heat. The three types of muscle tissue—skeletal, cardiac, and smooth—work together to enable both voluntary movements like walking and involuntary functions like digestion and heartbeat."
    },
    { 
      name: "Nervous System",
      backgroundImage: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDR0cXIycDRtanpmNmxtYndkYjlieGR6dHZwM2psZnM3dXF0amZybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3nSGQ045gEvvQFRm/giphy.gif",
      backgroundPosition: '50% 50%',
      backgroundSize: '150%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=65MF&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VIn&paid=o_2bb445ae",
      slug: "nervous",
      description: "The nervous system is the body's control center, consisting of the brain, spinal cord, and a vast network of nerves. This complex communication highway transmits electrical signals that coordinate everything from conscious actions and thoughts to unconscious processes like breathing and digestion. Neurons—specialized cells that can transmit information—form the foundation of this system, with an adult human brain containing approximately 86 billion of these remarkable cells."
    },
    { 
      name: "Cardiovascular System",
      backgroundImage: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGo4a2k3NTRpYTh4NGs1NmNna25wdXJoOHJqdm1wMWFia25zNDN2MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yeUxljCJjH1rW/giphy.gif",
      backgroundPosition: '50% 50%',
      backgroundSize: '120%',
      textColor: 'white',
      modelSrc: "https://human.biodigital.com/viewer/?id=65MI&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VIy&paid=o_2bb445ae",
      slug: "cardiovascular",
      description: "The cardiovascular system is a sophisticated transportation network powered by the heart, which pumps approximately 2,000 gallons of blood through 60,000 miles of blood vessels daily. This system delivers oxygen and nutrients to cells while removing waste products. The heart beats about 100,000 times per day, creating a continuous flow that maintains homeostasis and supports every other body system."
    },
    { 
      name: "Respiratory System",
      backgroundImage: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXBuY2ttNzlhMGppeDVvcjRjazB3dTdlcWVoY3htdXFqeW85OWF4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g7teYpDDWjP7q/giphy.gif",
      backgroundPosition: '50% 30%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=65MJ&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VJr&paid=o_2bb445ae",
      slug: "respiratory",
      description: "The respiratory system facilitates gas exchange, bringing oxygen into the bloodstream and expelling carbon dioxide. Centered on the lungs, this system includes the nose, pharynx, larynx, trachea, bronchi, and diaphragm. With each breath, air travels through a series of increasingly smaller airways until reaching the alveoli—tiny air sacs where oxygen and carbon dioxide exchange occurs across membranes just one cell thick."
    },
    {  
      name: "Digestive System",
      backgroundImage: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWl0azdkMXVkdGUzeWZiMzVjMzBzbGtramJsbXBya2xocmRrMG5ycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lckhIaarcbT20CXRDo/giphy.gif",
      backgroundPosition: '50% 30%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dQ&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1ns5&paid=o_18063d15",
      slug: "digestive",
      description: "The digestive system is a 30-foot-long pathway that breaks down food into nutrients the body can absorb and use for energy, growth, and cell repair. This complex system includes the mouth, esophagus, stomach, small intestine, large intestine, liver, pancreas, and gallbladder. Food takes between 24-72 hours to complete its journey through this remarkable processing system, which produces over 7 liters of digestive juices daily."
    },
    { 
      name: "Endocrine System",
      backgroundImage: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG5sNWF2cWo5enR6ODVoMXVlZDA4eHJuYnYxdGN2NHF0ajkxNHJ4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LyaGVgxlGYHrW2Do1A/giphy.gif",
      backgroundPosition: '50% 20%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=65MO&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VKG&paid=o_2bb445ae",
      slug: "endocrine",
      description: "The endocrine system is a network of glands that produce and release hormones—chemical messengers that regulate metabolism, growth, tissue function, reproduction, sleep, and mood. Though tiny in amount (measured in billionths of grams), these powerful chemical signals coordinate slow-acting but long-lasting changes throughout the body. Major endocrine glands include the pituitary, thyroid, parathyroid, adrenal, pancreas, and reproductive glands."
    },
    { 
      name: "Immune System",
      backgroundImage: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWZsbDgwYXgycTVwZWc0NHd3aXQ2YTRtOG03MzRrcXJ5bWNlY2Z1bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oGRFxviWGwk77MfE4/giphy.gif",
      backgroundPosition: '50% 30%',
      backgroundSize: '130%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=62dW&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&load-rotate=10&uaid=M1nsJ&paid=o_18063d15",
      slug: "immune",
      description: "The immune system is the body's complex defense network against harmful invaders like bacteria, viruses, fungi, and parasites. This sophisticated protection includes physical barriers like skin, chemical defenses like stomach acid, and specialized cells that can identify and destroy threats. The system also maintains immunological memory—allowing for faster, stronger responses to previously encountered pathogens—through a remarkable coordination of white blood cells, lymph nodes, and specialized tissues."
    }
  ]

  const { user } = useUser()
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scrollTopics = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth * 0.8 // Scroll 80% of container width
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  // Check if there's content to scroll to and update arrow visibility
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    
    // Check if we can scroll left (not at the beginning)
    const canScrollLeft = container.scrollLeft > 5
    
    // Check if we can scroll right (not at the end)
    const canScrollRight = container.scrollLeft + container.clientWidth < container.scrollWidth - 5
    
    setShowLeftArrow(canScrollLeft)
    setShowRightArrow(canScrollRight)
  }

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      
      // Initial check after content is loaded
      checkScrollability()
      
      // Additional check after a small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        checkScrollability()
      }, 500)
      
      return () => {
        container.removeEventListener('scroll', checkScrollability)
        clearTimeout(timer)
      }
    }
  }, [])
  
  // Check scrollability on window resize
  useEffect(() => {
    const handleResize = () => {
      checkScrollability()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  useEffect(() => {
    // Page title
    document.title = `AnaphyVerse - Home`
  }, [])
  
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
          {showLeftArrow && (
            <button 
              className="scroll-arrow scroll-left"
              onClick={() => scrollTopics('left')}
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>
          )}
          
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
          
          {showRightArrow && (
            <button 
              className="scroll-arrow scroll-right"
              onClick={() => scrollTopics('right')}
              aria-label="Scroll right"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default Homepage