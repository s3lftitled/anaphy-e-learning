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
      modelSrc: "https://human.biodigital.com/viewer/?id=65M6&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VGy&paid=o_2bb445ae",
      slug: "skeletal",
      description: "The skeletal system provides structural support for the body, protects vital organs, and works with muscles to enable movement. Consisting of 206 bones in adults, it also produces blood cells in bone marrow and stores minerals like calcium and phosphorus. Each bone is a dynamic, living tissue that continuously rebuilds and reforms throughout life."
    },
    /* { 
      name: "Hand bones",
      backgroundImage: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWRyaDd5ZWdkdno5ajk3MTg2N2c0YmJiczhrcWV4ZHNlaXQ4cmlpbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ov9jWEoCJtzRWs02A/giphy.gif",
      backgroundPosition: '20% 20%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"",
      slug: "hand",
      description: "Carpal bones (proximal) – a set of eight irregularly shaped bones. They are located in the area of the wrist. Metacarpals – a set of five bones, each one related to a digit. They are located in the area of the palm. Phalanges (distal) – the bones of the digits"
    },
    */
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
      name: " Male Endocrine System",
      backgroundImage: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG5sNWF2cWo5enR6ODVoMXVlZDA4eHJuYnYxdGN2NHF0ajkxNHJ4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LyaGVgxlGYHrW2Do1A/giphy.gif",
      backgroundPosition: '50% 20%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=65MO&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M2VKG&paid=o_2bb445ae",
      slug: "endocrine",
      description: "The endocrine system is a network of glands that produce and release hormones—chemical messengers that regulate metabolism, growth, tissue function, reproduction, sleep, and mood. Though tiny in amount (measured in billionths of grams), these powerful chemical signals coordinate slow-acting but long-lasting changes throughout the body. Major endocrine glands include the pituitary, thyroid, parathyroid, adrenal, pancreas, and reproductive glands."
    },
    { 
      name: "Female Endocrine System",
      backgroundImage: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3p1NXBpaHd1eDBxcjVwOXI3angxam9icjV5eGs1ZDhycnM4bjFnNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TGqWGcUJGICXnWqkvr/giphy.gif",
      backgroundPosition: '40% 60%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=68ZW&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M3QJi&paid=o_1b172637",
      slug: "endocrine",
      description: "The endocrine system is a network of glands that produce and release hormones—chemical messengers that regulate metabolism, growth, tissue function, reproduction, sleep, and mood. Though tiny in amount (measured in billionths of grams), these powerful chemical signals coordinate slow-acting but long-lasting changes throughout the body. Major endocrine glands include the pituitary, thyroid, parathyroid, adrenal, pancreas, and reproductive glands."
    },
    
    { 
      name: "Male Reproductive System",
      backgroundImage: "https://blog.ninapaley.com/wp-content/uploads/male1_6.gif",
      backgroundPosition: '100%' ,
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=68ZR&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M3QIB&paid=o_1b172637", 
      slug: "reproductive",
      description: "The reproductive system of an organism, also known as the genital system, is the biological system made up of all the anatomical organs involved in sexual reproduction. Many non-living substances such as fluids, hormones, and pheromones are also important accessories to the"
    },
    { 
      name: "Female Reproductive System",
      backgroundImage: "https://blog.ninapaley.com/wp-content/uploads/uteri2_8.gif",
      backgroundPosition: '40% 60%',
      backgroundSize: '100%',
      textColor: 'white',
      modelSrc:"https://human.biodigital.com/viewer/?id=68ZS&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M3QIu&paid=o_1b172637",
      slug: "reproductive",
      description: "The reproductive system of an organism, also known as the genital system, is the biological system made up of all the anatomical organs involved in sexual reproduction. Many non-living substances such as fluids, hormones, and pheromones are also important accessories to the"
    },
   
    
  ]

  const { user } = useUser()
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const [newsArticles, setNewsArticles] = useState([])
  const [caseStudies, setCaseStudies] = useState([])
  const [isLoadingNews, setIsLoadingNews] = useState(true)
  const [isLoadingCases, setIsLoadingCases] = useState(true)

  const fetchAnatomyNews = async () => {
    setIsLoadingNews(true)
    try {
      // You'll need to set up a news API account and use your API key
      // This is using NewsAPI.org as an example
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: 'human anatomy and physiology and medical and health',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5,
          apiKey: '2c31ea74a263413682f77ff4cb8e2f17' 
        }
      })
      
      // Process news articles and match them with related body systems
      const processedNews = response.data.articles.map(article => {
        // Determine which body system the article relates to
        const matchedSystem = determineRelatedSystem(article.title + ' ' + article.description)
        return {
          ...article,
          relatedSystem: matchedSystem
        }
      })
      
      setNewsArticles(processedNews)
    } catch (error) {
      console.error('Error fetching news:', error)
      // Fallback to sample news data
      setNewsArticles(sampleNewsData)
    }
    setIsLoadingNews(false)
  }
  
  // Function to determine which body system an article relates to
  const determineRelatedSystem = (text) => {
    const systemKeywords = {
      'skeletal': ['bone', 'skeleton', 'joint', 'cartilage', 'skull', 'spine'],
      'hand': ['hand', 'finger', 'wrist', 'palm', 'carpal'],
      'muscular': ['muscle', 'tendon', 'myocyte', 'contraction', 'myosin'],
      'nervous': ['brain', 'nerve', 'neuron', 'spinal', 'neurotransmitter'],
      'cardiovascular': ['heart', 'blood', 'vessel', 'artery', 'vein', 'cardiac'],
      'respiratory': ['lung', 'breath', 'oxygen', 'alveoli', 'diaphragm'],
      'digestive': ['stomach', 'intestine', 'digest', 'liver', 'pancreas'],
      'endocrine': ['hormone', 'gland', 'thyroid', 'insulin', 'pituitary'],
      'reproductive': ['uterus', 'ovary', 'testes', 'sperm', 'egg', 'fertility']
    }
    
    // Convert text to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase()
    
    // Find the system with the most keyword matches
    let bestMatch = null
    let highestCount = 0
    
    for (const [system, keywords] of Object.entries(systemKeywords)) {
      const matchCount = keywords.filter(keyword => lowerText.includes(keyword)).length
      if (matchCount > highestCount) {
        highestCount = matchCount
        bestMatch = system
      }
    }
    
    return bestMatch || 'general' // Default to 'general' if no specific system matches
  }

  // Function to fetch daily case studies
