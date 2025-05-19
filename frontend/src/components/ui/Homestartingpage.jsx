import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Star, Calendar, Users, Activity, Settings, Play, ArrowRight } from "lucide-react";

const HeroSection = ({ scrollToEventGenres }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("slide-in");
  const [activeTab, setActiveTab] = useState("create");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const words = [
    "Revolutionary",
    "Immersive", 
    "Streamlined",
    "Captivating",
    "Next-Level"
  ];

  // Particle system
  const particlesRef = useRef([]);
  const particleCount = 100;
  
  useEffect(() => {
    if (!particlesRef.current.length) {
      particlesRef.current = Array(particleCount).fill().map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1
      }));
    }
    
    const animateParticles = () => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, i) => {
        if (!particlesRef.current[i]) return;
        
        particlesRef.current[i].x += particlesRef.current[i].speedX;
        particlesRef.current[i].y += particlesRef.current[i].speedY;
        
        // Loop particles when they go off screen
        if (particlesRef.current[i].x > 100) particlesRef.current[i].x = 0;
        if (particlesRef.current[i].x < 0) particlesRef.current[i].x = 100;
        if (particlesRef.current[i].y > 100) particlesRef.current[i].y = 0;
        if (particlesRef.current[i].y < 0) particlesRef.current[i].y = 100;
        
        particle.style.left = `${particlesRef.current[i].x}%`;
        particle.style.top = `${particlesRef.current[i].y}%`;
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    
    // Word animation
    const wordInterval = setInterval(() => {
      setAnimationClass("slide-out");
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setAnimationClass("slide-in");
      }, 800);
    }, 3500);
    
    // Mouse parallax effect
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) - 0.5,
        y: ((e.clientY - rect.top) / rect.height) - 0.5
      });
    };
    
    // Scroll effect
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(wordInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Features data
  const features = {
    create: {
      title: "Create Amazing Events",
      description: "Design stunning event pages with our intuitive drag-and-drop builder, customized registrations, and branded experiences.",
      icon: <Calendar size={24} className="text-purple-400" />,
      color: "from-purple-600 to-pink-600"
    },
    manage: {
      title: "Powerful Management Tools",
      description: "Track registrations, communicate with attendees, and monitor your event metrics all from one centralized dashboard.",
      icon: <Settings size={24} className="text-blue-400" />,
      color: "from-blue-600 to-cyan-600"
    },
    engage: {
      title: "Engage Your Audience",
      description: "Interactive features like live polls, Q&A sessions, networking tools, and personalized attendee journeys.",
      icon: <Users size={24} className="text-green-400" />,
      color: "from-green-600 to-teal-600"
    }
  };

  return (
    <div 
      ref={heroRef}
      className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, #13132b, #090918)"
      }}
    >
      {/* Animated particle system */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(particleCount).fill().map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full bg-white"
            style={{
              width: `${particlesRef.current[i]?.size || 2}px`,
              height: `${particlesRef.current[i]?.size || 2}px`,
              left: `${particlesRef.current[i]?.x || 0}%`,
              top: `${particlesRef.current[i]?.y || 0}%`,
              opacity: particlesRef.current[i]?.opacity || 0.2,
              boxShadow: `0 0 ${(particlesRef.current[i]?.size || 2) * 2}px rgba(255, 255, 255, 0.8)`
            }}
          />
        ))}
      </div>

      {/* Animated gradient blobs */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)",
          top: '10%',
          left: '15%',
          transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
          transition: 'transform 0.2s ease-out',
          animation: 'pulse 8s infinite alternate'
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full opacity-30 blur-3xl"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #2dd4bf)",
          bottom: '15%',
          right: '10%',
          transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
          transition: 'transform 0.2s ease-out',
          animation: 'pulse 6s infinite alternate-reverse'
        }}
      />
      <div 
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: "linear-gradient(135deg, #f43f5e, #ec4899)",
          top: '60%',
          left: '60%',
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
          transition: 'transform 0.2s ease-out',
          animation: 'pulse 7s infinite alternate'
        }}
      />

      {/* Content with z-index to appear above background elements */}
      <div 
        className="z-10 flex flex-col items-center px-4 md:px-6 max-w-6xl mx-auto"
        style={{
          transform: `translateY(${scrollPosition * -0.2}px)`,
          opacity: Math.max(0, 1 - scrollPosition / 500)
        }}
      >
        {/* Laser light effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-purple-500 to-transparent opacity-50" 
            style={{transform: `rotate(${mousePosition.x * 5}deg)`}} />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-blue-500 to-transparent opacity-30" 
            style={{transform: `rotate(${mousePosition.x * -8}deg)`}} />
        </div>

        {/* Badge */}
        <div className="text-center mb-6 animate-fade-in-up">
          <span className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-purple-900/50 to-fuchsia-900/50 backdrop-blur-md border border-purple-500/30 text-sm font-medium tracking-wider">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            LAUNCHING SOON
          </span>
        </div>
        
        {/* Main heading with 3D effect */}
        <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-center leading-tight animate-fade-in-up">
          <span className="relative inline-block" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
            The Future Of
            <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20"></span>
          </span>
          <br />
          <span 
            className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 relative"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 5s ease infinite'
            }}
          >
            Event Management
          </span>
        </h1>

        {/* Dynamic text transition */}
        <div className="h-24 relative overflow-hidden flex items-center justify-center mb-8 w-full">
          <span
            key={wordIndex}
            className={`absolute text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-violet-500 to-fuchsia-500 text-transparent bg-clip-text animate-${animationClass}`}
          >
            {words[wordIndex]}
          </span>
        </div>

        {/* Description */}
        <p className="text-xl mb-12 text-center max-w-3xl text-blue-100 leading-relaxed animate-fade-in-up" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
          Evently revolutionizes the event experience with AI-powered tools, immersive attendee engagement, 
          and real-time analytics that make your events truly unforgettable.
        </p>

        {/* Feature tabs */}
        <div className="w-full max-w-4xl mb-12">
          <div className="flex justify-center mb-6 backdrop-blur-sm bg-white/5 p-1 rounded-full border border-white/10 overflow-hidden">
            {Object.keys(features).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? `bg-gradient-to-r ${features[tab].color} text-white shadow-lg` 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Feature content */}
          <div className="relative h-64 overflow-hidden rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6">
            {Object.keys(features).map((tab) => (
              <div
                key={tab}
                className={`absolute inset-0 p-6 transition-all duration-500 flex ${
                  activeTab === tab 
                    ? 'opacity-100 translate-x-0' 
                    : activeTab > tab 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="w-1/4 flex items-start justify-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${features[tab].color}`}>
                    {features[tab].icon}
                  </div>
                </div>
                <div className="w-3/4">
                  <h3 className="text-2xl font-bold mb-2">{features[tab].title}</h3>
                  <p className="text-gray-300">{features[tab].description}</p>
                  <button className="mt-6 flex items-center text-sm font-medium text-white/80 hover:text-white">
                    Learn more <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 animate-fade-in-up">
          <button
            onClick={scrollToEventGenres}
            className="group relative px-8 py-4 rounded-full font-bold text-lg overflow-hidden"
            style={{
              background: "linear-gradient(90deg, #8B5CF6, #EC4899, #F43F5E)"
            }}
          >
            <span className="relative z-10 flex items-center justify-center">
              Get Started Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            <span className="absolute inset-0" style={{
              background: "linear-gradient(90deg, #8B5CF6, #EC4899, #F43F5E, #8B5CF6)",
              backgroundSize: "200% 100%",
              animation: "gradientShift 3s linear infinite"
            }}></span>
          </button>
          
          <button 
            className="group relative px-8 py-4 rounded-full font-bold text-lg border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all overflow-hidden"
            onClick={() => setIsVideoPlaying(true)}
          >
            <span className="relative z-10 flex items-center justify-center">
              <Play size={18} className="mr-2" />
              Watch Demo
            </span>
            <span className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-all"></span>
            <span className="absolute -inset-full transform-gpu blur-3xl group-hover:animate-pulse bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-30"></span>
          </button>
        </div>
        
        {/* Stats counter */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 animate-fade-in-up">
          {[
            { number: "10K+", label: "Events Hosted" },
            { number: "2M+", label: "Attendees" },
            { number: "98%", label: "Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {stat.number}
              </div>
              <div className="text-gray-400 mt-1 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce mt-8">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl aspect-video bg-black/80 rounded-lg overflow-hidden border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              <span className="absolute text-sm text-blue-400">Loading demo...</span>
            </div>
            <button 
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setIsVideoPlaying(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-out {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-40px);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.4;
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-out {
          animation: slide-out 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          animation-delay: calc(var(--index, 0) * 0.1s);
        }
      `}</style>
    </div>
  );
};

export default HeroSection;