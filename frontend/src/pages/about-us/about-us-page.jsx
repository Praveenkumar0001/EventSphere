import { useRef, useState, useEffect } from "react";
import { Play, ChevronDown, Users, Calendar, Award, ArrowRight, X, Star, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import NavSidebar from "@/components/ui/HomeNavbarandSidebar";
import Footer from "../home/Footer";

const AboutUs = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    about: false,
    stats: false,
    team: false,
    values: false,
    testimonials: false,
    timeline: false
  });
  
  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  // Particle animation effect for hero section
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvas.width) p.speedX = -p.speedX;
        if (p.y < 0 || p.y > canvas.height) p.speedY = -p.speedY;
      }
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  
  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
  };

  const scrollToNextSection = () => {
    document.getElementById('about-company').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const teamMembers = [
    { 
      name: "BHARAT SINGH", 
      role: "Frontend Developer", 
      image: "Bharat.jpg",
      quote: "Building beautiful interfaces that users love",
      socialLinks: ["twitter", "linkedin", "github"],
      achievements: "5+ years of experience in React development" 
    },
    { 
      name: "AMIT BHAGAT", 
      role: "Project Manager", 
      image: "amit.jpg",
      quote: "Turning visions into successful reality",
      socialLinks: ["twitter", "linkedin"],
      achievements: "Managed 150+ successful events" 
    },
    { 
      name: "PRAVEEN KUMAR", 
      role: "Backend Developer", 
      image: "praveen.jpg",
      quote: "Creating robust systems that stand the test of time",
      socialLinks: ["linkedin", "github"],
      achievements: "Expert in Node.js and database optimization" 
    }
  ];

  const [activeMember, setActiveMember] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      text: "Working with this team was an absolute pleasure. They transformed our corporate event from ordinary to extraordinary, handling every detail with precision and creativity. The online platform made ticket management incredibly simple.",
      author: "Sarah Johnson",
      role: "Marketing Director, TechCorp",
      rating: 5
    },
    {
      text: "This event platform exceeded all our expectations. From the initial planning stages to the final execution, the team was professional, responsive, and innovative. Our conference was a huge success thanks to their expertise.",
      author: "Michael Chen",
      role: "CEO, InnovateX",
      rating: 5
    },
    {
      text: "The tender system on this platform helped us find the perfect venues for our nationwide seminar series. The competitive bidding process ensured we got the best value while maintaining quality. Highly recommended!",
      author: "Emily Rodriguez",
      role: "Events Coordinator, EduSummit",
      rating: 4
    }
  ];

  const [activeTab, setActiveTab] = useState('event');
  
  // For FAQ accordion
  const [openQuestion, setOpenQuestion] = useState(null);
  
  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
  
  const faqs = [
    {
      question: "How does your event platform work?",
      answer: "Our platform connects event planners with venues and attendees. Organizers can create and list their events, manage registrations, and process ticket sales. Attendees can discover events, purchase tickets, and manage their bookings—all in one place."
    },
    {
      question: "What types of events can be hosted on your platform?",
      answer: "We support a wide range of events including conferences, weddings, festivals, corporate meetings, workshops, concerts, and more. Our flexible system adapts to events of any size and type."
    },
    {
      question: "How does the venue tendering system work?",
      answer: "Event organizers can create tender requests specifying their venue requirements. Venue providers can then bid on these tenders, offering their spaces and services. This creates a competitive environment where organizers can select the best options for their needs."
    },
    {
      question: "What payment methods do you support?",
      answer: "We support all major credit cards, PayPal, bank transfers, and several regional payment methods. Our secure payment processing ensures that all transactions are safe and protected."
    }
  ];

  // Timeline content
  const timeline = [
    {
      year: "2015",
      title: "Company Founded",
      description: "Started with a vision to revolutionize event management"
    },
    {
      year: "2017",
      title: "Platform Launch",
      description: "First version of our event management platform goes live"
    },
    {
      year: "2019",
      title: "Tender System",
      description: "Introduced innovative venue tendering system"
    },
    {
      year: "2021",
      title: "Mobile App",
      description: "Launched companion app for on-the-go event management"
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Expanded services to international markets"
    }
  ];

  // For newsletter signup
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="font-sans overflow-x-hidden">
      <NavSidebar scrollToFooter={scrollToFooter} />

      {/* Hero Section with Parallax and Particles */}
      <section id="hero" className="relative h-screen bg-cover bg-center flex items-center overflow-hidden">
        <canvas id="particle-canvas" className="absolute inset-0 z-10 opacity-50"></canvas>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="aboutusimage.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover transform scale-110"
            style={{
              transform: isVisible.hero ? "scale(1.05)" : "scale(1.15)",
              transition: "transform 10s ease-out"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent"></div>
        </div>
        
        <div className={`relative z-20 w-full px-6 md:px-10 transition-all duration-1000 transform ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="text-left mb-8 md:mb-0">
              <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full mb-4 animate-pulse">
                Event Management Specialists
              </div>
              <h1 className="text-4xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
                Crafting <span className="text-orange-400">Memories</span> That Last Forever
              </h1>
              <p className="text-white text-xl max-w-lg mb-8 opacity-90">
                Where vision meets execution. We create experiences that transform ordinary moments into extraordinary memories.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-700 hover:bg-orange-400 hover:text-white py-3 px-8 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center">
                  Our Services <ArrowRight size={18} className="ml-2" />
                </button>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 py-3 px-8 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
                  Get in Touch
                </button>
              </div>
            </div>
            
            <div>
              <button 
                onClick={toggleVideo}
                className="flex items-center justify-center w-24 h-24 bg-white rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-orange-400 group shadow-xl"
                aria-label="Play video"
              >
                <Play className="text-blue-600 group-hover:text-white w-12 h-12 ml-1" />
              </button>
              <p className="text-white mt-3 text-center font-medium">Watch our story</p>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={scrollToNextSection}
              className="flex flex-col items-center text-white animate-bounce"
              aria-label="Scroll down"
            >
              <span className="mb-2 font-medium">Explore More</span>
              <ChevronDown size={24} />
            </button>
          </div>

          
        </div>
        
        {/* Video Modal */}
        {isPlaying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300">
            <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden border border-gray-700">
              <button 
                onClick={toggleVideo} 
                className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-10 h-10 flex items-center justify-center z-10 hover:bg-red-600 transition-colors"
                aria-label="Close video"
              >
                <X size={20} />
              </button>
              <div className="aspect-w-16 aspect-h-9 h-full">
                {/* Replace with actual video component */}
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play size={64} className="mx-auto mb-4 text-blue-400 opacity-50" />
                    <p className="text-xl">Your company promotional video would play here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* About Your Company Section - Enhanced Design */}
<section id="about-company" className="py-20 relative overflow-hidden">
  {/* Background gradient and decoration */}
  <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-white opacity-70 -z-10"></div>
  <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-50 -z-5"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full transform -translate-x-1/2 translate-y-1/3 opacity-50 -z-5"></div>
  
  {/* Animated pattern overlay */}
  <div className="absolute inset-0 opacity-10 -z-5">
    <div className="absolute top-10 left-10 w-40 h-40 border-2 border-blue-300 rounded-full"></div>
    <div className="absolute top-20 right-20 w-20 h-20 border-2 border-orange-300 rounded-full"></div>
    <div className="absolute bottom-20 left-1/4 w-32 h-32 border-2 border-blue-300 rounded-full"></div>
    <div className="absolute top-1/3 right-1/3 w-24 h-24 border-2 border-orange-300 rounded-full"></div>
  </div>
  
  {/* Floating stats card with animation for mobile */}
  <div className="lg:hidden max-w-lg mx-auto -mt-16 mb-12 relative z-10">
    <div className="grid grid-cols-3 bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 border border-gray-100">
      <div className="flex flex-col items-center py-6 hover:bg-blue-50 transition-colors duration-300">
        <span className="text-orange-400 text-3xl mb-1">⭐</span>
        <h3 className="text-2xl font-bold text-blue-600 mb-1">27k+</h3>
        <p className="text-gray-600 text-sm">Happy Clients</p>
      </div>
      <div className="flex flex-col items-center py-6 border-l border-r border-gray-100 hover:bg-blue-50 transition-colors duration-300">
        <span className="text-blue-400 text-3xl mb-1">🎭</span>
        <h3 className="text-2xl font-bold text-blue-600 mb-1">985+</h3>
        <p className="text-gray-600 text-sm">Events</p>
      </div>
      <div className="flex flex-col items-center py-6 hover:bg-blue-50 transition-colors duration-300">
        <span className="text-orange-400 text-3xl mb-1">👥</span>
        <h3 className="text-2xl font-bold text-blue-600 mb-1">78+</h3>
        <p className="text-gray-600 text-sm">Team</p>
      </div>
    </div>
  </div>
  
  <div className="max-w-6xl mx-auto px-6 relative z-10">
    {/* Section title with animation for mobile */}
    <div className="text-center mb-12 lg:hidden">
      <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full mb-4 transform hover:scale-105 transition-transform duration-300 shadow-md">
        Our Story
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800 leading-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Revolutionizing Event Management
        </span>
      </h2>
      <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto"></div>
    </div>
    
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
      {/* Enhanced Image Column with animations and effects */}
      <div className="w-full md:w-5/12 relative transition-all duration-1000 ease-out mb-8 md:mb-0 group">
        {/* Decorative backgrounds with enhanced effects */}
        <div className="absolute top-8 left-8 w-full h-full bg-gradient-to-br from-blue-200 to-blue-50 rounded-3xl transform -rotate-6 -z-10 group-hover:-rotate-8 transition-transform duration-500"></div>
        <div className="absolute top-4 left-4 w-full h-full bg-gradient-to-br from-orange-200 to-orange-50 rounded-3xl transform rotate-3 -z-5 group-hover:rotate-5 transition-transform duration-500"></div>
        
        {/* Main image container with enhanced effects */}
        <div className="relative bg-white p-5 rounded-3xl shadow-xl overflow-hidden border border-gray-100 group-hover:shadow-2xl transition-all duration-500">
          <div className="rounded-2xl overflow-hidden">
            <img
              src="praveen.jpg"
              alt="Company Overview"
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          
          {/* Enhanced badge with better effects */}
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-full shadow-xl transform rotate-12 group-hover:rotate-0 transition-all duration-500 border-4 border-white">
            <p className="font-bold text-xl">Est. 2015</p>
          </div>
          
          {/* Added floating feature badges */}
          <div className="absolute top-6 left-0 -translate-x-1/2 bg-blue-600 text-white py-2 px-4 rounded-r-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-500">
            <p className="font-medium text-sm">Award Winning</p>
          </div>
          <div className="absolute top-20 left-0 -translate-x-1/2 bg-orange-500 text-white py-2 px-4 rounded-r-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 transition-all duration-700 delay-100">
            <p className="font-medium text-sm">Industry Leader</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Content Column with better typography and effects */}
      <div className="w-full md:w-7/12 text-left transition-all duration-1000">
        <div className="hidden lg:inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full mb-4 transform hover:scale-105 transition-transform duration-300 shadow-md">
          Our Story
        </div>
        <h2 className="hidden lg:block text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Revolutionizing Event Management
          </span>
        </h2>
        <div className="hidden lg:block w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mb-8"></div>
        
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            Welcome to our event management platform, where <span className="font-semibold text-blue-700">innovation meets execution</span>. 
            Our platform empowers clients to create and list extraordinary events, while providing 
            users with a hassle-free ticket purchasing experience. Whether you're planning a 
            dream wedding, corporate conference, or music festival, our intuitive interface transforms 
            complex event organization into a simple, streamlined process.
          </p>
          
          <p className="text-gray-700 leading-relaxed text-lg">
            For attendees, we deliver a <span className="font-semibold text-blue-700">seamless experience</span> with 
            secure transactions and mobile-friendly access, ensuring you can focus on creating memories. 
            Our innovative <span className="font-semibold text-orange-600">tender system</span> revolutionizes 
            how venues compete for events, creating a transparent marketplace where quality and value 
            drive success for vendors and exceptional experiences for event organizers.
          </p>
        </div>
        
        {/* Enhanced feature boxes with hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-5 border-l-4 border-blue-500 shadow-md hover:shadow-xl transform transition-all hover:-translate-y-1 duration-300">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-lg">Our Mission</h3>
                <p className="text-gray-600">To simplify event management and create extraordinary experiences</p>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-5 border-l-4 border-orange-500 shadow-md hover:shadow-xl transform transition-all hover:-translate-y-1 duration-300">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Award size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-lg">Our Vision</h3>
                <p className="text-gray-600">To become the world's premier platform for exceptional events</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced CTA button */}
        <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center hover:scale-105 hover:shadow-xl">
          Discover Our Journey
          <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
    
    {/* Enhanced stats with animations for desktop */}
    <div className="hidden lg:block mt-20">
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users size={32} />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-blue-600 mb-2 text-center">27k+</h3>
          <p className="text-gray-600 text-lg text-center">Happy Clients</p>
          <div className="w-0 h-1 bg-blue-600 group-hover:w-full transition-all duration-500 mt-4"></div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={32} />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-blue-600 mb-2 text-center">985+</h3>
          <p className="text-gray-600 text-lg text-center">Events Managed</p>
          <div className="w-0 h-1 bg-orange-500 group-hover:w-full transition-all duration-500 mt-4"></div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle size={32} />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-blue-600 mb-2 text-center">78+</h3>
          <p className="text-gray-600 text-lg text-center">Team Members</p>
          <div className="w-0 h-1 bg-indigo-500 group-hover:w-full transition-all duration-500 mt-4"></div>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Services Tabs Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
              What We Offer
            </div>
            <h2 className="text-4xl font-bold mb-4 text-blue-800">Our Premium Services</h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              We provide comprehensive solutions for all your event management needs,
              from planning to execution and everything in between.
            </p>
          </div>
          
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-lg bg-gray-100 p-2">
              <button 
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'event' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-blue-500'}`}
                onClick={() => setActiveTab('event')}
              >
                Event Planning
              </button>
              <button 
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'ticket' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-blue-500'}`}
                onClick={() => setActiveTab('ticket')}
              >
                Ticketing
              </button>
              <button 
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'tender' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-blue-500'}`}
                onClick={() => setActiveTab('tender')}
              >
                Venue Tendering
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-12">
                {activeTab === 'event' && (
                  <div className="h-full flex flex-col">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">Expert Event Planning</h3>
                    <p className="text-gray-600 mb-6">
                      Our platform provides a comprehensive suite of tools for event planners to create, 
                      manage, and promote their events. From weddings to corporate conferences, we have 
                      you covered with customizable templates and intuitive interfaces.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {['Customizable event pages', 'Attendee management', 'Marketing tools', 'Analytics dashboard'].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="mr-3 text-orange-500">✓</div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="mt-auto group inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                      Learn more about event planning 
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
                
                {activeTab === 'ticket' && (
                  <div className="h-full flex flex-col">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">Seamless Ticketing Solutions</h3>
                    <p className="text-gray-600 mb-6">
                      Our secure ticketing system handles everything from sales to check-ins. 
                      Multiple ticket types, automatic confirmations, and QR code generation make 
                      managing attendees effortless.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {['Multiple ticket tiers', 'Secure payment processing', 'Mobile tickets', 'Contactless check-in'].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="mr-3 text-orange-500">✓</div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="mt-auto group inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                      Explore ticketing features
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
                
                {activeTab === 'tender' && (
                  <div className="h-full flex flex-col">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">Innovative Venue Tendering</h3>
                    <p className="text-gray-600 mb-6">
                      Our unique tender system connects event organizers with venue providers. 
                      Create detailed venue specifications and receive competitive bids from qualified providers, 
                      ensuring you get the best value for your event.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {['Detailed venue specifications', 'Competitive bidding', 'Venue comparisons', 'Direct communication tools'].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="mr-3 text-orange-500">✓</div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="mt-auto group inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                      Learn about tendering
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-12 flex items-center justify-center">
                <img
                  src={activeTab === 'event' ? 'profile.png' : activeTab === 'ticket' ? 'profile.png' : 'profile.png'}
                  alt={activeTab === 'event' ? 'Event Planning' : activeTab === 'ticket' ? 'Ticketing' : 'Venue Tendering'}
                  className="rounded-lg shadow-lg max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section id="values" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
            Our Principles
          </div>
          <h2 className="text-4xl font-bold mb-4 text-blue-800">Core Values That Drive Us</h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto mb-16"></div>
          
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible.values ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {[
              {
                title: "Innovation",
                description: "We continuously seek new ways to improve our platform and services, pushing the boundaries of what's possible in event management.",
                icon: "💡",
                color: "from-blue-50 to-blue-100",
                borderColor: "border-blue-200"
              },
              {
                title: "Excellence",
                description: "We strive for perfection in every event we help bring to life, ensuring each detail meets our high standards of quality.",
                icon: "🏆",
                color: "from-orange-50 to-orange-100",
                borderColor: "border-orange-200"
              },
              {
                title: "Integrity",
                description: "We operate with honesty and transparency in all our dealings, building trust with clients, vendors, and attendees alike.",
                icon: "🤝",
                color: "from-green-50 to-green-100",
                borderColor: "border-green-200"
              }
            ].map((value, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${value.color} p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${value.borderColor}`}
              >
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-blue-700 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section id="timeline" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
              Our Journey
            </div>
            <h2 className="text-4xl font-bold mb-4 text-blue-800">Company Timeline</h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
          </div>
          
          <div className={`relative transition-all duration-1000 ${isVisible.timeline ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className={`flex justify-${index % 2 === 0 ? 'end md:justify-start' : 'start md:justify-end'} relative mb-16 last:mb-0`}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500">
                    <div className="inline-block bg-orange-100 text-orange-600 px-2 py-1 rounded-md mb-3 font-medium">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section with Interactive Slider */}
      <section id="team" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
              Meet Our Experts
            </div>
            <h2 className="text-4xl font-bold mb-4 text-blue-800">Our Team Members</h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the talented individuals who drive our success. Their expertise and dedication are the foundation of our exceptional service.
            </p>
          </div>
          
          <div className={`transition-all duration-1000 ${isVisible.team ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="relative py-12">
              {/* Team member showcase */}
              <div className="flex overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeMember * 100}%)` }}
                >
                  {teamMembers.map((member, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                        <div className="w-full lg:w-1/2 flex justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-50 rounded-full transform -rotate-6 scale-95"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-50 rounded-full transform rotate-6 scale-95"></div>
                            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
                              <img 
                                src={member.image} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -right-4 -bottom-4 bg-blue-600 text-white p-4 rounded-full shadow-lg">
                              {index + 1}/{teamMembers.length}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                          <h3 className="text-3xl font-bold text-blue-700 mb-3">{member.name}</h3>
                          <p className="text-xl text-orange-500 mb-6">{member.role}</p>
                          <p className="text-gray-600 mb-8 text-lg italic">"{member.quote}"</p>
                          
                          <div className="mb-8">
                            <h4 className="font-semibold text-blue-800 mb-2">Key Achievements:</h4>
                            <p className="text-gray-600">{member.achievements}</p>
                          </div>
                          
                          <div className="flex space-x-4 justify-center lg:justify-start">
                            {member.socialLinks.map((platform, i) => (
                              <a 
                                key={i}
                                href="#" 
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                              >
                                {platform === 'twitter' && <span>X</span>}
                                {platform === 'linkedin' && <span>in</span>}
                                {platform === 'github' && <span>GH</span>}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation arrows */}
              <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 left-0 right-0">
                <button 
                  onClick={() => setActiveMember((prev) => (prev > 0 ? prev - 1 : teamMembers.length - 1))} 
                  className="bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors focus:outline-none"
                  aria-label="Previous team member"
                >
                  ←
                </button>
                <button 
                  onClick={() => setActiveMember((prev) => (prev < teamMembers.length - 1 ? prev + 1 : 0))} 
                  className="bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors focus:outline-none"
                  aria-label="Next team member"
                >
                  →
                </button>
              </div>
              
              {/* Pagination dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveMember(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeMember === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to team member ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Carousel */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-white bg-opacity-20 text-blue-700 px-4 py-1 rounded-full mb-4">
              Client Feedback
            </div>
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto"></div>
          </div>
          
          <div className={`transition-all duration-1000 ${isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="bg-white text-gray-800 p-8 rounded-xl shadow-xl relative">
                        <div className="text-6xl text-blue-100 absolute top-4 left-4">"</div>
                        <div className="relative z-10">
                          <div className="flex mb-6">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={20} 
                                className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                          
                          <p className="text-gray-700 text-lg mb-8 italic leading-relaxed">
                            {testimonial.text}
                          </p>
                          
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                              <img src="praveen.jpg" alt={testimonial.author} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-blue-700">{testimonial.author}</p>
                              <p className="text-gray-600 text-sm">{testimonial.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation arrows */}
              <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 left-0 right-0">
                <button 
                  onClick={() => setCurrentTestimonial(prev => (prev > 0 ? prev - 1 : testimonials.length - 1))} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-700 hover:text-blue-600 transition-all focus:outline-none -ml-5"
                  aria-label="Previous testimonial"
                >
                  ←
                </button>
                <button 
                  onClick={() => setCurrentTestimonial(prev => (prev < testimonials.length - 1 ? prev + 1 : 0))} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-700 hover:text-blue-600 transition-all focus:outline-none -mr-5"
                  aria-label="Next testimonial"
                >
                  →
                </button>
              </div>
              
              {/* Pagination dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentTestimonial === index ? 'bg-white w-8' : 'bg-white bg-opacity-30 hover:bg-opacity-50'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
              Got Questions?
            </div>
            <h2 className="text-4xl font-bold mb-4 text-blue-800">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="flex items-center justify-between w-full p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-blue-700">{faq.question}</h3>
                  <span className={`transform transition-transform ${openQuestion === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openQuestion === index ? 'max-h-80' : 'max-h-0'}`}
                >
                  <div className="p-5 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-white bg-opacity-20 text-blue-700 px-4 py-1 rounded-full mb-4">
            Stay Updated
          </div>
          <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="mb-8 max-w-lg mx-auto">
            Get the latest updates, news, and special offers delivered directly to your inbox.
          </p>
          
          {isSubscribed ? (
            <div className="bg-white text-blue-600 p-4 rounded-lg shadow-lg inline-block">
              <p className="font-medium">Thanks for subscribing! Check your inbox soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-300 text-gray-800"
                  required
                />
                <button 
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
              Get In Touch
            </div>
            <h2 className="text-4xl font-bold mb-4 text-blue-800">Contact Us</h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">Our Location</h3>
              <p className="text-gray-600">
                123 Event Street<br />
                Bangalore, Karnataka<br />
                India
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">Email Us</h3>
              <p className="text-gray-600">
                info@eventplatform.com<br />
                support@eventplatform.com
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">Call Us</h3>
              <p className="text-gray-600">
                +91 1234 567890<br />
                +91 9876 543210
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button 
              onClick={scrollToFooter}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Full Contact Details
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Next Amazing Event?</h2>
          <p className="mb-12 text-xl max-w-2xl mx-auto">
            Join thousands of satisfied clients who have transformed their event ideas into reality with our comprehensive platform.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-white text-blue-600 hover:bg-blue-50 py-4 px-10 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
              Start Planning Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 py-4 px-10 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-lg">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      <Footer ref={footerRef} />
    </div>
  );
};

export default AboutUs;