const fetchCaseStudies = async () => {
  setIsLoadingCases(true)
  try {
    // Fetch from an API or database if available
    // For demonstration, we're using the PubMed API
    const date = new Date()
    const seed = date.getDate() + (date.getMonth() + 1) * 31 // Use date as seed for "random" daily selection
    
    const response = await axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi', {
      params: {
        db: 'pubmed',
        term: 'anatomy case study',
        retmode: 'json',
        retmax: 10,
        sort: 'relevance'
      }
    })
    
    // Get article IDs
    const ids = response.data.esearchresult.idlist
    
    // Fetch detailed information for each article
    const detailResponse = await axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi', {
      params: {
        db: 'pubmed',
        id: ids.join(','),
        retmode: 'json'
      }
    })
    
    // Process and select 3 case studies (based on daily seed)
    const studies = []
    const result = detailResponse.data.result
    
    for (const id of ids) {
      if (studies.length >= 3) break
      
      const article = result[id]
      if (!article) continue
      
      studies.push({
        id,
        title: article.title,
        authors: article.authors ? article.authors.map(a => a.name).join(', ') : 'Unknown',
        journal: article.fulljournalname || 'Scientific Journal',
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        relatedSystem: determineRelatedSystem(article.title)
      })
    }
    
    setCaseStudies(studies)
  } catch (error) {
    console.error('Error fetching case studies:', error)
    // Fall back to sample case studies
    setCaseStudies(sampleCaseStudies)
  }
  setIsLoadingCases(false)
}

// Sample data to use as fallback
const sampleNewsData = [
  {
    title: "New Discovery Shows How Brain Processes Visual Information",
    description: "Researchers have identified a novel neural pathway that explains how the brain processes complex visual information.",
    url: "https://example.com/news/1",
    urlToImage: "https://via.placeholder.com/300x200?text=Brain+Research",
    publishedAt: "2025-05-05T09:30:00Z",
    source: { name: "Neuroscience Today" },
    relatedSystem: "nervous"
  },
  {
    title: "Revolutionary Treatment for Osteoporosis Shows Promise in Clinical Trials",
    description: "A new drug targeting bone density has shown remarkable results in strengthening the skeletal system in patients with osteoporosis.",
    url: "https://example.com/news/2",
    urlToImage: "https://via.placeholder.com/300x200?text=Bone+Research",
    publishedAt: "2025-05-04T14:15:00Z",
    source: { name: "Medical Advances" },
    relatedSystem: "skeletal"
  },
  {
    title: "Heart Muscle Regeneration Breakthrough Could Transform Cardiac Care",
    description: "Scientists have developed a technique to stimulate heart muscle cell regeneration after damage, potentially revolutionizing treatment for heart attack patients.",
    url: "https://example.com/news/3",
    urlToImage: "https://via.placeholder.com/300x200?text=Heart+Research",
    publishedAt: "2025-05-03T11:45:00Z",
    source: { name: "Cardiovascular Science" },
    relatedSystem: "cardiovascular"
  },
  {
    title: "New Imaging Technology Reveals Previously Unseen Lung Structures",
    description: "Advanced 4D imaging has revealed microscopic structures in the lungs that may play a crucial role in respiratory diseases.",
    url: "https://example.com/news/4",
    urlToImage: "https://via.placeholder.com/300x200?text=Lung+Research",
    publishedAt: "2025-05-02T08:20:00Z",
    source: { name: "Respiratory Journal" },
    relatedSystem: "respiratory"
  }
]

const sampleCaseStudies = [
  {
    id: "12345678",
    title: "Rare Anatomical Variation in the Brachial Plexus: A Case Study",
    authors: "Smith, J., Jones, A., Williams, B.",
    journal: "Journal of Anatomical Variations",
    url: "https://example.com/case-study/1",
    relatedSystem: "nervous"
  },
  {
    id: "23456789",
    title: "Unusual Presentation of Carpal Tunnel Syndrome: Clinical Implications",
    authors: "Johnson, M., Thompson, L.",
    journal: "Hand Surgery International",
    url: "https://example.com/case-study/2",
    relatedSystem: "hand"
  },
  {
    id: "34567890",
    title: "Congenital Heart Defect with Unusual Ventricular Configuration: Surgical Approach",
    authors: "Garcia, P., Lee, S., Chen, H.",
    journal: "Cardiac Surgery Cases",
    url: "https://example.com/case-study/3",
    relatedSystem: "cardiovascular"
  }
]

// Add this useEffect inside your component to load news and case studies when the page loads
useEffect(() => {
  fetchAnatomyNews()
  fetchCaseStudies()
  
  // Set up daily refresh for case studies
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const timeUntilMidnight = tomorrow - now
  
  const dailyRefreshTimer = setTimeout(() => {
    fetchCaseStudies()
    // Set up daily refresh after first execution
    const dailyInterval = setInterval(fetchCaseStudies, 24 * 60 * 60 * 1000)
    return () => clearInterval(dailyInterval)
  }, timeUntilMidnight)
  
  return () => clearTimeout(dailyRefreshTimer)
}, [])

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