import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Music, 
  TrendingUp, 
  Ticket, 
  Award,
  ChevronRight,
  Loader2
} from 'lucide-react';

const genres = [
  { 
    title: 'Cultural Fest', 
    image: 'culturalgenre2.jpeg',
    icon: <Award className="w-8 h-8" />,
    description: 'Celebrate diversity through art, music, and traditions',
    color: 'from-purple-600 to-indigo-600'
  },
  { 
    title: 'Sports', 
    image: 'sportsgenre.jpg',
    icon: <TrendingUp className="w-8 h-8" />,
    description: 'Competitions, tournaments and athletic showcases',
    color: 'from-green-600 to-teal-600'
  },
  { 
    title: 'Musical Concerts', 
    image: 'concertgenre.jpg',
    icon: <Music className="w-8 h-8" />,
    description: 'Live performances from your favorite artists',
    color: 'from-pink-600 to-rose-600' 
  },
  { 
    title: 'Comedy Shows', 
    image: 'combedygenre.jpg',
    icon: <Users className="w-8 h-8" />,
    description: 'Laugh out loud with talented comedians',
    color: 'from-yellow-500 to-amber-600'
  },
  { 
    title: 'Science Fair', 
    image: 'sciencegenre.jpg',
    icon: <Calendar className="w-8 h-8" />,
    description: 'Explore innovations and scientific discoveries',
    color: 'from-blue-600 to-cyan-600'
  },
];

const GenreCard = ({ genre, count, onClick, isHovered, onHover }) => {
  const iconMap = {
    'Cultural Fest': <Award className="w-6 h-6" />,
    'Sports': <TrendingUp className="w-6 h-6" />,
    'Musical Concerts': <Music className="w-6 h-6" />,
    'Comedy Shows': <Users className="w-6 h-6" />,
    'Science Fair': <Calendar className="w-6 h-6" />,
  };

  return (
    <motion.div
      className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-xl cursor-pointer m-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(genre.title)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80 z-10`}></div>
      
      {/* Background image */}
      <div className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{ 
          backgroundImage: `url(${genre.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      ></div>

      {/* Content */}
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between text-white">
        <div>
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center mb-4">
            {genre.icon}
          </div>
          <h3 className="text-2xl font-bold mb-2">{genre.title}</h3>
          <p className="text-sm text-white text-opacity-90">{genre.description}</p>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Ticket className="w-5 h-5 mr-2" />
              <span className="font-medium">{count || 0} Events</span>
            </div>
            
            <motion.div 
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-full p-1"
              initial={{ x: 0 }}
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EventGenres = () => {
  const navigate = useNavigate();
  const [eventCounts, setEventCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchEventCounts = async () => {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3002/api/event/getAllEvent");
        const events = response.data.events;

        const counts = genres.reduce((acc, genre) => {
          const count = events.filter(event => event.genre === genre.title).length;
          acc[genre.title] = count;
          return acc;
        }, {});

        setEventCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event counts:', error);
        setLoading(false);
      }
    };

    fetchEventCounts();
  }, []);

  // Set up automatic carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % genres.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (genre) => {
    navigate('/genrepagefilter', { state: { genreTitle: genre.title } });
  };

  const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-block mb-3 px-4 py-1 bg-purple-100 rounded-full text-purple-700 text-sm font-medium">
          Discover Events
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
          Browse Events by Category
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Explore our {totalEvents} upcoming events across {genres.length} exciting categories to find your next unforgettable experience
        </p>
      </motion.div>

      {/* Featured Genre - Highlight the selected genre */}
      <motion.div 
        className="mb-16 relative max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-20 rounded-3xl transform -rotate-1 scale-105"></div>
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={activeIndex} // This will trigger animation when activeIndex changes
                transition={{ duration: 0.5 }}
              >
                <div className={`inline-block p-3 rounded-xl mb-4 bg-gradient-to-br ${genres[activeIndex].color} bg-opacity-10`}>
                  {genres[activeIndex].icon}
                </div>
                <h3 className="text-3xl font-bold mb-3">{genres[activeIndex].title}</h3>
                <p className="text-gray-600 mb-6">{genres[activeIndex].description}</p>
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 text-purple-800 rounded-full px-4 py-1 font-medium">
                    {eventCounts[genres[activeIndex].title] || 0} Events Available
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl text-white bg-gradient-to-r ${genres[activeIndex].color} shadow-lg flex items-center`}
                  onClick={() => handleCardClick(genres[activeIndex])}
                >
                  Explore Events
                  <ChevronRight className="ml-2 w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
            <div className="relative h-64 md:h-auto">
              <motion.div 
                className="absolute inset-0"
                key={`image-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                  backgroundImage: `url(${genres[activeIndex].image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-l ${genres[activeIndex].color} opacity-40`}></div>
              </motion.div>
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="absolute bottom-6 left-8 flex space-x-2">
            {genres.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'w-8 bg-white' 
                    : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* All Genres Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <span className="ml-4 text-lg text-gray-600">Loading categories...</span>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {genres.map((genre, index) => (
            <GenreCard
              key={index}
              genre={genre}
              count={eventCounts[genre.title]}
              onClick={() => handleCardClick(genre)}
              isHovered={hoveredGenre === genre.title}
              onHover={setHoveredGenre}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventGenres;